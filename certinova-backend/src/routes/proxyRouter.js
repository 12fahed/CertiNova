import express from 'express';
import dns from 'node:dns/promises';
import net from 'node:net';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const router = express.Router();
const DEFAULT_ALLOWED_HOSTS = [
  'res.cloudinary.com',
  '*.cloudinary.com',
  '*.cloudinary.net',
  'images.unsplash.com',
  'source.unsplash.com',
  'placehold.co',
  'via.placeholder.com',
];
const MAX_IMAGE_BYTES = Number(process.env.IMAGE_PROXY_MAX_BYTES || 10 * 1024 * 1024);
const IMAGE_PROXY_TIMEOUT_MS = Number(process.env.IMAGE_PROXY_TIMEOUT_MS || 5000);

class ProxyError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const getAllowedHosts = () =>
  (process.env.IMAGE_PROXY_ALLOWED_HOSTS || DEFAULT_ALLOWED_HOSTS.join(','))
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

const isAllowedHost = (hostname) =>
  getAllowedHosts().some((allowedHost) => {
    if (allowedHost.startsWith('*.')) {
      const domain = allowedHost.slice(2);
      return hostname === domain || hostname.endsWith(`.${domain}`);
    }

    return hostname === allowedHost;
  });

const isPrivateIpv4 = (address) => {
  const parts = address.split('.').map(Number);
  const [first, second] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    first >= 224
  );
};

const isPrivateIpv6 = (address) => {
  const normalized = address.toLowerCase();
  const ipv4MappedPrefix = '::ffff:';

  if (normalized.startsWith(ipv4MappedPrefix)) {
    return isPrivateIpv4(normalized.slice(ipv4MappedPrefix.length));
  }

  return (
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  );
};

const isPrivateAddress = (address) => {
  const ipVersion = net.isIP(address);

  if (ipVersion === 4) {
    return isPrivateIpv4(address);
  }

  if (ipVersion === 6) {
    return isPrivateIpv6(address);
  }

  return false;
};

const validateProxyUrl = async (rawUrl) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new ProxyError(400, 'PROXY_INVALID_URL', 'A valid image URL is required');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new ProxyError(400, 'PROXY_INVALID_URL', 'Only HTTP and HTTPS image URLs are supported');
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (['localhost', 'localhost.localdomain'].includes(hostname)) {
    throw new ProxyError(403, 'PROXY_SSRF_BLOCKED', 'Local image URLs cannot be proxied');
  }

  if (net.isIP(hostname) && isPrivateAddress(hostname)) {
    throw new ProxyError(403, 'PROXY_SSRF_BLOCKED', 'Private image URLs cannot be proxied');
  }

  if (!isAllowedHost(hostname)) {
    throw new ProxyError(403, 'PROXY_SSRF_BLOCKED', 'Image host is not allowed for proxying');
  }

  const resolvedAddresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (resolvedAddresses.some(({ address }) => isPrivateAddress(address))) {
    throw new ProxyError(403, 'PROXY_SSRF_BLOCKED', 'Image host resolves to a private address');
  }

  return parsedUrl;
};

const fetchWithTimeout = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMAGE_PROXY_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const createSizeLimitStream = () => {
  let streamedBytes = 0;

  return new Transform({
    transform(chunk, _encoding, callback) {
      streamedBytes += chunk.length;

      if (streamedBytes > MAX_IMAGE_BYTES) {
        callback(new ProxyError(413, 'PROXY_SIZE_EXCEEDED', 'Image exceeds the proxy size limit'));
        return;
      }

      callback(null, chunk);
    },
  });
};

/**
 * Proxy route for fetching trusted certificate images with SSRF and size guards.
 */
router.get('/image-proxy', async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      throw new ProxyError(400, 'PROXY_MISSING_URL', 'URL parameter is required');
    }

    const imageUrl = await validateProxyUrl(String(url));
    const response = await fetchWithTimeout(imageUrl);

    if (!response.ok) {
      throw new ProxyError(
        response.status,
        'PROXY_FETCH_FAILED',
        `Failed to fetch image: ${response.statusText}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new ProxyError(
        400,
        'PROXY_INVALID_CONTENT_TYPE',
        `Invalid content type: ${contentType || 'unknown'}`
      );
    }

    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > MAX_IMAGE_BYTES) {
      throw new ProxyError(413, 'PROXY_SIZE_EXCEEDED', 'Image exceeds the proxy size limit');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    await pipeline(Readable.fromWeb(response.body), createSizeLimitStream(), res);
  } catch (error) {
    if (error.name === 'AbortError') {
      next(new ProxyError(504, 'PROXY_FETCH_FAILED', 'Image fetch timed out'));
      return;
    }

    next(error);
  }
});

export default router;

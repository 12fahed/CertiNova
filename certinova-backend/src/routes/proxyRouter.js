import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * Proxy route for fetching images with proper CORS headers
 * This helps bypass CORS restrictions when generating certificates
 */
router.get('/image-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL parameter is required' 
      });
    }
    
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Failed to fetch image: ${response.statusText}`
      });
    }
    
    // Get content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: `Invalid content type: ${contentType}`
      });
    }
    
    // Stream the image with CORS headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    // Get the image as a buffer and send it
    const buffer = await response.buffer();
    res.send(buffer);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to proxy image'
    });
  }
});

export default router;

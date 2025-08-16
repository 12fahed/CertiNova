const config = {
  API_BASE_URL: (() => {
    // If NEXT_PUBLIC_API_URL is set, use it (for custom domains)
    if (process.env.NEXT_PUBLIC_API_URL) {
      console.log('Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' || (!process.env.NODE_ENV && typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
      console.log('Development mode detected, using localhost:5000');
      return 'http://localhost:5000/api';
    }
    
    // Auto-detect based on environment for production
    if (typeof window !== 'undefined') {
      // Client-side: use current domain
      const protocol = window.location.protocol;
      const host = window.location.host;
      const url = `${protocol}//${host}/api`;
      console.log('Client-side production mode, using:', url);
      return url;
    } else {
      // Server-side: use Vercel URL if available
      const vercelUrl = process.env.VERCEL_URL;
      if (vercelUrl) {
        const url = `https://${vercelUrl}/api`;
        console.log('Server-side Vercel mode, using:', url);
        return url;
      }
      // Fallback to localhost for development
      console.log('Fallback to localhost:5000');
      return 'http://localhost:5000/api';
    }
  })(),
  
  FRONTEND_URL: (() => {
    if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
      return process.env.NEXT_PUBLIC_FRONTEND_URL;
    }
    
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}`;
    } else {
      const vercelUrl = process.env.VERCEL_URL;
      if (vercelUrl) {
        return `https://${vercelUrl}`;
      }
      return 'http://localhost:3000';
    }
  })(),
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Cloudinary (these will be set in Vercel environment variables)
  CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  
  // Other constants
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

export default config
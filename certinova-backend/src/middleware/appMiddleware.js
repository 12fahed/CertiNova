// Request logging middleware
export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  // console.log(`${timestamp} - ${req.method} ${req.path} - ${req.ip}`);
  next();
};

// CORS middleware with environment-based origins
export const cors = (req, res, next) => {
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app',
        'https://certinova.vercel.app', // Add your actual Vercel domain here
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000'
      ];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

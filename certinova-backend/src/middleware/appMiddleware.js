// Request logging middleware
export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  // console.log(`${timestamp} - ${req.method} ${req.path} - ${req.ip}`);
  next();
};

// CORS middleware
export const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Vercel serverless function configuration
export default function handler(req, res) {
  // This is handled by the main server.js
  // Vercel will automatically route requests to server.js
  return require('./server.js');
}

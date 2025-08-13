import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import certificateRoutes from './src/routes/certificateRoutes.js';
import { errorHandler, notFound } from './src/middleware/errorMiddleware.js';
import { logger, cors } from './src/middleware/appMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors);
app.use(logger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CertiNova Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      },
      events: {
        addEvent: 'POST /api/events/addEvent',
        getEvents: 'GET /api/events/:organisationID'
      },
      certificates: {
        addConfig: 'POST /api/certificates/addCertificateConfig',
        getConfig: 'GET /api/certificates/config/:eventId',
        updateConfig: 'PUT /api/certificates/config/:configId',
        uploadTemplate: 'POST /api/certificates/upload-template'
      }
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/certificates', certificateRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
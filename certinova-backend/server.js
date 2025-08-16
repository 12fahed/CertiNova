// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import certificateRoutes from './src/routes/certificateRoutes.js';
import { errorHandler, notFound } from './src/middleware/errorMiddleware.js';
import { logger, cors } from './src/middleware/appMiddleware.js';
import testCloudinaryConfig from './test/cloudinary-test.js';

// Test Cloudinary configuration after env variables are loaded
testCloudinaryConfig();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors);
app.use(logger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint for Vercel deployment testing
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CertiNova Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Note: No longer serving static files locally since we're using Cloudinary

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
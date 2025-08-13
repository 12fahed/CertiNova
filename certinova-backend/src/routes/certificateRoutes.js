import express from 'express';
import upload from '../../middleware/upload.js';
import { 
  addCertificateConfig, 
  getCertificateConfig, 
  updateCertificateConfig,
  uploadCertificateTemplate,
  storeGeneratedCertificate,
  getGeneratedCertificates
} from '../controllers/certificateController.js';

const router = express.Router();

// Certificate configuration routes
router.post('/addCertificateConfig', addCertificateConfig);
router.get('/config/:eventId', getCertificateConfig);
router.put('/config/:configId', updateCertificateConfig);

// Certificate template upload route
router.post('/upload-template', upload.single('certificate'), uploadCertificateTemplate);

// Generated certificate data storage route
router.post('/storeGenerated', storeGeneratedCertificate);

// Get generated certificates with filtering and pagination
router.get('/generated', getGeneratedCertificates);

export default router;

import express from 'express';
import { 
  addCertificateConfig, 
  getCertificateConfig, 
  updateCertificateConfig 
} from '../controllers/certificateController.js';

const router = express.Router();

// Certificate configuration routes
router.post('/addCertificateConfig', addCertificateConfig);
router.get('/config/:eventId', getCertificateConfig);
router.put('/config/:configId', updateCertificateConfig);

export default router;

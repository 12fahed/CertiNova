import express from 'express';
import upload from '../../middleware/upload.js';
import { 
  addCertificateConfig, 
  getCertificateConfig, 
  updateCertificateConfig,
  uploadCertificateTemplate,
  storeGeneratedCertificate,
  getGeneratedCertificates,
  getDecryptedGeneratedCertificates,
  verifyUUID,
  verifyCertificateFullByUUID,
  getCertificateUUIDs,
  getOrganizationStats,
  getAllOrganizationStats,
  updateRecipientCount
} from '../controllers/certificateController.js';
import {
  decryptLimiter,
  generationLimiter,
  readLimiter,
  verifyLimiter
} from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Certificate configuration routes
router.post('/addCertificateConfig', addCertificateConfig);
router.get('/config/:eventId', getCertificateConfig);
router.put('/config/:configId', updateCertificateConfig);

// Certificate template upload route
router.post('/upload-template', upload.single('certificate'), uploadCertificateTemplate);

// Generated certificate data storage route
router.post('/storeGenerated', generationLimiter, storeGeneratedCertificate);

// Get generated certificates with filtering and pagination
router.get('/generated', readLimiter, getGeneratedCertificates);

// Decrypt and get generated certificates with password
router.post('/generated/decrypt', decryptLimiter, getDecryptedGeneratedCertificates);

// UUID verification routes
router.get('/verify/:uuid', verifyLimiter, verifyUUID);
router.get('/verify-full/:uuid', verifyLimiter, verifyCertificateFullByUUID);
router.get('/generated/:id/uuids', readLimiter, getCertificateUUIDs);

// Organization statistics routes
router.get('/organization-stats/:organizationName', getOrganizationStats);
router.get('/all-organization-stats', getAllOrganizationStats);

router.patch('/update-recipient-count', updateRecipientCount);

export default router;

import express from 'express';
import upload from '../../middleware/upload.js';
import { protect } from '../middleware/auth.js';
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
  updateRecipientCount,
} from '../controllers/certificateController.js';

const router = express.Router();

// Certificate configuration routes (protected)
router.post('/addCertificateConfig', protect, addCertificateConfig);
router.get('/config/:eventId', protect, getCertificateConfig);
router.put('/config/:configId', protect, updateCertificateConfig);

// Certificate template upload route (protected)
router.post('/upload-template', protect, upload.single('certificate'), uploadCertificateTemplate);

// Generated certificate data storage route (protected)
router.post('/storeGenerated', protect, storeGeneratedCertificate);

// Get generated certificates (protected)
router.get('/generated', protect, getGeneratedCertificates);

// Decrypt and get generated certificates (protected)
router.post('/generated/decrypt', protect, getDecryptedGeneratedCertificates);

// UUID verification routes (PUBLIC - anyone can verify a certificate)
router.get('/verify/:uuid', verifyUUID);
router.get('/verify-full/:uuid', verifyCertificateFullByUUID);

// UUID and stats routes (protected)
router.get('/generated/:id/uuids', protect, getCertificateUUIDs);
router.get('/organization-stats/:organizationName', protect, getOrganizationStats);
router.get('/all-organization-stats', protect, getAllOrganizationStats);
router.patch('/update-recipient-count', protect, updateRecipientCount);

export default router;

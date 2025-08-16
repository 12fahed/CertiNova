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
  getCertificateUUIDs,
  getOrganizationStats,
  getAllOrganizationStats,
  updateRecipientCount
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

// Decrypt and get generated certificates with password
router.post('/generated/decrypt', getDecryptedGeneratedCertificates);

// UUID verification routes
router.get('/verify/:uuid', verifyUUID);
router.get('/generated/:id/uuids', getCertificateUUIDs);

// Organization statistics routes
router.get('/organization-stats/:organizationName', getOrganizationStats);
router.get('/all-organization-stats', getAllOrganizationStats);

router.patch('/update-recipient-count', updateRecipientCount);

export default router;

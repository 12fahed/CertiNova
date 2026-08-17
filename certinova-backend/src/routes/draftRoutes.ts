import express from 'express';
import { saveDraft, getDraft, deleteDraft } from '../controllers/draftController';
// import { protect } from '../middleware/authMiddleware'; // Uncomment if you use an auth middleware

const router = express.Router();

// If you have an authentication middleware, add it here:
// router.use(protect); 

router.post('/', saveDraft);
router.get('/', getDraft);
router.delete('/', deleteDraft);

export default router;

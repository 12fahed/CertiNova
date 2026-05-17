import express from 'express';
import { protect } from '../middleware/auth.js'; // add this
import { addEvent, getEventsByOrganisation, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

// Event routes (all protected)
router.post('/addEvent', protect, addEvent);
router.get('/:organisationID', protect, getEventsByOrganisation);
router.delete('/:eventId', protect, deleteEvent);

export default router;
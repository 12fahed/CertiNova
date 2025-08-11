import express from 'express';
import { addEvent, getEventsByOrganisation } from '../controllers/eventController.js';

const router = express.Router();

// Event routes
router.post('/addEvent', addEvent);
router.get('/:organisationID', getEventsByOrganisation);

export default router;

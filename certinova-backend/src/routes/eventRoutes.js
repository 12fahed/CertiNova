import express from 'express';
import { addEvent, getEventsByOrganisation, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

// Event routes
router.post('/addEvent', addEvent);
router.get('/:organisationID', getEventsByOrganisation);
router.delete('/:eventId', deleteEvent);

export default router;

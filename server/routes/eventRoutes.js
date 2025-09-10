const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, deleteEvent,registerForEvent } = require('../controller/eventController');
const authMiddleware = require('../middleware/auth');
const { isAlumni } = require('../middleware/checkRole'); // Optional but recommended

// --- EVENT ROUTES ---

// Get all events (accessible to all logged-in users)
router.get('/', authMiddleware, getAllEvents);

// Create a new event (accessible only to logged-in alumni)
router.post('/', authMiddleware, isAlumni, createEvent);

// Delete an event (accessible only to the logged-in user who created it)
router.delete('/:id', authMiddleware, deleteEvent);

router.post('/:id/register', authMiddleware, registerForEvent);

module.exports = router;
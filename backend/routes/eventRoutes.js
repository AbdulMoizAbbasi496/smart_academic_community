const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getEvents, createEvent, deleteEvent, registerForEvent,unregisterForEvent, editEvent, getEventAttendees } = require('../controllers/eventController');

const router = express.Router();
router.get('/', protect, getEvents);
router.post('/', protect, admin, createEvent);
router.delete('/:id', protect, admin, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/unregister', protect, unregisterForEvent);
router.put('/:id',protect,admin, editEvent);
router.get('/:id/attendees', protect, admin, getEventAttendees);

module.exports = router;
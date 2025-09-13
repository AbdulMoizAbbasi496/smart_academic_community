const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getEvents, createEvent, deleteEvent, registerForEvent, editEvent } = require('../controllers/eventController');

const router = express.Router();
router.get('/', protect, getEvents);
router.post('/', protect, admin, createEvent);
router.delete('/:id', protect, admin, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.put('/:id',protect,admin, editEvent)

module.exports = router;
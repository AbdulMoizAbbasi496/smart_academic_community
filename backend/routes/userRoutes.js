const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { updateProfile, getRegisteredEvents } = require('../controllers/userController');

const router = express.Router();
router.put('/profile', protect, updateProfile);
router.get('/events', protect, getRegisteredEvents);

module.exports = router;
const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getAnnouncements, createAnnouncement, deleteAnnouncement,editAnnouncement } = require('../controllers/announcementController');

const router = express.Router();
router.get('/', protect, getAnnouncements);
router.post('/', protect, admin, createAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);
// edit
router.put('/:id',protect,admin, editAnnouncement);

module.exports = router;
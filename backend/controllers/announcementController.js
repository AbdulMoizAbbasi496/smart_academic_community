const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({}).sort({ createdAt: -1 });
  return res.json(announcements);
};

const createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  const announcement = await Announcement.create({ title, message });
  return res.status(201).json(announcement);
};

const deleteAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (announcement) {
    await announcement.deleteOne();
    return res.json({ message: 'Announcement removed' });
  } else {
    return res.status(404).json({ message: 'Announcement not found' });
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
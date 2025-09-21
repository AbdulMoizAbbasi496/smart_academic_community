const Announcement = require('../models/Announcement');

const getAnnouncements = async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};
  const announcements = await Announcement.find(query).sort({ createdAt: -1 });
  return res.json(announcements);
};

const createAnnouncement = async (req, res) => {
  const { title, message, category } = req.body;
  const announcement = await Announcement.create({ title, message, category });
  return res.status(201).json(announcement);
};

const editAnnouncement = async (req, res) => {
  try {
    const { title, message, category } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, message, category },
      { new: true, runValidators: true } // return updated doc & validate
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update announcement', error: error.message });
  }
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

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement,editAnnouncement };
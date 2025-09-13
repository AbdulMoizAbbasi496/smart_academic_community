const Event = require('../models/Event');

const getEvents = async (req, res) => {
  const events = await Event.find({});
  return res.json(events);
};

const createEvent = async (req, res) => {
  const { title, description, date } = req.body;
  const event = await Event.create({ title, description, date, registeredUsers: [] });
  return res.status(201).json(event);
};

// PUT /api/events/:id
const editEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date },
      { new: true, runValidators: true } // return updated doc & validate
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};


const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    await event.deleteOne();
    return res.json({ message: 'Event removed' });
  } else {
    return res.status(404).json({ message: 'Event not found' });
  }
};

const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered' });
    }
    event.registeredUsers.push(req.user._id);
    await event.save();
    return res.json({ message: 'Registered successfully' });
  } else {
    return res.status(404).json({ message: 'Event not found' });
  }
};

module.exports = { getEvents, createEvent, deleteEvent, registerForEvent, editEvent };
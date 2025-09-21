const Event = require('../models/Event');

// get events with search and sort
const getEvents = async (req, res) => {
  const { search, sort } = req.query;
  let query = {};
  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    };
  }
  let sortOption = {};
  if (sort === 'upcoming') sortOption = { date: 1 };
  else if (sort === 'recent') sortOption = { date: -1 };

  const events = await Event.find(query).sort(sortOption);
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

//unregister
const unregisterForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }
    event.registeredUsers.pull(req.user._id); // Remove userId from array
    await event.save();
    res.json({ message: 'Unregistered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unregister', error: err.message });
  }
};

const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('registeredUsers', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json(event.registeredUsers);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getEvents, createEvent, deleteEvent, registerForEvent,unregisterForEvent, editEvent ,getEventAttendees};
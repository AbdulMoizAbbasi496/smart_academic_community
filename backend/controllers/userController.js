const User = require('../models/User');
const Event = require('../models/Event');

const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password; // Will be hashed by pre-save hook
  await user.save();
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

const getRegisteredEvents = async (req, res) => {
  const events = await Event.find({ registeredUsers: req.user._id });
  return res.json(events);
};

module.exports = { updateProfile, getRegisteredEvents };
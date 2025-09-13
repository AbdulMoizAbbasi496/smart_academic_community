const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Function to seed admin user
const seedAdmin = async () => {
  try {
    await connectDB();
    console.log('MongoDB connection established');

    // Check if an admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists:', adminExists.email);
      process.exit(0);
    }

    // Get admin credentials from environment variables
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Missing admin credentials in .env file (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD)');
      process.exit(1);
    }

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user, bypassing pre-save hook for password
    const admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });
    admin.isModified = () => false; // Prevent double-hashing
    await admin.save();

    console.log('Admin user created successfully:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
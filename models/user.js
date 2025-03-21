// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema for the "users" collection in the "social" database
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: {
    type: String,
    default: '', // Default image path or URL
  },

});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Define and export the model
module.exports = User;

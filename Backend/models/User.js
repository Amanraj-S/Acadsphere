const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  username: { type: String, required: true, unique: true },
  password: { type: String },  // optional for Google users
  googleId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

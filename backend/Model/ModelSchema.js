const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Boolean,
    default: false // false: user, true: admin
  }
}, {
  timestamps: true // avtomatik ravishda yaratilgan va yangilangan vaqtlarni saqlaydi
});

// Model yaratish
const User = mongoose.model('User', userSchema);

module.exports = User;

// models/Fan.js
const mongoose = require('mongoose');

const fanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Fan nomi
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fan', fanSchema);

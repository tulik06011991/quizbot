const mongoose = require('mongoose');

const correctAnswerSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Variant matni
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CorrectAnswer', correctAnswerSchema);

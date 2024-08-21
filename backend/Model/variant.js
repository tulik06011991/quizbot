// models/Variant.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Variant', variantSchema);

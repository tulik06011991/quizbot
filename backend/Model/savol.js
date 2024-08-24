// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  fanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fan', required: true },  // Fan bilan bog'lash
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);

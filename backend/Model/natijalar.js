// models/Answer.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: true }
});

module.exports = mongoose.model('Answer', answerSchema);

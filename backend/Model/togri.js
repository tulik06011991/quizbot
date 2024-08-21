const mongoose = require('mongoose');

const correctAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  correctOptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: true }
});

module.exports = mongoose.model('CorrectAnswer', correctAnswerSchema);

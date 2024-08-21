const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const correctAnswerSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  correctOptionText: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('CorrectAnswer', correctAnswerSchema);

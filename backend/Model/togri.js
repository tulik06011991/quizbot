const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const correctAnswerSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  correctOptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  }
});

module.exports = mongoose.model('CorrectAnswer', correctAnswerSchema);

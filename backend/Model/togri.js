// models/Question.js

// models/Option.js

// models/CorrectAnswer.js

const mongoose = require('mongoose'); // Mongoose'ni import qilish
const Schema = mongoose.Schema; // 

const correctAnswerSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  correctOption: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('CorrectAnswer', correctAnswerSchema);

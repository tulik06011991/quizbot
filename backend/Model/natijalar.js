const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // User modeliga referens
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz', // Quiz modeliga referens
    required: true
  },
  correctCount: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', resultSchema);

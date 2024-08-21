const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Agar sizda User modeli bo'lsa
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz', // Agar sizda Quiz modeli bo'lsa
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

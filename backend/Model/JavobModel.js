const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Agar sizning User modelingiz bo'lsa
    required: true
  },
  answers: {
    type: Map,
    of: String, // Savol ID'si va foydalanuvchi tanlagan variant
    required: true
  },
  correctAnswersCount: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  scorePercentage: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Answer', answerSchema);

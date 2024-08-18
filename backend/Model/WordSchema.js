const mongoose = require('mongoose');

// Savollar va variantlar uchun schema
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [String],
  correctAnswer: {
    type: String,
    required: true
  }
});

// Test ma'lumotlari uchun schema
const testSchema = new mongoose.Schema({
  originalFileName: {
    type: String,
    required: true
  },
  storedFileName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  questions: [questionSchema] // Savollar ro'yxati
});

const TestModel = mongoose.model('Test', testSchema);

module.exports = TestModel;

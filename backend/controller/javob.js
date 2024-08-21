const express = require('express');
const router = express.Router();
const CorrectAnswer = require('../Model/natijalar');

// Test yakunlash va natijani hisoblash
const finishQuiz = async (req, res) => {
  const { answers } = req.body; // Foydalanuvchidan yuborilgan javoblar
  let correctCount = 0;
  const totalQuestions = Object.keys(answers).length;

  try {
    // Har bir savol uchun to'g'ri javobni tekshirish
    for (const [questionId, selectedOptionId] of Object.entries(answers)) {
      const correctAnswer = await CorrectAnswer.findOne({ questionId }).populate('correctOptionId');
      
      if (correctAnswer && correctAnswer.correctOptionId._id.toString() === selectedOptionId) {
        correctCount++;
      }
    }

    // Natijani qaytarish
    res.json({
      correctCount,
      totalQuestions
    });
  } catch (error) {
    console.error('Natijani hisoblashda xatolik:', error);
    res.status(500).json({ message: 'Natijani hisoblashda xatolik yuz berdi' });
  }
};

module.exports = { finishQuiz };

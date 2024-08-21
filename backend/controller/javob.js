const express = require('express');
const router = express.Router();
const CorrectAnswer = require('../Model/togri'); // Natijalar model
const User = require('../Model/ModelSchema'); // User modeli

// Test yakunlash va natijani hisoblash
const finishQuiz = async (req, res) => {
  const { userId, answers } = req.body; // Foydalanuvchi ID'si va javoblar
  let correctCount = 0;
  const totalQuestions = Object.keys(answers).length;

  try {
    // Foydalanuvchi ID'sini tekshirish
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

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

const express = require('express');
const router = express.Router();
const CorrectAnswer = require('../Model/togri'); // To'g'ri javoblar modeli
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
    for (const [questionId, selectedOptionText] of Object.entries(answers)) {
      // Savolga mos to'g'ri javobni olish
      const correctAnswer = await CorrectAnswer.findOne({ questionId });

      // Tekshirish: correctAnswer mavjudmi va correctOptionText mavjudmi
      if (correctAnswer && correctAnswer.correctOptionText === selectedOptionText) {
        correctCount++;
      } else {
        console.warn(`Savol ${questionId} uchun to'g'ri javob topilmadi yoki noto'g'ri formatda.`);
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

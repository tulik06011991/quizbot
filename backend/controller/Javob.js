const express = require('express');
const Question = require('../Model/savol');
const Option = require('../Model/variant');
const CorrectAnswer = require('../Model/togri');
const Answer = require('../Model/JavobModel'); // Javoblar schemasi
const User = require('../Model/ModelSchema'); // User schemasi

const submitQuiz = async (req, res) => {
  try {
    const { answers, userId } = req.body; // Foydalanuvchi bergan javoblar va userId

    // Foydalanuvchi mavjudligini tekshirish
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Foydalanuvchi topilmadi' });
    }

    let correctAnswersCount = 0;
    const totalQuestions = Object.keys(answers).length;

    for (let [questionId, userAnswer] of Object.entries(answers)) {
      // To'g'ri javobni olish
      const correctAnswer = await CorrectAnswer.findOne({ questionId: questionId });

      if (correctAnswer && correctAnswer.correctOption === userAnswer) {
        correctAnswersCount++;
      }
    }

    // Foizni hisoblash
    const scorePercentage = (correctAnswersCount / totalQuestions) * 100;

    // Natijalarni saqlash
    const userAnswers = new Answer({
      userId: userId,
      answers: answers,
      correctAnswersCount: correctAnswersCount,
      totalQuestions: totalQuestions,
      scorePercentage: scorePercentage
    });

    await userAnswers.save(); // Natijalarni bazaga saqlash

    // Foydalanuvchiga natijani qaytarish
    res.json({
      correctAnswersCount,
      totalQuestions,
      scorePercentage
    });

  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

module.exports = { submitQuiz };

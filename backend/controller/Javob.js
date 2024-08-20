const express = require('express');
const Question = require('../Model/savol');
const Option = require('../Model/variant');
const CorrectAnswer = require('../Model/togri');

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Foydalanuvchi bergan javoblar
    let correctAnswersCount = 0;
    const totalQuestions = Object.keys(answers).length;

    for (let [index, userAnswer] of Object.entries(answers)) {
      const questionId = await Question.findOne().skip(index).exec(); // Indeks bo'yicha savolni olish

      if (!questionId) continue;

      // To'g'ri javobni olish
      const correctAnswer = await CorrectAnswer.findOne({ questionId: questionId._id });

      if (correctAnswer && correctAnswer.correctOption === userAnswer) {
        correctAnswersCount++;
      }
    }

    // Foydalanuvchiga natijani qaytarish
    res.json({
      correctAnswersCount,
      totalQuestions
    });

  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

module.exports = { submitQuiz };

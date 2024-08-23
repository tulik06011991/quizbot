// controllers/quizController.js
const mongoose = require('mongoose');
const Variant = require('../Model/variant');
const User = require('../Model/ModelSchema');
const Result = require('../Model/natijalar'); // Natijalar modelini qo'shamiz

const checkQuizAnswers = async (req, res) => {
  const { userId, answers } = req.body;
  console.log(userId);
  console.log(answers);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let score = 0;
    const totalQuestions = Object.keys(answers).length;

    for (const questionIndex in answers) {
      const selectedVariantId = answers[questionIndex];
      const variant = await Variant.findOne({ _id: selectedVariantId });

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      if (variant.isCorrect) {
        score += 1;
      }
    }

    // Foizni hisoblash
    const percentage = (score / totalQuestions) * 100;

    // Natijalarni saqlash
    const result = new Result({
      userId,
      score,
      totalQuestions,
      percentage: percentage.toFixed(2)
    });

    await result.save();

    res.status(200).json({ 
      message: 'Quiz checked and result saved successfully',
      score,
      totalQuestions,
      percentage: percentage.toFixed(2) // To'rtinchi raqamgacha aniqroq
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error, could not check answers.' });
  }
};

module.exports = {
  checkQuizAnswers
};

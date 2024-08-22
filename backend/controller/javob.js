// controllers/quizController.js
const mongoose = require('mongoose');
const Variant = require('../Model/variant');
const User = require('../Model/ModelSchema');

const checkQuizAnswers = async (req, res) => {
  const { userId, answers } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let score = 0;
    const totalQuestions = Object.keys(answers).length;

    for (const questionIndex in answers) {
      const selectedVariantIndex = answers[questionIndex];
      const variant = await Variant.findOne({ _id: selectedVariantIndex });

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      if (variant.isCorrect) {
        score += 1;
      }
    }

    res.status(200).json({ 
      message: 'Quiz checked successfully',
      score,
      totalQuestions
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error, could not check answers.' });
  }
};

module.exports = {
  checkQuizAnswers
};

const mongoose = require('mongoose');
const User = require('../Model/ModelSchema');
const Question = require('../Model/savol');
const Option = require('../Model/variant');
const CorrectAnswer = require('../Model/togri');
const Answer = require('../Model/natijalar'); // Yangi model



const checkAnswers = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    const questionIds = answers.map(answer => mongoose.Types.ObjectId(answer.questionId));
    const correctAnswers = await CorrectAnswer.find({ questionId: { $in: questionIds } });

    let correctCount = 0;
    let totalQuestions = answers.length;

    for (const answer of answers) {
      const questionId = mongoose.Types.ObjectId(answer.questionId);
      const selectedOptionId = mongoose.Types.ObjectId(answer.selectedOptionId);

      const correctAnswer = correctAnswers.find(ca =>
        ca.questionId.equals(questionId) &&
        ca.correctOptionId.equals(selectedOptionId)
      );
      if (correctAnswer) {
        correctCount++;
      }

      await Answer.create({
        userId: userId,
        questionId: questionId,
        selectedOptionId: selectedOptionId
      });
    }

    const percentage = (correctCount / totalQuestions) * 100;

    res.json({
      correctCount,
      totalQuestions,
      percentage: percentage.toFixed(2)
    });
  } catch (error) {
    console.error('Error checking answers:', error);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

module.exports = { checkAnswers };


module.exports = { checkAnswers };

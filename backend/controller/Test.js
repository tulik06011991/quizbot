const Question = require('../Model/savol');
const Option = require('../Model/variant');

const getQuiz = async (req, res, next) => {
  try {
    const questions = await Question.find();
    const options = await Option.find().populate('questionId');

    // Savollar va variantlarni birlashtirish
    const quizData = questions.map(question => {
      return {
        question: question.question,
        options: options
          .filter(option => option.questionId._id.toString() === question._id.toString())
          .map(option => option.option)
      };
    });

    res.status(200).json(quizData);
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuiz };

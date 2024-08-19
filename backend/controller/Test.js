// Savollarni va ularning variantlarini olib kelish uchun API
const Question = require('../Model/savol');
const Option = require('../Model/variant');
const getQuiz = async (req, res) => {
  try {
    const questions = await Question.find();
    const quiz = [];

    // Har bir savol uchun variantlarni va to'g'ri javoblarni yig'ish
    for (const question of questions) {
      const options = await Option.find({ questionId: question._id });
      const correctAnswer = await CorrectAnswer.findOne({ questionId: question._id });

      quiz.push({
        question: question.question,
        options: options.map(option => option.option),
        correctAnswer: correctAnswer ? correctAnswer.correctOption : null
      });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};
module.exports = {  getQuiz };
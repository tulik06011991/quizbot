// controllers/quizController.js

const Question = require('../Model/savol');
const Option = require('../Model/variant');
const CorrectAnswer = require('../Model/togri');

const getQuiz = async (req, res) => {
  try {
    // Savollarni olish
    const questions = await Question.find();
    const quiz = [];

    // Har bir savol uchun variantlarni va to'g'ri javoblarni olish
    for (const question of questions) {
      const options = await Option.find({ questionId: question._id });
      const correctAnswers = await CorrectAnswer.find({ questionId: question._id });

      // Variantlarni formatlash
      const formattedOptions = options.map(option => {
        let displayOption = option.option;
        
        // To'g'ri variantni tekshirish
        const isCorrect = correctAnswers.some(correctAnswer => correctAnswer.correctOptionId.equals(option._id));
        
        // Agar to'g'ri variant bo'lsa, nuqtani olib tashlash
        if (isCorrect) {
          displayOption = displayOption.replace(/^\.\s*/, ''); // Nuqtani olib tashlash
        }

        return {
          option: displayOption,
          isCorrect: isCorrect
        };
      });

      quiz.push({
        question: question.question,
        options: formattedOptions
      });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};


module.exports = { getQuiz };

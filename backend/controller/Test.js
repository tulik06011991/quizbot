const Question = require('../Model/Question');
const Option = require('../Model/Option');
const CorrectAnswer = require('../Model/CorrectAnswer');

// Savollar va variantlarni qaytaruvchi funksiya
const getQuiz = async (req, res) => {
  try {
    const questions = await Question.find(); // Barcha savollarni olish
    const quiz = [];

    for (const question of questions) {
      // Har bir savol uchun tegishli variantlarni olish
      const options = await Option.find({ questionId: question._id });
      const formattedOptions = options.map(option => ({
        _id: option._id,
        option: option.option // yoki text bo'lsa text, option ni ishlatamiz
      }));

      // Savolni variantlar bilan birgalikda quiz array'iga qo'shish
      quiz.push({
        _id: question._id, // Savol ID'sini qo'shish
        question: question.question,
        options: formattedOptions
      });
    }

    res.json(quiz); // JSON formatda qaytarish
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

// Foydalanuvchi javoblarini to'g'ri javoblar bilan solishtirish va natijani qaytaruvchi funksiya
const finishQuiz = async (req, res) => {
  const { answers } = req.body;
  let correctCount = 0;

  try {
    for (const [questionId, selectedOptionId] of Object.entries(answers)) {
      // Har bir savol uchun to'g'ri javobni olish
      const correctAnswer = await CorrectAnswer.findOne({ questionId });

      // Agar foydalanuvchi tanlagan javob to'g'ri bo'lsa, correctCount ni oshirish
      if (correctAnswer && correctAnswer.correctOptionId.toString() === selectedOptionId) {
        correctCount++;
      }
    }

    // To'g'ri javoblar sonini qaytarish
    res.json({ correctCount });
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

module.exports = { getQuiz, finishQuiz };

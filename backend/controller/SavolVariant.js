

// Savollar ro'yxatini olish
// controllers/questionController.js

const Question = require('../Model/savol');
const Variant = require('../Model/variant');

// Savollarni va variantlarni olish


// Savollarni va variantlarni olish
const getQuestionsWithVariants = async (req, res) => {
  try {
    // Barcha savollarni olish
    const questions = await Question.find().exec();

    // Har bir savol uchun uning variantlarini olish
    const questionsWithVariants = await Promise.all(questions.map(async (question) => {
      const variants = await Variant.find({ questionId: question._id })
        .select('text isCorrect') // Faqat kerakli maydonlarni tanlash
        .exec();
      return {
        ...question.toObject(), // Savolni obyektga o'zgartirish
        variants: variants.map(variant => ({
          text: variant.text,
          isCorrect: variant.isCorrect
        })) // Variantlarni kerakli formatda qaytarish
      };
    }));

    res.status(200).json(questionsWithVariants);
    console.log(questionsWithVariants)
    
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi', error });
  }
};

module.exports = {
  getQuestionsWithVariants
};




// Savolni qo'shish
const addQuestion = async (req, res) => {
  const { text } = req.body;
  try {
    const newQuestion = new Question({ text });
    await newQuestion.save(); // Savolni saqlash
    res.status(201).json(newQuestion); // Yangi savolni qaytarish
  } catch (error) {
    console.error('Savolni qo\'shishda xatolik:', error);
    res.status(500).json({ message: 'Savolni qo\'shishda xatolik' });
  }
};

// Savolni o'chirish
const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(id); // Savolni o'chirish
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Savol topilmadi' });
    }
    res.status(200).json({ message: 'Savol o\'chirildi' }); // O'chirilgan savol haqida ma'lumot
  } catch (error) {
    console.error('Savolni o\'chirishda xatolik:', error);
    res.status(500).json({ message: 'Savolni o\'chirishda xatolik' });
  }
};

module.exports = {
  getQuestionsWithVariants,
  addQuestion,
  deleteQuestion,
};

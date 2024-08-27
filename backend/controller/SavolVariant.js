

// Savollar ro'yxatini olish
// controllers/questionController.js

const Question = require('../Model/savol');
const Variant = require('../Model/variant');
const Fan = require('../Model/newFan'); // Fan modelini qo'shamiz

const getQuestionsWithVariants = async (req, res) => {
  try {
    // Barcha savollarni olish
    const questions = await Question.find().exec();

    // Har bir savol uchun uning variantlarini va fan nomini olish
    const questionsWithVariants = await Promise.all(questions.map(async (question) => {
      const variants = await Variant.find({ questionId: question._id })
        .select('text isCorrect') // Faqat kerakli maydonlarni tanlash
        .exec();

      // Fan ma'lumotlarini olish
      const fan = await Fan.findById(question.fanId).exec();

      return {
        ...question.toObject(), // Savolni obyektga o'zgartirish
        fanName: fan ? fan.name : 'Unknown', // Fan nomini qo'shish
        variants: variants.map(variant => ({
          text: variant.text,
          isCorrect: variant.isCorrect
        })) // Variantlarni kerakli formatda qaytarish
      };
    }));

    res.status(200).json(questionsWithVariants);

  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi', error });
  }
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

/// Savolni yangilash
const updateQuestion = async (req, res) => {
  const { id } = req.params; // URL dan savol ID sini olish
  const { text, variants, fanName } = req.body; // Yangi savol ma'lumotlari

  try {
    // Savolni yangilash
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { text, variants, fanName },
      { new: true } // Yangilangan savolni qaytaradi
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Savol topilmadi' });
    }

    res.status(200).json({ message: 'Savol yangilandi', updatedQuestion }); // Yangilangan savol haqida ma'lumot
  } catch (error) {
    console.error('Savolni yangilashda xatolik:', error);
    res.status(500).json({ message: 'Savolni yangilashda xatolik' });
  }
};

module.exports = {
  getQuestionsWithVariants,
  addQuestion,
  updateQuestion,
};

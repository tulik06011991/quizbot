const Question = require('../Model/savol');

// Savollar ro'yxatini olish
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find(); // Savollarni olish
    res.status(200).json(questions); // Savollarni qaytarish
  } catch (error) {
    console.error('Savollarni olishda xatolik:', error);
    res.status(500).json({ message: 'Savollarni olishda xatolik' });
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
  getQuestions,
  addQuestion,
  deleteQuestion,
};

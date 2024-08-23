const Question = require('../Model/savol');
const Variant = require('../Model/variant');

// Barcha savollar va variantlarni o'chiruvchi funksiya
const deleteAllQuestionsAndVariants = async (req, res) => {
  try {
    // Barcha variantlarni o'chirish
    await Variant.deleteMany({});
    
    // Barcha savollarni o'chirish
    await Question.deleteMany({});

    res.status(200).json({ message: 'Barcha savollar va variantlar muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error('Barcha savollarni va variantlarni o\'chirishda xatolik:', error);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

module.exports = { deleteAllQuestionsAndVariants };

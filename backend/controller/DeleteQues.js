const Question = require('../Model/savol');
const Variant = require('../Model/variant');
const User = require('../Model/ModelSchema');

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





// Foydalanuvchini ID bo'yicha o'chirish
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    // Foydalanuvchini topish
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }
    
    // Foydalanuvchini o'chirish
    await User.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error('Foydalanuvchini o\'chirishda xatolik:', error);
    res.status(500).json({ message: 'Tizim xatoligi' });
  }
};


module.exports = { deleteAllQuestionsAndVariants, deleteUser };

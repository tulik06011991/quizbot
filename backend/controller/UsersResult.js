const Result = require('../Model/natijalar'); // Result modelini import qilish
const User = require('../Model/ModelSchema'); // User modelini import qilish

// Foydalanuvchilar va ularning natijalarini olish
const getAllResults = async (req, res) => {
  try {
    // Foydalanuvchilar va ularning natijalarini olish
    const results = await Result.find().populate('userId', 'name email'); // userId bilan bog'langan User'ni olish
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik ro\'y berdi', error });
  }
};

// Maxsus userning natijalarini olish
const getResultByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Result.find({ userId }).populate('userId', 'name email'); // Maxsus foydalanuvchi natijasi
    if (!result) {
      return res.status(404).json({ message: 'Natijalar topilmadi' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik ro\'y berdi', error });
  }
};
; // User modelini import qilish

// Foydalanuvchi va uning natijalarini o'chirish
const deleteUserAndResults = async (req, res) => {
  try {
    const { id } = req.params;
   
console.log(id);

    // Foydalanuvchining natijalarini o'chirish
    await Result.deleteMany({ id });

    // Foydalanuvchini o'chirish
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    res.status(200).json({ message: 'Foydalanuvchi va uning natijalari muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Xatolik ro\'y berdi', error });
  }
};


module.exports = {
  deleteUserAndResults,
  getAllResults
}
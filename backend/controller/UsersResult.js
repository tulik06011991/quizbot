const Result = require('../Model/natijalar'); // Result modelini import qilish
const User = require('../Model/ModelSchema'); // User modelini import qilish

// Foydalanuvchilar va ularning natijalarini olish
exports.getAllResults = async (req, res) => {
  try {
    // Foydalanuvchilar va ularning natijalarini olish
    const results = await Result.find().populate('userId', 'name email'); // userId bilan bog'langan User'ni olish
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik ro\'y berdi', error });
  }
};

// Maxsus userning natijalarini olish
exports.getResultByUserId = async (req, res) => {
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

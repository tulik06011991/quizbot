const mongoose = require('mongoose');
const Variant = require('../Model/variant');
const User = require('../Model/ModelSchema');
const Result = require('../Model/natijalar'); // Natijalar modelini qo'shamiz

const checkQuizAnswers = async (req, res) => {
  const { userId, answers } = req.body; // answers obyekti { questionId: variantId } shaklida bo'ladi
console.log(userId);

  try {
    // Foydalanuvchini tekshirish
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let score = 0;
    const totalQuestions = Object.keys(answers).length;

    // Savollar va variantlarni tekshirish
    for (const [questionId, selectedVariantId] of Object.entries(answers)) {
      // Tanlangan variantni topish
      const variant = await Variant.findOne({ _id: selectedVariantId, questionId });

      if (!variant) {
        return res.status(404).json({ error: 'Variant not found' });
      }

      // Variantning to'g'ri yoki noto'g'ri ekanligini tekshirish
      if (variant.isCorrect) {
        score += 1;
      }
    }

    // Foizni hisoblash
    const percentage = (score / totalQuestions) * 100;

    // Natijalarni saqlash
    const result = new Result({
      userId,
      score,
      totalQuestions,
      percentage: percentage.toFixed(2)
    });

    await result.save();

    // Natijalarni qaytarish
    res.status(200).json({ 
      message: 'Quiz checked and result saved successfully',
      score,
      totalQuestions,
      percentage: percentage.toFixed(2) // To'rtinchi raqamgacha aniqroq
    });

  } catch (error) {
    console.error('Error checking quiz answers:', error);
    res.status(500).json({ error: 'Server error, could not check answers.' });
  }
};

module.exports = {
  checkQuizAnswers
};

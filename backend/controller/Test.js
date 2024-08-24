const Question = require('../Model/savol'); // Savol modeli
const Variant = require('../Model/variant'); // Variant modeli

// Savollar va variantlarni olish va foydalanuvchiga ko'rsatish
async function getQuiz(req, res) {
  try {
    // Barcha savollarni olish
    const questions = await Question.find();

    // Savollar va variantlar ro'yxati
    let quiz = [];

    for (let question of questions) {
      // Har bir savolga tegishli variantlarni olish
      const variants = await Variant.find({ questionId: question._id });

      // Savol va uning variantlarini birga yig'ish
      quiz.push({
        question: question.text,
        variants: variants.map(variant => ({
          _id: variant._id,        // Variantning IDsi
          text: variant.text,
          isCorrect: variant.isCorrect
        }))
      });
    }

    // Foydalanuvchiga savollar va variantlarni JSON formatda qaytarish
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Server error, could not retrieve quiz.' });
  }
}

module.exports = {
  getQuiz
};

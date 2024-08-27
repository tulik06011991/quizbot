const Question = require('../Model/savol'); // Savol modeli
const Variant = require('../Model/variant'); // Variant modeli

// Massiv elementlarini aralashtirish uchun funksiya
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
        variants: shuffleArray(variants.map(variant => ({
          _id: variant._id,        // Variantning IDsi
          text: variant.text,
          isCorrect: variant.isCorrect
        })))
      });
    }

    // Savollarni ham aralashtirish
    quiz = shuffleArray(quiz);

    // Foydalanuvchiga savollar va variantlarni JSON formatda qaytarish
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Server error, could not retrieve quiz.' });
  }
}

module.exports = {
  getQuiz
};

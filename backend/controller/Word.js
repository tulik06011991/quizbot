const mammoth = require('mammoth');
const Question = require('../Model/savol');
const Variant = require('../Model/variant');
const CorrectAnswer = require('../Model/togri');
const Fan = require('../Model/newFan');

// Word faylidan matnni o'qish
async function readWordFile(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error reading Word file:', error);
    throw error;
  }
}

// Savollarni matndan JSON formatga o'tkazish
function parseTextToQuestions(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const questions = [];
  let currentQuestion = null;

  lines.forEach(line => {
    if (line.match(/^\d+\./)) { // Savol qatori
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        text: line.replace(/^\d+\.\s*/, '').trim(),
        variants: []
      };
    } else if (line.match(/^\./)) { // To'g'ri javob variant
      currentQuestion.variants.push({ text: line.replace(/^\./, '').trim(), isCorrect: true });
    } else { // Oddiy variant
      currentQuestion.variants.push({ text: line.trim(), isCorrect: false });
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}

// Quiz yaratish
async function createQuiz(req, res) {
  if (!req.file || !req.body.fan) { // Fan nomini ham olish
    return res.status(400).json({ error: 'Please select a Word file and provide a fan name.' });
  }

  try {
    const filePath = req.file.path;
    const text = await readWordFile(filePath);
    const questions = parseTextToQuestions(text);

    // Yangi yoki mavjud fan nomi orqali fan topish yoki yaratish
    let fan = await Fan.findOne({ name: req.body.fan });
    if (!fan) {
      fan = await Fan.create({ name: req.body.fan });
    }

    for (let questionData of questions) {
      // Savolni saqlash va fanga bog'lash
      const question = await Question.create({ text: questionData.text, fanId: fan._id });

      for (let variantData of questionData.variants) {
        // Variantni saqlash
        const variant = await Variant.create({
          text: variantData.text,
          isCorrect: variantData.isCorrect,
          questionId: question._id
        });

        // To'g'ri javobni saqlash
        if (variantData.isCorrect) {
          await CorrectAnswer.create({ text: variantData.text, questionId: question._id });
        }
      }
    }

    res.status(201).json({ message: 'Quiz created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createQuiz };

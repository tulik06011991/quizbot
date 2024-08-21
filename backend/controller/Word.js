const mammoth = require('mammoth');
const Question = require('../Model/savol');
const Variant = require('../Model/variant');
const CorrectAnswer = require('../Model/togri');
const fs = require('fs');

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
  if (!req.file) {
    return res.status(400).json({ error: 'Please select a Word file.' });
  }

  try {
    const filePath = req.file.path; // Yuklangan faylning yo'li
    const text = await readWordFile(filePath);
    const questions = parseTextToQuestions(text);

    for (let questionData of questions) {
      // Savolni saqlash
      const question = await Question.create({ text: questionData.text });

      for (let variantData of questionData.variants) {
        // Variantni saqlash
        const variant = await Variant.create({
          text: variantData.text, // Matnni nuqta bilan boshlangan qismini olib tashlab saqlash
          isCorrect: variantData.isCorrect, // To'g'ri yoki noto'g'ri ekanligini saqlash
          questionId: question._id
        });

        // Agar bu to'g'ri variant bo'lsa, CorrectAnswer schema'siga ham saqlaymiz
        if (variantData.isCorrect) {
          await CorrectAnswer.create({ text: variantData.text }); // To'g'ri javobni saqlash
        }
      }
    }

    res.status(201).json({ message: 'Quiz created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createQuiz
};

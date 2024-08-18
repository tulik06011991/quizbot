const express = require('express');
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const Question = require('../Model/savol');
const Option = require('../Model/variant');

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .docx files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Fayl yuklash va qayta ishlash
const uploadQuiz = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fayl yuklanmadi' });
    }

    const filePath = req.file.path;
    const quizData = await extractQuizData(filePath);

    // MongoDB'ga savollar va variantlarni saqlash
    for (const question of quizData.questions) {
      const savedQuestion = await Question.create({ question: question.question });
      
      for (const option of question.options) {
        await Option.create({
          questionId: savedQuestion._id,
          option: option
        });
      }
    }

    res.status(201).json({ message: 'Quiz muvaffaqiyatli yuklandi va saqlandi' });
  } catch (error) {
    next(error);
  }
};

// Word fayldan ma'lumot olish va JSON formatiga o'zgartirish
const extractQuizData = async (filePath) => {
  const data = await mammoth.extractRawText({ path: filePath });
  const lines = data.value.split('\n').filter(Boolean);

  const quizData = { questions: [] };
  let currentQuestion = null;
  let questionCount = 0; // Maksimum 30 ta savol

  lines.forEach((line) => {
    if (line.match(/^\d+\./)) {
      if (currentQuestion && questionCount < 30) {
        quizData.questions.push(currentQuestion);
      }
      if (questionCount < 30) {
        currentQuestion = {
          question: line.trim(),
          options: []
        };
        questionCount++;
      }
    } 
    else if (line.match(/^[A-D]\./) && currentQuestion) {
      currentQuestion.options.push(line.trim());
    }
  });

  // Oxirgi savolni qo'shish
  if (currentQuestion && questionCount <= 30) {
    quizData.questions.push(currentQuestion);
  }

  return quizData;
};

// Multer middleware va fayl yuklash funksiyasini eksport qilish
module.exports = { upload, uploadQuiz };

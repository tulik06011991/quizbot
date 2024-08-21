const express = require('express');
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const Question = require('../Model/savol'); // Model schemas
const Option = require('../Model/variant');
const CorrectAnswer = require('../Model/togri');

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

// Word fayldan ma'lumot olish va JSON formatiga o'zgartirish
const extractQuizData = async (filePath) => {
  const data = await mammoth.extractRawText({ path: filePath });
  const lines = data.value.split('\n').filter(Boolean);

  const quizData = { questions: [] };
  let currentQuestion = null;
  let questionCount = 0; // Maksimum 30 ta savol

  lines.forEach((line) => {
    if (line.match(/^\d+\./)) {
      // Agar oldingi savol bo'lsa, uni qo'shamiz
      if (currentQuestion && questionCount < 30) {
        quizData.questions.push(currentQuestion);
      }
      // Yangi savol yaratish
      if (questionCount < 30) {
        currentQuestion = {
          question: line.trim(),
          options: []
        };
        questionCount++;
      }
    } 
    else if (line.match(/^\.\s/) && currentQuestion) {
      // Nuqta bilan boshlangan variant to'g'ri javob hisoblanadi
      currentQuestion.options.push({
        text: line.replace(/^\.\s/, '').trim(),
        isCorrect: true
      });
    }
    else if (line.trim() && currentQuestion) {
      // Oddiy variantlar
      currentQuestion.options.push({
        text: line.trim(),
        isCorrect: false
      });
    }
  });

  // Oxirgi savolni qo'shish
  if (currentQuestion && questionCount <= 30) {
    quizData.questions.push(currentQuestion);
  }

  return quizData;
};


// Fayl yuklash va qayta ishlash
const uploadQuiz = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fayl yuklanmadi' });
    }

    const filePath = req.file.path;
    const quizData = await extractQuizData(filePath);

    // MongoDB'ga savollar, variantlar va to'g'ri javoblarni saqlash
    for (const question of quizData.questions) {
      const savedQuestion = await Question.create({ question: question.question });

      for (const option of question.options) {
        await Option.create({
          questionId: savedQuestion._id,
          option: option.text,
          isCorrect: option.isCorrect
        });

        if (option.isCorrect) {
          await CorrectAnswer.create({
            questionId: savedQuestion._id,
            correctOptionText: option.text // To'g'ri variant matnini saqlash
          });
        }
      }
    }

    res.status(201).json({ message: 'Quiz muvaffaqiyatli yuklandi va saqlandi' });
  } catch (error) {
    console.error('Error in uploadQuiz:', error); // Xatolikni loglash
    next(error);
  }
};




// Foydalanuvchiga testni ko'rsatish
const getQuiz = async (req, res) => {
  try {
    const questions = await Question.find();
    const quiz = [];

    for (const question of questions) {
      const options = await Option.find({ questionId: question._id });
      const correctAnswers = await CorrectAnswer.find({ questionId: question._id });

      // Variantlarni formatlash
      const formattedOptions = options.map(option => ({
        option: option.option,
        isCorrect: correctAnswers.some(correctAnswer => 
          correctAnswer.correctOptionText === option.option
        )
      }));

      quiz.push({
        question: question.question,
        options: formattedOptions
      });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};




module.exports = { upload, uploadQuiz, getQuiz };

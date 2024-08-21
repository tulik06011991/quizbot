const express = require('express');
const router = express.Router();
const quizController = require('../controller/javob'); // To'g'ri import

// Foydalanuvchi javoblarini tekshirish uchun yo'l
router.post('/check-answers', quizController.checkAnswers);

module.exports = router;

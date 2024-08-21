const express = require('express');
const router = express.Router();
const {  finishQuiz } = require('../controller/Test'); // Controller funksiyalarni import qilish

// Quiz olish route (GET /quiz)


// Quizni yakunlash route (POST /quiz/finish)
router.post('/quiz/finish', finishQuiz);

module.exports = router;

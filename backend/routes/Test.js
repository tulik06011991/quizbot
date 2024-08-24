const express = require('express');
const router = express.Router();
const { getQuiz } = require('../controller/Test');

// Savollarni olish marshruti
router.get('/quiz/Biologiya', getQuiz);

module.exports = router;

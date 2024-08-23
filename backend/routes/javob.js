// routes/javob.js
const express = require('express');
const router = express.Router();
const { checkQuizAnswers } = require('../controller/javob'); // Kontroller import

router.post('/submit', checkQuizAnswers); // Kontroller funksiyasini qo'shish

module.exports = router;

const express = require('express');
const router = express.Router();
const { uploadWordFile, saveParsedQuestions } = require('../controller/Word');

// Word faylni yuklash va parse qilish
router.post('/upload', uploadWordFile);

// Yangi faylni alohida schema bo'yicha saqlash
router.post('/save-parsed', saveParsedQuestions);

module.exports = router;

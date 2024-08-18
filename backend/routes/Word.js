const express = require('express');
const router = express.Router();
const { upload, uploadQuiz } = require('../controller/Word');

// Fayl yuklash va qayta ishlash uchun marshrut
router.post('/upload', upload.single('file'), uploadQuiz);

module.exports = router;

// routes/quizRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const quizController = require('../controller/Word');
const verifyToken = require('../middleware/errorhandler')

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Quiz yaratish uchun route
router.post('/create', verifyToken,  upload.single('file'), quizController.createQuiz);

module.exports = router;

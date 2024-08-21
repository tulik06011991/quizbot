const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadQuiz, getQuiz } = require('../controller/Word');

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

// Quizlarni yuklash uchun route
router.post('/upload', upload.single('file'), uploadQuiz);

// Quizlarni olish uchun route
router.get('/get', getQuiz);

module.exports = router;

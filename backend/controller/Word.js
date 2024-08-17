const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const { JSDOM } = require('jsdom');
const TestModel = require('../Model/WordSchema'); // Modelni import qilish

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now() + ext;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /docx|doc/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Faqat Word fayllari yuklashga ruxsat berilgan!'));
    }
  }
}).single('wordFile');

// HTML matnni o'qish va parsing qilish
const parseHtml = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const questions = [];
  let currentQuestion = null;

  document.querySelectorAll('p').forEach((element) => {
    const textContent = element.textContent.trim();

    // Savol aniqlash
    const questionMatch = textContent.match(/^(\d+)\.\s(.+)$/);
    if (questionMatch) {
      if (currentQuestion) {
        // Oldingi savolni qo'shish
        questions.push(currentQuestion);
      }

      currentQuestion = {
        questionText: questionMatch[2],
        options: [],
        correctAnswer: ''
      };
    } else if (textContent.match(/^[A-D]\.\s.+$/)) {
      // Variantlarni qo'shish
      const optionMatch = textContent.match(/^([A-D])\.\s(.+)$/);
      if (currentQuestion) {
        currentQuestion.options.push({
          optionText: optionMatch[2],
          optionLetter: optionMatch[1]
        });
      }
    } else if (element.querySelector('b') && currentQuestion) {
      // Qalin matnni aniqlash
      if (element.querySelector('b').textContent.trim().toLowerCase() === textContent.toLowerCase()) {
        currentQuestion.correctAnswer = textContent;
      }
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
};

// Faylni yuklash va ma'lumotlarni bazaga saqlash
const uploadWordFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // Yuklangan faylni o'qish va HTMLga aylantirish
      const result = await mammoth.convertToHtml({ path: req.file.path });
      const html = result.value;
      const questions = parseHtml(html);

      // Testni bazaga saqlash
      const test = new TestModel({
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        questions: questions
      });

      await test.save();
      res.status(200).json({ message: 'Fayl yuklandi va test yaratildi', test });
    } catch (error) {
      res.status(500).json({ message: 'Faylni saqlashda xatolik yuz berdi', error });
    }
  });
};

// Boshqa kerakli funktsiyalar

module.exports = { uploadWordFile };

const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const TestModel = require('../Model/WordSchema'); // Bazadagi modelni chaqirish

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Fayl saqlanadigan joy
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Fayl kengaytmasi
    const fileName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now() + ext;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB maksimal hajm
  fileFilter: (req, file, cb) => {
    const fileTypes = /docx|doc/; // Faqat Word fayllari
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Faqat Word fayllari yuklashga ruxsat berilgan!'));
    }
  }
}).single('wordFile');

// Faylni yuklab olish va test ma'lumotlariga aylantirish
const uploadWordFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // Yuklangan faylni o'qish va tekstga aylantirish
      const result = await mammoth.extractRawText({ path: req.file.path });
      const fileContent = result.value; // Fayldagi matn

      // Fayldan savollarni ajratib olish
      const questions = parseQuestionsFromText(fileContent); 

      // Testni bazaga saqlash
      const test = new TestModel({
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        questions: questions // Savollar bazaga saqlanadi
      });

      await test.save();
      res.status(200).json({ message: 'Fayl yuklandi va test yaratildi', test });
    } catch (error) {
      res.status(500).json({ message: 'Faylni saqlashda xatolik yuz berdi', error: error.message });
    }
  });
};

// Test ma'lumotlarini parsing qilish (savol/javoblarni ajratib olish uchun funksiya)
const parseQuestionsFromText = (text) => {
  const questions = [];
  const lines = text.split('\n').map(line => line.trim()); // Har bir qatorni tozalash

  let currentQuestion = null;

  lines.forEach((line) => {
    if (line.toLowerCase().startsWith('savol:')) {
      if (currentQuestion) {
        questions.push(currentQuestion); // Oldingi savolni qo'shish
      }
      currentQuestion = {
        questionText: line.replace('Savol:', '').trim(),
        options: [],
        correctAnswer: ''
      };
    } else if (currentQuestion && currentQuestion.options.length < 4) {
      currentQuestion.options.push(line.trim()); // Variantlarni qo'shish
    } else if (line.toLowerCase().startsWith('to\'g\'ri javob:')) {
      currentQuestion.correctAnswer = line.replace('To\'g\'ri javob:', '').trim(); // To'g'ri javobni qo'shish
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion); // Oxirgi savolni qo'shish
  }

  return questions;
};

module.exports = { uploadWordFile };

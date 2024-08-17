const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const FileModel = require('../Model/WordSchema');

// Fayl yuklash xavfsizligi uchun multer sozlamalari
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Fayllar xavfsiz joyda saqlanadi
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Fayl kengaytmasi
    const cleanFileName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_'); // Xavfsiz fayl nomi
    cb(null, cleanFileName + '_' + Date.now() + ext); // Fayl nomi vaqt bilan beriladi
  }
});

// Fayl yuklashda faqat Word fayllari qabul qilinadi va hajmi 5 MB dan oshmasligi kerak
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Maksimal hajm: 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /docx|doc/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only Word files are allowed!'));
    }
  }
}).single('wordFile');

// Fayl yuklash va ma'lumotlarni saqlash controlleri
const uploadWordFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const filePath = path.join(__dirname, '../uploads/', req.file.filename);

      // Word fayldan ma'lumotlarni chiqarib olish
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value; // Fayldan olingan matn

      // Ma'lumotlarni test shaklida formatlash
      const questions = parseTestFromText(text);

      // Ma'lumotlarni bazaga saqlash
      const savedTest = await saveTestToDatabase(questions);

      res.status(200).json({ message: 'Fayl yuklandi va test ko\'rinishda saqlandi', test: savedTest });
    } catch (error) {
      res.status(500).json({ message: 'Faylni o\'qishda yoki saqlashda xatolik yuz berdi', error: error.message });
    }
  });
};

// Test savollarini o'qish va bazaga saqlash
const parseTestFromText = (text) => {
  // Matndan test savollarini ajratib olish
  const questions = text.split("\n").map(line => ({
    question: line.split("?")[0] + "?",
    answers: ["A", "B", "C", "D"], // Javoblar avtomatik shakllantiriladi
    correctAnswer: "A" // To'g'ri javob keyinchalik yangilanadi
  }));
  return questions;
};

// Ma'lumotlarni bazaga saqlash
const saveTestToDatabase = async (questions) => {
  const test = new FileModel({ questions });
  return await test.save();
};

module.exports = { uploadWordFile };

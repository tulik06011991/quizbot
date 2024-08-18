const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const fs = require('fs');
const TestModel = require('../Model/WordSchema');

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Fayl saqlanadigan papka
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now() + ext;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage }).single('wordFile');

// Faylni yuklash va parse qilish
const uploadWordFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      const result = await mammoth.extractRawText({ path: filePath });
      const fileContent = result.value;

      const questions = parseQuestionsFromText(fileContent);

      // JSON formatida saqlash
      const parsedFilePath = path.join(__dirname, '../parsed/', req.file.filename + '.json');
      fs.writeFileSync(parsedFilePath, JSON.stringify(questions, null, 2));

      const test = new TestModel({
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        questions: questions
      });

      await test.save();
      res.status(200).json({ message: 'File processed and saved successfully', test });
    } catch (error) {
      res.status(500).json({ message: 'Error processing file', error });
    }
  });
};

// Savollarni parse qilish funksiyasi
const parseQuestionsFromText = (text) => {
  const questions = [];
  const lines = text.split('\n').map(line => line.trim());

  let currentQuestion = null;

  lines.forEach(line => {
    if (line.match(/^\d+\./)) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        questionText: line.replace(/^\d+\.\s*/, '').trim(),
        options: [],
        correctAnswer: ''
      };
    } else if (currentQuestion && line.match(/^[A-D]\./)) {
      currentQuestion.options.push(line.trim());
    } else if (line.match(/^Correct Answer:/)) {
      currentQuestion.correctAnswer = line.replace(/^Correct Answer:\s*/, '').trim();
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
};

// Modelga saqlash uchun faylni qabul qilish
const saveParsedQuestions = async (req, res) => {
  try {
    const parsedFilePath = path.join(__dirname, '../parsed/', req.file.filename + '.json');
    const fileContent = fs.readFileSync(parsedFilePath);
    const questions = JSON.parse(fileContent);

    const test = new TestModel({
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      questions: questions
    });

    await test.save();
    res.status(200).json({ message: 'Parsed questions saved to database successfully', test });
  } catch (error) {
    res.status(500).json({ message: 'Error saving parsed questions', error });
  }
};

module.exports = {
  uploadWordFile,
  saveParsedQuestions
};

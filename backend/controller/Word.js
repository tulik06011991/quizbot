const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileModel = require('../Model/WordSchema'); // Modelni import qilish

// Fayllarni saqlash joyi va nomini o'rnatish
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Fayl saqlanadigan papka
  },
  filename: (req, file, cb) => {
    // Fayl nomini tozalash
    const ext = path.extname(file.originalname); // Fayl kengaytmasi
    const cleanFileName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_'); // Xavfsiz nom
    cb(null, cleanFileName + '_' + Date.now() + ext); // Fayl nomi vaqtga bog'liq qilib beriladi
  }
});

// Faylni yuklashni sozlash
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Maksimal fayl o'lchami 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /docx|doc/; // Faqat Word fayllari
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only Word files are allowed!')); // Xatolik xabari
    }
  }
}).single('wordFile'); // 'wordFile' - formda faylning nomi

// Faylni yuklash controlleri
const uploadWordFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // Fayl ma'lumotlarini saqlash
      const file = new FileModel({
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
      });

      await file.save();

      res.status(200).json({
        message: 'File uploaded and saved successfully',
        file: req.file
      });
    } catch (error) {
      res.status(500).json({ message: 'Error saving file metadata' });
    }
  });
};

// Faylni o'qish va test ko'rinishida taqdim etish
const presentTest = (req, res) => {
  const filePath = path.join(__dirname, '../uploads/', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Faylni o'qish va testga tayyorlash
  // (Bu yerda faylni o'qish va test ko'rinishida tayyorlash)
  res.status(200).json({ message: 'Test ready', file: req.params.filename });
};

module.exports = { uploadWordFile, presentTest };

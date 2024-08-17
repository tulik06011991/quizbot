const express = require('express');
const router = express.Router();
const { uploadWordFile, presentTest } = require('../controller/Word');

// POST route fayl yuklash uchun
router.post('/upload', uploadWordFile);

// GET route yuklangan faylni test ko'rinishida taqdim etish uchun
router.get('/test/:filename', presentTest);

module.exports = router;

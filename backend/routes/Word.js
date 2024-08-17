const express = require('express');
const router = express.Router();
const { uploadWordFile } = require('../controller/Word');

// Faylni yuklash uchun route
router.post('/upload', uploadWordFile);

module.exports = router;

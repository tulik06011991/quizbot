const express = require('express');
const router = express.Router();
const {uploadWordFile} = require('../controller/Word')

// POST route fayl yuklash uchun
router.post('/upload', uploadWordFile);



module.exports = router;

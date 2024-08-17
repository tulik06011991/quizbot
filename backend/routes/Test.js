const express = require('express');
const router = express.Router();
const {getTestById } = require('../controller/Test')

// POST route fayl yuklash uchun
router.post('/test', getTestById );



module.exports = router;

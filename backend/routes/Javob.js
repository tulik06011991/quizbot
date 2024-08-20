const express = require('express');
const { submitQuiz } = require('../controller/Javob');

const router = express.Router();

router.post('/test/submit', submitQuiz);

module.exports = router;

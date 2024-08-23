const express = require('express');
const router = express.Router();
const middleware = require('../middleware/errorhandler')
const {  getQuestions, } = require('../controller/SavolVariant');

// Savol va uning variantlarini olish
router.get('/question',   getQuestions);

module.exports = router;

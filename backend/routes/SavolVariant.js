const express = require('express');
const router = express.Router();
const middleware = require('../middleware/errorhandler')
const {  getQuestionsWithVariants } = require('../controller/SavolVariant');

// Savol va uning variantlarini olish
router.get('/question',   getQuestionsWithVariants);

module.exports = router;

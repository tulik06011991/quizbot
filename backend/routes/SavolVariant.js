const express = require('express');
const router = express.Router();
const middleware = require('../middleware/errorhandler')
const {  getQuestionsWithVariants,addQuestion,
    updateQuestion } = require('../controller/SavolVariant');

// Savol va uning variantlarini olish
router.get('/question',   getQuestionsWithVariants);
router.post('/question/:id',   addQuestion);
router.put('/question/:id',   updateQuestion);

module.exports = router;

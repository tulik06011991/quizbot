const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/errorhandler')
const {  getQuestionsWithVariants,addQuestion,
    updateQuestion } = require('../controller/SavolVariant');

// Savol va uning variantlarini olish
router.get('/question', verifyToken,  getQuestionsWithVariants);
router.post('/question/:id', verifyToken,  addQuestion);
router.put('/question/:id', verifyToken,   updateQuestion);

module.exports = router;

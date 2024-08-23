const express = require('express');
const router = express.Router();
const { deleteAllQuestionsAndVariants } = require('../controller/DeleteQues');
const middleware = require('../middleware/errorhandler')  

// Barcha savollar va variantlarni o'chirish
router.delete('/delete',   deleteAllQuestionsAndVariants);

module.exports = router;

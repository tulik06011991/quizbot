const express = require('express');
const router = express.Router();
const { deleteAllQuestionsAndVariants, deleteUser } = require('../controller/DeleteQues');
const middleware = require('../middleware/errorhandler')  

// Barcha savollar va variantlarni o'chirish
router.delete('/delete',   deleteAllQuestionsAndVariants);
router.delete('/delete/:id',   deleteUser);

module.exports = router;

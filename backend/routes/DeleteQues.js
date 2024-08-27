const express = require('express');
const router = express.Router();
const { deleteAllQuestionsAndVariants, deleteUser } = require('../controller/DeleteQues');
const verifyToken = require('../middleware/errorhandler')  

// Barcha savollar va variantlarni o'chirish
router.delete('/delete',   verifyToken, deleteAllQuestionsAndVariants);
router.delete('/delete/:id', verifyToken,   deleteUser);

module.exports = router;

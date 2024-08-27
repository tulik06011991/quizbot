const express = require('express');
const router = express.Router();
const { deleteUserAndResults , getAllResults} = require('../controller/UsersResult');
const verifyToken   = require('../middleware/errorhandler')

// Foydalanuvchilar va ularning natijalarini olish
router.get('/results', verifyToken, getAllResults);
router.delete('/result/:id', verifyToken, deleteUserAndResults);


// Maxsus userning natijalarini olish


module.exports = router;

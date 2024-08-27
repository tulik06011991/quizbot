const express = require('express');
const router = express.Router();
const { deleteUserAndResults , getAllResults} = require('../controller/UsersResult');
const middleware   = require('../middleware/errorhandler')

// Foydalanuvchilar va ularning natijalarini olish
router.get('/results',  getAllResults);
router.delete('/result/:id', deleteUserAndResults);


// Maxsus userning natijalarini olish


module.exports = router;

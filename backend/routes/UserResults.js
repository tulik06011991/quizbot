const express = require('express');
const router = express.Router();
const resultController = require('../controller/UsersResult');
const middleware   = require('../middleware/errorhandler')

// Foydalanuvchilar va ularning natijalarini olish
router.get('/results',  resultController.getAllResults);

// Maxsus userning natijalarini olish
router.get('/results/:userId', middleware,  resultController.getResultByUserId);

module.exports = router;

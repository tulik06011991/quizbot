// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/Auth');
// const verifyToken = require('../middleware/errorhandler')

// Ro'yxatdan o'tish
router.post('/register', register);

// Login qilish
router.post('/login', login);

module.exports = router;

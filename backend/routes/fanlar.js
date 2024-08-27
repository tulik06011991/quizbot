const express = require('express');
const router = express.Router();
const { getFanList } = require('../controller/fanlar');
const verifyToken = require('../middleware/errorhandler')

router.get('/fanlar',  verifyToken, getFanList);

module.exports = router;

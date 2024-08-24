const express = require('express');
const router = express.Router();
const { getFanList } = require('../controller/fanlar');

router.get('/fanlar', getFanList);

module.exports = router;

const express = require('express');
const app = express();
require('dotenv').config();

PORT = process.env.PORT ||  5000;  // To'g'ri port raqamini qo'shish

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

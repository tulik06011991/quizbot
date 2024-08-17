const express = require('express');
const mongoose = require('mongoose');
const Auth = require('./routes/Auth')


const app = express();

// Ma'lumotlarni JSON formatda olish uchun middleware
app.use(express.json());

// MongoDB'ga ulanish
mongoose.connect('mongodb+srv://tolqinmirsaliyev:baliq06011991@cluster0.pjeij25.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth route'larni ulash
app.use('/auth', Auth)

// Serverni ishga tushirish
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

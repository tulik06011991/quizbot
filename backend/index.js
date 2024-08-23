const express = require('express');
const mongoose = require('mongoose');
const Auth = require('./routes/Auth')
const fileUploadRoutes = require('./routes/Word');
const resultRoutes = require('./routes/UserResults');
const deleteQues = require('./routes/DeleteQues');
const savolVariant = require('./routes/SavolVariant')
const Test = require('./routes/Test')
const javob = require('./routes/javob')
const path = require('path');
const cors = require('cors');


const app = express();
app.use(cors())

// Ma'lumotlarni JSON formatda olish uchun middleware
app.use(express.json());

// MongoDB'ga ulanish
mongoose.connect('mongodb+srv://tolqinmirsaliyev:baliq06011991@cluster0.pjeij25.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth route'larni ulash
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Fayl yuklash marshrutlarini ulash

app.use('/parsed', express.static('parsed'));
app.use('/api', fileUploadRoutes);
app.use('/api', resultRoutes);
app.use('/deleteAll', deleteQues)
app.use('/savollar', savolVariant)
app.use('/test', Test)
app.use('/auth', Auth)
app.use('/test', javob)

// Serverni ishga tushirish
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

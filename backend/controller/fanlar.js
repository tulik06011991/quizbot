const Fan = require('../Model/newFan');

// Fanlar ro'yxatini olish
async function getFanList(req, res) {
  try {
    // Barcha fanlarni olish
    const fanlar = await Fan.find().sort({ createdAt: -1 }); // Yaratilgan vaqti bo'yicha so'nggi fanlar birinchi chiqadi
    res.status(200).json(fanlar); // Fanlar ro'yxatini JSON formatda qaytarish
  } catch (error) {
    res.status(500).json({ error: error.message }); // Xatolik yuz bersa qaytariladi
  }
}

module.exports = { getFanList };

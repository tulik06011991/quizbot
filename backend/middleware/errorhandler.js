const jwt = require('jsonwebtoken');
const User = require('../Model/ModelSchema');
require('dotenv').config();
 // Foydalanuvchi modelini import qilish

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer so'zidan keyingi haqiqiy tokenni olish
// Tokenni frontenddan headers orqali olish
// console.log(token)

  if (!token) {
    return res.status(403).json({ message: 'No token provided' }); // Token bo'lmasa xatolik berish
  }

  // Tokenni tekshirish
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
   
    if (err) {
      return res.status(401).json({ message: 'Invalid token' }); // Yaroqsiz token
    }

    try {
      // Foydalanuvchini topish
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Foydalanuvchi topilmasa
      }

      
      if (user.role ===true) {
         next(); // Admin panelga kirish
      }else{
        return res.status(401).json("admin emassiz")
      }

      // User bo'lsa
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
};



module.exports = verifyToken ;

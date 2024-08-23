const jwt = require('jsonwebtoken');
const User = require('../Model/ModelSchema'); // Foydalanuvchi modelini import qilish

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; // Tokenni frontenddan headers orqali olish

  if (!token) {
    return res.status(403).json({ message: 'No token provided' }); // Token bo'lmasa xatolik berish
  }

  // Tokenni tekshirish
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' }); // Yaroqsiz token
    }

    try {
      // Foydalanuvchini topish
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Foydalanuvchi topilmasa
      }

      // Admin bo'lsa
      if (user.role) {
        return res.status(200).json({ message: 'Access granted to admin panel' }); // Admin panelga kirish
      }

      // User bo'lsa
      return res.status(201).json({ message: 'Access granted to user panel' }); // Foydalanuvchi paneliga kirish
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = verifyToken;

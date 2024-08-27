// controllers/authController.js
const User = require('../Model/ModelSchema'); // Modelning to'g'ri yo'lini tekshiring
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register controller
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Foydalanuvchini tekshirish (email bor-yo'qligini)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Parolni xesh qilish
    const hashedPassword = await bcrypt.hash(password, 12); // Xesh kuchaytirilgan

    // Yangi foydalanuvchi yaratish
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Foydalanuvchini saqlash
    await newUser.save();

    // JWT yaratish
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Foydalanuvchini qidirish
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // JWT yaratish
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  register
};

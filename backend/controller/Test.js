const TestModel = require('../Model/WordSchema');

// Foydalanuvchiga test ko'rsatish
const getTestById = async (req, res) => {
  try {
    const test = await TestModel.find();
    if (!test) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi', error });
  }
};

module.exports = { getTestById };

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  option: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Option', optionSchema);

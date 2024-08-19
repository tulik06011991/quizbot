const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  option: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Option', optionSchema);

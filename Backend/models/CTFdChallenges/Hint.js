const mongoose = require('mongoose');

const HintSchema = new mongoose.Schema({
  content: { type: String, required: true },
  cost: { type: Number, required: true }
});

module.exports = mongoose.model('Hint', HintSchema);

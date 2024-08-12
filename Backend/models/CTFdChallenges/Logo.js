const mongoose = require('mongoose');

const LogoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {  // Add the title field
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Logo', LogoSchema);

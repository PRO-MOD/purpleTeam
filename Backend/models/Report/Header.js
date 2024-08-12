const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const Header = mongoose.model('Header', headerSchema);

module.exports = Header;

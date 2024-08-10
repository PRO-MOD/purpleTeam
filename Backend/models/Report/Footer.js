const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const Footer = mongoose.model('Footer', footerSchema);

module.exports = Footer;

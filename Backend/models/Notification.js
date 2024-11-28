const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['toast', 'alert', 'background'], required: true }, // Notification type
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);
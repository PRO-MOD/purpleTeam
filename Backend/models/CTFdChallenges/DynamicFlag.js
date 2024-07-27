const mongoose = require('mongoose');

const flagEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flag: { type: String, required: true }
});

const dynamicFlagSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  flags: [flagEntrySchema]
});

module.exports = mongoose.model('DynamicFlag', dynamicFlagSchema);

// models/Submission.js
const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);

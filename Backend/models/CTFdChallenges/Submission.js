// models/Submission.js
const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  cheating:{type:Boolean, default: false},
  attempt: { // New field to track attempt count
    type: Number,
    default: 0,
  },
  points:{
    type: Number,
    default: 0,
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);

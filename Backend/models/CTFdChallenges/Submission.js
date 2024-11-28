const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  cheating: { type: Boolean, default: false },
  attempt: { // Field to track attempt count
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  copiedFrom: { // Field to store the flag owner's ID if cheating
    type: String,
    default: null, // Default value is null
  },
  date: { type: Date, default: Date.now },

  hintsUsed: { type: Number, default: 0 }, // Number of hints used
  totalHintCost: { type: Number, default: 0 }
});

module.exports = mongoose.model('Submission', SubmissionSchema);

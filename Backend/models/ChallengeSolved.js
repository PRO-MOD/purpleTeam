const mongoose = require('mongoose');

const challengeSolveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  challenge_id: {
    type: String,
    required: true,
  },
  challenge_name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  solve_id: {
    type: String,
    required: false,
  }
});

const ChallengeSolve = mongoose.model('ChallengeSolve', challengeSolveSchema);

module.exports = ChallengeSolve;

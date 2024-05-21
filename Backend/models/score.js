const mongoose = require('mongoose');
const { read } = require('xlsx');

// Define the Score schema
const scoreSchema = new mongoose.Schema({
  account_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  score: {
    type: Number,
    required: true
  },
  manualScore: {
    type: Number,
    default: null
  },
  date: {
    type: Date
  },
  read: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User schema
  }
});

// Create a Score model from the schema
module.exports = mongoose.model('score', scoreSchema);
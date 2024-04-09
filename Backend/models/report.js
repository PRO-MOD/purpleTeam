// Import mongoose
const mongoose = require('mongoose');

// Define the schema for form data
const reportSchema = new mongoose.Schema({
  question1: {
    type: String,
    required: true,
  },
  question2: {
    type: String,
    required: true,
  },
  question3: {
    type: String,
    required: true,
  },
  question4: {
    type: String,
    required: true,
  },
  question5: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: [String], 
    required: false, 
  },
  pdfName: {
    type: String,
    required: true,
  },
  reportType: { 
    type: String, 
    required: true 
  },  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  manualScore: {
    type: Number,
    default: null // Assuming manual score is not initially set
  }
});

// Creating the FormData model
const reportModel = mongoose.model('reportData', reportSchema);

// Export the model
module.exports = reportModel;

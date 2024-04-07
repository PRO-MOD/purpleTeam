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
    type: [String], // Assuming you store the photo URL
    required: false, // It's not required if the user doesn't upload a photo
  },
  pdfName: {
    type: String,
    required: true,
  },
  reportType: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the FormData model
const reportModel = mongoose.model('reportData', reportSchema);

// Export the model
module.exports = reportModel;

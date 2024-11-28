
const mongoose = require('mongoose');

// Define the schema for form data
const notificationSchema = new mongoose.Schema({

    description: { type: String, required: true },
    descriptionScore: { type: Number, default: 0, required: false },
    location: { type: String, required: true },
    locationScore: { type: Number, default: 0, required: false },
    notes: { type: String, required: false },
    ID:{
        type: String, required: true
    },
    // notesScore: { type: Number, default: 0, required: false },
    pocScreenshots: {
        type: [String],
        required: false,
    },
    pocScreenshotsScore:{
        type: Number, default: 0, required: false

    },
    pdfName: {
        type: String,
        required: true,
    },
    reportType: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    manualScore: {
        type: Number,
        default: null, // Assuming manual score is not initially set
        required: false,
    },
    penaltyScore: {
        type: Number, default: 0, required: false
  
    },
    penalty:{type: String, required: false},
});

// Creating the FormData model
const notificationModel = mongoose.model('notificationData', notificationSchema);

// Export the model
module.exports = notificationModel;


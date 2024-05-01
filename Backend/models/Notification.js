
// Import mongoose
const mongoose = require('mongoose');

// Define the schema for form data
const notificationSchema = new mongoose.Schema({

    type:{type:String, required:true},
    location:{type:String,required:true},
    priority:{type:String,required:true},
    action:{type:String,required:true},
    mitre:{type:String,required:true},
    step:{type:String,required:true},
    notes:{type:String,required:true},
  pocScreenshots: {
    type: [String],
    required: false,
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
  },
});


// Creating the FormData model
const notificationModel = mongoose.model('notificationData', notificationSchema);

// Export the model
module.exports = notificationModel;


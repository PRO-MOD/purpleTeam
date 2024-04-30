
// Import mongoose
const mongoose = require('mongoose');

// Define the schema for form data
const reportSchema = new mongoose.Schema({

    description: { type: String, required: true },
    threatLevel: { type: String, enum: ['Low', 'Guarded', 'Elevated', 'High', 'Severe'], required: true },
    areasOfConcern: [{ type: String }],
    recentIncidents: { type: String, required: true },
    trendAnalysis: { type: String, required: true },
    impactAssessment: { type: String, required: true },
    sources: [{ type: String }],
    keyThreatActors: { type: String, required: true },
    indicatorsOfCompromise: [{ type: String }],
    recentVulnerabilities: { type: String, required: true },
    patchStatus: { type: String, required: true },
    mitigationRecommendations: { type: String, required: true },
    currentOperations: { type: String, required: true },
    incidentResponse: { type: String, required: true },
    forensicAnalysis: { type: String, required: true },
    internalNotifications: [{ type: String }],
    externalNotifications: [{ type: String }],
    publicRelations: { type: String, required: true },
    riskAssessment: { type: String, required: true },
    continuityPlanning: { type: String, required: true },
    trainingAndExercises: { type: String, required: true },
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
  notes:{
    type: String,
    required:false,
  },
  prepared:{
    type: String,
    required: false,
  },
});


// Creating the FormData model
const reportModel = mongoose.model('reportData', reportSchema);

// Export the model
module.exports = reportModel;


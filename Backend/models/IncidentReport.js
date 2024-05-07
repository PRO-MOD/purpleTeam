const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
 
    description: { type: String, required: true },
    severityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    impact: {
      type: String,
      enum: ['Minimal', 'Moderate', 'Significant', 'Severe'],
      required: true,
    },
    affectedSystems: [{ type: String }],
    detectionMethod: { type: String, required: true },
    initialDetectionTime: { type: Date, required: true },
    attackVector: {
      type: String,
      enum: ['Phishing', 'Malware', 'Insider Threat', 'DoS', 'Other'],
      required: true,
    },
    attackers: {
      type: String,
      enum: ['External', 'Internal', 'Unknown'],
      required: true,
  },
    containment: { type: String, required: true },
    eradication: { type: String, required: true },
    recovery: { type: String, required: true },
    lessonsLearned: { type: String, required: true },
    evidence: { type: String, required: true },
    indicatorsOfCompromise: [{ type: String }],
    ttps: { type: String, required: true },
    mitigationRecommendations: { type: String, required: true },
    internalNotification: [{ type: String }],
    externalNotification: [{ type: String }],
    updates: { type: String, required: true },
    other: { type: String, required: false },
  pocScreenshots:{ type: [String], required:false},
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
    required:false
  },
  prepared:{
    type: String,
    required: false 
  },
});

const incidentModel = mongoose.model('incidentData', incidentSchema);

module.exports = incidentModel;

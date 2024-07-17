
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({


  ID: { type: String, required: true },

 
    description: { type: String, required: true },
    descriptionScore: { type: Number, default: 0, required: false },
    severityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    severityLevelScore: { type: Number, default: 0, required: false },
    impact: {
      type: String,
      enum: ['Minimal', 'Moderate', 'Significant', 'Severe'],
      required: true,
    },
    impactScore: { type: Number, default: 0, required: false },
    affectedSystems: { type: String, required: true },
    affectedSystemsScore: { type: Number, default: 0, required: false },
    detectionMethod: { type: String, required: true },
    detectionMethodScore: { type: Number, default: 0, required: false },
    initialDetectionTime: { type: Date, required: true },
    initialDetectionTimeScore: { type: Number, default: 0, required: false },
    attackVector: {
      type: String,
      enum: ['Phishing', 'Malware', 'Insider Threat', 'DoS', 'Other'],
      required: true,
    },
    attackVectorScore: { type: Number, default: 0, required: false },
    attackers: {
      type: String,
      enum: ['External', 'Internal', 'Unknown'],
      required: true,
    },
    attackersScore: { type: Number, default: 0, required: false },
    containment: { type: String, required: true },
    containmentScore: { type: Number, default: 0, required: false },
    eradication: { type: String, required: true },
    eradicationScore: { type: Number, default: 0, required: false },
    recovery: { type: String, required: true },
    recoveryScore: { type: Number, default: 0, required: false },
    lessonsLearned: { type: String, required: true },
    lessonsLearnedScore: { type: Number, default: 0, required: false },
    evidence: { type: String, required: true },
    evidenceScore: { type: Number, default: 0, required: false },
    indicatorsOfCompromise: { type: String, required: true },
    indicatorsOfCompromiseScore: { type: Number, default: 0, required: false },
    ttps: { type: String, required: true },
    ttpsScore: { type: Number, default: 0, required: false },
    mitigationRecommendations: { type: String, required: true },
    mitigationRecommendationsScore: { type: Number, default: 0, required: false },
    internalNotification: { type: String, required: false  },
    // internalNotificationScore: { type: Number, default: 0, required: false },
    externalNotification: { type: String, required: false },
    // externalNotificationScore: { type: Number, default: 0, required: false },
    updates: { type: String, required: false },
    // updatesScore: { type: Number, default: 0, required: false },
    other: { type: String, required: false },
    pocScreenshots: { type: [String], required: false },
    pocScreenshotsScore:{
      type: Number, default: 0, required: false

  },
    pdfName: { type: String, required: true },
    reportType: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    manualScore: { type: Number, default: null, required: false },
    notes: { type: String, required: false },
    prepared: { type: String, required: false },
    penalty:{type: String, required: false},
    penaltyScore: {
      type: Number, default: 0, required: false

  },
});

const incidentModel = mongoose.model('incidentData', incidentSchema);

module.exports = incidentModel;

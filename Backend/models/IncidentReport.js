// const mongoose = require('mongoose');

// const incidentSchema = new mongoose.Schema({
 
//     description: { type: String, required: true },
//     severityLevel: {
//       type: String,
//       enum: ['Low', 'Medium', 'High', 'Critical'],
//       required: true,
//     },
//     impact: {
//       type: String,
//       enum: ['Minimal', 'Moderate', 'Significant', 'Severe'],
//       required: true,
//     },
//     affectedSystems: [{ type: String }],
//     detectionMethod: { type: String, required: true },
//     initialDetectionTime: { type: Date, required: true },
//     attackVector: {
//       type: String,
//       enum: ['Phishing', 'Malware', 'Insider Threat', 'DoS', 'Other'],
//       required: true,
//     },
//     attackers: {
//       type: String,
//       enum: ['External', 'Internal', 'Unknown'],
//       required: true,
//   },
//     containment: { type: String, required: true },
//     eradication: { type: String, required: true },
//     recovery: { type: String, required: true },
//     lessonsLearned: { type: String, required: true },
//     evidence: { type: String, required: true },
//     indicatorsOfCompromise: [{ type: String }],
//     ttps: { type: String, required: true },
//     mitigationRecommendations: { type: String, required: true },
//     internalNotification: [{ type: String }],
//     externalNotification: [{ type: String }],
//     updates: { type: String, required: true },
//     other: { type: String, required: false },
//   pocScreenshots:{ type: [String], required:false},
//   pdfName: {
//     type: String,
//     required: true,
//   },
//   reportType: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   manualScore: {
//     type: Number,
//     default: null, // Assuming manual score is not initially set
//   },
//   notes:{
//     type: String,
//     required:false
//   },
//   prepared:{
//     type: String,
//     required: false 
//   },
// });

// const incidentModel = mongoose.model('incidentData', incidentSchema);

// module.exports = incidentModel;


const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
 
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
    affectedSystems: [{ type: String }],
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
    indicatorsOfCompromise: [{ type: String }],
    indicatorsOfCompromiseScore: { type: Number, default: 0, required: false },
    ttps: { type: String, required: true },
    ttpsScore: { type: Number, default: 0, required: false },
    mitigationRecommendations: { type: String, required: true },
    mitigationRecommendationsScore: { type: Number, default: 0, required: false },
    internalNotification: [{ type: String }],
    internalNotificationScore: { type: Number, default: 0, required: false },
    externalNotification: [{ type: String }],
    externalNotificationScore: { type: Number, default: 0, required: false },
    updates: { type: String, required: true },
    updatesScore: { type: Number, default: 0, required: false },
    other: { type: String, required: false },
    pocScreenshots: { type: [String], required: false },
    pdfName: { type: String, required: true },
    reportType: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    manualScore: { type: Number, default: null, required: false },
    notes: { type: String, required: false },
    prepared: { type: String, required: false }
});

const incidentModel = mongoose.model('incidentData', incidentSchema);

module.exports = incidentModel;

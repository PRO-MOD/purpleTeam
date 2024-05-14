
// // Import mongoose
// const mongoose = require('mongoose');

// // Define the schema for form data
// const reportSchema = new mongoose.Schema({

//     description: { type: String, required: true },
//     threatLevel: { type: String, enum: ['Low', 'Guarded', 'Elevated', 'High', 'Severe'], required: true },
//     areasOfConcern: [{ type: String }],
//     recentIncidents: { type: String, required: true },
//     trendAnalysis: { type: String, required: true },
//     impactAssessment: { type: String, required: true },
//     sources: [{ type: String }],
//     keyThreatActors: { type: String, required: true },
//     indicatorsOfCompromise: [{ type: String }],
//     recentVulnerabilities: { type: String, required: true },
//     patchStatus: { type: String, required: true },
//     mitigationRecommendations: { type: String, required: true },
//     currentOperations: { type: String, required: true },
//     incidentResponse: { type: String, required: true },
//     forensicAnalysis: { type: String, required: true },
//     internalNotifications: [{ type: String }],
//     externalNotifications: [{ type: String }],
//     publicRelations: { type: String, required: true },
//     riskAssessment: { type: String, required: true },
//     continuityPlanning: { type: String, required: true },
//   pocScreenshots: {
//     type: [String],
//     required: false,
//   },
//   photoUrl: {
//     type: [String], 
//     required: false,
//   },
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
//     required:false,
//   },
//   prepared:{
//     type: String,
//     required: false,
//   },
// });


// // Creating the FormData model
// const reportModel = mongoose.model('reportData', reportSchema);

// // Export the model
// module.exports = reportModel;



// Import mongoose
const mongoose = require('mongoose');

// Define the schema for form data
const reportSchema = new mongoose.Schema({

    description: { type: String, required: true },
    descriptionScore: { type: Number, default: 0, required: false },
    threatLevel: { type: String, enum: ['Low', 'Guarded', 'Elevated', 'High', 'Severe'], required: true },
    threatLevelScore: { type: Number, default: 0, required: false },
    areasOfConcern: [{ type: String }],
    areasOfConcernScore: { type: Number, default: 0, required: false },
    recentIncidents: { type: String, required: true },
    recentIncidentsScore: { type: Number, default: 0, required: false },
    // trendAnalysis: { type: String, required: true },
    // trendAnalysisScore: { type: Number, default: 0, required: false },
    impactAssessment: { type: String, required: true },
    impactAssessmentScore: { type: Number, default: 0, required: false },
    sources: [{ type: String }],
    sourcesScore: { type: Number, default: 0, required: false },
    keyThreatActors: { type: String, required: true },
    keyThreatActorsScore: { type: Number, default: 0, required: false },
    indicatorsOfCompromise: [{ type: String }],
    indicatorsOfCompromiseScore: { type: Number, default: 0, required: false },
    recentVulnerabilities: { type: String, required: true },
    recentVulnerabilitiesScore: { type: Number, default: 0, required: false },
    patchStatus: { type: String, required: true },
    patchStatusScore: { type: Number, default: 0, required: false },
    // mitigationRecommendations: { type: String, required: true },
    // mitigationRecommendationsScore: { type: Number, default: 0, required: false },
    currentOperations: { type: String, required: true },
    currentOperationsScore: { type: Number, default: 0, required: false },
    incidentResponse: { type: String, required: true },
    incidentResponseScore: { type: Number, default: 0, required: false },
    forensicAnalysis: { type: String, required: true },
    forensicAnalysisScore: { type: Number, default: 0, required: false },
    internalNotifications: [{ type: String }],
    internalNotificationsScore: { type: Number, default: 0, required: false },
    externalNotifications: [{ type: String }],
    externalNotificationsScore: { type: Number, default: 0, required: false },
    publicRelations: { type: String, required: true },
    publicRelationsScore: { type: Number, default: 0, required: false },
    // riskAssessment: { type: String, required: true },
    // riskAssessmentScore: { type: Number, default: 0, required: false },
    // continuityPlanning: { type: String, required: true },
    // continuityPlanningScore: { type: Number, default: 0, required: false },
    pocScreenshots: {
        type: [String],
        required: false,
    },
    pocScreenshotsScore:{
        type: Number, default: 0, required: false

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
    notes: {
        type: String,
        required: false,
    },
    // prepared: {
    //     type: String,
    //     required: false,
    // },
});


// Creating the FormData model
const reportModel = mongoose.model('reportData', reportSchema);

// Export the model
module.exports = reportModel;

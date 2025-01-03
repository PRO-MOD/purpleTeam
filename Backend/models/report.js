
// Import mongoose
const mongoose = require('mongoose');

// Define the schema for form data
const reportSchema = new mongoose.Schema({
    ID:{type:String, required:true},
    description: { type: String, required: true },
    descriptionScore: { type: Number, default: 0, required: false },
    threatLevel: { type: String, enum: ['Low', 'Guarded', 'Elevated', 'High', 'Severe'], required: true },
    threatLevelScore: { type: Number, default: 0, required: false },
    areasOfConcern: { type: String , required:true},
    areasOfConcernScore: { type: Number, default: 0, required: false },
    // recentIncidents: { type: String, required: true },
    // recentIncidentsScore: { type: Number, default: 0, required: false },
    // trendAnalysis: { type: String, required: true },
    // trendAnalysisScore: { type: Number, default: 0, required: false },
    // impactAssessment: { type: String, required: true },
    // impactAssessmentScore: { type: Number, default: 0, required: false },
    sources: { type: String, required:true },
    sourcesScore: { type: Number, default: 0, required: false },
    // keyThreatActors: { type: String, required: true },
    // keyThreatActorsScore: { type: Number, default: 0, required: false },
    indicatorsOfCompromise: { type: String, required:true },
    indicatorsOfCompromiseScore: { type: Number, default: 0, required: false },
    recentVulnerabilities: { type: String, required: true },
    recentVulnerabilitiesScore: { type: Number, default: 0, required: false },
    patchStatus: { type: String, required: true },
    patchStatusScore: { type: Number, default: 0, required: false },
    Status: { type: String, required: true },
    StatusScore: { type: Number, default: 0, required: false },
    // mitigationRecommendations: { type: String, required: true },
    // mitigationRecommendationsScore: { type: Number, default: 0, required: false },
    currentOperations: { type: String, required: true },
    currentOperationsScore: { type: Number, default: 0, required: false },
    // incidentResponse: { type: String, required: true },
    // incidentResponseScore: { type: Number, default: 0, required: false },
    // forensicAnalysis: { type: String, required: true },
    // forensicAnalysisScore: { type: Number, default: 0, required: false },
    // internalNotifications: [{ type: String }],
    // internalNotificationsScore: { type: Number, default: 0, required: false },
    // externalNotifications: [{ type: String }],
    // externalNotificationsScore: { type: Number, default: 0, required: false },
    // publicRelations: { type: String, required: true },
    // publicRelationsScore: { type: Number, default: 0, required: false },
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
    penaltyScore: {
        type: Number, default: 0, required: false
  
    },
    penalty:{type: String, required: false},
    IDN:{type: String, required: false},
    descriptionN:{type: String, required: false},
    locationN:{type: String, required: false},
});


// Creating the FormData model
const reportModel = mongoose.model('reportData', reportSchema);

// Export the model
module.exports = reportModel;

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const reportModel = require('../models/report');
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/User');
const score = require('../models/score');
const incidentModel = require('../models/IncidentReport');
const notificationModel = require('../models/Notification');

// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for form submission
router.post('/', fetchuser, upload.array('pocScreenshots', 5), async (req, res) => {
  // console.log(req.body);
  try {
    const {
      description,
      threatLevel,
      areasOfConcern,
      recentIncidents,
      trendAnalysis,
      impactAssessment,
      sources,
      keyThreatActors,
      indicatorsOfCompromise,
      recentVulnerabilities,
      patchStatus,
      mitigationRecommendations,
      currentOperations,
      incidentResponse,
      forensicAnalysis,
      internalNotifications,
      externalNotifications,
      publicRelations,
      riskAssessment,
      continuityPlanning,
      trainingAndExercises,
      notes,
      prepared,
    } = req.body;

    const pocScreenshots = req.files; // Use req.files to access multiple uploaded screenshots
    const reportType = "SITREP";
    const userId = req.user.id;
   
    var currentDate = new Date().toLocaleDateString();
    var currentTime = new Date().toLocaleTimeString();

    // Load PDF file
    const pdfFilePath = path.join(__dirname, '..', 'public', 'SITREP Report.pdf'); // Path to original PDF file
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));

    const form=pdfDoc.getForm();

    const dateField=form.getTextField('Date');
    const timeField=form.getTextField('Time');
    const Description=form.getTextField('Description');
    const Threat=form.getDropdown('Threat Level');
    const Aoc=form.getTextField('Areas of Concern');
    const RI=form.getTextField('Recent Incidents');
    const TA=form.getTextField('Trend Analysis');
    const IA=form.getTextField('Impact Assessment');
    const Sources=form.getTextField('Sources');
    const KTA=form.getTextField('Key Threat Actors');
    const IOCs=form.getTextField('IOCs');
    const Vm=form.getTextField('Vulnerability management');
    const ps=form.getTextField('patch status');
    const MR=form.getTextField('Mitigration Recommendations');
    const CO=form.getTextField('current operations');
    const IR=form.getTextField('Incident Response');
    const FA=form.getTextField('Forensic Analysis');
    const IN=form.getTextField('Internal Notifications');
    const EN=form.getTextField('External Notifications');
    const PR=form.getTextField('public Relations');
    const RA=form.getTextField('Risk Assessment');
    const CP=form.getTextField('Continuity Planning');
    const TE=form.getTextField('Training and Exercise');
    const notes1=form.getTextField('Notes');
    const prepared1=form.getTextField('prepared By');


    dateField.setText(currentDate);
    timeField.setText(currentTime);
    Description.setText(description);
    Threat.select(threatLevel);
    Aoc.setText(areasOfConcern);
    RI.setText(recentIncidents);
    TA.setText(trendAnalysis);
    IA.setText(impactAssessment)
    Sources.setText(sources);
    KTA.setText(keyThreatActors);
    IOCs.setText(indicatorsOfCompromise);
    Vm.setText(recentVulnerabilities);
    ps.setText(patchStatus);
    MR.setText(mitigationRecommendations);
    CO.setText(currentOperations);
    IR.setText(incidentResponse);
    FA.setText(forensicAnalysis);
    IN.setText(internalNotifications);
    EN.setText(externalNotifications);
    PR.setText(publicRelations);
    RA.setText(riskAssessment);
    CP.setText(continuityPlanning);
    TE.setText(trainingAndExercises);
    notes1.setText(notes);
    prepared1.setText(prepared);

    form.flatten();

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    currentDate = currentDate.replace(/[^\w\s]/gi, '');
currentTime= currentTime.replace(/[^\w\s]/gi, '');

const pdfName = `Report_${currentDate}_${currentTime}.pdf`;

    // Generate unique filename for modified PDF
  

    // Save modified PDF to uploads folder
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', pdfName), modifiedPdfBytes);

    // Save FormData to MongoDB
    const formData = new reportModel({
      description,
      threatLevel,
      areasOfConcern,
      recentIncidents,
      trendAnalysis,
      impactAssessment,
      sources,
      keyThreatActors,
      indicatorsOfCompromise,
      recentVulnerabilities,
      patchStatus,
      mitigationRecommendations,
      currentOperations,
      incidentResponse,
      forensicAnalysis,
      internalNotifications,
      externalNotifications,
      publicRelations,
      riskAssessment,
      continuityPlanning,
      trainingAndExercises,
      notes,
      prepared,
      pocScreenshots,
      pdfName,
      reportType,
      userId,
    });
    await formData.save();

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get scores and reports data for a specific user
router.get('/specific/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find scores associated with the specified user ID
    const scores = await score.find({ user: userId });

    // Find reports submitted by the specified user ID
    const reports = await reportModel.find({ userId });

    if (!scores && !reports) {
      return res.status(404).json({ message: 'No data found for the specified user' });
    }

    // Return the scores and reports data in JSON format
    res.json({ scores, reports });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all reports
router.get('/getAllReports', fetchuser,async (req, res) => {
  try {
    const userID = req.user.id;
    // Fetch all reports from the database
    const reportsSIT= await reportModel.find({userId: userID});
    const reportsINC = await incidentModel.find({userId: userID});
    const reportsNOT = await notificationModel.find({userId: userID});

    const reports =[...reportsSIT,...reportsINC,...reportsNOT];
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Route to get details of a specific report by ID
router.get('/:reportId', async (req, res) => {
  try {
    const reportId = req.params.reportId;

    // Fetch the report from the database by ID
    // const report = await reportModel.findById(reportId);
    const reportsSIT= await reportModel.findById(reportId);
    const reportsINC = await incidentModel.findById(reportId);
    const reportsNOT = await notificationModel.findById(reportId);
    const reports =[...reportsSIT,...reportsINC,...reportsNOT];

    if (!reports) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Send the report details in the response
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching report details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Backend route to fetch reports by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Assuming you have a Report model
    // const reports = await reportModel.find({ userId }); // Find all reports with the given user ID
    const reportsSIT= await reportModel.find({ userId });
    const reportsINC = await incidentModel.find({ userId });
    const reportsNOT = await notificationModel.find({ userId });
    const reports =[...reportsSIT,...reportsINC,...reportsNOT];

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route for adding manual score to a report
router.post('/:reportId/manual-score', async (req, res) => {
  const reportId = req.params.reportId;
  const score = req.body.score;
  // console.log(score);

  try {
    // Find the report by ID
    // const report = await reportModel.findById(reportId);

    const reportsSIT= await reportModel.findById(reportId);
    const reportsINC = await incidentModel.findById(reportId);
    const reportsNOT = await notificationModel.findById(reportId);
    const reports =[...reportsSIT,...reportsINC,...reportsNOT];
    if (!reports) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Update the manual score field of the report
    reports.manualScore = score;

    // Save the updated report
    await reports.save();

    return res.status(200).json({ message: 'Manual score added successfully' });
  } catch (error) {
    console.error('Error adding manual score:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

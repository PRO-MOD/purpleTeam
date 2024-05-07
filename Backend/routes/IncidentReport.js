const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
// const incidentModel = require('../models/IncidentReport'); // Changed import to incidentModel
const uploadImageToCloudinary = require('../utils/imageUpload');
const incidentModel =require('../models/IncidentReport')
const fetchuser = require('../middleware/fetchuser');

// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for form submission
router.post('/', fetchuser, upload.array('pocScreenshots', 5), async (req, res) => {
   // Removed ':reportType' from the route path
  //  console.log(req.body);
  try {
    const {
      description,
      severityLevel,
      impact,
      affectedSystems,
      detectionMethod,
      initialDetectionTime,
      attackVector,
      attackers,
      containment,
      eradication,
      recovery,
      lessonsLearned,
      evidence,
      indicatorsOfCompromise,
      ttps,
      mitigationRecommendations,
      internalNotification,
      externalNotification,
      updates,
      notes,
      prepared,
      other,
    } = req.body;

    const pocScreenshots = req.files; // Use req.files to access multiple uploaded screenshots
    const reportType = "IRREP";
    const userId = req.user.id;

    const photoUrls = [];
    for (const photo of pocScreenshots) {
      const imageUrl = await uploadImageToCloudinary(photo);
      photoUrls.push(imageUrl); // Push imageUrl into photoUrls array
    }

    // Load PDF file
    

    var currentDate = new Date().toLocaleDateString();
    var currentTime = new Date().toLocaleTimeString();

    
    // Generate unique filename for modified PDF
    currentDate = currentDate.replace(/[^\w\s]/gi, '');
    currentTime= currentTime.replace(/[^\w\s]/gi, '');
    
    const pdfName = `Incident_${currentDate}_${currentTime}.pdf`;

     // Save FormData to MongoDB
     const formData = new incidentModel({ // Changed to incidentModel
      description,
      severityLevel,
      impact,
      affectedSystems,
      detectionMethod,
      initialDetectionTime,
      attackVector,
      attackers,
      containment,
      eradication,
      recovery,
      lessonsLearned,
      evidence,
      indicatorsOfCompromise,
      ttps,
      mitigationRecommendations,
      internalNotification,
      externalNotification,
      updates,
      notes,
      prepared,
      pocScreenshots:photoUrls,
      pdfName,
      reportType,
      userId,
      other,
    });
    await formData.save();



    currentDate = new Date(formData.createdAt).toLocaleDateString();
    currentTime = new Date(formData.createdAt).toLocaleTimeString();

    const pdfFilePath = path.join(__dirname, '..', 'public', 'IncidentFinal.pdf'); // Path to original PDF file
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));

    const form=pdfDoc.getForm();

    const dateField=form.getTextField('Date');
    const timeField=form.getTextField('Time');
    const description1=form.getTextField('Description');
    const severityLevel1=form.getDropdown('Severity level');
    const impact1=form.getDropdown('Impact');
    const affectedSystems1=form.getTextField('Affected Systems');
    const detectionMethod1=form.getDropdown('Detection Method');
    const initialDetectionTime1=form.getTextField('Initial Detection Time');
    const attackVector1=form.getDropdown('Attacker Vector');
    const attackers1=form.getDropdown('Attackers');
    const containment1=form.getTextField('containment');
    const eradication1=form.getTextField('Eradication');
    const recovery1=form.getTextField('Recovery');
    const lessonsLearned1=form.getTextField('Lession Learned');
    const evidence1=form.getTextField('Evidence');
    const indicatorsOfCompromise1=form.getTextField('IOCS');
    const ttps1=form.getTextField('TTPs');
    const mitigationRecommendations1=form.getTextField('Recommendations');
    const internalNotification1=form.getTextField('internal notification');
    const externalNotification1=form.getTextField('External Notification');
    const updates1=form.getTextField('Updates');
    const notes1=form.getTextField('Notes');
    const prepared1=form.getTextField('prepared By');
    const other1=form.getTextField('other');
  
 

    dateField.setText(currentDate);
    timeField.setText(currentTime);
    description1.setText(description);
    severityLevel1.select(severityLevel);
    impact1.select(impact);
    affectedSystems1.setText(affectedSystems);
    detectionMethod1.select(detectionMethod);
    initialDetectionTime1.setText(initialDetectionTime);
    // dateField.setDate('initialDetectionTime');
    attackVector1.select(attackVector);
    attackers1.select(attackers);
    containment1.setText(containment);
    eradication1.setText(eradication);
    recovery1.setText(recovery);
    lessonsLearned1.setText(lessonsLearned);
    evidence1.setText(evidence);
    indicatorsOfCompromise1.setText(indicatorsOfCompromise);
    ttps1.setText(ttps);
    mitigationRecommendations1.setText(mitigationRecommendations);
    internalNotification1.setText(internalNotification);
    externalNotification1.setText(externalNotification);
    updates1.setText(updates);
    notes1.setText(notes);
    prepared1.setText(prepared);
    other1.setText(other);



   

    form.flatten();


    


    // Modify PDF (add text, etc.)
    // Example: Add text to PDF
    // const pdfPage = pdfDoc.getPages()[0];
    // pdfPage.drawText('Sample Text', { x: 10, y: 10 });

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();


    // Save modified PDF to uploads folder
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', pdfName), modifiedPdfBytes);

   

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Other routes (GET, POST for manual score, etc.) remain the same


// router.get('/getAllReports', fetchuser,async (req, res) => {
//   try {
//     const userID = req.user.id;
//     // Fetch all reports from the database
//     const reports = await incidentModel.find({userId: userID});
//     res.status(200).json(reports);
//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Route to get details of a specific report by ID
// router.get('/:reportId', async (req, res) => {
//   try {
//     const reportId = req.params.reportId;

//     // Fetch the report from the database by ID
//     const report = await incidentModel.findById(reportId);

//     if (!report) {
//       return res.status(404).json({ error: 'Report not found' });
//     }

//     // Send the report details in the response
//     res.status(200).json(report);
//   } catch (error) {
//     console.error('Error fetching report details:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Backend route to fetch reports by user ID
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // Assuming you have a Report model
//     const reports = await incidentModel.find({ userId }); // Find all reports with the given user ID
//     res.json(reports);
//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // POST route for adding manual score to a report
// router.post('/:reportId/manual-score', async (req, res) => {
//   const reportId = req.params.reportId;
//   const score = req.body.score;
//   // console.log(score);

//   try {
//     // Find the report by ID
//     const report = await incidentModel.findById(reportId);
//     if (!report) {
//       return res.status(404).json({ message: 'Report not found' });
//     }

//     // Update the manual score field of the report
//     report.manualScore = score;

//     // Save the updated report
//     await report.save();

//     return res.status(200).json({ message: 'Manual score added successfully' });
//   } catch (error) {
//     console.error('Error adding manual score:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports = router;

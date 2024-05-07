
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
// const reportModel = require('../models/report');
const notificationModel=require('../models/Notification')
const fetchuser = require('../middleware/fetchuser');
const uploadImageToCloudinary = require('../utils/imageUpload');
const User = require('../models/User');
const score = require('../models/score');


// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

b =>
c

// POST route for form submission
router.post('/', fetchuser, upload.array('pocScreenshots', 5), async (req, res) => {

  try {
    const {
    type,
    location,
    priority,
    action,
    mitre,
    step,
    notes,
     
    } = req.body;

    const pocScreenshots = req.files; // Use req.files to access multiple uploaded screenshots
    const reportType = "Notification";
    const userId = req.user.id;

    const photoUrls = [];
    for (const photo of pocScreenshots) {
      const imageUrl = await uploadImageToCloudinary(photo);
      photoUrls.push(imageUrl); // Push imageUrl into photoUrls array
    }
   
    var currentDate = new Date().toLocaleDateString();
    var currentTime = new Date().toLocaleTimeString();

    currentDate = currentDate.replace(/[^\w\s]/gi, '');
    currentTime= currentTime.replace(/[^\w\s]/gi, '');
    
    const pdfName = `Notification_${currentDate}_${currentTime}.pdf`;

      // Save FormData to MongoDB
      const formData = new notificationModel({
        type,
        location,
        priority,
        action,
        mitre,
        step,
        notes,
        pocScreenshots:photoUrls,
        pdfName,
        reportType,
        userId,
      });
      await formData.save();

    // Load PDF file
    const pdfFilePath = path.join(__dirname, '..', 'public', 'Notification.pdf'); // Path to original PDF file
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));

    currentDate = new Date(formData.createdAt).toLocaleDateString();
    currentTime = new Date(formData.createdAt).toLocaleTimeString();



    const form=pdfDoc.getForm();

    const dateField=form.getTextField('Date');
    const timeField=form.getTextField('Time');
    const type1=form.getTextField('Type');
    const location1=form.getTextField('Location');
    const priority1=form.getTextField('Priority');
    const action1=form.getTextField('Action');
    const mitre1=form.getTextField('MITRE');
    const step1=form.getTextField('step');
    const notes1=form.getTextField('Notes');

    

    dateField.setText(currentDate);
    timeField.setText(currentTime);
    type1.setText(type);
    location1.setText(location);
    priority1.setText(priority);
    action1.setText(action);
    mitre1.setText(mitre);
    step1.setText(step);
    notes1.setText(notes);

    

    form.flatten();

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Generate unique filename for modified PDF
    

    // Save modified PDF to uploads folder
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', pdfName), modifiedPdfBytes);

  

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get scores and reports data for a specific user
// router.get('/specific/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Find scores associated with the specified user ID
//     const scores = await score.find({ user: userId });

//     // Find reports submitted by the specified user ID
//     const reports = await reportModel.find({ userId });
//     const incidentReport = await incidentModel.find({userId});
//     const NotificationReport = await notificationModel.find({userId}); 

//     if (!scores && !reports) {
//       return res.status(404).json({ message: 'No data found for the specified user' });
//     }

//     // Return the scores and reports data in JSON format
//     res.json({ scores, "SITREP_Report":reports, "IRREP_Report": incidentReport, "Notification_Report": NotificationReport });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Route to get all reports
// router.get('/getAllReports', fetchuser,async (req, res) => {
//   try {
//     const userID = req.user.id;
//     // Fetch all reports from the database
//     const reportsSIT= await reportModel.find({userId: userID});
//     const reportsINC = await incidentModel.find({userId: userID});
//     const reportsNOT = await notificationModel.find({userId: userID});

//     const reports =[...reportsSIT,...reportsINC,...reportsNOT];
//     res.status(200).json(reports);
//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // // Route to get details of a specific report by ID
// router.get('/:reportId', async (req, res) => {
//   try {
//     const reportId = req.params.reportId;

//     // Fetch the report from the database by ID
//     // const report = await reportModel.findById(reportId);
//     const reportsSIT= await reportModel.findById(reportId);
//     const reportsINC = await incidentModel.findById(reportId);
//     const reportsNOT = await notificationModel.findById(reportId);
//     const reports =[...reportsSIT,...reportsINC,...reportsNOT];

//     if (!reports) {
//       return res.status(404).json({ error: 'Report not found' });
//     }

//     // Send the report details in the response
//     res.status(200).json(reports);
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
//     // const reports = await reportModel.find({ userId }); // Find all reports with the given user ID
//     const reportsSIT= await reportModel.find({ userId });
//     const reportsINC = await incidentModel.find({ userId });
//     const reportsNOT = await notificationModel.find({ userId });
//     const reports =[...reportsSIT,...reportsINC,...reportsNOT];

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
//     // const report = await reportModel.findById(reportId);

//     const reportsSIT= await reportModel.findById(reportId);
//     const reportsINC = await incidentModel.findById(reportId);
//     const reportsNOT = await notificationModel.findById(reportId);
//     const reports =[...reportsSIT,...reportsINC,...reportsNOT];
//     if (!reports) {
//       return res.status(404).json({ message: 'Report not found' });
//     }

//     // Update the manual score field of the report
//     reports.manualScore = score;

//     // Save the updated report
//     await reports.save();

//     return res.status(200).json({ message: 'Manual score added successfully' });
//   } catch (error) {
//     console.error('Error adding manual score:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports = router;

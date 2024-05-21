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
const uploadImageToCloudinary = require('../utils/imageUpload');
const incidentModel = require('../models/IncidentReport');
const notificationModel = require('../models/Notification');
const { log } = require('util');
const http = require('http');
const https = require('https');
const NewReportUpdate = require('../models/NewReportUpdate');

// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });


async function fetchImageAsBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch image, status code: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', error => {
      reject(error);
    });
  });
}



// POST route for form submission
router.post('/', fetchuser, upload.array('pocScreenshots', 5), async (req, res) => {
  // console.log(req.body);
  try {
    const {
      ID,
      description,
      threatLevel,
      areasOfConcern,
      sources,
      indicatorsOfCompromise,
      recentVulnerabilities,
      patchStatus,
      Status,
      currentOperations,
      notes,
      IDN,
      descriptionN,
      locationN,
    } = req.body;

    const pocScreenshots = req.files;


    // Use req.files to access multiple uploaded screenshots
    const reportType = "IRREP";
    const userId = req.user.id;

    const photoUrls = [];
    for (const photo of pocScreenshots) {
      const imageUrl = await uploadImageToCloudinary(photo);
      photoUrls.push(imageUrl); // Push imageUrl into photoUrls array
    }


    var currentDate = new Date().toLocaleDateString();
    var currentTime = new Date().toLocaleTimeString();

    currentDate = currentDate.replace(/[^\w\s]/gi, '');
    currentTime = currentTime.replace(/[^\w\s]/gi, '');

    const pdfName = `Report_${currentDate}_${currentTime}.pdf`;

    const formData = new reportModel({
      ID,
      description,
      threatLevel,
      areasOfConcern,
      sources,
      indicatorsOfCompromise,
      recentVulnerabilities,
      patchStatus,
      Status,
      currentOperations,
      notes,
      pocScreenshots: photoUrls,
      pdfName,
      reportType,
      userId,
      IDN,
      descriptionN,
      locationN,
    });
    await formData.save();


    // Load PDF file
    const pdfFilePath = path.join(__dirname, '..', 'public', 'Incidentfinal (2).pdf'); // Path to original PDF file
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));

    const options = { timeZone: 'Asia/Kolkata' };
    currentDate = new Date(formData.createdAt).toLocaleDateString('en-IN', options);
    currentTime = new Date(formData.createdAt).toLocaleTimeString('en-IN', options);

    const form = pdfDoc.getForm();

    const dateField = form.getTextField('Date');
    const timeField = form.getTextField('Time');
    const ID1 = form.getTextField('ID');
    const IDN1 = form.getTextField('IDN');
    const descriptionN1 = form.getTextField('descriptionN');
    const locationN1 = form.getTextField('locationN');
    const Description = form.getTextField('Description');
    const Threat = form.getDropdown('Threat Level');
    const Aoc = form.getTextField('Area of Concern');
    const Sources = form.getTextField('Sources');
    const IOCs = form.getTextField('IOCs');
    const Vm = form.getTextField('Recent Vulnerabilities');
    const ps = form.getTextField('Patch Status');
    const Status1 = form.getDropdown('Status');
    // const MR = form.getTextField('Mitigration Recommendations');
    const CO = form.getTextField('Current Operations');

    // const RA = form.getTextField('Risk Assessment');
    // const CP = form.getTextField('Continuity Planning');
    const notes1 = form.getTextField('Notes');
    // const prepared1 = form.getTextField('prepared By');



    dateField.setText(currentDate);
    timeField.setText(currentTime);
    ID1.setText(ID);
    IDN1.setText(IDN);
    descriptionN1.setText(descriptionN);
    locationN1.setText(locationN);
    Description.setText(description);
    Threat.select(threatLevel);
    Aoc.setText(areasOfConcern);
    // TA.setText(trendAnalysis);
    Sources.setText(sources);
    IOCs.setText(indicatorsOfCompromise);
    Vm.setText(recentVulnerabilities);
    ps.setText(patchStatus);
    Status1.select(Status);
    // MR.setText(mitigationRecommendations);
    CO.setText(currentOperations);
    // RA.setText(riskAssessment);
    // CP.setText(continuityPlanning);
    notes1.setText(notes);
    // prepared1.setText(prepared);

    form.flatten();


    // Add a new page
    const numPagesNeeded = Math.ceil(photoUrls.length / 2);

    // Add new pages for images
    for (let i = 0; i < numPagesNeeded; i++) {
      const page = pdfDoc.addPage();
      await drawImagesOnPage(page, photoUrls.slice(i * 2, (i + 1) * 2));
    }

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', pdfName), modifiedPdfBytes);

    // Create a new record for report submission
    const newReportUpdate = await new NewReportUpdate({
      userId: userId, 
      ID: ID,
    });
    await newReportUpdate.save();

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET route to fetch IDs for which the user has submitted reports
router.get('/userSubmittedIds', fetchuser, async (req, res) => {
  const userId = req.user.id; // Assuming you have the user's ID in the request

  try {
      // Find all reports submitted by the user and get unique IDs
      const submittedIds = await reportModel.distinct('ID', { userId });

      // Send the list of submitted IDs in JSON format
      res.json(submittedIds);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to draw images on a page
// async function drawImagesOnPage(page, imageUrls) {
//    const margin = 50; // Margin for images
//    const pageWidth = page.getWidth();
//    const pageHeight = page.getHeight();
//    let x = margin;
//    let y = pageHeight - margin;

//    for (const imageUrl of imageUrls) {
//        const imageBytes = await fetchImageAsBuffer(imageUrl);
//        if (imageBytes) {
//            const image = await page.doc.embedPng(imageBytes); // Embed the image into the document
//            const scaleFactor = (pageWidth - 2 * margin) / image.width;
//            const scaledWidth = (pageWidth - 2 * margin);
//            const scaledHeight = image.height * scaleFactor;

//            page.drawImage(image, {
//                x: x,
//                y: y - scaledHeight,
//                width: scaledWidth,
//                height: scaledHeight,
//            });

//            x += scaledWidth + margin;
//            if (x + scaledWidth > pageWidth - margin) {
//                x = margin;
//                y -= scaledHeight + margin;
//                if (y < margin) break;
//            }
//        }
//    }
// }


// Function to determine the image format based on file extension
function getImageFormat(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  if (extension === 'png') {
    return 'png';
  } else if (extension === 'jpg' || extension === 'jpeg') {
    return 'jpeg';
  } else if (extension === 'tif' || extension === 'tiff') {
    return 'tiff';
  } else {
    return null; // Unsupported format
  }
}

// Function to embed images into the PDF document based on their format
async function embedImage(page, imageBytes, format) {
  if (format === 'png') {
    return page.doc.embedPng(imageBytes);
  } else if (format === 'jpeg' || format === 'jpg') {
    return page.doc.embedJpg(imageBytes);
  } else if (format === 'tiff' || format === 'tif') {
    return page.doc.embedTiff(imageBytes);
  } else {
    throw new Error('Unsupported image format');
  }
}

// Function to draw images on a page
async function drawImagesOnPage(page, imageUrls) {
  const margin = 50; // Margin for images
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  let x = margin;
  let y = pageHeight - margin;

  for (const imageUrl of imageUrls) {
    const imageBytes = await fetchImageAsBuffer(imageUrl);
    if (imageBytes) {
      const format = getImageFormat(imageUrl); // Determine image format
      if (!format) {
        console.error(`Unsupported image format for ${imageUrl}`);
        continue;
      }

      const image = await embedImage(page, imageBytes, format); // Embed the image into the document
      const scaleFactor = (pageWidth - 2 * margin) / image.width;
      const scaledWidth = (pageWidth - 2 * margin);
      const scaledHeight = image.height * scaleFactor;

      page.drawImage(image, {
        x: x,
        y: y - scaledHeight,
        width: scaledWidth,
        height: scaledHeight,
      });

      x += scaledWidth + margin;
      if (x + scaledWidth > pageWidth - margin) {
        x = margin;
        y -= scaledHeight + margin;
        if (y < margin) break;
      }
    }
  }
}

// Endpoint to fetch incident data by ID
router.get('/notification/:id', fetchuser, async (req, res) => {
  const incidentId = req.params.id;
  const userId = req.user.id;
  try {
    const incident = await notificationModel.findOne({ ID: incidentId, userId: userId });
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
    const incidentReport = await incidentModel.find({ userId });
    const NotificationReport = await notificationModel.find({ userId });

    if (!scores && !reports) {
      return res.status(404).json({ message: 'No data found for the specified user' });
    }

    // Return the scores and reports data in JSON format
    res.json({ scores, "SITREP_Report": reports, "IRREP_Report": incidentReport, "Notification_Report": NotificationReport });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all reports
router.get('/getAllReports', fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    // Fetch all reports from the database
    const reportsSIT = await reportModel.find({ userId: userID });
    const reportsINC = await incidentModel.find({ userId: userID });
    const reportsNOT = await notificationModel.find({ userId: userID });

    const reports = [...reportsSIT, ...reportsINC, ...reportsNOT];
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get details of a specific report by ID
router.get('/update/:reportType/:reportId', async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const reportType = req.params.reportType;

    // console.log(reportType);

    // Fetch the report from the database by ID
    // const report = await reportModel.findById(reportId);





    if (reportType == "IRREP") {
      const reportsSIT = await reportModel.findById(reportId);
      if (!reportsSIT) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Send the report details in the response
      res.status(200).json(reportsSIT);

    }
    else if (reportType == "SITREP") {
      const reportsINC = await incidentModel.findById(reportId);
      if (!reportsINC) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Send the report details in the response
      res.status(200).json(reportsINC);

    }
    else {
      const reportsNOT = await notificationModel.findById(reportId);
      if (!reportsNOT) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Send the report details in the response
      res.status(200).json(reportsNOT);
    }
  }
  // console.log("hello");

  // if (!report) {
  //         return res.status(404).json({ error: 'Report not found' });
  //       }

  //       // Send the report details in the response
  // res.status(200).json(report);



  catch (error) {
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
    const reportsSIT = await reportModel.find({ userId });
    const reportsINC = await incidentModel.find({ userId });
    const reportsNOT = await notificationModel.find({ userId });
    const reports = [...reportsSIT, ...reportsINC, ...reportsNOT];

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// // POST route for adding manual score to a report
// router.post('/:reportId/:reportType/manual-score', async (req, res) => {
//   const reportId = req.params.reportId;
//   const reportType = req.params.reportType;
//   const score = req.body.score;
//   // console.log(reportType);

//   try {
//     // Find the report by ID
//     // const report = await reportModel.findById(reportId);

//     const reportsSIT = await reportModel.findById(reportId);
//     const reportsINC = await incidentModel.findById(reportId);
//     const reportsNOT = await notificationModel.findById(reportId);
//     // const reports =[...reportsSIT,...reportsINC,...reportsNOT];
//     // if (!reports) {
//     //   return res.status(404).json({ message: 'Report not found' });
//     // }
//     if (reportType == "SITREP") {
//       reportsSIT.manualScore = score;
//       await reportsSIT.save();

//     }
//     else if (reportType == "IRREP") {
//       reportsINC.manualScore = score;
//       await reportsINC.save();

//     }
//     else {
//       reportsNOT.manualScore = score;

//       await reportsNOT.save();

//     }


//     // Update the manual score field of the report
//     // reports.manualScore = score;

//     // Save the updated report



//     return res.status(200).json({ message: 'Manual score added successfully' });
//   } catch (error) {
//     console.error('Error adding manual score:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Assuming you have already set up your Express app and mongoose models

// Route to handle manual score update
// router.post('/:reportId/:reportType/manual-score', async (req, res) => {
//   const { reportId, reportType } = req.params;
//   const updatedData = req.body;
//   console.log(updatedData);

//   try {
//       // Find the report by ID and update its data
//       const report = await reportModel.findByIdAndUpdate(reportId, updatedData, { new: true });

//       if (!report) {
//           return res.status(404).json({ message: 'Report not found' });
//       }

//       // Optionally, perform any additional processing or validation here

//       return res.json({ message: 'Manual score updated successfully', report });
//   } catch (error) {
//       console.error('Error updating manual score:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//   }
// });


// Route to handle manual score update
router.post('/:reportId/:reportType/manual-score', async (req, res) => {
  const { reportId, reportType } = req.params;
  const updatedData = req.body;
  // console.log(updatedData);

  try {
    // Extract total manual score from the request body
    const { totalManualScore, ...reportData } = updatedData;
    const { penalty } = updatedData;
    // console.log(totalManualScore);



    // console.log(totalManualScore);
    if (reportType == "IRREP") {
      const report = await reportModel.findByIdAndUpdate(reportId, reportData, { new: true });
      report.manualScore = totalManualScore;
      report.penalty = penalty;
      await report.save();
      return res.json({ message: 'Manual score updated successfully', report });
    }


    // }
    else if (reportType == "SITREP") {
      const report = await incidentModel.findByIdAndUpdate(reportId, reportData, { new: true });
      report.manualScore = totalManualScore;
      report.penalty = penalty;
      await report.save();

      return res.json({ message: 'Manual score updated successfully', report });

    }
    else {
      const report = await notificationModel.findByIdAndUpdate(reportId, reportData, { new: true });
      report.manualScore = totalManualScore;
      report.penalty = penalty;
      await report.save();
      return res.json({ message: 'Manual score updated successfully', report });

    }

    // Find the report by ID and update its data
    // const report = await reportModel.findByIdAndUpdate(reportId, reportData, { new: true });
    // report.manualScore = totalManualScore;
    //       await report.save();

    // if (!report) {
    //     return res.status(404).json({ message: 'Report not found' });
    // }
    // return res.json({ message: 'Manual score updated successfully', report });

    // Optionally, perform any additional processing or validation here
  }

  catch (error) {
    console.error('Error updating manual score:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;

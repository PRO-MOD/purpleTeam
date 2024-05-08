const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
// const incidentModel = require('../models/IncidentReport'); // Changed import to incidentModel
const uploadImageToCloudinary = require('../utils/imageUpload');
const incidentModel = require('../models/IncidentReport')
const fetchuser = require('../middleware/fetchuser');
const http = require('http');
const https = require('https');

// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to fetch image as buffer
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
    currentTime = currentTime.replace(/[^\w\s]/gi, '');

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
      pocScreenshots: photoUrls,
      pdfName,
      reportType,
      userId,
      other,
    });
    await formData.save();



    const options = { timeZone: 'Asia/Kolkata' };
    currentDate = new Date(formData.createdAt).toLocaleDateString('en-IN', options);
    currentTime = new Date(formData.createdAt).toLocaleTimeString('en-IN', options);

    const pdfFilePath = path.join(__dirname, '..', 'public', 'IncidentFinal.pdf'); // Path to original PDF file
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));

    const form = pdfDoc.getForm();

    const dateField = form.getTextField('Date');
    const timeField = form.getTextField('Time');
    const description1 = form.getTextField('Description');
    const severityLevel1 = form.getDropdown('Severity level');
    const impact1 = form.getDropdown('Impact');
    const affectedSystems1 = form.getTextField('Affected Systems');
    const detectionMethod1 = form.getDropdown('Detection Method');
    const initialDetectionTime1 = form.getTextField('Initial Detection Time');
    const attackVector1 = form.getDropdown('Attacker Vector');
    const attackers1 = form.getDropdown('Attackers');
    const containment1 = form.getTextField('containment');
    const eradication1 = form.getTextField('Eradication');
    const recovery1 = form.getTextField('Recovery');
    const lessonsLearned1 = form.getTextField('Lession Learned');
    const evidence1 = form.getTextField('Evidence');
    const indicatorsOfCompromise1 = form.getTextField('IOCS');
    const ttps1 = form.getTextField('TTPs');
    const mitigationRecommendations1 = form.getTextField('Recommendations');
    const internalNotification1 = form.getTextField('internal notification');
    const externalNotification1 = form.getTextField('External Notification');
    const updates1 = form.getTextField('Updates');
    const notes1 = form.getTextField('Notes');
    const prepared1 = form.getTextField('prepared By');
    const other1 = form.getTextField('other');



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


       // Calculate number of pages needed based on the number of images
       const numPagesNeeded = Math.ceil(photoUrls.length / 2);

       // Add new pages for images
       for (let i = 0; i < numPagesNeeded; i++) {
           const page = pdfDoc.addPage();
           await drawImagesOnPage(page, photoUrls.slice(i * 2, (i + 1) * 2));
       }

       // Save modified PDF
       const modifiedPdfBytes = await pdfDoc.save();
       fs.writeFileSync(path.join(__dirname, '..', 'uploads', pdfName), modifiedPdfBytes);

       res.status(201).json({ message: 'Form data saved successfully' });
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal server error' });
   }
});


async function drawImagesOnPage(page, imageUrls) {
   const margin = 50; // Margin for images
   const pageWidth = page.getWidth();
   const pageHeight = page.getHeight();
   let x = margin;
   let y = pageHeight - margin;

   for (const imageUrl of imageUrls) {
       const imageBytes = await fetchImageAsBuffer(imageUrl);
       if (imageBytes) {
           const image = await page.doc.embedPng(imageBytes); // Embed the image into the document
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

module.exports = router;
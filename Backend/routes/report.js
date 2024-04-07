const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const reportModel = require('../models/report');
const uploadImageToCloudinary = require('../utils/imageUpload');

// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for form submission
router.post('/:reportType', upload.array('photos', 5), async (req, res) => {
  try {
    const { question1, question2, question3, question4, question5 } = req.body;
    const photos = req.files; // Use req.files to access multiple uploaded photos
    const reportType = req.params.reportType;

    // console.log(photos);
    // Upload photos to Cloudinary and get their URLs
    const photoUrls = [];
    for (const photo of photos) {
      const imageUrl = await uploadImageToCloudinary(photo);
      photoUrls.push(imageUrl); // Push imageUrl into photoUrls array
    }
    // console.log(photoUrls.toString());

    // Load PDF file
    const pdfFilePath = path.join(__dirname, '..', 'public', 'original.pdf'); // Path to original PDF file
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Modify PDF (add text, etc.)
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const fontSize = 30;
    firstPage.drawText(question1, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    }); // Example: Add question1 text to PDF

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();

    // Generate unique filename for modified PDF
    const pdfName = `newPdf.pdf`;

    // Save modified PDF to uploads folder
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', pdfName), modifiedPdfBytes);

    // Save FormData to MongoDB
    const formData = new reportModel({
      question1,
      question2,
      question3,
      question4,
      question5,
      photoUrl: photoUrls.length > 0 ? photoUrls : null, // Save photo URLs if uploaded
      pdfName: pdfName, // Save the name of the PDF file
      reportType: reportType
    });
    await formData.save();

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get all reports
router.get('/getAllReports', async (req, res) => {
  try {
    // Fetch all reports from the database
    const reports = await reportModel.find({reportType: "SITREP"});
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get details of a specific report by ID
router.get('/:reportId', async (req, res) => {
  try {
    const reportId = req.params.reportId;

    // Fetch the report from the database by ID
    const report = await reportModel.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Send the report details in the response
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

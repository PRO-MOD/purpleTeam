
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const notificationModel = require('../models/Notification');
const fetchuser = require('../middleware/fetchuser');
const uploadImageToCloudinary = require('../utils/imageUpload');
const User = require('../models/User');
const score = require('../models/score');
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
    try {
        const {
            type,
            location,
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
        currentTime = currentTime.replace(/[^\w\s]/gi, '');

        const pdfName = `Notification_${currentDate}_${currentTime}.pdf`;

        // Save FormData to MongoDB
        const formData = new notificationModel({
            type,
            location,
            notes,
            pocScreenshots: photoUrls,
            pdfName,
            reportType,
            userId,
        });
        await formData.save();

        // Load PDF file
        const pdfFilePath = path.join(__dirname, '..', 'public', 'NotificationFinal (3).pdf'); // Path to original PDF file
        const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));

        const options = { timeZone: 'Asia/Kolkata' };
            currentDate = new Date(formData.createdAt).toLocaleDateString('en-IN', options);
            currentTime = new Date(formData.createdAt).toLocaleTimeString('en-IN', options);
        
        
            const form = pdfDoc.getForm();
        
            const dateField = form.getTextField('Date');
            const timeField = form.getTextField('Time');
            const type1 = form.getTextField('Type');
            const location1 = form.getTextField('Location');
            const priority1 = form.getTextField('Priority');
        
        
        
            dateField.setText(currentDate);
            timeField.setText(currentTime);
            type1.setText(type);
            location1.setText(location);
            priority1.setText(notes);
        
        
        
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
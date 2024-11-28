
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const notificationModel = require('../models/NotificationReport');
const fetchuser = require('../middleware/fetchuser');
const uploadImageToCloudinary = require('../utils/imageUpload');
const User = require('../models/User');
const score = require('../models/score');
const http = require('http');
const https = require('https');
const NewReportUpdate = require('../models/NewReportUpdate');

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
            ID,
            description,
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
            ID,
            description,
            location,
            notes,
            pocScreenshots: photoUrls,
            pdfName,
            reportType,
            userId,
        });
        await formData.save();

        // Load PDF file
        const pdfFilePath = path.join(__dirname, '..', 'public', 'Notifications.pdf'); // Path to original PDF file
        const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));

        const options = { timeZone: 'Asia/Kolkata' };
        currentDate = new Date(formData.createdAt).toLocaleDateString('en-IN', options);
        currentTime = new Date(formData.createdAt).toLocaleTimeString('en-IN', options);


        const form = pdfDoc.getForm();

        const dateField = form.getTextField('Date');
        const timeField = form.getTextField('Time');
        const ID1 = form.getTextField('ID');
        const description1 = form.getTextField('Description');
        const location1 = form.getTextField('Location');
        const notes1 = form.getTextField('Notes');



        dateField.setText(currentDate);
        timeField.setText(currentTime);
        description1.setText(description);
        ID1.setText(ID);
        // type1.setText(type);
        location1.setText(location);
        notes1.setText(notes);



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
        const submittedIds = await notificationModel.distinct('ID', { userId });

        // Send the list of submitted IDs in JSON format
        res.json(submittedIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



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


module.exports = router;
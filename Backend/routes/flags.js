const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Flag = require('../models/flags');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename for uploaded files
  }
});

const upload = multer({ storage: storage });

// Endpoint to handle file upload and store data in the database
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Read the uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Array to store data from Excel sheet
    const flagsData = [];

    // Iterate over rows in the Excel sheet
    for (let i = 1; ; i++) { // Start from row 2 (assuming headers are in row 1)
      const teamNameCell = sheet['A' + i];
      const ctfdChallengeCell = sheet['B' + i];
      const ctfdFlagCell = sheet['C' + i];
      const encryptedFlagCell = sheet['D' + i];

      // Break loop if any cell in the row is empty
      if (!teamNameCell || !ctfdChallengeCell || !ctfdFlagCell || !encryptedFlagCell) {
        break;
      }

      // Extract data from cells
      const teamName = teamNameCell.v;
      const ctfdChallenge = ctfdChallengeCell.v;
      const ctfdFlag = ctfdFlagCell.v;
      const encryptedFlag = encryptedFlagCell.v;

      // Add data to flagsData array
      flagsData.push({ teamName, ctfdChallenge, ctfdFlag, encryptedFlag });
    }

    // Save data to the database
    const flags = await Flag.insertMany(flagsData);

    // Send response
    res.status(200).json({ message: 'Data uploaded successfully', flags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

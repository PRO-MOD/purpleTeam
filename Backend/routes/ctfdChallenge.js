const express = require('express');
const axios = require('axios');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');

const API_URL = 'https://ctf.hacktify.in/api/v1/';
const API_TOKEN = process.env.CTFD_accessToken;

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

async function createChallenge(challengeData) {
    try {
        const response = await axios.post(`${API_URL}challenges`, challengeData, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const challengeId = response.data.data.id;
        // console.log(`Challenge created successfully with ID: ${challengeId}`);

        return challengeId;
    } catch (error) {
        console.error('Error creating challenge:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function assignFlag(challengeId, flagContent) {
    try {
        const response = await axios.post(`${API_URL}flags`, {
            challenge_id: challengeId,
            content: flagContent,
            type: "static",
            data: ""
        }, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // console.log('Flag assigned successfully');
    } catch (error) {
        console.error('Error assigning flag:', error.response ? error.response.data : error.message);
    }
}

async function updateChallengeState(challengeId, newState) {
    try {
        const response = await axios.patch(`${API_URL}challenges/${challengeId}`, {
            state: newState
        }, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // console.log(`Challenge state updated to "${newState}" successfully.`);
    } catch (error) {
        console.error('Error updating challenge state:', error.response ? error.response.data : error.message);
    }
}

// router.post('/create', async (req, res) => {
    
//     const { challengeData, flagContent } = req.body;

//     try {
//         const challengeId = await createChallenge(challengeData);
//         if (challengeId) {
//             await assignFlag(challengeId, flagContent);
//             await updateChallengeState(challengeId, 'visible');

//             res.status(201).json({ message: 'Challenge created and updated successfully', challengeId });
//         } else {
//             res.status(500).json({ message: 'Failed to create challenge' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error occurred', error: error.message });
//     }
// });
router.post('/create', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const challenges = xlsx.utils.sheet_to_json(worksheet);

        for (const challenge of challenges) {
            const { name, description, category, value, type, flagContent } = challenge;
            const challengeData = { name, description, category, value, type };

            const challengeId = await createChallenge(challengeData);
            if (challengeId) {
                await assignFlag(challengeId, flagContent);
                await updateChallengeState(challengeId, 'visible');
            }
        }

        res.status(201).json({ message: 'Challenges created and updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

module.exports = router;

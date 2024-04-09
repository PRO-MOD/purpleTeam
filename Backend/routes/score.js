const axios = require('axios'); // Import axios for making HTTP requests
const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User')
const Score = require('../models/score')
const Report = require('../models/report')

router.get('/getscores', async (req, res) => {
    try {
        // Fetch user information from your database
        const users = await User.find({role: "BT"}, 'name'); // Assuming you only need name to match users

        // Extract names of users from the database
        const userNames = users.map(user => user.name);

        // Define the URL of the CTFd API endpoint for the scoreboard
        const apiUrl = process.env.CTFD_apiUrl;

        // Define your access token obtained from CTFd
        const accessToken = process.env.CTFD_accessToken; 
        
        // Make a GET request to the CTFd API endpoint for the scoreboard
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Token ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Ensure that the request was successful (status code 2xx)
        if (response.status !== 200) {
            throw new Error(`Failed to fetch scores: ${response.status} - ${response.statusText}`);
        }

        // Filter scores to include only scores for users present in your database
        const scores = response.data.data || []; // If 'data' property doesn't exist, fallback to an empty array

        // Filter scores to include only scores for users present in your database
        const filteredScores = scores.filter(score => userNames.includes(score.name));

        // Update scores and manual scores in the database
        for (const score of filteredScores) {
            const user = await User.findOne({ name: score.name });
            if (user) {
                // Fetch all the reports belonging to the user
                const reports = await Report.find({ userId: user._id });

                // Calculate the sum of manual scores from the reports
                let totalManualScore = 0;
                for (const report of reports) {
                    totalManualScore += report.manualScore || 0; // Add the manual score to the total
                }

                // Update the score and manual score for the user in the Score collection
                await Score.findOneAndUpdate(
                    { user: user._id },
                    {
                        $set: {
                            account_id: score.account_id,
                            score: score.score,
                            manualScore: totalManualScore // Update manual score
                        }
                    },
                    { upsert: true, new: true } // Create a new document if it doesn't exist
                );
            }
        }

        // Fetch scores from the Scores collection
        const scoresData = await Score.find();

        // Send the filtered scores back as the response
        res.json(scoresData);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'An error occurred while fetching scores' });
    }
});

module.exports = router;

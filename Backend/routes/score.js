const axios = require('axios'); // Import axios for making HTTP requests
const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User')
const Score = require('../models/score')
const Report = require('../models/report')
const IncidentReport = require('../models/IncidentReport')
const notificationReport = require('../models/Notification')

router.get('/getscores', async (req, res) => {
    try {
        // Fetch user information from your database
        const users = await User.find({ role: "BT" }, 'name'); // Assuming you only need name to match users

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

        // Update scores and manual scores in the database
        for (const score of scores) {
            const user = await User.findOne({ name: score.name });
            if (user) {
                // Check if a score document exists for today's date and the user's _id
                const existingScore = await Score.findOne({ user: user._id, date: { $gte: new Date("2024-05-05T10:07:24.392Z").setHours(0, 0, 0, 0) } });
                if (existingScore) {
                    // Update the existing score document
                    existingScore.name = score.name;
                    existingScore.account_id = score.account_id;
                    existingScore.score = score.score;
                    // existingScore.manualScore = 0;
                    await existingScore.save();
                } else {
                    // Create a new score document with the current date
                    await Score.create({
                        name: score.name,
                        account_id: score.account_id,
                        score: score.score,
                        manualScore: 0,
                        user: user._id,
                        date: new Date("2024-05-05T10:07:24.392Z") // Insert the current date
                    });
                }
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

router.get('/get-scores', async (req, res) => {
    try {
        // Fetch scores from the Scores collection
        const scoresData = await Score.find();

        // Initialize an object to store scores by user name
        const scoresByUser = {};

        // Organize scores by user name
        scoresData.forEach(scores => {
            const { name, score, manualScore, date } = scores;
            if (!scoresByUser[name]) {
                scoresByUser[name] = [];
            }
            scoresByUser[name].push({ score, manualScore, date });
        });

        // Send the organized scores back as the response
        res.json(scoresByUser);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'An error occurred while fetching scores' });
    }
});




router.get('/sum-manual-scores', async (req, res) => {
    try {
        // Fetch all users from the Score model
        const scores = await Score.find();

        // Initialize an object to store the sum of manual scores for each user and date
        const manualScoresByUserAndDate = {};

        // Iterate through each score
        for (const score of scores) {
            // Find all reports with the user ID obtained from the score
            const reports = await Promise.all([
                Report.find({ userId: score.user }),
                IncidentReport.find({ userId: score.user }),
                notificationReport.find({ userId: score.user })
            ]);

            // Iterate through each type of report
            for (const reportType of reports) {
                // Iterate through each report
                for (const report of reportType) {
                    // Get the date of the report
                    const reportDate = new Date(report.createdAt);
                    const formattedDate = reportDate.toDateString();

                    // Check if the report belongs to the same user and date as the current score
                    if (score.user.toString() === report.userId.toString() && score.date.toDateString() === formattedDate) {
                        // Update the manual score for the current date
                        if (!manualScoresByUserAndDate[score.user]) {
                            manualScoresByUserAndDate[score.user] = {}; // Initialize a new object to store scores by date
                        }
                        if (!manualScoresByUserAndDate[score.user][formattedDate]) {
                            manualScoresByUserAndDate[score.user][formattedDate] = 0; // Initialize score to 0 if not exists
                        }
                        manualScoresByUserAndDate[score.user][formattedDate] += report.manualScore || 0;
                    }
                }
            }
        }

        // Update the manual scores for each user and date in the Score collection
        for (const userId of Object.keys(manualScoresByUserAndDate)) {
            const userManualScoresByDate = manualScoresByUserAndDate[userId];
            for (const date of Object.keys(userManualScoresByDate)) {
                const manualScoreForDate = userManualScoresByDate[date];
                const formattedDate = new Date(date);
                formattedDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
                await Score.findOneAndUpdate(
                    { user: userId, date: { $gte: formattedDate } }, // Match user and date
                    {
                        $set: {
                            manualScore: manualScoreForDate
                        }
                    }
                );
            }
        }

        res.status(200).json(manualScoresByUserAndDate);
    } catch (error) {
        console.error('Error calculating sum of manual scores:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;

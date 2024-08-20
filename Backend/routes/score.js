const axios = require('axios'); // Import axios for making HTTP requests
const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User')
const Score = require('../models/score')
const Report = require('../models/report')
const IncidentReport = require('../models/IncidentReport')
const notificationReport = require('../models/Notification')
const xlsx = require('xlsx');
const fetchuser = require('../middleware/fetchuser');

// Endpoint to export scores and report counts to Excel
router.get('/export', async (req, res) => {
    try {
        // Fetch scores from the database
        const scores = await Score.find().populate('user', 'username');

        // Fetch counts of reports submitted by each user from different report schemas
        const reportCountsPromises = [
            notificationReport.aggregate([
                { $group: { _id: '$userId', notificationCount: { $sum: 1 } } }
            ]),
            Report.aggregate([
                { $group: { _id: '$userId', reportCount: { $sum: 1 } } }
            ]),
            IncidentReport.aggregate([
                { $group: { _id: '$userId', incidentCount: { $sum: 1 } } }
            ])
        ];

        const [notificationCounts, reportCounts, incidentCounts] = await Promise.all(reportCountsPromises);
        // console.log(notificationCounts);
        // Prepare data for Excel
        const data = scores.map(score => {
            const userId = score.user._id;
            // const username = score.user.username;

            // Find the count of reports submitted by the user in each report schema
            const notificationCount = notificationCounts.find(count => count._id.equals(userId))?.notificationCount || 0;
            const reportCount = reportCounts.find(count => count._id.equals(userId))?.reportCount || 0;
            const incidentCount = incidentCounts.find(count => count._id.equals(userId))?.incidentCount || 0;

            return {
                'Name': score.name,
                'SERVICE AVAILABILITY': score.score,
                'INCIDENT RESPONSE': score.manualScore,
                'Total': score.score + score.manualScore,
                'Notification Count': notificationCount,
                'Report Count': reportCount,
                'Incident Count': incidentCount
            };
        });

        // Create a new workbook and add a worksheet
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);

        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Scores');

        // Generate Excel file buffer
        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers for file download
        res.set('Content-Disposition', 'attachment; filename=scores_with_reports.xlsx');
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send the Excel file buffer as response
        res.send(excelBuffer);

        console.log('Scores and report counts exported to Excel successfully.');
    } catch (error) {
        console.error('Error exporting scores and report counts to Excel:', error);
        res.status(500).json({ message: 'Error exporting data to Excel' });
    }
});


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
                const existingScore = await Score.findOne({ user: user._id, date: { $gte: new Date().setHours(0, 0, 0, 0) } });
                if (existingScore) {
                    // Update the existing score document
                    existingScore.name = score.name;
                    existingScore.account_id = score.account_id;
                    existingScore.score = 1000 - score.score;
                    // existingScore.manualScore = 0;
                    await existingScore.save();
                } else {
                    // Create a new score document with the current date
                    await Score.create({
                        name: score.name,
                        account_id: score.account_id,
                        score: 1000 - score.score,
                        manualScore: 0,
                        user: user._id,
                        date: new Date() // Insert the current date
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

router.get('/getscores1', async (req, res) => {
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

        // Filter scores to include only scores for users present in your database
        const filteredScores = scores.filter(score => userNames.includes(score.name));
        
        // Update scores and manual scores in the database
        for (const score of filteredScores) {
            const user = await User.findOne({ name: score.name });
            if (user) {
                // Fetch all the reports belonging to the user
                const reports = await Promise.all([
                    Report.find({ userId: user._id }),
                    IncidentReport.find({ userId: user._id }),
                    notificationReport.find({ userId: user._id })
                ]);

                // console.log(reports);

                // Calculate the sum of manual scores from the reports
                let totalManualScore = 0;
                let allReportsHaveManualScore = true;
                for (const reportType of reports) {
                    // Iterate through each report
                    for (const report of reportType) {
                        if (report.manualScore == null) {
                            allReportsHaveManualScore = false;
                        }
                        totalManualScore += report.manualScore || 0; // Add the manual score to the total
                    }
                }

                // Update the score and manual score for the user in the Score collection
                await Score.findOneAndUpdate(
                    { user: user._id },
                    {
                        $set: {
                            name: score.name,
                            account_id: score.account_id,
                            score: 12000 - score.score,
                            manualScore: totalManualScore, // Update manual score
                            read: allReportsHaveManualScore
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

router.get('/get-scores', async (req, res) => {
    try {
        // Fetch scores from the Scores collection
        const scoresData = await Score.find();

        // Update scores and manual scores in the database
        for (const score of scoresData) {
            const user = await User.findOne({ name: score.name });
            if (user) {
                // Fetch all the reports belonging to the user
                const reports = await Promise.all([
                    Report.find({ userId: user._id }),
                    IncidentReport.find({ userId: user._id }),
                    notificationReport.find({ userId: user._id })
                ]);

                // console.log(reports);

                // Calculate the sum of manual scores from the reports
                let totalManualScore = 0;
                let allReportsHaveManualScore = true;
                for (const reportType of reports) {
                    // Iterate through each report
                    for (const report of reportType) {
                        if (report.manualScore == null) {
                            allReportsHaveManualScore = false;
                        }
                        totalManualScore += report.manualScore || 0; // Add the manual score to the total
                    }
                }

                // Update the score and manual score for the user in the Score collection
                await Score.findOneAndUpdate(
                    { user: user._id },
                    {
                        $set: {
                            name: score.name,
                            // account_id: score.account_id,
                            score: 12000 - score.score,
                            manualScore: totalManualScore, // Update manual score
                            read: allReportsHaveManualScore
                        }
                    },
                    { upsert: true, new: true } // Create a new document if it doesn't exist
                );
            }
        }


        // Initialize an object to store scores by user name
        // const scoresByUser = {};

        // Organize scores by user name
        // scoresData.forEach(scores => {
        //     const { name, score, manualScore,staticScore,read, date } = scores;
        //     console.log(scores);
        //     if (!scoresByUser[name]) {
        //         scoresByUser[name] = [];
        //     }
        //     scoresByUser[name].push(scores);
        // });
        const scores = await Score.find();
        // Send the organized scores back as the response
        res.json(scores);
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

            // console.log(reports);

            // Iterate through each type of report
            for (const reportType of reports) {
                // Iterate through each report
                for (const report of reportType) {
                    // Get the date of the report
                    const reportDate = new Date(report.createdAt);
                    const formattedDate = reportDate.toDateString();

                    // Check if the report belongs to the same user and date as the current score
                    // console.log(score.user.toString() + " "+report.userId.toString()+" "+score.date.toDateString()+" "+formattedDate);
                    if (score.user.toString() === report.userId.toString() && score.date.toDateString() === formattedDate) {
                        // console.log("hello");
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


router.put('/assign-static-score/:userId', async (req, res) => {
    try {
      const { staticScore } = req.body;
      const { userId } = req.params;
  
      if (typeof staticScore !== 'number') {
        return res.status(400).send({ error: 'staticScore must be a number' });
      }
  
      const score = await Score.findOne({ user: userId });
  
      if (!score) {
        return res.status(404).send({ error: 'Score not found' });
      }
  
      score.staticScore = staticScore;
      await score.save();
  
      res.send(score);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  router.get('/get-static-score/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const score = await Score.findOne({ user: userId });
      if (!score) {
        return res.status(404).send({ error: 'Score not found' });
      }
      res.send({ staticScore: score.staticScore });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });



  router.get('/score/:id', async (req, res) => {
    try {
      // Find the score document by account_id or user_id
      const score = await Score.findOne( { user: req.params.id });
  
      if (!score) {
        return res.status(404).json({ error: 'Score not found' });
      }
  
      // Extract the required fields
      const { manualScore, score: baseScore, staticScore } = score;
  
      // Send the extracted fields as the response
      res.json({ manualScore, score: baseScore, staticScore });
    } catch (err) {
      console.error('Error fetching score:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;

const axios = require('axios'); // Import axios for making HTTP requests
const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User')

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

        // Send the filtered scores back as the response
        res.json(filteredScores);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'An error occurred while fetching scores' });
    }
});

module.exports = router;

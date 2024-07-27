const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Assuming DynamicFlags and Users are the models for dynamic flags and users
const DynamicFlags = require('../../models/CTFdChallenges/DynamicFlag');
const User = require('../../models/User');

// GET route to fetch dynamic flags and associated users for a given challengeId
router.get('/display/:challengeId', async (req, res) => {
  const { challengeId } = req.params;

  try {
    // Find the dynamic flags for the given challengeId
    const dynamicFlags = await DynamicFlags.findOne({ challengeId }).populate('flags.userId','name');
    // console.log(dynamicFlags.flags);
    if (!dynamicFlags) {
      return res.status(404).json({ error: 'No dynamic flags found for this challenge' });
    }

    // Extract flags and their associated users
    const flagsWithUsers = dynamicFlags.flags.map(flag => ({
      flag: flag.flag,
      assignedUser: flag.userId ? flag.userId.name : 'User not found', // Assuming username field exists
    }));

    // Respond with the flags and associated users
    res.status(200).json({ flags: flagsWithUsers });
  } catch (error) {
    console.error('Error fetching dynamic flags:', error);
    res.status(500).json({ error: 'Failed to fetch dynamic flags' });
  }
});

module.exports = router;

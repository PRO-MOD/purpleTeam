const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Assuming DynamicFlags and Users are the models for dynamic flags and users
const DynamicFlags = require('../../models/CTFdChallenges/DynamicFlag');
const User = require('../../models/User');

router.get('/display/:challengeId', async (req, res) => {
  const { challengeId } = req.params;

  try {
    // Find the dynamic flags for the given challengeId, populating user details
    const dynamicFlags = await DynamicFlags.findOne({ challengeId })
      .populate({
        path: 'flags.userId',
        select: 'name role' // Ensure that role is also populated
      });

    if (!dynamicFlags) {
      return res.status(404).json({ error: 'No dynamic flags found for this challenge' });
    }

    // Extract flags and their associated users with role 'BT'
    const flagsWithUsers = dynamicFlags.flags
      .filter(flag => flag.userId && flag.userId.role === 'BT') // Filter based on user role
      .map(flag => ({
        flag: flag.flag,
        assignedUser: flag.userId ? flag.userId.name : 'User not found', // Assuming username field exists
      }));

    // Respond with the filtered flags and associated users
    res.status(200).json({ flags: flagsWithUsers });
  } catch (error) {
    console.error('Error fetching dynamic flags:', error);
    res.status(500).json({ error: 'Failed to fetch dynamic flags' });
  }
});

router.get('/userFlag/:challengeId/:emailId', async (req, res) => {
  const { challengeId, emailId } = req.params;

  try {
    // Find the user by emailId
    const user = await User.findOne({ email: emailId });
    // Fetch the user-specific flag for the given challenge
    const userChallenge = await DynamicFlags.findOne(
      {
        challengeId: challengeId,
        "flags.userId": user._id
      },
      { "flags.$": 1 } // Only return the matched flag
    );

    // Handle cases where the user has no flag for the challenge
    if (!userChallenge || !userChallenge.flags.length) {
      return res.status(404).json({ error: 'User flag not found for this challenge' });
    }

    // Extract and return the user's flag
    const userFlag = userChallenge.flags.map(f => f.flag).join(', ');
    res.status(200).json({ flag: userFlag });
  } catch (error) {
    console.error('Error fetching user-specific flag:', error);
    res.status(500).json({ error: 'Failed to fetch user-specific flag' });
  }
});

// Edit a specific flag
router.put('/edit/:challengeId', async (req, res) => {
  const { challengeId } = req.params;
  const { index, flag } = req.body;

  try {
    const dynamicFlags = await DynamicFlags.findOne({ challengeId });

    if (!dynamicFlags || !dynamicFlags.flags[index]) {
      return res.status(404).json({ error: 'Flag not found' });
    }

    // Update the flag
    dynamicFlags.flags[index].flag = flag;
    await dynamicFlags.save();

    res.status(200).json({ message: 'Flag updated successfully', flag: dynamicFlags.flags[index] });
  } catch (error) {
    console.error('Error updating flag:', error);
    res.status(500).json({ error: 'Failed to update flag' });
  }
});

// Delete a specific flag
router.delete('/delete/:challengeId', async (req, res) => {
  const { challengeId } = req.params;
  const { index } = req.body;

  try {
    const dynamicFlags = await DynamicFlags.findOne({ challengeId });

    if (!dynamicFlags || !dynamicFlags.flags[index]) {
      return res.status(404).json({ error: 'Flag not found' });
    }

    // Remove the flag
    dynamicFlags.flags.splice(index, 1);
    await dynamicFlags.save();

    res.status(200).json({ message: 'Flag deleted successfully' });
  } catch (error) {
    console.error('Error deleting flag:', error);
    res.status(500).json({ error: 'Failed to delete flag' });
  }
});

module.exports = router;

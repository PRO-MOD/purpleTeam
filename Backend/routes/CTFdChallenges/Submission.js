const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Submission =require('../../models/CTFdChallenges/Submission');




router.get('/all', async (req, res) => {
  try {
    // const challengeId = req.params.challengeId;
    const incorrectSubmissions = await Submission.find()
      .populate('userId', 'name')
      .populate('challengeId', 'name')
      .select('userId challengeId answer date isCorrect');

    res.json(incorrectSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new route to delete submissions
router.delete('/delete', async (req, res) => {
  try {
    const { submissionIds } = req.body;
    await Submission.deleteMany({ _id: { $in: submissionIds } });
    res.json({ message: 'Submissions deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
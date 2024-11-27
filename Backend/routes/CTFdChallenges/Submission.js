const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Submission =require('../../models/CTFdChallenges/Submission');
const mongoose = require('mongoose');


router.get('/all', async (req, res) => {
  try {
    const Submissions = await Submission.find()
      .populate('userId', 'name')  // Populate with 'User' model (userId field)
      .populate('challengeId', 'name type')  // Populate with 'Challenge' model (challengeId field)
      .select('userId challengeId answer date isCorrect points cheating attempt');

    // Filter out any submissions where userId or challengeId doesn't exist
    const filteredSubmissions = Submissions.filter(submission => submission.userId !== null && submission.challengeId !== null);

    res.json(filteredSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/submission-types-count', async (req, res) => {
  try {
    // Define all possible challenge types
    const allTypes = ['standard', 'code', 'dynamic', 'manual_verification', 'multiple_choice'];

    // Get the count of submissions for each type
    const submissionTypeCounts = await Submission.aggregate([
      {
        $lookup: {
          from: 'challenges', // The collection name for challenges
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challenge',
        },
      },
      {
        $unwind: '$challenge',
      },
      {
        $group: {
          _id: '$challenge.type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
        },
      },
    ]);

    // Convert the result into a map for easy lookup
    const submissionTypeMap = submissionTypeCounts.reduce((acc, { type, count }) => {
      acc[type] = count;
      return acc;
    }, {});

    // Prepare the final result with counts, including 0s for missing types
    const result = allTypes.map(type => ({
      type,
      count: submissionTypeMap[type] || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/types-count/:userId', async (req, res) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;

    // Convert the userId to ObjectId if necessary
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Define all possible challenge types
    const allTypes = ['standard', 'code', 'dynamic', 'manual_verification', 'multiple_choice'];

    // Get the count of submissions for each type, filtering by userId
    const submissionTypeCounts = await Submission.aggregate([
      {
        $match: {
          userId: objectIdUserId, // Match submissions with ObjectId userId
        },
      },
      {
        $lookup: {
          from: 'challenges', // The collection name for challenges
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challenge',
        },
      },
      {
        $unwind: '$challenge',
      },
      {
        $group: {
          _id: '$challenge.type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
        },
      },
    ]);

    // Log the result to debug
  

    // Convert the result into a map for easy lookup
    const submissionTypeMap = submissionTypeCounts.reduce((acc, { type, count }) => {
      acc[type] = count;
      return acc;
    }, {});

    // Prepare the final result with counts, including 0s for missing types
    const result = allTypes.map(type => ({
      type,
      count: submissionTypeMap[type] || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


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

router.get('/submissions/:challengeId', async (req, res) => {
  const { challengeId } = req.params; // Extract challengeId from URL parameters

  try {
    const submissions = await Submission.find({ challengeId }) // Filter by challengeId
      .populate('userId', 'name') // Populate user details with only the name field
      .populate('challengeId', 'name') // Populate challenge details with only the name field
      .select('userId challengeId answer date isCorrect points cheating attempt'); // Select specific fields

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/userSubmissions/:userId', async (req, res) => {
  const { userId } = req.params; // Extract challengeId from URL parameters

  try {
    const submissions = await Submission.find({ userId }) // Filter by challengeId
      .populate('userId', 'name') // Populate user details with only the name field
      .populate('challengeId', 'name') // Populate challenge details with only the name field
      .select('userId challengeId answer date isCorrect points cheating attempt'); // Select specific fields

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
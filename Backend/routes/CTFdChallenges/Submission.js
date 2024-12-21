const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Submission =require('../../models/CTFdChallenges/Submission');
const Score =require('../../models/score');
const mongoose = require('mongoose');
const fetchuser =require('../../middleware/fetchuser');
const User = require('../../models/User')
const Challenge = require('../../models/CTFdChallenges/challenge');


// router.get('/all',fetchuser, async (req, res) => {
//   try {

//     const userAdmin = await User.findById(req.user.id);
    
//       if (userAdmin.role !== process.env.WT) {
//         return res.status(403).json({ error: "Bad Request" });
//       }
//     const Submissions = await Submission.find()
//       .populate('userId', 'name')  // Populate with 'User' model (userId field)
//       .populate('challengeId', 'name type')  // Populate with 'Challenge' model (challengeId field)
//       .select('userId challengeId answer date isCorrect points cheating attempt copiedFrom hintsUsed totalHintCost');

//     // Filter out any submissions where userId or challengeId doesn't exist
//     const filteredSubmissions = Submissions.filter(submission => submission.userId !== null && submission.challengeId !== null);

//     res.json(filteredSubmissions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

router.get('/all', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);

    // Check if the user has the required role
    if (userAdmin.role !== process.env.WT) {
      return res.status(403).json({ error: "Bad Request" });
    }

    // Fetch users with userVisibility set to true
    const visibleUsers = await User.find({ userVisibility: true }).select('_id');

    // Extract user IDs
    const userIds = visibleUsers.map(user => user._id);

    // Fetch submissions where user is in the list of visible users
    const submissions = await Submission.find({ userId: { $in: userIds } })
      .populate('userId', 'name')  // Populate with 'User' model (userId field)
      .populate('challengeId', 'name type')  // Populate with 'Challenge' model (challengeId field)
      .select('userId challengeId answer date isCorrect points cheating attempt copiedFrom hintsUsed totalHintCost');

    // Filter out any submissions where userId or challengeId doesn't exist
    const filteredSubmissions = submissions.filter(submission => submission.userId !== null && submission.challengeId !== null);

    res.json(filteredSubmissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/submission-types-count',fetchuser, async (req, res) => {
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

router.get('/types-count/:userId', fetchuser, async (req, res) => {
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


router.delete('/delete',fetchuser, async (req, res) => {
  try {

    const userAdmin = await User.findById(req.user.id);
    
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }
    const { submissionIds } = req.body;

    // Fetch all the submissions to delete and their points
    const submissions = await Submission.find({ _id: { $in: submissionIds } });

    // For each submission, subtract points from the user's score
    for (const submission of submissions) {
      const userId = submission.userId;
      const pointsToDeduct = submission.points;

      // Find the user's current score
      const userScore = await Score.findOne({ user: userId });

      // If the user has a score, subtract the points
      if (userScore) {
        userScore.score -= pointsToDeduct;

        // Make sure the score doesn't go below zero
        if (userScore.score < 0) {
          userScore.score = 0;
        }

        // Save the updated score
        await userScore.save();
      }
    }

    // Now delete the submissions
    await Submission.deleteMany({ _id: { $in: submissionIds } });

    res.json({ message: 'Submissions deleted and scores updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/submissions/:challengeId', fetchuser,async (req, res) => {
  const { challengeId } = req.params; // Extract challengeId from URL parameters

  try {
    const userAdmin = await User.findById(req.user.id);
    
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }
    const submissions = await Submission.find({ challengeId }) // Filter by challengeId
      .populate('userId', 'name') // Populate user details with only the name field
      .populate('challengeId', 'name') // Populate challenge details with only the name field
      .select('userId challengeId answer date isCorrect points cheating attempt copiedFrom hintsUsed totalHintCost'); // Select specific fields

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/userSubmissions/:userId',fetchuser, async (req, res) => {
  const { userId } = req.params; // Extract challengeId from URL parameters

  try {
    const submissions = await Submission.find({ userId }) // Filter by challengeId
      .populate('userId', 'name') // Populate user details with only the name field
      .populate('challengeId', 'name') // Populate challenge details with only the name field
      .select('userId challengeId answer date isCorrect points cheating attempt copiedFrom hintsUsed totalHintCost'); // Select specific fields

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// router.get('/solved-challenges', fetchuser, async (req, res) => {
//   try {
//     const solvedChallenges = await Submission.aggregate([
//       {
//         $match: { isCorrect: true } // Only solved submissions
//       },
//       {
//         $group: {
//           _id: '$challengeId', // Group by challengeId
//           solvedUsers: { $addToSet: '$userId' } // Collect unique user IDs
//         }
//       },
//       {
//         $lookup: {
//           from: 'challenges', // Challenges collection
//           localField: '_id', // challengeId in Submission
//           foreignField: '_id', // _id in Challenge
//           as: 'challengeDetails'
//         }
//       },
//       {
//         $unwind: '$challengeDetails' // Flatten the challenge details
//       },
//       {
//         $match: {
//           'challengeDetails.state': 'visible' // Ensure the challenge is visible
//         }
//       },
//       {
//         $lookup: {
//           from: 'users', // Users collection
//           localField: 'solvedUsers', // User IDs who solved the challenge
//           foreignField: '_id', // _id in User
//           as: 'userDetails'
//         }
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the default MongoDB _id
//           challengeName: '$challengeDetails.name', // Include challenge name
//           solvedUsers: '$userDetails.name' // Map solved user names
//         }
//       }
//     ]);

//     res.status(200).json({ success: true, data: solvedChallenges });
//   } catch (error) {
//     console.error('Error fetching solved challenges:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch solved challenges' });
//   }
// });

// router.get('/solved-challenges', fetchuser, async (req, res) => {
//   try {
//     // Step 1: Fetch all users
//     const allUsers = await User.find({ role: process.env.BT }).select('_id name');

//     // Step 2: Aggregate solved challenges
//     const challengesWithSubmissions = await Submission.aggregate([
//       {
//         $match: { isCorrect: true } // Only correct submissions
//       },
//       {
//         $group: {
//           _id: '$challengeId', // Group by challengeId
//           solvedUsers: { $addToSet: '$userId' } // Collect unique user IDs
//         }
//       },
//       {
//         $lookup: {
//           from: 'challenges', // Challenges collection
//           localField: '_id', // challengeId in Submission
//           foreignField: '_id', // _id in Challenge
//           as: 'challengeDetails'
//         }
//       },
//       {
//         $unwind: '$challengeDetails' // Flatten the challenge details
//       },
//       {
//         $match: {
//           'challengeDetails.state': 'visible' // Only include visible challenges
//         }
//       },
//       {
//         $project: {
//           challengeId: '$_id', // Include challengeId for reference
//           challengeName: '$challengeDetails.name', // Challenge name
//           solvedUsers: 1 // Keep solvedUsers array
//         }
//       }
//     ]);

//     // Step 3: Combine challenge data with all users
//     const result = challengesWithSubmissions.map((challenge) => {
//       const userStatuses = allUsers.map((user) => {
//         const isSolved = challenge.solvedUsers.some(
//           (solvedUserId) => solvedUserId.toString() === user._id.toString() // Ensure proper comparison
//         );

//         return {
//           name: user.name,
//           solved: isSolved
//         };
//       });

//       return {
//         challengeName: challenge.challengeName,
//         users: userStatuses
//       };
//     });

//     // Step 4: Send response
//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     console.error('Error fetching solved challenges:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch solved challenges' });
//   }
// });




router.get('/solved-challenges', async (req, res) => {
  try {
    // Step 1: Fetch all users
    const allUsers = await User.find({ role: process.env.BT, userVisibility: true }).select('_id name');

    // Step 2: Fetch all challenges
    const allChallenges = await Challenge.find().select('_id name category');

    // Step 3: Fetch all correct submissions
    const correctSubmissions = await Submission.find({ isCorrect: true }).select('challengeId userId');

    // Step 4: Create a map of challenges with solved user IDs
    const solvedChallengesMap = {};
    correctSubmissions.forEach((submission) => {
      const challengeId = submission.challengeId.toString();
      if (!solvedChallengesMap[challengeId]) {
        solvedChallengesMap[challengeId] = new Set();
      }
      solvedChallengesMap[challengeId].add(submission.userId.toString());
    });

    // Step 5: Group challenges by category and combine user statuses
    const challengesByCategory = {};
    allChallenges.forEach((challenge) => {
      const categoryName = challenge.category || 'Uncategorized'; // Default category if none provided

      if (!challengesByCategory[categoryName]) {
        challengesByCategory[categoryName] = [];
      }

      const userStatuses = allUsers.map((user) => {
        const isSolved = solvedChallengesMap[challenge._id.toString()]?.has(user._id.toString());
        return {
          name: user.name,
          solved: isSolved || false, // Default to false if not solved
        };
      });

      challengesByCategory[categoryName].push({
        challengeName: challenge.name,
        users: userStatuses,
      });
    });

    // Step 6: Send response
    res.status(200).json({ success: true, data: challengesByCategory });
  } catch (error) {
    console.error('Error fetching solved challenges:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch solved challenges' });
  }
});





module.exports = router;
const express = require('express');
const router = express.Router();
const Challenge = require('../../models/CTFdChallenges/challenge');
const Hint = require('../../models/CTFdChallenges/Hint');
const DetailHint =require('../../models/CTFdChallenges/detailhint');
const fetchuser =require('../../middleware/fetchuser');
const Score =require('../../models/score')
const mongoose = require('mongoose');
const User = require('../../models/User')

// POST /api/hints/add/:challengeId to add hints
router.post('/add/:challengeId', fetchuser, async (req, res) => {
  const { challengeId } = req.params;
  const { content, cost } = req.body;

  try {
    const userAdmin = await User.findById(req.user.id);
    
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }
    const newHint = new Hint({ content, cost });
    await newHint.save();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    challenge.hints.push(newHint._id);
    await challenge.save();

    res.status(201).json({ hint: newHint });
  } catch (error) {
    console.error('Error adding hint:', error);
    res.status(500).json({ message: 'Failed to add hint' });
  }
});

// GET /api/hints/get/:challengeId
router.get('/get/:challengeId', fetchuser, async (req, res) => {
  const { challengeId } = req.params;

  try {
    const challenge = await Challenge.findById(challengeId).populate('hints');
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({ hints: challenge.hints });
  } catch (error) {
    console.error('Error fetching hints:', error);
    res.status(500).json({ message: 'Failed to fetch hints' });
  }
});

// PUT /api/hints/edit/:challengeId/hints/:hintId
router.put('/edit/:challengeId/hints/:hintId', fetchuser, async (req, res) => {
  const { challengeId, hintId } = req.params;
  const { content, cost } = req.body;

  try {

    const userAdmin = await User.findById(req.user.id);
    
    if (userAdmin.role !== process.env.WT) {
      return res.status(403).json({ error: "Bad Request" });
    }
    const updatedHint = await Hint.findByIdAndUpdate(hintId, { content, cost }, { new: true });

    if (!updatedHint) {
      return res.status(404).json({ message: 'Hint not found' });
    }

    res.json({ hint: updatedHint });
  } catch (error) {
    console.error('Error editing hint:', error);
    res.status(500).json({ message: 'Failed to edit hint' });
  }
});

// DELETE /api/hints/:challengeId/hints/delete/:hintId
router.delete('/:challengeId/hints/delete/:hintId', fetchuser, async (req, res) => {
  const { challengeId, hintId } = req.params;

  try {
    const userAdmin = await User.findById(req.user.id);
    
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }

    // Remove hint reference from challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const index = challenge.hints.indexOf(hintId);
    if (index !== -1) {
      challenge.hints.splice(index, 1);
      await challenge.save();
    }

    // Delete hint document
    const deletedHint = await Hint.findByIdAndDelete(hintId);
    if (!deletedHint) {
      return res.status(404).json({ message: 'Hint not found' });
    }

    res.json({ message: 'Hint deleted successfully' });
  } catch (error) {
    console.error('Error deleting hint:', error);
    res.status(500).json({ message: 'Failed to delete hint' });
  }
});

//content and cost of hint using hint id 
router.get('/hints/:id', fetchuser, async (req, res) => {
  try {
      const hints = await Hint.find({_id: req.params.id});
      res.status(200).json(hints);
  } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
  }
});

router.get('/cost/:id', fetchuser, async (req, res) => {
  try {
      const hints = await Hint.find({_id: req.params.id});
           
      res.status(200).json(hints[0].cost);
  } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
  }
});


router.get('/locked/hints/:id',fetchuser, async (req, res) => {
  try {
      const hints = await Hint.find({_id: req.params.id});
      res.status(200).json(hints);
  } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
  }
});




router.get('/used-hints/:challengeId',fetchuser, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const  userId = req.user.id;
    const usedHints = await DetailHint.find({ user: userId, challengeId }).lean();
    res.status(200).json(usedHints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.post('/use-hint', fetchuser, async (req, res) => {
//   try {
//     const { challengeId, hintId } = req.body;
//     const userId = req.user.id;

//     // Fetch the challenge
//     const challenge = await Challenge.findById(challengeId);
//     if (!challenge) {
//       return res.status(404).json({ message: 'Challenge not found.' });
//     }

//     // Fetch the hint
//     const hint = await Hint.findById(hintId);
//     if (!hint) {
//       return res.status(404).json({ message: 'Hint not found.' });
//     }

//     // Fetch the user's score
//     const userScore = await Score.findOne({ user: userId });
//     if (!userScore) {
//       return res.status(404).json({ message: 'User score not found.' });
//     }

//     const cost = hint.cost;

//     // Check if the user has enough score
//     if (userScore.score < cost) {
//       return res.status(400).json({ message: 'Insufficient score to use the hint.' });
//     }
// console.log( userScore.score);
//     // Deduct the hint cost from the user's score
//     userScore.score -= cost;
//     await userScore.save();
//     console.log( userScore.score);

//     // Save the hint usage details
//     const detailHint = new DetailHint({
//       user: userId,
//       challengeId,
//       hint_id: hintId,
//       value: userScore.score // Updated score after deduction
//     });
//     await detailHint.save();

//     res.status(200).json({
//       message: 'Hint usage recorded.',
//       remainingScore: userScore.score
//     });
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });


router.post('/use-hint', fetchuser, async (req, res) => {
  try {
    const { challengeId, hintId } = req.body;
    const userId = req.user.id;

    // Fetch the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }

    // Fetch the hint
    const hint = await Hint.findById(hintId);
    if (!hint) {
      return res.status(404).json({ message: 'Hint not found.' });
    }

    // Fetch the user's score
    const userScore = await Score.findOne({ user: userId });
    if (!userScore) {
      return res.status(404).json({ message: 'User score not found.' });
    }

    const cost = hint.cost;

    // Check if the user has enough score
    if ((userScore.score + userScore.staticScore) < cost) {
      return res.status(400).json({ message: 'Insufficient score to use the hint.' });
    }

    // Deduct the hint cost from the user's score
    userScore.score -= cost;
    await userScore.save();

    // Save the hint usage details
    const detailHint = new DetailHint({
      user: userId,
      challengeId,
      hint_id: hintId,
      value: cost, // Updated score after deduction
    });
    await detailHint.save();

    res.status(200).json({
      message: 'Hint usage recorded.',
      remainingScore: userScore.score, // Updated score sent to the client
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get('/totalHintCost/:userId',fetchuser, async (req, res) => {
  try {
    // Extract the userId from the request parameters
    const { userId } = req.params;

    // Convert the userId to ObjectId if necessary
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Fetch unique challenges for the user
    const userChallenges = await DetailHint.aggregate([
      {
        $match: {
          user: objectIdUserId, // Match documents with the specified userId
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
          _id: '$challenge._id',
          name: { $first: '$challenge.name' },
        },
      },
    ]);

    // Extract challenge names
    const allChallenges = userChallenges.map(({ name }) => name);

    // Aggregate the total value for challenges specific to the user
    const challengeValueCounts = await DetailHint.aggregate([
      {
        $match: {
          user: objectIdUserId, // Match documents with the specified userId
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
          _id: '$challenge._id',
          name: { $first: '$challenge.name' },
          totalValue: { $sum: '$value' },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          totalValue: 1,
        },
      },
    ]);

    // Convert the result into a map for easy lookup
    const challengeValueMap = challengeValueCounts.reduce((acc, { name, totalValue }) => {
      acc[name] = totalValue;
      return acc;
    }, {});

    // Prepare the final result, including missing challenges with totalValue as 0
    const result = allChallenges.map(name => ({
      name,
      totalValue: challengeValueMap[name] || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});






module.exports = router;

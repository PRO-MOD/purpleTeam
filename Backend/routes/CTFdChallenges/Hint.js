const express = require('express');
const router = express.Router();
const Challenge = require('../../models/CTFdChallenges/challenge');
const Hint = require('../../models/CTFdChallenges/Hint');
const DetailHint =require('../../models/CTFdChallenges/detailhint');
const fetchuser =require('../../middleware/fetchuser');

// POST /api/hints/add/:challengeId
router.post('/add/:challengeId', async (req, res) => {
  const { challengeId } = req.params;
  const { content, cost } = req.body;

  try {
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
router.get('/get/:challengeId', async (req, res) => {
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
router.put('/edit/:challengeId/hints/:hintId', async (req, res) => {
  const { challengeId, hintId } = req.params;
  const { content, cost } = req.body;

  try {
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
router.delete('/:challengeId/hints/delete/:hintId', async (req, res) => {
  const { challengeId, hintId } = req.params;

  try {
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

router.get('/hints/:id', async (req, res) => {
  try {
      const hints = await Hint.find({_id: req.params.id});
      res.status(200).json(hints);
  } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
  }
});

router.get('/locked/hints/:id', async (req, res) => {
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

// Route to save the used hint
router.post('/use-hint',fetchuser, async (req, res) => {
  try {
    const {  challengeId, hintId } = req.body;
    const  userId = req.user.id;

    const challenge = await Challenge.findById(challengeId);
    const challengevalue=challenge.value
    if (!challengevalue) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const hintscore = await DetailHint.findOne({ user: userId, challengeId }).sort({ value: 1 }).exec();
    var score=0;

    if (!hintscore) {
       score=challengevalue;
    }
    else{
    score=hintscore.value;
    }
   

    const hint=await Hint.findById(hintId);
    const cost=hint.cost;
    const value=score-cost;

    
    const detailHint = new DetailHint({ user: userId, challengeId, hint_id: hintId,value });
    await detailHint.save();
    res.status(200).json({ message: 'Hint usage recorded.' });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/value/:challengeId', fetchuser, async (req, res) => {
  const { challengeId } = req.params;
  const userId = req.user.id;

  try {
    // Find the entry with the lowest value for the given userId and challengeId


    const challenge = await Challenge.findById(challengeId);
    const challengevalue=challenge.value
    const detailHint = await DetailHint.findOne({ user: userId, challengeId }).sort({ value: 1 }).exec();

    // if (!detailHint) {
    //   return res.status(404).send({ message: 'No progress found for this challenge' });
    // }

    res.status(200).send({ value: detailHint ? detailHint.value : challengevalue });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});


module.exports = router;

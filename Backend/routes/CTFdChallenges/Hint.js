const express = require('express');
const router = express.Router();
const Challenge = require('../../models/CTFdChallenges/challenge');
const Hint = require('../../models/CTFdChallenges/Hint');

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

module.exports = router;

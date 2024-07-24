const express = require('express');
const router = express.Router();
const Challenge = require('../../models/CTFdChallenges/challenge');

// Get tags for a specific challenge
router.get('/get/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const challenge = await Challenge.findById(challengeId).select('tags');
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json({ tags: challenge.tags });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
});

// Add a new tag to a challenge
router.post('/add/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { tag } = req.body;
    if (!tag) {
      return res.status(400).json({ message: 'Tag content is required' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    challenge.tags.push(tag);
    await challenge.save();
    res.json({ message: 'Tag added successfully', tag });
  } catch (error) {
    res.status(500).json({ message: 'Error adding tag', error });
  }
});

// Delete a tag from a challenge
router.delete('/:challengeId/delete', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { tag } = req.body;
    if (!tag) {
      return res.status(400).json({ message: 'Tag content is required' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    challenge.tags = challenge.tags.filter(t => t !== tag);
    await challenge.save();
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tag', error });
  }
});

module.exports = router;

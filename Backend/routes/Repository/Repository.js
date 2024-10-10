const express = require('express');
const router = express.Router();
const Repository = require('../../models/CTFdChallenges/Repository/Repository'); // Import your Repository model
const Challenge = require('../../models/CTFdChallenges/challenge'); // Import your Challenge model

// 1. Create a new repository
router.post('/create', async (req, res) => {
    const { name, description } = req.body;

    try {
        const repository = new Repository({ name, description });
        await repository.save();
        res.status(201).json({ message: "Repository created successfully", repository });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Add a challenge to a repository
router.post('/:repositoryId/challenges/add', async (req, res) => {
    const { challengeId } = req.body;
    const { repositoryId } = req.params;

    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        // Add challenge to repository and set repository reference in challenge
        repository.challenges.push(challengeId);
        // challenge.repository = repositoryId;

        await repository.save();
        // await challenge.save();

        res.status(200).json({ message: "Challenge added to repository successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Get all challenges in a repository
router.get('/:repositoryId/challenges', async (req, res) => {
    try {
        const repository = await Repository.findById(req.params.repositoryId).populate({
            path: 'challenges', // Populate the 'challenges' field
            select: 'name value category type state' // Select specific fields from the 'Challenge' schema
        });
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }
        res.json(repository.challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Get all repositories
router.get('/', async (req, res) => {
    try {
        const repositories = await Repository.find();
        res.json(repositories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. Delete a repository
router.delete('/:repositoryId', async (req, res) => {
    try {
        const repository = await Repository.findByIdAndDelete(req.params.repositoryId);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Optionally, you may want to remove the reference to this repository from all associated challenges
        // await Challenge.updateMany(
        //     { repository: req.params.repositoryId },
        //     { $set: { repository: null } } // Reset repository reference
        // );

        res.json({ message: "Repository deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 6. Delete a challenge from a repository
router.delete('/:repositoryId/challenges/:challengeId', async (req, res) => {
    const { repositoryId, challengeId } = req.params;

    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Remove challenge from repository
        repository.challenges.pull(challengeId);
        await repository.save();

        // Optionally, reset repository reference in the challenge
        // await Challenge.findByIdAndUpdate(challengeId, { $set: { repository: null } });

        res.json({ message: "Challenge removed from repository successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

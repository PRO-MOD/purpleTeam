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


router.get('/:repositoryId', async (req, res) => {
    const { repositoryId } = req.params; // Get repository ID from the request parameters

    try {
        const repository = await Repository.findById(repositoryId); // Fetch repository by ID
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" }); // Handle case where repository does not exist
        }
        res.status(200).json(repository); // Send the repository as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
});
// 2. Add a challenge to a repository
// router.post('/:repositoryId/challenges/add', async (req, res) => {
//     const { challengeId } = req.body;
//     const { repositoryId } = req.params;

//     try {
//         const repository = await Repository.findById(repositoryId);
//         if (!repository) {
//             return res.status(404).json({ message: "Repository not found" });
//         }

//         const challenge = await Challenge.findById(challengeId);
//         if (!challenge) {
//             return res.status(404).json({ message: "Challenge not found" });
//         }

//         // Add challenge to repository and set repository reference in challenge
//         repository.challenges.push(challengeId);
//         // challenge.repository = repositoryId;

//         await repository.save();
//         // await challenge.save();

//         res.status(200).json({ message: "Challenge added to repository successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Assuming you already have your required imports
router.post('/:repositoryId/challenges/add', async (req, res) => {
    const { challengeId } = req.body; // Now this is expected to be an array
    const { repositoryId } = req.params;

    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Validate and add each challenge to the repository
        for (const id of challengeId) {
            const challenge = await Challenge.findById(id);
            if (!challenge) {
                return res.status(404).json({ message: `Challenge not found for ID: ${id}` });
            }

            if (!repository.challenges.includes(id)) {
                repository.challenges.push(id); // Avoid adding duplicates
            }
        }

        await repository.save(); // Save repository with added challenges

        res.status(200).json({ message: "Challenges added to repository successfully" });
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

// 5. Delete multiple repositories
router.delete('/delete-multiple', async (req, res) => {
    const { repositoryIds } = req.body; // Expect an array of repository IDs

    if (!Array.isArray(repositoryIds) || repositoryIds.length === 0) {
        return res.status(400).json({ message: "No repository IDs provided." });
    }

    try {
        // Delete repositories with the specified IDs
        const result = await Repository.deleteMany({ _id: { $in: repositoryIds } });

        // Optionally, remove references to these repositories from associated challenges
        // await Challenge.updateMany(
        //     { repository: { $in: repositoryIds } },
        //     { $set: { repository: null } } // Reset repository reference
        // );

        res.json({ message: `${result.deletedCount} repositories deleted successfully` });
    } catch (error) {
        console.error('Error deleting repositories:', error);
        res.status(500).json({ message: error.message });
    }
});


// 6. Delete a challenge from a repository
// router.delete('/:repositoryId/challenges/:challengeId', async (req, res) => {
//     const { repositoryId, challengeId } = req.params;

//     try {
//         const repository = await Repository.findById(repositoryId);
//         if (!repository) {
//             return res.status(404).json({ message: "Repository not found" });
//         }

//         // Remove challenge from repository
//         repository.challenges.pull(challengeId);
//         await repository.save();

//         // Optionally, reset repository reference in the challenge
//         // await Challenge.findByIdAndUpdate(challengeId, { $set: { repository: null } });

//         res.json({ message: "Challenge removed from repository successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.delete('/:repositoryId/challenges', async (req, res) => {
    const { repositoryId } = req.params;
    const { challengeIds } = req.body;  // Expecting an array of challenge IDs in the body

    try {
        // Find the repository by its ID
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        if (!Array.isArray(challengeIds) || challengeIds.length === 0) {
            return res.status(400).json({ message: "No challenge IDs provided" });
        }

        // Remove multiple challenges from the repository
        repository.challenges = repository.challenges.filter(
            challengeId => !challengeIds.includes(challengeId.toString())
        );

        await repository.save();

        // Optionally, reset repository reference in the challenges
        // await Challenge.updateMany(
        //     { _id: { $in: challengeIds } },
        //     { $set: { repository: null } }
        // );

        res.json({ message: "Challenges removed from repository successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;

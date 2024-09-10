const express = require('express');
const dockerUtils = require('../../utils/Docker/Docker'); 
const Image = require('../../models/CTFdChallenges/Docker/image');
const fetchuser = require('../../middleware/fetchuser');
const DynamicFlag = require('../../models/CTFdChallenges/DynamicFlag');

const router = express.Router();

// Route to list Docker images
router.get('/images', async (req, res) => {
    try {
        const images = await dockerUtils.listDockerImages();
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Error listing Docker images' });
    }
});

// Route to get details of a specific Docker image
router.get('/details/images', async (req, res) => {
    const imageName = req.body.name;
    try {
        const imageDetails = await dockerUtils.getImageDetails(imageName);
        res.json(imageDetails);
    } catch (error) {
        res.status(500).json({ error: `Error fetching details for image ${imageName}` });
    }
});

// Route to pull a Docker image
router.post('/images/pull', async (req, res) => {
    const { imageName, challengeId, port } = req.body;

    if (!imageName || !challengeId) {
        return res.status(400).json({ error: 'Image name and challenge ID are required' });
    }

    try {
        // Pull the Docker image
        await dockerUtils.pullDockerImage(imageName);

        // Save the image details to the database
        const image = new Image({
            imageName,
            port,
            challengeId,
            status: 'pulled'
        });

        await image.save();

        res.json({ message: `Image ${imageName} pulled and saved successfully` });
    } catch (error) {
        console.error('Error pulling image or saving to database:', error);
        res.status(500).json({ error: `Error pulling image ${imageName}` });
    }
});

// Route to create a container and get its URL
router.post('/create/container', fetchuser, async (req, res) => {
    const { challengeId } = req.body;

    try {
        // Step 1: Find image for the given challengeId
        const image = await Image.findOne({ challengeId });

        if (!image) {
            return res.status(404).json({ error: 'Image not found for the provided challengeId' });
        }

        const userId = req.user.id;

        // Step 2: Fetch user challenge flag for the given challengeId
        const userChallenge = await DynamicFlag.findOne(
            {
                challengeId: challengeId, // Find the document with this challengeId
                "flags.userId": userId    // Filter for the userId in the flags array
            },
            { "flags.$": 1 }  // Only return the matched flag from the array
        );

        if (!userChallenge || !userChallenge.flags.length) {
            return res.status(404).json({ error: 'User flag not found for this challenge' });
        }

        // Step 3: Extract the user flag
        const userFlag = userChallenge.flags.map(f => f.flag).join(', ');

        if (!userFlag) {
            return res.status(400).json({ error: 'User does not have any flag for this challenge' });
        }

        // Step 4: Get image name and port
        const imageName = image && image.imageName;
        const port = image && image.port;

        if (!imageName || !port) {
            return res.status(400).json({ error: 'Image information is incomplete (missing name or port)' });
        }

        // Step 5: Create flags object
        const flags = { Flag: `${userFlag}`, MIN_AGE: 21 };

        // Step 6: Generate URL and container for the image
        const containerData = await dockerUtils.generateUrl(imageName, port, flags);

        if (!containerData) {
            return res.status(500).json({ error: 'Error generating container URL' });
        }

        // Step 7: Return the container data
        res.json(containerData);
    } catch (error) {
        console.error('Error creating container:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            res.status(503).json({ error: 'Docker service is unavailable' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


router.post('/stop/container', async (req, res) => {
    const { containerId } = req.body;

    if (!containerId) {
        return res.status(400).json({ error: 'Container ID is required' });
    }

    try {
        await dockerUtils.stopContainer(containerId);
        res.json({ message: `Container ${containerId} stopped successfully` });
    } catch (error) {
        res.status(500).json({ error: `Error stopping container ${containerId}` });
    }
});

module.exports = router;

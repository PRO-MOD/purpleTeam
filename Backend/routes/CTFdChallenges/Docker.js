const express = require('express');
const dockerUtils = require('../../utils/Docker/Docker'); 
const Image = require('../../models/CTFdChallenges/Docker/image');
const fetchuser = require('../../middleware/fetchuser');
const DynamicFlag = require('../../models/CTFdChallenges/DynamicFlag');
const Challenge = require('../../models/CTFdChallenges/challenge');

const router = express.Router();

// Route to list Docker images
router.get('/images', async (req, res) => {
    try {
        const images = await dockerUtils.listDockerImages();
        const data = [];

        // Use for...of for asynchronous processing
        for (const ele of images) {
            const element = await Image.findOne({ imageName: ele });
            if (element) {
                data.push({ _id: element._id, name: ele, port: element.port });
            } else {
                data.push({ _id: element._id, name: ele, port: null }); // Handle case where no port is found
            }
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error listing Docker images' });
    }
});

router.get('/images/:challengeId', async (req, res) => {
    const { challengeId } = req.params;

    try {
        if (!challengeId) {
            return res.status(400).json({ error: 'Challenge ID is required.' });
        }

        // Fetch the challenge with the specified challengeId and populate dockerImage field
        const challenge = await Challenge.findById(challengeId).populate('dockerImage');

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found.' });
        }

        // Check if dockerImage is populated
        const dockerImage = challenge.dockerImage;
        if (!dockerImage) {
            return res.status(200).json([]); // No dockerImage found for the challenge
        }

        const imageName = dockerImage.imageName;
        const port = dockerImage.port;

        // Check if the Docker image exists
        const dockerImageExists = await dockerUtils.checkImageExists(imageName);
        if (!dockerImageExists) {
            return res.status(404).json({ error: 'Docker image not found.' });
        }

        // Respond with the Docker image information
        const data = {
            _id: dockerImage._id,
            name: imageName,
            port: port
        };

        res.json([data]);
    } catch (error) {
        console.error('Error fetching Docker images:', error);
        res.status(500).json({ error: 'Error fetching Docker images' });
    }
});


router.put('/edit/images/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { port } = req.body;
  
      // Validate request body
      if (!port) {
        return res.status(400).json({ error: 'Image name and port are required.' });
      }
  
      // Find and update the Docker image
      const updatedImage = await Image.findByIdAndUpdate(
        id,
        { port },
        { new: true } // Return the updated document
      );
  
      if (!updatedImage) {
        return res.status(404).json({ error: 'Docker image not found.' });
      }
  
      // Respond with the updated image
      res.json(updatedImage);
    } catch (error) {
      console.error('Error updating Docker image:', error);
      res.status(500).json({ error: 'Internal server error.' });
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
    const { imageName, port } = req.body;

    if (!imageName) {
        return res.status(400).json({ error: 'Image name is required' });
    }

    try {
        // Pull the Docker image
        await dockerUtils.pullDockerImage(imageName);

        // Check if the image already exists in the database
        const existingImage = await Image.findOne({ imageName });

        if (existingImage) {
            // If the image already exists, return a message indicating so
            return res.status(500).json({ error: `Image ${imageName} already exists` });
        }

        // Save the image details to the database after successful pull
        const image = new Image({
            imageName,
            port,
            status: 'pulled'
        });

        await image.save();

        res.status(201).json({ message: `Image ${imageName} pulled and saved successfully` });
    } catch (error) {
        console.error('Error pulling image or saving to database:', error);
        res.status(500).json({ error: `Error pulling image ${imageName}: ${error.message}` });
    }
});

// route to assign challenges a Docker Image
router.post('/challenges/assignImage', async (req, res) => {
    const { challengeId, imageId } = req.body;

    if (!challengeId || !imageId) {
        return res.status(400).json({ error: 'Challenge ID and Image ID are required' });
    }

    try {
        // Find the image by ID
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Find the challenge by ID
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Check if the challenge type is dynamic
        if (challenge.type !== 'dynamic') {
            return res.status(400).json({ error: 'Image can only be assigned to dynamic challenges' });
        }

        // Assign the image to the challenge
        challenge.dockerImage = imageId;
        await challenge.save();

        res.json({ message: `Image assigned to challenge successfully` });
    } catch (error) {
        console.error('Error assigning image to challenge:', error);
        res.status(500).json({ error: 'Error assigning image to challenge' });
    }
});



// Delete Docker image and remove from the database
router.delete('/images/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the image by ID
        const imageDoc = await Image.findById(id);
        if (!imageDoc) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        // Delete the Docker image and associated containers
        await dockerUtils.deleteDockerImage(imageDoc.imageName);

        // Remove the image from the database
        await Image.findByIdAndDelete(id);

        res.status(200).json({ message: 'Image and associated containers deleted successfully.' });
    } catch (error) {
        console.error('Error deleting Docker image:', error);
        res.status(500).json({ error: 'Error deleting Docker image.' });
    }
});

// Route to create a container and get its URL
router.post('/create/container', fetchuser, async (req, res) => {
    const { challengeId } = req.body;

    try {
        // Step 1: Find the challenge by challengeId
        const challenge = await Challenge.findById(challengeId)
            .populate('dockerImage'); // Populate the dockerImage field with Image details

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found for the provided challengeId' });
        }

        if (!challenge.dockerImage) {
            return res.status(404).json({ error: 'Docker image not found for this challenge' });
        }

        // Step 2: Extract the image information from the challenge
        const { imageName, port } = challenge.dockerImage;

        if (!imageName || !port) {
            return res.status(400).json({ error: 'Image information is incomplete (missing name or port)' });
        }

        // Step 3: Fetch user challenge flag
        const userId = req.user.id;
        const userChallenge = await DynamicFlag.findOne(
            {
                challengeId: challengeId,
                "flags.userId": userId
            },
            { "flags.$": 1 } // Only return the matched flag from the array
        );

        if (!userChallenge || !userChallenge.flags.length) {
            return res.status(404).json({ error: 'User flag not found for this challenge' });
        }

        // Step 4: Extract the user flag
        const userFlag = userChallenge.flags.map(f => f.flag).join(', ');

        if (!userFlag) {
            return res.status(400).json({ error: 'User does not have any flag for this challenge' });
        }

        // Step 5: Create flags object
        const flags = { Flag: `${userFlag}`, MIN_AGE: 21 };

        // Step 6: Generate URL and container for the image
        const containerData = await dockerUtils.generateUrl(userId,imageName, port, flags);

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

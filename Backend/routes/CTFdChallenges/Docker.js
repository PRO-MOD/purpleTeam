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
        const data = [];

        // Use for...of for asynchronous processing
        for (const ele of images) {
            const element = await Image.findOne({ imageName: ele });
            if (element) {
                data.push({ name: ele, port: element.port });
            } else {
                data.push({ name: ele, port: null }); // Handle case where no port is found
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

        // Fetch Docker images associated with the specific challengeId from the Image model
        const imageDocs = await Image.find({ challengeId });

        if (imageDocs.length == 0) {
            return res.status(200).json([]);
        }

        const data = [];

        for (const imageDoc of imageDocs) {
            const ele = imageDoc.imageName;

            // If image exists in Docker, add it to the data array
            const dockerImageExists = await dockerUtils.checkImageExists(ele); 
            if (dockerImageExists) {
                data.push({ _id: imageDoc._id,name: ele, port: imageDoc.port });
            }
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'No images found for this challenge.' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error listing Docker images:', error);
        res.status(500).json({ error: 'Error listing Docker images' });
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

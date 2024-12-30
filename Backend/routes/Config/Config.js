const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Config=require('../../models/CTFdChallenges/Config');
const User = require('../../models/User')


const createUploadMiddleware = require('../../utils/CTFdChallenges/multerConfig');
const fetchuser = require('../../middleware/fetchuser');
const User = require('../../models/User');
// Define the upload path
const uploadPath = path.join(__dirname, '../../uploads/CTFdChallenges');

// Create multer upload middleware with dynamic path
const upload = createUploadMiddleware(uploadPath);


router.post('/update-general', fetchuser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userAdmin = await User.findById(req.user.id);
      
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }

    // Assuming you want to update the existing config or create a new one if not exists
    const config = await Config.findOne();
    if (config) {
      config.title = title;
      config.description=description;
      await config.save();
    } else {
      const newConfig = new Config({ title, description });
      await newConfig.save();
    }

    res.status(200).json({ success: true, message: 'Title and discription updated successfully!' });
  } catch (error) {
    console.error('Error updating title and discription :', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.post('/update-logo', upload.single('logo'), fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
      
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }
    const url = req.file ? `/uploads/CTFdChallenges/${req.file.filename}` : null;

    // Assuming you want to update the existing config or create a new one if not exists
    const config = await Config.findOne();
    if (config) {
      config.url = url;
      await config.save();
    } else {
      const newConfig = new Config({ url });
      await newConfig.save();
    }

    res.status(200).json({ success: true, message: 'Logo updated successfully!' });
  } catch (error) {
    console.error('Error updating logo:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.get('/eventDetails', async (req, res) => {
  try {
    // Find the most recent logo entry
    const eventDetails = await Config.findOne();

    if (eventDetails) {
      res.json({
        url: eventDetails.url,
        title: eventDetails.title,
        description: eventDetails.description
      });
    } else {
      res.status(404).json({ message: 'eventDetails not found' });
    }
  } catch (error) {
    console.error('Error fetching eventDetails:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get visibility settings for a specific team
router.get('/getVisibilitySettings/:team', fetchuser, async (req, res) => {
  const { team } = req.params;
  try {
      const config = await Config.findOne();
      if (!config || !config.visibilitySettings[team]) {
          return res.status(404).json({ message: 'Team not found or visibility settings not configured.' });
      }
      res.json({ settings: config.visibilitySettings[team] });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching visibility settings' });
  }
});

// Update visibility settings for a specific team and section
router.post('/setVisibilitySettings', fetchuser, async (req, res) => {
  const { team, section, visibility } = req.body;
  const userAdmin = await User.findById(req.user.id);
      
  if (userAdmin.role !== process.env.WT) {
    return res.status(403).json({ error: "Bad Request" });
  }
  try {
      const config = await Config.findOne();
      if (!config || !config.visibilitySettings[team]) {
          return res.status(404).json({ message: 'Team not found or visibility settings not configured.' });
      }
      config.visibilitySettings[team][section] = visibility;
      await config.save();
      res.status(200).json({ message: 'Visibility setting updated' });
  } catch (error) {
      res.status(500).json({ message: 'Error updating visibility setting' });
  }
});

// router.get('/mode', async (req, res) => {
//   try {
//     const config = await Config.findOne(); // Assuming there's only one config document
//     if (!config) {
//       return res.status(404).json({ success: false, message: 'Config not found.' });
//     }
//     res.json({ success: true, mode: config.mode });
//   } catch (error) {
//     console.error('Error fetching mode:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch mode.' });
//   }
// });

// Set Mode API
// router.post('/mode', fetchuser, async (req, res) => {
//   const { mode } = req.body;
//   const userAdmin = await User.findById(req.user.id);
      
//   if (userAdmin.role !== process.env.WT) {
//     return res.status(403).json({ error: "Bad Request" });
//   }
//   // Validate mode
//   if (!['ctfd', 'purpleTeam'].includes(mode)) {
//     return res.status(400).json({ success: false, message: 'Invalid mode value.' });
//   }

//   try {
//     const config = await Config.findOne(); // Assuming there's only one config document
//     if (!config) {
//       return res.status(404).json({ success: false, message: 'Config not found.' });
//     }

//     // Update mode
//     config.mode = mode;
//     await config.save();

//     res.json({ success: true, message: 'Mode updated successfully.', mode: config.mode });
//   } catch (error) {
//     console.error('Error updating mode:', error);
//     res.status(500).json({ success: false, message: 'Failed to update mode.' });
//   }
// });



module.exports = router;
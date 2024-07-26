const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Challenge = require('../../models/CTFdChallenges/challenge');
const fetchuser =require('../../middleware/fetchuser');
const score = require('../../models/score');
const ChallengeSolve =require('../../models/ChallengeSolved');



// POST route to create a new challenge
router.post('/create', async (req, res) => {
    try {
        const { name, description, category, value, type } = req.body;
        // console.log(type);
        // Create a new challenge instance
        const newChallenge = new Challenge({
            name,
            value,
            description,
            category,
            type
        });

        // Save the challenge to the database
        const savedChallenge = await newChallenge.save();

        // Extract the challenge ID from the saved challenge document
        const challengeId = savedChallenge._id;

        // Respond with the challenge ID
        res.status(201).json({ challengeId });
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ error: 'Failed to create challenge' });
    }
});

// Update challenge
router.put('/edit/:id', async (req, res) => {
  try {
    const challengeId = req.params.id;
    const updatedData = req.body;

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      challengeId,
      updatedData,
      { new: true }
    );

    if (!updatedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(updatedChallenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Multer configuration
const upload = require('../../utils/CTFdChallenges/multerConfig');



// POST route to update an existing challenge with additional data
router.post('/update/:challengeId', upload.array('file', 5), async (req, res) => {
  const { challengeId } = req.params;
  try {
      // Find the existing challenge by ID
      const existingChallenge = await Challenge.findById(challengeId);
      if (!existingChallenge) {
          return res.status(404).json({ error: 'Challenge not found' });
      }

      // Additional data to update
      const { flag, flag_data, state } = req.body;

      // Update challenge properties
      if (flag) {
          existingChallenge.flag.push(flag);
      }

      if (flag_data) {
          existingChallenge.flag_data.push(flag_data);
      }

      if (state) {
          existingChallenge.state = state;
      }

      // Handle specific fields based on selectedOption (e.g., language for 'code', choices for 'multiple_choice')
      if (existingChallenge.type === 'code') {
          existingChallenge.language = req.body.language;
      } else if (existingChallenge.type === 'multiple_choice') {
          existingChallenge.choices = JSON.parse(req.body.choices);
      }

      // Handle file uploads and update files array
      if (req.files && req.files.length > 0) {
          const newFiles = req.files.map(file => file.uniqueFilename); // Use unique filenames
          existingChallenge.files = existingChallenge.files.concat(newFiles);
      }

      // Save the updated challenge
      const updatedChallenge = await existingChallenge.save();

      // Respond with the updated challenge document
      res.status(200).json({ message: 'Challenge updated successfully', challenge: updatedChallenge });
  } catch (error) {
      console.error('Error updating challenge:', error);
      res.status(500).json({ error: 'Failed to update challenge' });
  }
});

// search challenge by ID
router.get('/details/:id', async (req, res) => {
    try {
        const challenges = await Challenge.findOne({_id: req.params.id});
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
    }
    });

    


    


    router.get('/all', async (req, res) => {
      try {
          const visibleChallenges = await Challenge.find({ state: "visible" }).select('name value description category langauge max_attempts type solves solved_by_me attempts choices files');
          res.status(200).json(visibleChallenges);
      } catch (error) {
          console.error('Error fetching challenges:', error);
          res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
      }
  });

 

  router.get('/hints/:id', async (req, res) => {
    try {
        const hints = await Challenge.find({_id: req.params.id}).select('hints');
        res.status(200).json(hints);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
    }
  });
 


router.get('/toDisplayAllChallenges', async (req, res) => {
    try {
        const challenges = await Challenge.find().select('name value category type state');
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges', message: error.message });
    }
    });

// Delete challenges by IDs
router.delete('/deleteChallenges', async (req, res) => {
    const { ids } = req.body;
  
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of IDs.' });
    }
  
    try {
      const result = await Challenge.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: `${result.deletedCount} challenges deleted successfully.` });
    } catch (error) {
      console.error('Error deleting challenges:', error);
      res.status(500).json({ error: 'Failed to delete challenges', message: error.message });
    }
  });

  router.get('/files/:id', async (req, res) => {
    try {
      const challenge = await Challenge.findById(req.params.id);
      if (!challenge) {
        return res.status(404).send('Challenge not found');
      }
      res.json(challenge.files);
    } catch (error) {
      res.status(500).send('Error fetching challenge');
    }
  });

  // upload new file in specific challenges
  router.post('/files/:id/upload', upload.single('file'), async (req, res) => {
    try {
      const challenge = await Challenge.findById(req.params.id);
      if (!challenge) {
        return res.status(404).send('Challenge not found');
      }
  
      challenge.files.push(req.file.filename);
      await challenge.save();
      res.json({ filename: req.file.filename });
    } catch (error) {
      res.status(500).send('Error uploading file');
    }
  });
  

  // delete particular file
  router.delete('/files/:id/delete/:filename', async (req, res) => {
    try {
      const challenge = await Challenge.findById(req.params.id);
      if (!challenge) {
        return res.status(404).send('Challenge not found');
      }
  
      const fileIndex = challenge.files.indexOf(req.params.filename);
      if (fileIndex === -1) {
        return res.status(404).send('File not found');
      }
  
      challenge.files.splice(fileIndex, 1);
      await challenge.save();
  
      // Delete the file from the file system
      const filePath = path.join(__dirname, '../uploads', req.params.filename);
    //   console.log(filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file from filesystem:', err);
          return res.status(500).send('Error deleting file from filesystem');
        }
        res.send('File deleted successfully');
      });
    } catch (error) {
      res.status(500).send('Error deleting file');
    }
  });

// get all flags
router.get('/flags/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).send('Challenge not found');
    }
    res.json({flags: challenge.flag, flag_data: challenge.flag_data});
  } catch (error) {
    res.status(500).send('Error fetching challenge');
  }
});

// POST route to add a flag to a challenge
router.post('/flags/:id/add', async (req, res) => {
  const { id: challengeId } = req.params;
  const { flag, flag_data } = req.body;
  // console.log(flag);
  try {
    // Find the challenge by ID
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Update challenge with new flag and flag_data
    challenge.flag.push(flag); // Assuming flags is an array in the Challenge schema
    challenge.flag_data.push(flag_data); // Assuming flag_data is an array in the Challenge schema

    // Save the updated challenge
    await challenge.save();

    // Respond with the added flag and flag_data
    res.status(201).json({ flag, flag_data });
  } catch (error) {
    console.error('Error adding flag:', error);
    res.status(500).json({ error: 'Failed to add flag' });
  }
});

// DELETE route to delete a flag from a challenge
router.delete('/flags/:id/delete/:flag', async (req, res) => {
  const { id: challengeId, flag } = req.params;

  try {
    // Find the challenge by ID
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Remove the flag from the array
    challenge.flag = challenge.flag.filter(f => f !== flag);
    challenge.flag_data = challenge.flag_data.filter((_, index) => index !== challenge.flag.indexOf(flag));

    // Save the updated challenge
    await challenge.save();

    // Respond with success message
    res.status(200).json({ message: 'Flag deleted successfully' });
  } catch (error) {
    console.error('Error deleting flag:', error);
    res.status(500).json({ error: 'Failed to delete flag' });
  }
});

// PUT route for editing a flag associated with a challenge
router.put('/flags/:challengeId/edit/:index', async (req, res) => {
  const { challengeId, index } = req.params;
  const { flag, flag_data } = req.body; // Assuming you are sending flag and flag_data in the request body

  try {
    // Find the challenge by ID
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found.' });
    }

    // Update the flag at the specified index
    challenge.flag[index] = flag;
    challenge.flag_data[index] = flag_data;

    // Save the updated challenge
    await challenge.save();

    res.json({ success: true, flag: challenge.flag[index] }); // Return the updated flag
  } catch (error) {
    console.error('Error editing flag:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/verify-answer', fetchuser, async (req, res) => {
  const { challengeId, answer, updatedValue } = req.body;
 console.log(updatedValue);


  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const isCorrectAnswer = (answer, flags, flagData) => {
      for (let i = 0; i < flags.length; i++) {
        if (flagData[i] === 'case_sensitive') {
          if (answer.trim() === flags[i].trim()) {
            return true;
          }
        } else {
          if (answer.trim().toLowerCase() === flags[i].trim().toLowerCase()) {
            return true;
          }
        }
      }
      return false;
    };

    const isCorrect = isCorrectAnswer(answer, challenge.flag, challenge.flag_data);

    if (isCorrect) {
      const userId = req.user.id;
      let userScore = await score.findOne({ user: userId });

      if (!userScore) {
        return res.status(404).json({ message: 'User score not found' });
      }

      // Check if the challenge has already been solved by the user
      const challengeSolved = await ChallengeSolve.findOne({ userId, challenge_id: challengeId });

      if (!challengeSolved) {
        // Update user score
        userScore.score += updatedValue;
        await userScore.save();
         console.log(userScore.score);

        // Save challenge solve record
        const newChallengeSolve = new ChallengeSolve({
          userId,
          challenge_id: challengeId,
          challenge_name: challenge.name,
          date: new Date(),
        });

        await newChallengeSolve.save();
       

        return res.json({ correct: isCorrect, newScore: userScore.score });
      }

      return res.json({ correct: isCorrect, newScore: userScore.score, message: 'Challenge already solved' });
    }

    res.json({ correct: isCorrect });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/solved',fetchuser, async (req, res) => {
  try {
    const  userId = req.user.id;
    const solvedChallenges = await ChallengeSolve.find({ userId }).select('challenge_id');
    res.json(solvedChallenges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});




module.exports = router;
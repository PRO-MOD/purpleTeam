const express = require('express');
const Question = require('../../models/Report/Question');
const Report = require('../../models/Report/Report');
const fetchuser = require('../../middleware/fetchuser');
const UserResponse = require('../../models/Report/UserResponse');
const User = require('../../models/User');
const router = express.Router();

// POST route to add a new question
router.post('/add/:id', fetchuser, async (req, res) => {
  try {
    const reportId = req.params.id;

    const userAdmin = await User.findById(req.user.id);
 
    if (userAdmin.role != process.env.WT) {
      return res.status(403).send({ error: "Bad Request" });
    }

    const { text, type, options, index, maxScore, scenarioId } = req.body;

    // Verify the report type exists
    const reportExists = await Report.findById(reportId);
    if (!reportExists) {
      return res.status(404).json({ error: 'Report type not found' });
    }

    // Validate scenarioId
    if (!scenarioId) {
      return res.status(400).json({ error: 'Scenario ID is required' });
    }

    // Create a new question instance
    const newQuestion = new Question({
      text,
      type,
      options,
      report: reportId,
      index,
      maxScore,
      scenarioId
    });

    // Save the question to the database
    const savedQuestion = await newQuestion.save();

    // Return the saved question
    res.status(201).json({ message: "Question Created Successfully" });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// PUT route to update a question
router.put('/edit/:id', fetchuser, async (req, res) => {
  const { id } = req.params; // Get the question ID from the URL parameters
  const { text, type, options, index, maxScore, scenarioId } = req.body; // Get the updated data from the request body

  try {
    const userAdmin = await User.findById(req.user.id);
 
    if (userAdmin.role != process.env.WT) {
      return res.status(403).send({ error: "Bad Request" });
    }

    // Validate scenarioId
    if (!scenarioId) {
      return res.status(400).json({ error: 'Scenario ID is required' });
    }

    // Find the question by ID and update it with the new data
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        text,
        type,
        options,
        index,
        maxScore,
        scenarioId
      },
      { new: true } // Return the updated document
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestion); // Respond with the updated question
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Failed to update question' });
  }
});

// DELETE route to remove a question
router.delete('/delete/:id', fetchuser, async (req, res) => {
  const { id } = req.params; // Get the question ID from the URL parameters

  try {
    const userAdmin = await User.findById(req.user.id);
 
    if (userAdmin.role != process.env.WT) {
      return res.status(403).send({ error: "Bad Request" });
    }
    // Find the question by ID and delete it
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
});


// Get questions for a specific report for admins only
router.get('/for/:reportId/', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
 
    if (userAdmin.role != process.env.WT) {
      return res.status(403).send({ error: "Bad Request" });
    }

    // Fetch the questions and populate scenarioId
    const questions = await Question.find({ report: req.params.reportId })
      .sort({ index: 1 })
      .populate('scenarioId', 'scenarioId'); // Populating only the scenarioId field

    // Map the questions to add the scenarioName field
    const response = questions.map(question => {
      // Access the _doc field which contains the actual data
      const doc = question._doc;

      if (doc.scenarioId && doc.scenarioId.scenarioId) {
        // Add the scenarioId to a new field called scenarioName
        doc.scenarioName = doc.scenarioId.scenarioId;
      }

      return doc; // Return the updated document object
    });

    // Send the final response to the client
    res.json(response);

  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch questions for a specific reportId and scenarioId
router.get('/for/:reportId/:scenarioId', fetchuser, async (req, res) => {
  const { reportId, scenarioId } = req.params;
  const userId = req.user.id; // Assuming fetchuser middleware sets req.user

  try {
    // Check if the user has already submitted a response
    const existingResponse = await UserResponse.findOne({ reportId, scenarioId, userId });

    if (existingResponse) {
      return res.status(403).json({
        message: 'You have already submitted this report. Editing is not allowed.'
      });
    }

    // Fetch questions filtered by reportId and scenarioId
    const questions = await Question.find({ report: reportId, scenarioId });

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this Report.' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      message: 'An error occurred while fetching questions.',
      error: error.message
    });
  }
});


module.exports = router;

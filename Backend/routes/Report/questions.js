const express = require('express');
const Question = require('../../models/Report/Question');
const Report = require('../../models/Report/Report');
const router = express.Router();

// POST route to add a new question
router.post('/add/:id', async (req, res) => {
  try {
    const reportId = req.params.id;

    const { text, type, options, index, maxScore } = req.body;

    // Verify the report type exists
    const reportExists = await Report.findById(reportId);
    if (!reportExists) {
      return res.status(404).json({ error: 'Report type not found' });
    }

    // Create a new question instance
    const newQuestion = new Question({
      text,
      type,
      options,
      report: reportId,
      index,
      maxScore
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
router.put('/edit/:id', async (req, res) => {
  const { id } = req.params; // Get the question ID from the URL parameters
  const { text, type, options, index, maxScore } = req.body; // Get the updated data from the request body

  try {
    // Find the question by ID and update it with the new data
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        text,
        type,
        options,
        index,
        maxScore
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
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the question ID from the URL parameters

  try {
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


// Get questions for a specific report
router.get('/for/:reportId/', async (req, res) => {
  try {
    const questions = await Question.find({ report: req.params.reportId }).sort({ index: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

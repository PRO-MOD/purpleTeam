const express = require('express');
const Question = require('../../models/Report/Question');
const Report = require('../../models/Report/Report');
const router = express.Router();

// POST route to add a new question
router.post('/add/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    
    const { text, type, options, index } = req.body;

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
    });

    // Save the question to the database
    const savedQuestion = await newQuestion.save();

    // Return the saved question
    res.status(201).json({message: "Question Created Successfully"});
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
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

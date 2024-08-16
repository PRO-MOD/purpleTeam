const express = require('express');
const router = express.Router();
const UserResponse = require('../../models/Report/UserResponse');
const fetchuser = require('../../middleware/fetchuser');
const moment = require('moment-timezone');
const Score= require('../../models/score');

router.post('/ans', fetchuser, async (req, res) => {
  const userId = req.user.id;
  try {
    const { reportId, responses } = req.body;

    if (!reportId || !userId || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    for (const response of responses) {
      if (!response.questionId || response.answer === undefined) {
        return res.status(400).json({ error: 'Each response must include questionId and answer' });
      }
    }

    const newResponse = new UserResponse({
      reportId,
      userId,
      responses,
    });

    await newResponse.save();
    res.status(201).json({ message: 'Responses saved successfully' });
  } catch (error) {
    console.error('Error saving responses:', error);
    res.status(500).json({ error: 'Failed to save responses' });
  }
});

router.get('/all/:userId', async (req, res) => {
  try {
    const {userId} = req.params;
    const responses = await UserResponse.find({ userId }).populate('reportId', 'name');

    const formattedResponses = responses.map(response => {
      const createdAt = moment(response.createdAt).tz('Asia/Kolkata');
      return {
        reportName: response.reportId.name,
        responseDate: createdAt.format('YYYY-MM-DD'),
        responseTime: createdAt.format('HH:mm:ss'),
        _id: response._id,
        finalScore: response.finalScore || 0,
      };
    });

    res.json(formattedResponses);
  } catch (error) {
    console.error('Error fetching user responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

router.get('/detail/:responseId', async (req, res) => {
  try {
    const { responseId } = req.params;

    const response = await UserResponse.findById(responseId)
      .populate('reportId', 'name')
      .populate('responses.questionId', 'text options maxScore');

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    const createdAt = moment(response.createdAt).tz('Asia/Kolkata');
    const detailedResponse = {
      _id: response._id,
      reportName: response.reportId.name,
      responses: response.responses.map(r => ({
        questionId: r.questionId._id,
        question: r.questionId.text,
        answer: r.answer,
        maxScore: r.questionId.maxScore,
        assignedScore: r.assignedScore || 0, // Assigned score, if exists
      })),
      penaltyScore: response.penaltyScore || 0, 
      finalScore:response.finalScore || 0,// Penalty score
      responseDate: createdAt.format('YYYY-MM-DD'),
      responseTime: createdAt.format('HH:mm:ss'),
    };

    res.json(detailedResponse);
  } catch (error) {
    console.error('Error fetching response details:', error);
    res.status(500).json({ error: 'Failed to fetch response details' });
  }
});

router.put('/update/:responseId', async (req, res) => {
  try {
    const { responseId } = req.params;
    const { updatedResponses, penaltyScore, finalScore } = req.body;

    // Validate input
    if (!responseId || !Array.isArray(updatedResponses) || updatedResponses.length === 0) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Find the response by ID
    const response = await UserResponse.findById(responseId);

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    // Create a mapping of questionIds to responses
    const responseMap = response.responses.reduce((map, item) => {
      map[item.questionId.toString()] = item; // Assuming questionId is stored as an ObjectId
      return map;
    }, {});

    // Update the assigned scores for each question
    updatedResponses.forEach(updatedResponse => {
      const questionIdStr = updatedResponse.questionId.toString();
      const questionResponse = responseMap[questionIdStr];
      if (questionResponse) {
        questionResponse.assignedScore = updatedResponse.assignedScore;
      }
    });

    // Update penalty and final scores
    response.penaltyScore = penaltyScore;
    response.finalScore = finalScore;

    // Save the updated response
    await response.save();

    // Find the corresponding Score document by user reference
    const score = await Score.findOne({ user: response.userId });
  

    if (score) {
      // Add finalScore from UserResponse to manualScore in Score
      score.manualScore = (score.manualScore || 0) + finalScore;

      // Save the updated Score document
      await score.save();
      
    }

    res.json({ message: 'Scores updated successfully', updatedResponse: response });
  } catch (error) {
    console.error('Error updating scores:', error);
    res.status(500).json({ error: 'Failed to update scores' });
  }
});



module.exports = router;

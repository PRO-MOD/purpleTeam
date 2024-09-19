const express = require('express');
const router = express.Router();
const UserResponse = require('../../models/Report/UserResponse');
const fetchuser = require('../../middleware/fetchuser');
const moment = require('moment-timezone');
const Score= require('../../models/score');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path where files will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Unique filename
  },
});

const upload = multer({ storage });

// Function to validate MongoDB ObjectId
// router.post('/ans', fetchuser, upload.any(), async (req, res) => {
//   try {
//     const { reportId } = req.body;
//     const userId = req.user.id; 
//     const responses = req.body.responses;
//     let responseArray = [];

//     // Ensure that responses exist
//     if (responses) {
//       // Process each response and validate questionId
//       for (let questionId in responses) {
//         if (!questionId) {
//           return res.status(400).json({ message: `Missing questionId for response.` });
//         }

//         const answer = responses[questionId];

//         // Check if questionId already exists in responseArray
//         let existingResponse = responseArray.find(response => response.questionId === questionId);
//         if (existingResponse) {
//           // If the response exists, and it's an array, push the new answer
//           if (Array.isArray(existingResponse.answer)) {
//             existingResponse.answer.push(answer);
//           } else {
//             existingResponse.answer = [existingResponse.answer, answer];
//           }
//         } else {
//           // Create new response for this questionId
//           responseArray.push({
//             questionId: questionId,
//             answer: answer
//           });
//         }
//       }
//     }

//     // Handle file uploads (if any) and validate questionId for each file
//     if (req.files && req.files.length > 0) {
//       req.files.forEach((file) => {


//  // Check if the file is an image
//     const isImage = file.mimetype.startsWith('image/');
    
//     if (!isImage) {
//       return res.status(400).json({ message: 'Only image files are allowed.' });
//     }

//         // Extract questionId from fieldname (assuming format: `responses[questionId]`)
//         const match = file.fieldname.match(/\[(.*?)\]/); // Matches text inside square brackets
//         const questionId = match ? match[1] : null;

//         if (!questionId) {
//           return res.status(400).json({ message: 'Missing questionId for file upload.' });
//         }

//         // Find the existing entry for the questionId
//         let existingResponse = responseArray.find(response => response.questionId === questionId);

//         if (existingResponse) {
//           // If an entry exists, and the answer is an array, append the file path to it
//           if (Array.isArray(existingResponse.answer)) {
//             existingResponse.answer.push(file.path);
//           } else {
//             // Otherwise, convert the existing answer to an array and add the file path
//             existingResponse.answer = [existingResponse.answer, file.path];
//           }
//         } else {
//           // If no entry exists, create a new one with the file path
//           responseArray.push({
//             questionId: questionId,
//             answer: file.path // Store the file path
//           });
//         }
//       });
//     }

//     // Save the new user response
//     const newResponse = new UserResponse({
//       reportId: reportId,
//       userId: userId,
//       responses: responseArray,
//     });

//     await newResponse.save();

//     res.status(200).json({ message: 'Form submitted successfully', data: newResponse });
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     res.status(500).json({ message: 'Failed to submit form', error: error.message });
//   }
// });



router.post('/ans', fetchuser, upload.any(), async (req, res) => {
  try {
    const { reportId } = req.body;
    const userId = req.user.id;
    const responses = req.body.responses;
    let responseArray = [];
    let errors = [];

    // Ensure that responses exist
    if (responses) {
      // Process each response and validate questionId
      for (let questionId in responses) {
        if (!questionId) {
          errors.push(`Missing questionId for response.`);
          continue; // Skip this iteration
        }

        const answer = responses[questionId];

        // Check if questionId already exists in responseArray
        let existingResponse = responseArray.find(response => response.questionId === questionId);
        if (existingResponse) {
          // If the response exists, and it's an array, push the new answer
          if (Array.isArray(existingResponse.answer)) {
            existingResponse.answer.push(answer);
          } else {
            existingResponse.answer = [existingResponse.answer, answer];
          }
        } else {
          // Create new response for this questionId
          responseArray.push({
            questionId: questionId,
            answer: answer
          });
        }
      }
    }

    // Handle file uploads (if any) and validate questionId for each file
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Check if the file is an image
        const isImage = file.mimetype.startsWith('image/');
        if (!isImage) {
          errors.push('Only image files are allowed.');
          return; // Skip this iteration
        }

        // Extract questionId from fieldname (assuming format: `responses[questionId]`)
        const match = file.fieldname.match(/\[(.*?)\]/); // Matches text inside square brackets
        const questionId = match ? match[1] : null;

        if (!questionId) {
          errors.push('Missing questionId for file upload.');
          return; // Skip this iteration
        }

        // Find the existing entry for the questionId
        let existingResponse = responseArray.find(response => response.questionId === questionId);

        if (existingResponse) {
          // If an entry exists, and the answer is an array, append the file path to it
          if (Array.isArray(existingResponse.answer)) {
            existingResponse.answer.push(file.path);
          } else {
            // Otherwise, convert the existing answer to an array and add the file path
            existingResponse.answer = [existingResponse.answer, file.path];
          }
        } else {
          // If no entry exists, create a new one with the file path
          responseArray.push({
            questionId: questionId,
            answer: file.path // Store the file path
          });
        }
      });
    }

    // Check if there are any errors collected
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors: errors });
    }

    // Save the new user response
    const newResponse = new UserResponse({
      reportId: reportId,
      userId: userId,
      responses: responseArray,
    });

    await newResponse.save();

    res.status(200).json({ message: 'Form submitted successfully', data: newResponse });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Failed to submit form', error: error.message });
  }
});


router.get('/all/:userId', async (req, res) => {
  try {
    const {userId} = req.params;
    const responses = await UserResponse.find({ userId }).populate('reportId', 'name');

    const formattedResponses = responses.map(response => {
      const createdAt = moment(response.createdAt).tz('Asia/Kolkata');
      return {
        reportId: response.reportId._id,
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

    const scoreDifference = finalScore - (response.finalScore || 0);


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
    const score = await Score.findOne({ user: response.userId.toString() });
 
    
    if (score) {
      // Add finalScore from UserResponse to manualScore in Score
      score.manualScore = (score.manualScore || 0) + scoreDifference;
      // Save the updated Score document
      await score.save();
    
      
    }

    res.json({ message: 'Scores updated successfully', updatedResponse: response });
  } catch (error) {
    console.error('Error updating scores:', error);
    res.status(500).json({ error: 'Failed to update scores' });
  }
});



router.get('/unique-reports', async (req, res) => {
  try {
    // Aggregation pipeline
    const results = await UserResponse.aggregate([
      {
        $lookup: {
          from: 'users', // Name of the collection for User model
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'newreports', // Name of the collection for NewReport model
          localField: 'reportId',
          foreignField: '_id',
          as: 'report'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $unwind: '$report'
      },
      {
        $group: {
          _id: {
            reportName: '$report.name'
          },
          users: {
            $push: {
              userName: '$user.name',
              createdAt: '$createdAt'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          reportName: '$_id.reportName',
          users: 1
        }
      }
    ]);

    res.json(results);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
});


router.get('/images/:responseId', async (req, res) => {
  const { responseId } = req.params;

  try {
    // Find the user response by ID
    const userResponse = await UserResponse.findById(responseId).exec();
    
    if (!userResponse) {
      return res.status(404).json({ success: false, message: 'User response not found.' });
    }

    // Extract image paths from the responses array
    const imagePaths = userResponse.responses
      .flatMap(response => {
        if (Array.isArray(response.answer)) {
          // If answer is an array, filter and return image paths
          return response.answer.filter(path =>
            typeof path === 'string' && (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg'))
          );
        } else if (typeof response.answer === 'string' && (response.answer.endsWith('.png') || response.answer.endsWith('.jpg') || response.answer.endsWith('.jpeg'))) {
          // If answer is a string, check if it's an image path
          return [response.answer];
        }
        return [];
      });

    res.json({ success: true, images: imagePaths });
  } catch (error) {
    console.error('Error fetching response images:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch images.' });
  }
});


module.exports = router;
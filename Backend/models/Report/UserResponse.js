// const mongoose = require('mongoose');

// const userResponseSchema = new mongoose.Schema({
//   reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewReport', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   responses: [
//     {
//       questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
//       answer: { type: mongoose.Schema.Types.Mixed, required: true } // Mixed type to handle different types of answers
//     }
//   ],
//   createdAt: { type: Date, default: Date.now }
// });

// const UserResponse = mongoose.model('UserResponse', userResponseSchema);


// module.exports = UserResponse;


const mongoose = require('mongoose');

const userResponseSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewReport', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      answer: { type: mongoose.Schema.Types.Mixed, required: true }, // Mixed type to handle different types of answers
      assignedScore: { type: Number, default: 0 } // Added field to store assigned marks
    }
  ],
  penaltyScore: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 }, // Field to store penalty score
  createdAt: { type: Date, default: Date.now }
});

const UserResponse = mongoose.model('UserResponse', userResponseSchema);

module.exports = UserResponse;

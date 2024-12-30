
const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  visibilitySettings: {
    A3F9B7C2D8E5F1A4: {
      communication: { type: String, default: 'yes' },
      dashboard: { type: String, default: 'yes' },
      notes: { type: String, default: 'yes' },
      progress: { type: String, default: 'yes' },
      notification: { type: String, default: 'yes' },
      challenges: { type: String, default: 'yes' },
      profile: { type: String, default: 'yes' },
      scoreBoard:{ type: String, default: 'yes' }
    },
    D71A6E9B4C3F8D2E: {
      home: { type: String, default: 'yes' },
      users: { type: String, default: 'yes' },
      viewAll: { type: String, default: 'yes' },
      submissions: { type: String, default: 'yes' },
      score: { type: String, default: 'yes' },
      newReports: { type: String, default: 'yes' },
      reportConfig: { type: String, default: 'yes' },
      config: { type: String, default: 'yes' },
      challenges: { type: String, default: 'yes' },
      notification: { type: String, default: 'yes' },
      profile: { type: String, default: 'yes' },
      communication: { type: String, default: 'yes' },
    },
    YT: {
      home: { type: String, default: 'no' },
      users: { type: String, default: 'no' },
      viewAll: { type: String, default: 'no' },
      submissions: { type: String, default: 'no' },
      score: { type: String, default: 'no' },
      newReports: { type: String, default: 'no' },
      reportConfig: { type: String, default: 'no' },
      config: { type: String, default: 'no' },
      challenges: { type: String, default: 'no' },
      profile: { type: String, default: 'no' },
      communication: { type: String, default: 'no' },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mode: {
    type: String,
    enum: ['ctfd', 'purpleTeam'],
    default: 'ctfd',
  },
});

module.exports = mongoose.model('config', ConfigSchema);

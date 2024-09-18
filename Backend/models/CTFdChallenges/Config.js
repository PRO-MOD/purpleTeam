


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
    BT: {
      communication: { type: String, default: 'no' },
      dashboard: { type: String, default: 'no' },
      notes: { type: String, default: 'no' },
      progress: { type: String, default: 'no' },
      notification: { type: String, default: 'no' },
      challenges: { type: String, default: 'no' },
      profile: { type: String, default: 'no' },
    },
    WT: {
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
    default: 'purpleTeam',
  },
});

module.exports = mongoose.model('config', ConfigSchema);

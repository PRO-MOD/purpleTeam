const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {  // Add the title field
    type: String,
    required: true,
  },
  description:{
    type:String,
    required:false,
  },
  visibilitySettings: {
    communication: { type: String, default: 'no' },
    dashboard: { type: String, default: 'no' },
    notes: { type: String, default: 'no' },
    progress: { type: String, default: 'no' },
    notification: { type: String, default: 'no' },
    challenges: { type: String, default: 'no' },
    profile: { type: String, default: 'no' },
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('config', ConfigSchema);

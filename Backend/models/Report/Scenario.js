const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  scenarioId: {
    type: String,
    required: true,
    unique: true,
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewReport', // Reference to the Report schema
    required: true,
  },
});

const Scenario = mongoose.model('Scenario', scenarioSchema);

module.exports = Scenario;

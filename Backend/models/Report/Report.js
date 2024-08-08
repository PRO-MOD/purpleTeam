const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Add auto-incrementing index field
reportSchema.plugin(AutoIncrement, { inc_field: 'index' });

const Report = mongoose.model('NewReport', reportSchema);

module.exports = Report;

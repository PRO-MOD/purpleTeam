const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  text: { type: String, required: true },
  type: { type: String, required: true, enum: ['input', 'checkbox', 'dropdown', 'textarea', 'mcq'] },
  options: [String], // For questions with options like dropdowns, checkboxes, or MCQs
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'NewReport', required: true },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

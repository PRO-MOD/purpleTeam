const mongoose = require('mongoose');

const firstLastPageSchema = new mongoose.Schema({
  text: { type: String, default: "" },
  margin: { type: Number, default: 0 },
  coordinateY: { type: Number, default: 0 },
}, { _id: false });

const reportConfigSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'NewReport', required: false },
  header: { type: mongoose.Schema.Types.ObjectId, ref: 'Header', required: false },
  footer: { type: mongoose.Schema.Types.ObjectId, ref: 'Footer', required: false },
  firstPage: [firstLastPageSchema],
  lastPage: [firstLastPageSchema],
  enablePageNumber: { type: Boolean, default: false },
});

const ReportConfig = mongoose.model('ReportConfig', reportConfigSchema);

module.exports = ReportConfig;

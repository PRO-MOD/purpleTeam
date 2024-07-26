const mongoose = require('mongoose');

const DetailHintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User schema
  },
  challengeId: {
     type: mongoose.Schema.Types.ObjectId,
    ref: 'challenge'

  },
  hint_id:{
         type: mongoose.Schema.Types.ObjectId,
    ref: 'Hint'

  },
  value: { type: Number }
});

module.exports = mongoose.model('detailHint',DetailHintSchema );

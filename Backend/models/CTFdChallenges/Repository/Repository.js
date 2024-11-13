const mongoose = require('mongoose');

// Define Repository Schema
const repositorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Each repository should have a unique name
    },
    description: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    challenges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge'
    }], // Array of challenge IDs linked to the repository
    isActive: {
        type: Boolean,
        default: false // Active repositories will be shown in the list
    }
});

// Compile the model from schema
const Repository = mongoose.model('Repository', repositorySchema);

module.exports = Repository;

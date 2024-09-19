const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true,
        unique: true
    },
    port: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'pulled', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

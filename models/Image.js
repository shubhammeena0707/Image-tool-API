const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalName:
    {
        type: String,
        required: true
    },
    processedFileName:
    {
        type: String,
        required: true
    },
    path:
    {
        type: String,
        required: true
    },
    operations:
    {
        type: Object,
        default: {}
    },
    createdAt:
    {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Image', ImageSchema);

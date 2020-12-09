const mongoose = require('mongoose');

const CueCardCollectionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    cueCards: {
        type: Array,
        default: []
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('CueCardCollections', CueCardCollectionSchema);
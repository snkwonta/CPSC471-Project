const mongoose = require('mongoose');

const CueCardCollectionSchema = mongoose.Schema({
    collectionName: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('CueCardCollections', CueCardCollectionSchema);
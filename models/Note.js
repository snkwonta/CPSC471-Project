const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Notes', NoteSchema);
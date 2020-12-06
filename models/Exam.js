const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    topics: {
        type: [String],
        required: true
    },
    examType: {
        type: String,
        required: true,
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

module.exports = mongoose.model('Exams', ExamSchema);
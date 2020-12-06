const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    semester: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    suffix: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    students: {
        type: Array,
        default: []
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Courses', CourseSchema);
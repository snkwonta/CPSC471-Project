const mongoose = require('mongoose');

const ReminderSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    dateDue: {
        type: Date,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Reminders', ReminderSchema);
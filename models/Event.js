const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    subject: {
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

module.exports = mongoose.model('Events', EventSchema);
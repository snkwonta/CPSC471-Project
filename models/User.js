const mongoose = require('mongoose');

const NameSchema = mongoose.Schema({
    firstName: {
        type: String,
        max: 255,
        required: true
    },
    lastName: {
        type: String,
        max: 255,
        required: true
    }
})

const UserSchema = mongoose.Schema({
    name: NameSchema,
    email: {
        type: String,
        required: true,
        lowercase: true,
        min: 6,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        min: 6,
        max: 1024,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Users', UserSchema);
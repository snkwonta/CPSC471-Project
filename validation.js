const Joi = require('@hapi/joi');

const subjects = ['biol','chem','cpsc','engg','geog','math','phil','soci','stat'];
const semesters = ['spring','summer','fall','winter']

// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: {
            firstName: Joi.string().min(2).required(),
            lastName: Joi.string().min(2).required()
        },
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required(),
        userType: Joi.string().lowercase().valid('student','teacher').required()
    });
    return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

// Exam Validation
const examValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        topics: Joi.array().items(Joi.string()).min(1).required(),
        examType: Joi.string().lowercase().valid('quiz','midterm','final').required(),
        dateTime: Joi.string()
    });
    return schema.validate(data);
};

// Event Validation
// const eventValidation = (data) => {
//     const schema = Joi.object({
//         name: Joi.string().min(3).required(),
//         topics: Joi.array().items(Joi.string()).min(1).required(),
//         examType: Joi.string().lowercase().valid('quiz','midterm','final').required()
//     });
//     return schema.validate(data);
// };


// Course Validation
const courseValidation = (data) => {
    const schema = Joi.object({
        semester: Joi.string().lowercase().valid(...semesters).required(),
        subject: Joi.string().lowercase().valid(...subjects).required(),
        suffix: Joi.string().min(3).max(3).pattern(/^[0-9]+$/).required()
    });
    return schema.validate(data);
};

// Cue Card Collection Validation
const cueCardCollectionValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        courseId: Joi.string().min(3).required()
    });
    return schema.validate(data);
};

// Cue Card Validation
const cueCardValidation = (data) => {
    const schema = Joi.object({
        question: Joi.string().min(3).required(),
        answer: Joi.string().min(3).required(),
        collectionId: Joi.string().min(3).required()
    });
    return schema.validate(data);
};

// Note Validation
const noteValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        text: Joi.string().min(3).required(),
        courseId: Joi.string().min(3).required()
    });
    return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.examValidation = examValidation;
// module.exports.eventValidation = eventValidation;
module.exports.courseValidation = courseValidation;
module.exports.cueCardCollectionValidation = cueCardCollectionValidation;
module.exports.cueCardValidation = cueCardValidation;
module.exports.noteValidation = noteValidation;
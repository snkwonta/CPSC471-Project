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
        examType: Joi.string().lowercase().valid('quiz','midterm','final').required()
    });
    return schema.validate(data);
};

// Course Validation
const courseValidation = (data) => {
    const schema = Joi.object({
        semester: Joi.string().lowercase().valid(...semesters).required(),
        subject: Joi.string().lowercase().valid(...subjects).required(),
        suffix: Joi.string().min(3).max(3).pattern(/^[0-9]+$/).required()
    });
    return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.examValidation = examValidation;
module.exports.courseValidation = courseValidation;
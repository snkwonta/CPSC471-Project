const router = require('express').Router();
const Exam = require('../models/Exam');
const Event = require('../models/Event');
const User = require('../models/User');
const verify = require('./verify');
const {examValidation} = require('../validation');

// Get all exams
// Unfinished
router.get('/', verify, async (req,res) => {
    // res.json({
    //     exams: {topics: ['CPSC','MATH'], examType: 'final'}
    // })

    const user = await User.findOne({_id : req.user._id});
    console.log(user);

    res.send(req.user);
});

// Create a new exam
router.post('/', verify, async (req,res) => {
    // Check if user is a teacher
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'teacher') return res.status(401).send('Access denied');

    // Validate exam data
    const {error} = examValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Create exam
    const exam = new Exam({
        name: req.body.name,
        topics: req.body.topics,
        examType: req.body.examType,
        createdBy: user._id
    });

    // // Create event
    // const event = new Event({
        
    // })

    try {
        const savedExam = await exam.save()
        res.json(savedExam);
    } catch(err) {
        res.json({message: err});
    }
});


module.exports = router;
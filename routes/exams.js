const router = require('express').Router();
const Exam = require('../models/Exam');
const Event = require('../models/Event');
const Course = require('../models/Course');
const User = require('../models/User');
const verify = require('./verify');
const {examValidation} = require('../validation');

// Get all exams
router.get('/', async (req,res) => {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch(err) {
        res.json({message: err});
    }
});

// Get a specific exam
router.get('/:examId', verify, async (req,res) => {
    try {
        // Find exam
        const exam = await Exam.findOne({_id : req.params.examId});
        if(!exam) return res.status(400).send('Exam ID does not exist');

        res.json(exam);
    } catch(err) {
        res.json({message: err});
    }
});

// Get all exams for a specific student
router.get('/student/:userId', verify, async (req,res) => {
    try {
        // Check if user is a student
        const user = await User.findById(req.params.userId);
        if(user.userType != 'student') return res.status(401).send('User is not a student');

        // Check if user has a course
        const courses = await Course.find({students : req.params.userId}); 
        if(!courses) return res.status(400).send('User does not have any courses');

        // Get all teacher IDs from courses
        let teachers = [];
        courses.forEach(c => {
            teachers.push(c.teacher);
        });

        // Get all exams from given teacher IDs
        const allExams = await Exam.find({createdBy: {$in: teachers}});
        if(!allExams) return res.status(400).send('User has no exams');

        res.json(allExams);
    } catch(err) {
        res.json({message: err});
    }
});

// Create a new exam
router.post('/', verify, async (req,res) => {
    // Check if user is a teacher
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'teacher') return res.status(401).send('User is not a teacher');

    // Check to see if user is teaching a course
    const course = await Course.findOne({teacher : req.user._id});
    if(!course) return res.status(403).send('User is not teaching a course');

    // Validate exam data
    let {error} = examValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Validate date due
    const dateTime = Date.parse(req.body.dateTime); // Example: Date.parse('01 Jan 1970 00:00:00 GMT')
    if(isNaN(dateTime)) return res.status(400).send('Invalid date: NaN');

    // Create exam
    const exam = new Exam({
        name: req.body.name,
        topics: req.body.topics,
        examType: req.body.examType,
        createdBy: user._id
    });

    // Create event
    const event = new Event({
        subject: course.subject,
        dateDue: dateTime
    });

    try {
        const savedExam = await exam.save();
        const savedEvent = await event.save()
        res.json(savedExam);
        res.json(savedEvent);
    } catch(err) {
        res.json({message: err});
    }
});

// Delete a specific exam
router.delete('/:examID', async (req,res) => {
    // TODO: Make sure user is a teacher who is teaching the courseId / examID
    try {
        const removedExam = await Exam.remove({_id: req.params.examID});
        res.json(removedExam);
    } catch(err) {
        res.json({message: err});
    }
});

// Update an exam
router.patch('/:examID', async (req,res) => {
    // TODO: Make sure user is a teacher who is teaching the courseId / examID
    // And validate everything
    try {
        const updatedExam = await Exam.updateOne({_id: req.params.examID}, 
            { $set: 
                { name: req.body.name, examType: req.body.examType }
            });
        res.json(updatedExam);
    } catch(err) {
        res.json({message: err});
    }
})


module.exports = router;
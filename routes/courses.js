const router = require('express').Router();
const Course = require('../models/Course');
const User = require('../models/User');
const verify = require('./verify');
const {courseValidation} = require('../validation');

// Create a new course
router.post('/create', verify, async (req,res) => {
    // Check if user is a teacher
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'teacher') return res.status(401).send('Access denied');

    // Check if teacher is already teaching a course
    const teacherExists = await Course.findOne({teacher : req.user._id});
    if(teacherExists) return res.status(403).send('Teacher already teaching a course');

    // Validate course data
    const {error} = courseValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if course already exists
    const courseExists = await Course.findOne({subject : req.body.subject.toLowerCase(), suffix : req.body.suffix});
    if(courseExists) return res.status(403).send("Course already exists");

    // Create course
    let year = new Date().getFullYear();
    const course = new Course({
        semester: req.body.semester+' '+year,
        subject: req.body.subject.toLowerCase(),
        suffix: req.body.suffix,
        teacher: user._id
    });
    try {
        const savedCourse = await course.save()
        res.json(savedCourse);
    } catch(err) {
        res.json({message: err});
    }
});

// Register for a course
router.post('/register', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('Access denied');

    // Validate course data
    const {error} = courseValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if course exists
    const courseExists = await Course.findOne({subject : req.body.subject.toLowerCase(), suffix : req.body.suffix});
    if(!courseExists) return res.status(403).send("Course does not exist");

    // Check if student is already enrolled in the course
    const course = await Course.findOne({semester : req.body.semester, subject : req.body.subject, suffix : req.body.suffix});
    if(course.students.includes(req.user._id)) return res.status(403).send('Student already enrolled in course');

    // Update course
    router.patch('/:courseId', async (req,res) => {
        try {
            const updatedCourse = await Course.updateOne({_id: course._id},
                { $push: { students: req.user._id }
                });
            res.json(updatedCourse);
        } catch(err) {
            res.json({message: err});
        }
    });
});

module.exports = router;
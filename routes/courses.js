const router = require('express').Router();
const Course = require('../models/Course');
const User = require('../models/User');
const verify = require('./verify');
const {courseValidation} = require('../validation');

// Get all courses
router.get('/', async (req,res) => {
    // TODO: Make it so that only teachers can do this?
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch(err) {
        res.json({message: err});
    }
});

// Get a specific course
router.get('/:courseId', async (req,res) => {
    try {
        // Find course
        const course = await Course.findOne({_id : req.params.courseId});
        if(!course) return res.status(400).send('Course ID does not exist');

        res.json(course);
    } catch(err) {
        res.json({message: err});
    }
});

// Get a student's courses
router.get('/student/:userId', verify, async (req,res) => {
    // TODO: Make sure student is the one getting his own course
    try {
        // Find course
        const course = await Course.find({students : req.params.userId});
        if(!course) return res.status(400).send('User ID does not exist, or user does not have any courses');

        res.json(course);
    } catch(err) {
        res.json({message: err});
    }
});

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

// Delete a specific course
router.delete('/:courseId', async (req,res) => {
    // TODO: Make sure user is a teacher who is teaching the courseId
    try {
        const removedCourse = await Course.remove({_id: req.params.courseId});
        res.json(removedCourse);
    } catch(err) {
        res.json({message: err});
    }
});

// Update a course
router.patch('/:courseId', async (req,res) => {
    // TODO: Make sure user is a teacher who is teaching the courseId
    // And validate everything
    try {
        const updatedCourse = await Course.updateOne({_id: req.params.courseId}, 
            { $set: 
                { subject: req.body.subject, suffix: req.body.suffix, teacher: req.body.teacher }
            });
        res.json(updatedCourse);
    } catch(err) {
        res.json({message: err});
    }
})

module.exports = router;
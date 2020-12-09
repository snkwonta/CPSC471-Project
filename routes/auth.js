const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verify = require('./verify');
const {registerValidation, loginValidation} = require('../validation');

// Get all users
router.get('/', async (req,res) => {
    // Currently implemented so any user can call this GET request
    // However, in a real implementation we would likely add more verification
    // But this makes it easier for us to show our API calls in the demo, etc.
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.json({message: err});
    }
});

// Register User
router.post('/register', async (req,res) => {
    // Validate data before adding user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message); // Send error message, if error

    // Check if user is already in database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already registered');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: { firstName: req.body.name.firstName, lastName: req.body.name.lastName },
        email: req.body.email,
        password: hashedPassword,
        userType: req.body.userType.toLowerCase()
    });
    try {
        const savedUser = await user.save()
        res.json(savedUser);
    } catch(err) {
        res.status(400).send(err);
    }
});

// Login User
router.post('/login', async (req,res) => {
    // Validate data before logging in user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message); // Send error message, if error

    // Check if email exists in database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exist');

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

// Delete a specific user
router.delete('/:userId', verify, async (req,res) => {
    // Check if user is a teacher
    const ctxUser = await User.findOne({_id : req.user._id});
    if(ctxUser.userType != 'teacher') return res.status(401).send('Access denied');

    // Check if given user ID exists
    const user = await User.findById(req.params.userId);
    if(!user) return res.status(404).send('User ID not found');

    try {
        const removedUser = await User.remove({_id: req.params.userId});
        res.json(removedUser);
    } catch(err) {
        res.json({message: err});
    }
});

// Update a user
router.patch('/:userId', verify, async (req,res) => {
    // Check if valid user ID
    const user = await User.findOne({_id : req.params.userId});
    if(!user) return res.status(404).send('User ID not found');

    // Check if user has same ID as provided ID
    if(req.params.userId != req.user._id) return res.status(400).send('User trying to update account they do not own');

    try {
        const updatedUser = await User.updateOne({_id: req.params.userId}, 
            { $set: 
                { email: req.body.email, userType: req.body.userType }
            });
        res.json(updatedUser);
    } catch(err) {
        res.json({message: err});
    }
})


module.exports = router;
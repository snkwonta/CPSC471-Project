const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');

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


module.exports = router;
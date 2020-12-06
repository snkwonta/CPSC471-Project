const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.json({message: err});
    }
});

// Authenticate a user
router.post('/login', async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email, password: password}, function(err, user) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        if(!user) {
            return res.status(404).send();
        }
        // else return user
        return res.status(200).send();
    });
});

// Register a user
router.post('/register', async (req,res) => {
    const user = new User({
        name: { firstName: req.body.name.firstName, lastName: req.body.name.lastName },
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType
    });
    try {
        const savedUser = await user.save()
        res.json(savedUser);
    } catch(err) {
        res.json({message: err});
    }
});

// Get a specific user
router.get('/:userId', async (req,res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(post);
    } catch(err) {
        res.json({message: err});
    }
});

// Delete a specific user
router.delete('/:userId', async (req,res) => {
    try {
        const removedUser = await Post.remove({_id: req.params.userId});
        res.json(removedUser);
    } catch(err) {
        res.json({message: err});
    }
});

// Update a user
router.patch('/:userId', async (req,res) => {
    try {
        const updatedUser = await User.updateOne({_id: req.params.userId}, 
            { $set: {name:
                { firstName: req.body.name.firstName, lastName: req.body.name.lastName } 
            }});
        res.json(updatedUser);
    } catch(err) {
        res.json({message: err});
    }
})

module.exports = router;
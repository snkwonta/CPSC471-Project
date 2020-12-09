const router = require('express').Router();
const CueCardCollection = require('../models/CueCardCollection');
const CueCard = require('../models/CueCard');
const Note = require('../models/Note');
const Course = require('../models/Course');
const User = require('../models/User');
const verify = require('./verify');
const {cueCardCollectionValidation, cueCardValidation, noteValidation} = require('../validation');

// Get all cue card collections
router.get('/cuecardcollection', async (req,res) => {
    // TODO: Make it so that only teachers can do this?
    try {
        const cueCardCollections = await CueCardCollection.find();
        res.json(cueCardCollections);
    } catch(err) {
        res.json({message: err});
    }
});

// Get a user's cue card collections
router.get('/cuecardcollection/:userId', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('User is not a student');

    try {
        const cueCardCollections = await CueCardCollection.find({createdBy: req.params.userId});
        res.json(cueCardCollections);
    } catch(err) {
        res.json({message: err});
    }
});

// Create a new cue card collection
router.post('/cuecardcollection', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('User is not a student');

    // Check if given course ID exists
    const course = await Course.findOne({_id : req.body.courseId});
    if(!course) return res.status(404).send('Course ID not found');

    // Check if user is a part of that course
    // if user.id in course.students then we good

    // Validate cue card collection data
    const {error} = cueCardCollectionValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Create cue card collection
    const cueCardCollection = new CueCardCollection({
        name: req.body.name,
        createdBy: req.user._id,
        courseId: req.body.courseId
    });

    try {
        const savedCueCardCollection = await cueCardCollection.save();
        res.json(savedCueCardCollection);
    } catch(err) {
        res.json({message: err});
    }
});

// Delete a specific cue card collection
router.delete('/cuecardcollection/:collectionId', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('User is not a student');

    // Verify cue card collection ID
    const cueCardCollection = await CueCardCollection.findOne({_id : req.params.collectionId});
    if(!cueCardCollection) return res.status(404).send('Cue card collection ID not found');

    // Check if user created this cue card collection
    if(cueCardCollection.createdBy != req.user._id) return res.status(400).send('User does now own this collection');

    // Delete all cue cards inside this collection
    try {
        cueCardCollection.cueCards.forEach(async(cardId) => {
            await CueCard.remove({_id: cardId});
        });
    } catch(err) {
        console.log(err);
    }

    try {
        const removedCueCardCollection = await CueCardCollection.remove({_id: req.params.collectionId});
        res.json(removedCueCardCollection);
    } catch(err) {
        res.json({message: err});
    }
});

// Update a cue card collection
router.patch('/cuecardcollection/:collectionId', verify, async (req,res) => {
    // Verify cue card collection ID
    const cueCardCollection = await CueCardCollection.findOne({_id : req.params.collectionId});
    if(!cueCardCollection) return res.status(404).send('Cue card collection ID not found');

    try {
        const updatedCueCardCollection = await CueCardCollection.updateOne({_id: req.params.collectionId}, 
            { $set: { name: req.body.name }});
        res.json(updatedCueCardCollection);
    } catch(err) {
        res.json({message: err});
    }
});


// Get all cue cards
router.get('/cuecard', async (req,res) => {
    // TODO: Make it so that only teachers can do this?
    try {
        const cueCards = await CueCard.find();
        res.json(cueCards);
    } catch(err) {
        res.json({message: err});
    }
});

// Create a new cue card
router.post('/cuecard', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('User is not a student');

    // Check if given cue card collection ID exists
    const cueCardCollection = await CueCardCollection.findOne({_id : req.body.collectionId});
    if(!cueCardCollection) return res.status(404).send('Cue card collection ID not found');

    // Validate cue card data
    let {error} = cueCardValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Create cue card
    const cueCard = new CueCard({
        question: req.body.question,
        answer: req.body.answer,
        collectionId: req.body.collectionId
    });

    // Update cue card collection
    await CueCardCollection.updateOne({_id: req.body.collectionId},
        { $push: { cueCards: cueCard._id }
        });
    
    try {
        const savedCueCard = await cueCard.save();
        res.json(savedCueCard);
    } catch(err) {
        res.json({message: err});
    }
});

// Delete a specific cue card
router.delete('/cuecard/:cardId', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('User is not a student');

    // Verify cue card ID
    const cueCard = await CueCard.findOne({_id : req.params.cardId});
    if(!cueCard) return res.status(404).send('Cue card ID not found');

    // TODO: Check if user created this cue card

    try {
        const removedCueCard = await CueCard.remove({_id: req.params.cardId});
        res.json(removedCueCard);
    } catch(err) {
        res.json({message: err});
    }
});

// Update a cue card
router.patch('/cuecard/:cardId', verify, async (req,res) => {
    // Verify cue card collection ID
    const cueCard = await CueCard.findOne({_id : req.params.cardId});
    if(!cueCard) return res.status(404).send('Cue card ID not found');

    try {
        const updatedCueCard = await CueCard.updateOne({_id: req.params.cardId}, 
            { $set: { question: req.body.question, answer: req.body.answer }});
        res.json(updatedCueCard);
    } catch(err) {
        res.json({message: err});
    }
});

// Get all notes
router.get('/note', async (req,res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch(err) {
        res.json({message: err});
    }
});

// Create a new note
router.post('/note', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('User is not a student');

    // Check if given course ID exists
    const course = await Course.findOne({_id : req.body.courseId});
    if(!course) return res.status(404).send('Course ID not found');

    // Validate note card data
    let {error} = noteValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Create note
    const note = new Note({
        name: req.body.name,
        text: req.body.text,
        courseId: req.body.courseId,
        createdBy: req.user._id
    });

    try {
        const savedNote = await note.save();
        res.json(savedNote);
    } catch(err) {
        res.json({message: err});
    }
});

// Delete a specific note
router.delete('/note/:noteId', verify, async (req,res) => {
    // Check if user is a student
    const user = await User.findOne({_id : req.user._id});
    if(user.userType != 'student') return res.status(401).send('User is not a student');

    // Verify note ID
    const note = await Note.findOne({_id : req.params.noteId});
    if(!note) return res.status(404).send('Note ID not found');

    // Check if user created this note
    if(cueCardCollection.createdBy != req.user._id) return res.status(400).send('User does now own this note');

    try {
        const removedNote = await Note.remove({_id: req.params.noteId});
        res.json(removedNote);
    } catch(err) {
        res.json({message: err});
    }
});

// Update a note
router.patch('/note/:noteId', verify, async (req,res) => {
    // Verify cue card collection ID
    const note = await Note.findOne({_id : req.params.noteId});
    if(!note) return res.status(404).send('Note ID not found');

    try {
        const updatedNote = await Note.updateOne({_id: req.params.noteId}, 
            { $set: { name: req.body.name, text: req.body.text }});
        res.json(updatedNote);
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router;
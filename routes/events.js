const router = require('express').Router();
const Event = require('../models/Event');
const verify = require('./verify');

// Get all events
router.get('/', async (req,res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch(err) {
        res.json({message: err});
    }
});

// Get a specific event
router.get('/:eventId', verify, async (req,res) => {
    try {
        // Find event
        const event = await Event.findOne({_id : req.params.eventId});
        if(!event) return res.status(400).send('Event ID does not exist');

        res.json(event);
    } catch(err) {
        res.json({message: err});
    }
});

// Delete a specific event
router.delete('/:eventId', async (req,res) => {
    try {
        const removedEvent = await Event.remove({_id: req.params.eventId});
        res.json(removedEvent);
    } catch(err) {
        res.json({message: err});
    }
});

// Update an event
router.patch('/:eventId', async (req,res) => {
    try {
        const updatedEvent = await Event.updateOne({_id: req.params.eventId}, 
            { $set: 
                { dateDue: req.body.dateDue }
            });
        res.json(updatedEvent);
    } catch(err) {
        res.json({message: err});
    }
})

module.exports = router;
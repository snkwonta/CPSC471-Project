const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

// Import Routes
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const examsRoute = require('./routes/exams');
const coursesRoute = require('./routes/courses');
const eventsRoute = require('./routes/events');
const notesRoute = require('./routes/notes');

// Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log('Connected to DB')
);

app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());
// Route Middlewares
app.use('/users', usersRoute);
app.use('/api/user', authRoute);
app.use('/api/exams', examsRoute);
app.use('/api/courses', coursesRoute);
app.use('/api/events', eventsRoute);
app.use('/api/notes', notesRoute);

// Routes
app.get('/', (req,res) => {
    res.send('Homepage');
    // res.render('index');
});

// Listening on port 3000
app.listen(3000, () => console.log('Server is running'));
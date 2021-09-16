// require('express') returns a function
const express = require('express');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie-rental')
    .then(() => console.log("Connected to db"))
    .catch(err => console.error("Could not connect to mongoDB"));


// express() returns an object of type express
// By convention we call this object, app which represents our application
const app = express();

// Joi makes it really easy to validate the input and return proper error messages to the client
const Joi = require('joi');

// Adding a piece of middleware to allow parsing of JSON objects
app.use(express.json());
// For all URL's that start with /, use the home router
app.use('/', home);
// For all URL's that start with /api/genres, use the genres router
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

// PORT
// If we have an env var named port, use it! Otherwise, use an arbitraty number for your development machine
const port = process.env.PORT || 3000;

// the callback function is called when the application starts listening on the given port
app.listen(port, (req,res)=>{
    console.log(`Listening on port ${port}`);
});



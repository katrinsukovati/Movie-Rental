const express = require('express');
const { string } = require('joi');
// Joi makes it really easy to validate the input and return proper error messages to the client
const Joi = require('joi');
// Cannot use app since we are working within different files
// Thus, we create a router
const router = express.Router();
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');


// Express gives our application a strucutre
// A get request to access all the genres
router.get('/', async (req,res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// A get request to access a specific genre
router.get('/:id', async (req,res) => {

    const genre = await Genre.findById(req.params.id);

    // If the genre doesnt exist, send a 404 error (not found)
    if (!genre) return res.status(404).send("That genre is not available!");

    res.send(genre);

});

// A post request to create a new genre
router.post('/', async (req,res) => {

    // Error handling to check if genre exists
    const {error} = validateGenre(req.body);

    // If invalid, send error details
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre ({
        // id is set by the db automatically 
        // We need to read the name from the body of the request
        name: req.body.name
    });

    genre = await genre.save()
    res.send(genre);
});

router.put('/:id', async (req,res) => {
    const {error} = validateGenre(req.body);

    // 400 bad request
    if (error) return res.status(400).send(error.details[0].message); 

    // Look up the genre
    // If it doesnt exist, return 404
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });

    if (!genre) return res.status(404).send("That genre does not exist");

    // return the updated genre
    res.send(genre);
});

router.delete('/:id', async (req,res)=>{

    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send("That genre does not exist");

    // Delete the genre

    res.send(genre);

});


module.exports = router;
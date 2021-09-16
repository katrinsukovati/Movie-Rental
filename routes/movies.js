const {Movie, validate} = require('../models/movie'); 
const {Genre} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

// creating a new movie
router.post('/', async (req, res) => {
    //validating the object that we sent in the request 
    // if its invalid, we send a 400 error
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // find the genre by id, and if it doesnt exist, we return the 400 error
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  // create a movie object
  let movie = new Movie({ 
    title: req.body.title,
    // complex object with 2 properties that we read both from genre
    // we cant do just genre, since it has a bunch of other properties
    // thus, we selcted which properties we want
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();
  
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

module.exports = router; 
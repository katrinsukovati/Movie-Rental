const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');

// Express gives our application a strucutre
// A get request to access all the genres
router.get('/', async (req,res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// A get request to access a specific genre
router.get('/:id', async (req,res) => {

    const customer = await Customer.findById(req.params.id);

    // If the genre doesnt exist, send a 404 error (not found)
    if (!customer) return res.status(404).send("That customer is not available!");

    res.send(customer);

});


// A post request to create a new genre
router.post('/', async (req,res) => {

    // Error handling to check if genre exists
    const {error} = validate(req.body);

    // If invalid, send error details
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer ({
        // id is set by the db automatically 
        // We need to read the name from the body of the request
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save()
    res.send(customer);
});

router.put('/:id', async (req,res) => {
    const {error} = validate(req.body);

    // 400 bad request
    if (error) return res.status(400).send(error.details[0].message); 

    // Look up the customer
    // If it doesnt exist, return 404
    const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });

    if (!customer) return res.status(404).send("That customer does not exist");

    // return the updated genre
    res.send(customer);
});

router.delete('/:id', async (req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("That customer does not exist");
    res.send(customer);
});


module.exports = router;
const express = require('express');
// Cannot use app since we seperated the routes in different modules
// Thus, we create a router 
// express.Router() returns a router object
const router = express.Router();

// We define new routes
// Express gives our application a strucutre
router.get('/', (req,res) => {
    res.send("Hello! Welcome to my movie rental application!");
});

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Service = require('../models/service');

// New endpoint for creating a service
router.post('/', auth, async (req, res) => {
    try {
        //Get the usrId from the authenticated token
        const userId = req.user.userId;
        // Get the data from the request body
        const {serviceName, description, multipleOptions, options} = req.body;
        //Create a new service document using the service model
        const newService = new Service({
            userId,
            serviceName,
            description,
            multipleOptions,
            options,
        });

        // Save the new service to the database
        await newService.save();
        res.status(201).json({message: 'Service created successfully', service: newService});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
        }
    });

// A simple test route to ensure it works
router.get('/', (req, res) => {
    res.send('Services route is working!');
});

module.exports = router;
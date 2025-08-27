const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Service = require('../models/service');

// Endpoint to get all services for a logged-in user
router.get('/',auth,async (req,res)=>{
    try{
        const userId = req.user.userId;
        const services = await Service.find({userId}).lean();
        res.status(200).json({services});
    } catch (err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
})

//endpoint for creating a service
router.post('/', auth, async (req, res) => {
    try {
        //Get the usrId from the authenticated token
        const userId = req.user.userId;
        // Get the data from the request body
        const {serviceName, description, multipleOptions, options} = req.body;

        //validate required fields
        if (!serviceName || !serviceName.trim()) {
            return res.status(400).json({message: 'Service name is required'});
        }

        if(!options || options.length === 0){
            return res.status(400).json({message: 'At least one option is required'});
        }

        //validate each option has required fields
        for(let i=0; i< options.length; i++){
            const option = options[i];
            if(!option.name || !option.name.trim()){
                return res.status(400).json({message: `Option ${i+1} name is required`});
            }
            if (!option.duration || !option.duration.trim()) {
                return res.status(400).json({message: `Option ${i+1} duration is required`});
            }
            if (!option.price || !option.price.trim()) {
                return res.status(400).json({message: `Option ${i+1} price is required`});
            }
        }

        //Create a new service document using the service model
        const newService = new Service({
            userId,
            serviceName,
            description,
            multipleOptions,
            options,
            available: true,
        });

        // Save the new service to the database
        await newService.save();
        res.status(201).json({message: 'Service created successfully', service: newService});

    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            res.status(400).json({message: err.message});
        }
        res.status(500).json({message: 'Server error'});
        }
    });

// A simple test route to ensure it works
router.get('/', (req, res) => {
    res.send('Services route is working!');
});

//endpoint to update a service (for both availability toggle and full service update)
router.put('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const serviceId = req.params.id;

        //Check if this is a simple availability toggle or a full service update
        if (Object.keys(req.body).length === 1 && 'available' in req.body) {
            const {available} = req.body;

            const updatedService = await Service.findOneAndUpdate(
                {_id: serviceId, userId: userId},
                {available},
                {new:true}
            );

            if(!updatedService){
                return res.status(404).json({message: 'Service not found or you are not authorized to edit it.'});
            }

            return res.status(200).json({message: 'Service updated successfully', service: updatedService});
        } else{
            const {serviceName, description, multipleOptions, options} = req.body;

            //validate required fields
            if (!serviceName || !serviceName.trim()) {
                return res.status(400).json({message: 'Service name is required'});
            }
            if(!options || options.length === 0){
                return res.status(400).json({message: 'At least one option is required'});
            }
            //validate each option has required fields
            for(let i=0; i< options.length; i++){
                const option = options[i];
                if(!option.name || !option.name.trim()){
                    return res.status(400).json({message: `Option ${i+1} name is required`});
                }
                if (!option.duration || !option.duration.trim()) {
                    return res.status(400).json({message: `Option ${i+1} duration is required`});
                }
                if (!option.price || !option.price.trim()) {
                    return res.status(400).json({message: `Option ${i+1} price is required`});
                }
            }
        }

        //Update the service document
        const updatedService = await Service.findOneAndUpdate(
            {_id: serviceId, userId: userId },
            {
                serviceName,
                description,
                multipleOptions,
                options
            },
            {new: true}
        );

        if (!updatedService) {
            return res.status(404).json({message: 'Service not found or you are not authorized to edit it.'});
        }

        return res.status(200).json({message: 'Service updated successfully', service: updatedService});

    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

//endpoint to delete a service
router.delete('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const serviceId = req.params.id;

        const result = await Service.findOneAndDelete({
            _id: serviceId,
            userId: userId
        });

        if(!result){
            return res.status(404).json({message: 'Service not found or you are not authorized to delete it.'});
        }

        res.status(200).json({message: 'Service deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;
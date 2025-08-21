const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.put('/profile', auth, async(req, res)=>{
    try{
        const{firstName,lastName, selectedServices, teamSize}=req.body;
        //find the user by their ID from the decoded token
        const user = await User.findById(req.user.userId);

        if(!user){
            return res.status(404).json({message: 'User not found' });
        }

        //Update the user's profile information
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.selectedServices = selectedServices || user.selectedServices;
        user.teamSize = teamSize || user.teamSize;

        await user.save();
        res.json({message: 'Profile updated successfully', user});
    } catch (err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports=router;
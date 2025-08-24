const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    // Defines the destination directory for uploaded files.
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/profiles/');
    },
    //Defines the name of the file on the server
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, req.user.userId + '-' + uniqueSuffix + fileExtension);
    }
});

//Create the multer upload instance with the storage configuration
const upload = multer({ storage: storage });

// new endpoint for profile picture upload
router.put('/profile/picture', auth, upload.single('profilePic'), async (req,res) =>{
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({message: 'User not found' });
        }

        // check if a file was successfully uploaded by Multer
        if(!req.file){
            return res.status(400).json({message: 'No file uploaded' });
        }

        // Save the public path to the uploaded file in the user's database document.
        user.profilePic = '/uploads/profiles/${req.file.filename}';
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            profilePic: user.profilePic
        });
    } catch (err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

// existing endpoint for profile details
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

// Endpoint: Handle salon information
router.put('/profile/business-info', auth, async(req, res)=>{
    try{
        const{salonName, salonLocation} = req.body;

        //Find the user by their ID from the decoded token
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        // Update the user's salon information
        user.salonName= salonName;
        user.salonLocation= salonLocation;

        await user.save();
        res.json({message: 'Salon information updated successfully', user});
    } catch (err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports=router;
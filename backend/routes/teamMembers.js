const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TeamMember = require('../models/teamMember');

// get all team members for the authenticated user
router.get('/', auth, async (req,res) =>
{
    try{
        const members = await TeamMember.find({userId: req.user.userId}); // Fix: Use userId instead of id
        res.status(200).json({members});
    } catch (error){
        console.error('Error fetching team members:', error);
        res.status(500).json({message: 'Server error. Failed to fetch team members.'});
    }
});

//POST a new team member
router.post('/', auth, async (req, res) => {
    try {
        const newMember = new TeamMember({
            ...req.body,
            userId: req.user.userId // Fix: Use userId instead of id
        });

        await newMember.save();
        res.status(201).json({message: 'Team member added successfully', member: newMember});
    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).json({message: 'Server error. Failed to add team member.'});
    }
});

// PUT (update) an existing team member by ID
router.put('/:id', auth, async(req, res) => {
    const {id} = req.params;
    try{
        const member = await TeamMember.findOneAndUpdate(
            {_id:id, userId: req.user.userId}, // Fix: Use userId instead of id
            req.body,
            {new: true, runValidators: true}
        );

        if(!member){
            return res.status(404).json({message: 'Team member not found or you are not authorized to update it.'});
        }

        res.status(200).json({message: 'Team member updated successfully', member});
    }catch (error){
        console.error('Error updating team member:', error);
        res.status(500).json({message: 'Server error. Failed to update team member.'});
    }
});

// Delete a team number by ID
router.delete('/:id', auth, async (req, res) =>{
    const {id} = req.params;
    try {
        const member = await TeamMember.findOneAndDelete({_id: id, userId: req.user.userId }); // Fix: Use userId instead of id

        if(!member){
            return res.status(404).json({message: 'Team member not found or you are not authorized to delete it.'});
        }

        res.status(200).json({message: 'Team member deleted successfully!'});
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({message: 'Server error. Failed to delete team member.'});
    }
});

module.exports = router;
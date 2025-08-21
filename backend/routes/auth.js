const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Identify or create a user by email, return JWT
router.post('/identify', async (req, res) => {
  const { email, firstName, lastName, selectedServices, teamSize } = req.body || {};
  console.log('[auth] identify request body:', req.body);
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    console.log('[auth] Looking for user with email:', email);
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('[auth] Found existing user:', user._id);
      const token = jwt.sign(
        {userId: user._id, email: user.email},
        JWT_SECRET,
        {expiresIn:'1h'}
      );
      return res.json({message: 'Login successful', token});

    } else {
      console.log('[auth] User not found, creating new user...');
      // Case 2: New User (First-time login/onboarding)
      // Create a new user account.
      user = new User({ 
        email, 
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        selectedServices: selectedServices || [],
        teamSize: teamSize || undefined
      });
      console.log('[auth] About to save user:', user);
      
      const savedUser = await user.save();
      console.log('[auth] User saved successfully:', savedUser._id, savedUser.email);

      // Generate a token for the new user.
      const token = jwt.sign(
          { userId: savedUser._id, email: savedUser.email }, 
          JWT_SECRET,
          { expiresIn: '1h' }
      );

      // Respond with the token. The frontend will use this to
      // redirect to the onboarding flow (/welcome).
      return res.status(201).json({ message: 'User created and logged in', token, user: { id: savedUser._id, email: savedUser.email } });
    }

  }catch (error) {
        console.error('Error in identify endpoint:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile information
router.put('/profile', async (req, res) => {
  const { email, firstName, lastName, selectedServices, teamSize } = req.body || {};
  console.log('[auth] profile update request body:', req.body);
  
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    console.log('[auth] Looking for user to update with email:', email);
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (selectedServices !== undefined) user.selectedServices = selectedServices;
    if (teamSize !== undefined) user.teamSize = teamSize;

    console.log('[auth] About to update user:', user);
    const updatedUser = await user.save();
    console.log('[auth] User updated successfully:', updatedUser._id, updatedUser.email);

    res.json({ 
      message: 'Profile updated successfully', 
      user: { 
        id: updatedUser._id, 
        email: updatedUser.email, 
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        selectedServices: updatedUser.selectedServices,
        teamSize: updatedUser.teamSize
      } 
    });

  } catch (error) {
    console.error('Error in profile update endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

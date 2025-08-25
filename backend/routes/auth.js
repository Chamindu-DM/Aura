const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Identify or create a user by email, return JWT
router.post('/identify', async (req, res) => {
    const { email } = req.body;
    console.log('[auth] identify request body:', req.body);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        console.log('[auth] Looking for user with email:', email);
        let user = await User.findOne({email});

        if (user) {
            // User exists. Send a flag to the frontend.
            console.log('[auth] Found existing user:', user._id)
            return res.status(200).json({message: 'User exists', isNewUser: false});
        } else {
            // User does not exist. Send a flag to the frontend.
            console.log('[auth] User not found, creating new user...');
            return res.status(200).json({message: 'User is new', isNewUser: true});
        }
    } catch (error) {
        console.error('Error in identify endpoint:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sign up a new user with email and password
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    if (password.length < 8 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)) {
        return res.status(400).json({ message: 'Password does not meet strength requirements' });
    }

    try{
        let user = await User.findOne({email});
        if (user) {
            return res.status(409).json({message: 'User with that email already exists. Please log in instead.'});
        }
        user = new User({email, password});
        const savedUser = await user.save();

        const token = jwt.sign(
            { userId: savedUser._id, email: savedUser.email },
            JWT_SECRET,
            {expiresIn: '7d'} // Changed to match frontend cookie expiry
        );

        res.status(201).json({message: 'User created successfully', token});
    } catch (err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

// Login an existing user with email and password
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('[auth] login request for email:', email);

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            console.log('[auth] User not found:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('[auth] Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('[auth] Login successful for user:', user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            onboardingCompleted: user.onboardingCompleted,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('Error in login endpoint:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
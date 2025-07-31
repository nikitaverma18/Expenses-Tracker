// routes/userRoutes.js

const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, password, expenseType } = req.body;
        const existingUser = await User.findOne({ name });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ name, password, expenseType });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

module.exports = router;

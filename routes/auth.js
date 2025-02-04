const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { user: { id: userId } },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { user: { id: userId } },
        process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, surname, username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            surname,
            username,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;

        await user.save();

        const userData = {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json({ 
            accessToken,
            refreshToken,
            data: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);
        
        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        const userData = {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json({ 
            accessToken,
            refreshToken,
            data: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key'
        );

        // Find user with this refresh token
        const user = await User.findOne({ 
            _id: decoded.user.id,
            refreshToken: refreshToken 
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
        
        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save();

        const userData = {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            data: userData
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', auth, async (req, res) => {
    try {
        // Clear refresh token in database
        await User.findByIdAndUpdate(req.user.user.id, { refreshToken: null });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile (/me endpoint)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.user.id).select('-password -refreshToken');
        const userData = {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.json({ data: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
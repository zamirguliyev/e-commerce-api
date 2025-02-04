const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../config/emailConfig');

// Helper function to save base64 image
const saveBase64Image = (base64String, userId) => {
    // Create uploads/profiles directory if it doesn't exist
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Extract image format and base64 data
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    const imageFormat = matches[1];
    const base64Data = matches[2];

    // Validate image format
    if (!['jpeg', 'jpg', 'png'].includes(imageFormat.toLowerCase())) {
        throw new Error('Invalid image format. Only JPEG, JPG, and PNG are allowed');
    }

    // Generate unique filename
    const fileName = `profile-${userId}-${Date.now()}.${imageFormat}`;
    const filePath = path.join(uploadDir, fileName);

    // Save the file
    fs.writeFileSync(filePath, base64Data, 'base64');

    return `/uploads/profiles/${fileName}`;
};

// Get all users with pagination and search (admin only)
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        const admin = await User.findById(req.user._id);
        if (!admin.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search parameters
        const keyword = req.query.keyword || '';
        const searchQuery = keyword ? {
            $or: [
                { username: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
                { name: { $regex: keyword, $options: 'i' } },
                { surname: { $regex: keyword, $options: 'i' } }
            ]
        } : {};

        // Get total count for pagination
        const totalUsers = await User.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalUsers / limit);

        // Get users with pagination and search
        const users = await User.find(searchQuery)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Format response
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            status: user.status,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.json({
            data: formattedUsers,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user's own profile
router.put('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Handle profile image update
        if (req.body.profileImage) {
            // Delete old profile image if exists
            if (user.profileImage) {
                const oldImagePath = path.join(__dirname, '..', user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            try {
                const imagePath = saveBase64Image(req.body.profileImage, req.user._id);
                user.profileImage = imagePath;
            } catch (imageError) {
                return res.status(400).json({ message: 'Invalid image format. Image must be in base64 format.' });
            }
        }

        // Update other fields
        const updates = ['name', 'surname', 'email'];
        updates.forEach(update => {
            if (req.body[update]) {
                user[update] = req.body[update];
            }
        });

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments();
        const users = await User.find()
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID (admin only)
router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user (admin only)
router.put('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = ['name', 'surname', 'email'];
        updates.forEach(update => {
            if (req.body[update]) {
                user[update] = req.body[update];
            }
        });

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user status (admin only)
router.patch('/users/:id/status', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { status } = req.body;
        if (!['active', 'inactive', 'banned'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        user.status = status;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change password route
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }

        // Check if current password is correct
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Cari şifrə yanlışdır' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Şifrə uğurla yeniləndi' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Şifrə yeniləmə zamanı xəta baş verdi' });
    }
});

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, surname, email, password, profileImage } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            surname,
            email,
            password
        });

        // Handle profile image if provided
        if (profileImage) {
            const imagePath = saveBase64Image(profileImage, 'profiles');
            user.profileImage = imagePath;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(email, name);

        // Create token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save reset code and expiration
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(email, resetCode);

        res.json({ message: 'Password reset code has been sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset password with code
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset fields
        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
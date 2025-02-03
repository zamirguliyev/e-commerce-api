const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User's first name
 *         surname:
 *           type: string
 *           description: User's last name
 *         username:
 *           type: string
 *           description: Unique username
 *         email:
 *           type: string
 *           description: Unique email address
 *         isAdmin:
 *           type: boolean
 *           description: Whether user is an admin
 *         status:
 *           type: string
 *           description: User account status
 *         profileImage:
 *           type: string
 *           description: User's profile image URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of users with pagination and search functionality. Only accessible by admin users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for username, email, name, or surname
 *     responses:
 *       200:
 *         description: List of users with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                     totalUsers:
 *                       type: integer
 *                       description: Total number of users
 *                     hasNextPage:
 *                       type: boolean
 *                       description: Whether there is a next page
 *                     hasPrevPage:
 *                       type: boolean
 *                       description: Whether there is a previous page
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

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

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user's own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 description: Base64 encoded image string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Username or email already exists
 *       401:
 *         description: Unauthorized
 */

// Update user's own profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, surname, username, email, profileImage } = req.body;
        const userId = req.user._id;

        // Check if username is taken by another user
        if (username) {
            const existingUsername = await User.findOne({ 
                username, 
                _id: { $ne: userId } 
            });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        // Check if email is taken by another user
        if (email) {
            const existingEmail = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Update user profile
        const updateData = {};
        if (name) updateData.name = name;
        if (surname) updateData.surname = surname;
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        if (profileImage) {
            try {
                // Delete old profile image if exists
                if (req.user.profileImage) {
                    const oldImagePath = path.join(__dirname, '..', req.user.profileImage);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                const imagePath = saveBase64Image(profileImage, userId);
                updateData.profileImage = imagePath;
            } catch (imageError) {
                return res.status(400).json({ message: 'Invalid image format' });
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
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
        };

        res.json({ data: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Update user status (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, banned]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Admin only.
 *       404:
 *         description: User not found
 */

// Update user status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        // Check if user is admin
        const admin = await User.findById(req.user._id);
        if (!admin.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { status } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
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
        };

        res.json({ data: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
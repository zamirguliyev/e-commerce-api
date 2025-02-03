const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * /api/comments/{productId}:
 *   post:
 *     summary: Create a new comment for a product
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - rating
 *             properties:
 *               comment:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Unauthorized
 */
router.post('/:productId', auth, async (req, res) => {
    try {
        const { comment, rating } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const newComment = new Comment({
            product: req.params.productId,
            user: req.user.id,
            comment,
            rating
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/comments/{productId}:
 *   get:
 *     summary: Get all comments for a product with pagination
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of comments with pagination info
 *       500:
 *         description: Server error
 */
router.get('/:productId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalComments = await Comment.countDocuments({ product: req.params.productId });
        const totalPages = Math.ceil(totalComments / limit);
        
        const comments = await Comment.find({ product: req.params.productId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        res.json({
            comments,
            currentPage: page,
            totalPages,
            totalComments,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the comment owner
 *       404:
 *         description: Comment not found
 */
router.put('/:commentId', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own comments' });
        }

        const { comment: newComment, rating } = req.body;
        
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        comment.comment = newComment || comment.comment;
        comment.rating = rating || comment.rating;

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the comment owner or admin
 *       404:
 *         description: Comment not found
 */
router.delete('/:commentId', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const isOwner = comment.user.toString() === req.user.id;
        const userIsAdmin = req.user.role === 'admin';

        if (!isOwner && !userIsAdmin) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

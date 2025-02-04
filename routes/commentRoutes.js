const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

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

router.get('/:productId', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalComments = await Comment.countDocuments({ product: req.params.productId });
        const totalPages = Math.ceil(totalComments / limit);
        
        const comments = await Comment.find({ product: req.params.productId })
            .populate({
                path: 'user',
                select: 'name surname email profileImage',
                transform: doc => ({
                    _id: doc._id,
                    fullName: `${doc.name} ${doc.surname}`.trim(),
                    email: doc.email,
                    profileImage: doc.profileImage
                })
            })
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

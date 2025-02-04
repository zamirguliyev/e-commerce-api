const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Check if product already exists in wishlist
        const existingItem = await Wishlist.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Product already exists in wishlist' });
        }

        const wishlistItem = new Wishlist({
            user: req.user._id,
            product: productId
        });

        await wishlistItem.save();
        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = Math.min(parseInt(limit), 50);

        const total = await Wishlist.countDocuments({ user: req.user._id });
        const totalPages = Math.ceil(total / limitNumber);
        const skip = (pageNumber - 1) * limitNumber;

        const items = await Wishlist.find({ user: req.user._id })
            .populate('product')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.json({
            items,
            pagination: {
                total,
                page: pageNumber,
                pages: totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:productId', auth, async (req, res) => {
    try {
        const result = await Wishlist.findOneAndDelete({
            user: req.user._id,
            product: req.params.productId
        });

        if (!result) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        res.json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

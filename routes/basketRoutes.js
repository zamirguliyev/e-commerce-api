const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Basket = require('../models/Basket');
const Product = require('../models/Product');

// Get user's basket
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = Math.min(parseInt(limit), 50);

        const total = await Basket.countDocuments({ user: req.user._id });
        const totalPages = Math.ceil(total / limitNumber);
        const skip = (pageNumber - 1) * limitNumber;

        const items = await Basket.find({ user: req.user._id })
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

// Add item to basket
router.post('/', auth, async (req, res) => {
    try {
        const { productId } = req.body;

        // Check if product already exists in basket
        const existingItem = await Basket.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Product already exists in basket' });
        }

        const basketItem = new Basket({
            user: req.user._id,
            product: productId
        });

        await basketItem.save();
        res.status(201).json(basketItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove item from basket
router.delete('/:productId', auth, async (req, res) => {
    try {
        const result = await Basket.findOneAndDelete({
            user: req.user._id,
            product: req.params.productId
        });

        if (!result) {
            return res.status(404).json({ message: 'Product not found in basket' });
        }

        res.json({ message: 'Product removed from basket successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

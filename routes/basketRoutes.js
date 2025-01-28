const express = require('express');
const router = express.Router();
const Basket = require('../models/Basket');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Basket:
 *       type: object
 *       required:
 *         - user
 *         - product
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         user:
 *           type: string
 *           description: User ID who owns this basket item
 *         product:
 *           type: string
 *           description: Product ID in the basket
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/basket:
 *   post:
 *     summary: Add product to basket
 *     description: Add a product to the authenticated user's basket
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add to basket
 *     responses:
 *       201:
 *         description: Product added to basket successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Basket'
 *       400:
 *         description: Product already in basket or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   get:
 *     summary: Get user's basket
 *     description: Get all products in the authenticated user's basket
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of basket items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Basket'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

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

/**
 * @swagger
 * /api/basket/{productId}:
 *   delete:
 *     summary: Remove product from basket
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID to remove from basket
 *     responses:
 *       200:
 *         description: Product removed from basket successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
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

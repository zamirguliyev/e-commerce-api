const express = require('express');
const router = express.Router();
const Basket = require('../models/Basket');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/basket:
 *   post:
 *     summary: Add product to basket
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
 *       400:
 *         description: Product already in basket
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

/**
 * @swagger
 * /api/basket:
 *   get:
 *     summary: Get user's basket items with pagination
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of basket items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       product:
 *                         $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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

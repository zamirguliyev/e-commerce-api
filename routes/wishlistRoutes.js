const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
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
 *                 description: ID of the product to add to wishlist
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully
 *       400:
 *         description: Product already in wishlist
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
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

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist items with pagination
 *     tags: [Wishlist]
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
 *         description: List of wishlist items
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

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
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

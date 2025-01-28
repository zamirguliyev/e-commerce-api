const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

// Helper function to handle base64 image
const saveBase64Image = (base64String, folder = 'uploads') => {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    // Extract image format and base64 data
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    const imageFormat = matches[1];
    const base64Data = matches[2];

    // Check if it's an allowed format
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(imageFormat.toLowerCase())) {
        throw new Error('Only jpg, jpeg, png, and gif formats are allowed');
    }

    // Generate filename and path
    const fileName = `${Date.now()}.${imageFormat}`;
    const filePath = path.join(folder, fileName);

    // Save the file
    fs.writeFileSync(filePath, base64Data, 'base64');
    
    return filePath;
};

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads', { recursive: true });
        }
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Middleware to handle file uploads conditionally
const handleFileUpload = (req, res, next) => {
    // Check if the request contains files
    if (req.is('multipart/form-data')) {
        return upload.fields([
            { name: 'coverImage', maxCount: 1 },
            { name: 'images', maxCount: 5 }
        ])(req, res, next);
    }
    next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           description: Product price
 *         category:
 *           type: string
 *           description: Category ID
 *         coverImage:
 *           type: string
 *           description: Cover image path or base64 string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional product images (paths or base64 strings)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: Smartphone
 *         description: Latest model smartphone
 *         price: 999.99
 *         category: 60d725b3e6c8b32b3c7c7b1e
 *         coverImage: uploads/cover-123.jpg
 *         images: [uploads/image1.jpg, uploads/image2.jpg]
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with images. Requires admin access. Accepts both multipart/form-data and application/json with base64 images.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 description: Base64 encoded image string (data:image/format;base64,...)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Base64 encoded image strings
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products with pagination and optional category filter
 *     description: Retrieve a paginated list of products. Can be filtered by category ID.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Category ID to filter products
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (starts from 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page (max 50)
 *     responses:
 *       200:
 *         description: Paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const { categoryId, page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = Math.min(parseInt(limit), 50); // Cap at 50 items per page
        
        let query = {};
        if (categoryId) {
            query.category = categoryId;
        }

        // Get total count for pagination
        const total = await Product.countDocuments(query);
        
        // Calculate pagination values
        const totalPages = Math.ceil(total / limitNumber);
        const skip = (pageNumber - 1) * limitNumber;
        
        // Get products for current page
        const products = await Product.find(query)
            .populate('category')
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limitNumber);

        // Prepare pagination info
        const pagination = {
            total,
            page: pageNumber,
            pages: totalPages,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        };

        res.json({
            products,
            pagination
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve detailed information about a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update a product's information and images. Requires admin access. Accepts both multipart/form-data and application/json with base64 images.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               price:
 *                 type: number
 *                 description: Product price
 *               category:
 *                 type: string
 *                 description: Category ID
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Main product image
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional product images (max 5)
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               price:
 *                 type: number
 *                 description: Product price
 *               category:
 *                 type: string
 *                 description: Category ID
 *               coverImage:
 *                 type: string
 *                 description: Base64 encoded image string (data:image/format;base64,...)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Base64 encoded image strings
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', adminAuth, handleFileUpload, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields from request body
        Object.assign(product, req.body);

        if (req.files) {
            // Handle multipart/form-data file uploads
            if (req.files['coverImage']) {
                product.coverImage = req.files['coverImage'][0].path;
            }
            if (req.files['images']) {
                product.images = req.files['images'].map(file => file.path);
            }
        } else {
            // Handle base64 images
            if (product.coverImage && product.coverImage.startsWith('data:image')) {
                product.coverImage = saveBase64Image(product.coverImage);
            }
            
            if (Array.isArray(product.images)) {
                product.images = await Promise.all(
                    product.images
                        .filter(img => img && img.startsWith('data:image'))
                        .map(img => saveBase64Image(img))
                );
            }
        }

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product and its associated images. Requires admin access.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

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

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const keyword = req.query.keyword || '';
        const sort = req.query.sort || ''; // price:asc or price:desc
        
        // Build query
        const query = {};
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' }; // case-insensitive search
        }

        // Build sort object
        let sortOptions = {};
        if (sort) {
            if (sort === 'asc') {
                sortOptions.price = 1;
            } else if (sort === 'desc') {
                sortOptions.price = -1;
            }
        }

        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Get products with pagination, search and sort
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate('category', 'name');

        res.json({
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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

router.post('/', adminAuth, handleFileUpload, async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            coverImage: req.files && req.files['coverImage'] ? req.files['coverImage'][0].path : '',
            images: req.files && req.files['images'] ? req.files['images'].map(file => file.path) : []
        });

        if (req.body.coverImage && req.body.coverImage.startsWith('data:image')) {
            product.coverImage = saveBase64Image(req.body.coverImage);
        }
        
        if (Array.isArray(req.body.images)) {
            product.images = await Promise.all(
                req.body.images
                    .filter(img => img && img.startsWith('data:image'))
                    .map(img => saveBase64Image(img))
            );
        }

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

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

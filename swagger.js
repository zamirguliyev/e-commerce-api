const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API Documentation',
            version: '1.0.0',
            description: 'API documentation for the E-commerce application with user management, product management, categories, basket, and wishlist features',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>'
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        currentPage: {
                            type: 'integer',
                            description: 'Current page number'
                        },
                        totalPages: {
                            type: 'integer',
                            description: 'Total number of pages'
                        },
                        total: {
                            type: 'integer',
                            description: 'Total number of items'
                        },
                        hasNextPage: {
                            type: 'boolean',
                            description: 'Whether there is a next page'
                        },
                        hasPrevPage: {
                            type: 'boolean',
                            description: 'Whether there is a previous page'
                        }
                    }
                },
                Comment: {
                    type: 'object',
                    required: [
                        'product',
                        'user',
                        'comment',
                        'rating'
                    ],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated unique identifier'
                        },
                        product: {
                            type: 'string',
                            description: 'Product ID the comment belongs to'
                        },
                        user: {
                            type: 'string',
                            description: 'User ID who wrote the comment'
                        },
                        comment: {
                            type: 'string',
                            description: 'Comment text'
                        },
                        rating: {
                            type: 'number',
                            minimum: 1,
                            maximum: 5,
                            description: 'Product rating (1-5)'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                User: {
                    type: 'object',
                    required: [
                        'name',
                        'email',
                        'password'
                    ],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated unique identifier'
                        },
                        name: {
                            type: 'string',
                            description: 'User\'s full name'
                        },
                        email: {
                            type: 'string',
                            description: 'User\'s email address'
                        },
                        password: {
                            type: 'string',
                            description: 'User\'s password (hashed)'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'User\'s role'
                        },
                        profileImage: {
                            type: 'string',
                            description: 'URL to user\'s profile image'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication is required or token is invalid',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'User does not have required permissions',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: 'The requested resource was not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Auth',
                description: 'Authentication endpoints'
            },
            {
                name: 'Users',
                description: 'User management endpoints'
            },
            {
                name: 'Products',
                description: 'Product management endpoints'
            },
            {
                name: 'Categories',
                description: 'Category management endpoints'
            },
            {
                name: 'Basket',
                description: 'Shopping basket endpoints'
            },
            {
                name: 'Wishlist',
                description: 'User wishlist endpoints'
            },
            {
                name: 'Comments',
                description: 'Comment management endpoints'
            }
        ]
    },
    apis: [
        './routes/*.js',
        './models/*.js'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user with optional profile image
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               profileImage:
 *                 type: string
 *                 description: Base64 encoded image string (data:image/jpeg;base64,...)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *       400:
 *         description: Invalid request body or email already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users/update-profile:
 *   put:
 *     summary: Update user profile including profile image
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
 *                 description: New name (optional)
 *               profileImage:
 *                 type: string
 *                 description: Base64 encoded image string (data:image/jpeg;base64,...)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid image format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

module.exports = swaggerSpec;
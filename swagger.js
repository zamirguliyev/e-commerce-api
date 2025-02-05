const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: 'E-commerce REST API documentation'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated user ID'
                        },
                        name: {
                            type: 'string',
                            description: "User's first name"
                        },
                        surname: {
                            type: 'string',
                            description: "User's last name"
                        },
                        email: {
                            type: 'string',
                            description: 'User email address'
                        },
                        profileImage: {
                            type: 'string',
                            description: 'User profile image path'
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
                Product: {
                    type: 'object',
                    required: ['name', 'price', 'category'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Product ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Product name'
                        },
                        description: {
                            type: 'string',
                            description: 'Product description'
                        },
                        price: {
                            type: 'number',
                            description: 'Product price'
                        },
                        category: {
                            type: 'string',
                            description: 'Category ID'
                        },
                        coverImage: {
                            type: 'string',
                            description: 'Cover image path'
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Additional product images'
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
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string'
                        }
                    }
                },
                Basket: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Basket item ID'
                        },
                        user: {
                            type: 'string',
                            description: 'User ID'
                        },
                        product: {
                            type: 'string',
                            description: 'Product ID'
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
                Category: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Category ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Category name'
                        },
                        description: {
                            type: 'string',
                            description: 'Category description'
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
                Comment: {
                    type: 'object',
                    required: ['comment', 'rating', 'user', 'product'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Comment ID'
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
                        user: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string',
                                    description: 'User ID'
                                },
                                name: {
                                    type: 'string',
                                    description: 'User name'
                                },
                                surname: {
                                    type: 'string',
                                    description: 'User surname'
                                }
                            }
                        },
                        product: {
                            type: 'string',
                            description: 'Product ID'
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
                Wishlist: {
                    type: 'object',
                    required: ['user', 'product'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Wishlist item ID'
                        },
                        user: {
                            type: 'string',
                            description: 'User ID'
                        },
                        product: {
                            $ref: '#/components/schemas/Product'
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
                    description: 'Access token is missing or invalid',
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
                name: 'Basket',
                description: 'Basket management endpoints'
            },
            {
                name: 'Categories',
                description: 'Category management endpoints'
            },
            {
                name: 'Comments',
                description: 'Comment management endpoints'
            },
            {
                name: 'Wishlist',
                description: 'Wishlist management endpoints'
            }
        ],
        paths: {
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'surname', 'email', 'password'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            example: 'John'
                                        },
                                        surname: {
                                            type: 'string',
                                            example: 'Doe'
                                        },
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            example: 'john@example.com'
                                        },
                                        password: {
                                            type: 'string',
                                            format: 'password',
                                            example: 'securePassword123'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'User registered successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            token: {
                                                type: 'string'
                                            },
                                            user: {
                                                $ref: '#/components/schemas/User'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid input',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            example: 'john@example.com'
                                        },
                                        password: {
                                            type: 'string',
                                            format: 'password',
                                            example: 'securePassword123'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            token: {
                                                type: 'string'
                                            },
                                            user: {
                                                $ref: '#/components/schemas/User'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/auth/refresh-token': {
                post: {
                    tags: ['Auth'],
                    summary: 'Refresh access token',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['refreshToken'],
                                    properties: {
                                        refreshToken: {
                                            type: 'string',
                                            description: 'Refresh token received during login'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'New access token generated',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            accessToken: {
                                                type: 'string'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/auth/logout': {
                post: {
                    tags: ['Auth'],
                    summary: 'Logout user',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Logged out successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Logged out successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/auth/me': {
                get: {
                    tags: ['Auth'],
                    summary: 'Get current user profile',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description: 'User profile retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/basket': {
                get: {
                    tags: ['Basket'],
                    summary: 'Get user\'s basket',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'query',
                            name: 'page',
                            schema: {
                                type: 'integer',
                                default: 1
                            },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'limit',
                            schema: {
                                type: 'integer',
                                default: 10,
                                maximum: 50
                            },
                            description: 'Items per page'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'User\'s basket retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            items: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/Basket'
                                                }
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    total: {
                                                        type: 'integer'
                                                    },
                                                    page: {
                                                        type: 'integer'
                                                    },
                                                    pages: {
                                                        type: 'integer'
                                                    },
                                                    hasNextPage: {
                                                        type: 'boolean'
                                                    },
                                                    hasPrevPage: {
                                                        type: 'boolean'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                },
                post: {
                    tags: ['Basket'],
                    summary: 'Add product to basket',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['productId'],
                                    properties: {
                                        productId: {
                                            type: 'string',
                                            description: 'ID of the product to add'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Product added to basket successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Basket'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Product already exists in basket',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/basket/{productId}': {
                delete: {
                    tags: ['Basket'],
                    summary: 'Remove product from basket',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'productId',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'ID of the product to remove'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Product removed from basket successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        404: {
                            description: 'Product not found in basket',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/categories': {
                get: {
                    tags: ['Categories'],
                    summary: 'Get all categories',
                    responses: {
                        200: {
                            description: 'List of all categories',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Category'
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
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
                post: {
                    tags: ['Categories'],
                    summary: 'Create a new category',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Category name'
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'Category description'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Category created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Category'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Category already exists or invalid input',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/categories/{id}': {
                get: {
                    tags: ['Categories'],
                    summary: 'Get a category by ID',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Category ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Category found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Category'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Category not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
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
                put: {
                    tags: ['Categories'],
                    summary: 'Update a category',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Category ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Category name'
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'Category description'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Category updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Category'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Category name already exists or invalid input',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        404: {
                            description: 'Category not found',
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
                delete: {
                    tags: ['Categories'],
                    summary: 'Delete a category',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Category ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Category deleted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        404: {
                            description: 'Category not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/comments/{productId}': {
                post: {
                    tags: ['Comments'],
                    summary: 'Create a new comment for a product',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'productId',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['comment', 'rating'],
                                    properties: {
                                        comment: {
                                            type: 'string',
                                            description: 'Comment text'
                                        },
                                        rating: {
                                            type: 'number',
                                            minimum: 1,
                                            maximum: 5,
                                            description: 'Product rating (1-5)'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Comment created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Comment'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid rating value',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                },
                get: {
                    tags: ['Comments'],
                    summary: 'Get all comments for a product with pagination',
                    parameters: [
                        {
                            in: 'path',
                            name: 'productId',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID'
                        },
                        {
                            in: 'query',
                            name: 'page',
                            schema: {
                                type: 'integer',
                                default: 1
                            },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'limit',
                            schema: {
                                type: 'integer',
                                default: 10
                            },
                            description: 'Number of items per page'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of comments with pagination info',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            comments: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/Comment'
                                                }
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    total: {
                                                        type: 'integer'
                                                    },
                                                    page: {
                                                        type: 'integer'
                                                    },
                                                    pages: {
                                                        type: 'integer'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/comments/{commentId}': {
                put: {
                    tags: ['Comments'],
                    summary: 'Update a comment',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'commentId',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Comment ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        comment: {
                                            type: 'string',
                                            description: 'Updated comment text'
                                        },
                                        rating: {
                                            type: 'number',
                                            minimum: 1,
                                            maximum: 5,
                                            description: 'Updated rating (1-5)'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Comment updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Comment'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        403: {
                            description: 'Not the comment owner',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Comment not found',
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
                delete: {
                    tags: ['Comments'],
                    summary: 'Delete a comment (admin admin and comment owner)',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'commentId',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Comment ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Comment deleted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Comment deleted successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        403: {
                            description: 'Not the comment owner or admin',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Comment not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/products': {
                get: {
                    tags: ['Products'],
                    summary: 'Get all products with pagination and filters',
                    parameters: [
                        {
                            in: 'query',
                            name: 'page',
                            schema: {
                                type: 'integer',
                                default: 1
                            },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'limit',
                            schema: {
                                type: 'integer',
                                default: 10
                            },
                            description: 'Items per page'
                        },
                        {
                            in: 'query',
                            name: 'category',
                            schema: {
                                type: 'string'
                            },
                            description: 'Filter by category ID'
                        },
                        {
                            in: 'query',
                            name: 'search',
                            schema: {
                                type: 'string'
                            },
                            description: 'Search in name and description'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of products with pagination info',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            products: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/Product'
                                                }
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    total: {
                                                        type: 'integer'
                                                    },
                                                    page: {
                                                        type: 'integer'
                                                    },
                                                    pages: {
                                                        type: 'integer'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
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
                post: {
                    tags: ['Products'],
                    summary: 'Create a new product',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'price', 'category'],
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Product name'
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'Product description'
                                        },
                                        price: {
                                            type: 'number',
                                            description: 'Product price'
                                        },
                                        category: {
                                            type: 'string',
                                            description: 'Category ID'
                                        },
                                        images: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'binary'
                                            },
                                            description: 'Product images (max 5)'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Product created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Product'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid input',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/products/{id}': {
                get: {
                    tags: ['Products'],
                    summary: 'Get a product by ID',
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Product found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Product'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Product not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
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
                put: {
                    tags: ['Products'],
                    summary: 'Update a product',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Product name'
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'Product description'
                                        },
                                        price: {
                                            type: 'number',
                                            description: 'Product price'
                                        },
                                        category: {
                                            type: 'string',
                                            description: 'Category ID'
                                        },
                                        images: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                format: 'binary'
                                            },
                                            description: 'Product images (max 5)'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Product updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Product'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid input',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        404: {
                            description: 'Product not found',
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
                delete: {
                    tags: ['Products'],
                    summary: 'Delete a product',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Product deleted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Product deleted successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        404: {
                            description: 'Product not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all users (Admin only)',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'query',
                            name: 'page',
                            schema: {
                                type: 'integer',
                                default: 1
                            },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'limit',
                            schema: {
                                type: 'integer',
                                default: 10
                            },
                            description: 'Items per page'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of users with pagination info',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            users: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/User'
                                                }
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    total: {
                                                        type: 'integer'
                                                    },
                                                    page: {
                                                        type: 'integer'
                                                    },
                                                    pages: {
                                                        type: 'integer'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        403: {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/users/profile': {
                get: {
                    tags: ['Users'],
                    summary: 'Get user profile',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    responses: {
                        200: {
                            description: 'User profile data',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                },
                put: {
                    tags: ['Users'],
                    summary: 'Update user profile',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'User first name'
                                        },
                                        surname: {
                                            type: 'string',
                                            description: 'User last name'
                                        },
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            description: 'User email'
                                        },
                                        profileImage: {
                                            type: 'string',
                                            format: 'byte',
                                            description: 'Profile image in base64 format'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Profile updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid input or image format',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/users/{id}': {
                get: {
                    tags: ['Users'],
                    summary: 'Get user by ID (Admin only)',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'User ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'User data',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        403: {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'User not found',
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
                put: {
                    tags: ['Users'],
                    summary: 'Update user (Admin only)',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'User ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string'
                                        },
                                        surname: {
                                            type: 'string'
                                        },
                                        email: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'User updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid input',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        403: {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'User not found',
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
                delete: {
                    tags: ['Users'],
                    summary: 'Delete user (Admin only)',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'User ID'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'User deleted successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'User deleted successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        403: {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/users/{id}/status': {
                patch: {
                    tags: ['Users'],
                    summary: 'Update user status (Admin only)',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'User ID'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['status'],
                                    properties: {
                                        status: {
                                            type: 'string',
                                            enum: ['active', 'inactive', 'banned'],
                                            description: 'New user status'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'User status updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        403: {
                            description: 'Forbidden - Admin access required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/users/change-password': {
                post: {
                    tags: ['Users'],
                    summary: 'Change user password',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['currentPassword', 'newPassword'],
                                    properties: {
                                        currentPassword: {
                                            type: 'string',
                                            description: 'Current password'
                                        },
                                        newPassword: {
                                            type: 'string',
                                            description: 'New password'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Password changed successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Password changed successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid current password',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                }
            },
            '/api/users/forgot-password': {
                post: {
                    tags: ['Users'],
                    summary: 'Request password reset code',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            description: 'User email address'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Reset code sent successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Password reset code has been sent to your email'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/users/reset-password': {
                post: {
                    tags: ['Users'],
                    summary: 'Reset password with code',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'code', 'newPassword'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            format: 'email',
                                            description: 'User email address'
                                        },
                                        code: {
                                            type: 'string',
                                            description: 'Reset code received via email'
                                        },
                                        newPassword: {
                                            type: 'string',
                                            description: 'New password'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Password reset successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Password has been reset successfully'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Invalid or expired reset code',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'User not found',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/wishlist': {
                get: {
                    tags: ['Wishlist'],
                    summary: "Get user's wishlist items",
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'query',
                            name: 'page',
                            schema: {
                                type: 'integer',
                                default: 1
                            },
                            description: 'Page number'
                        },
                        {
                            in: 'query',
                            name: 'limit',
                            schema: {
                                type: 'integer',
                                default: 10
                            },
                            description: 'Items per page'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of wishlist items with pagination info',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            items: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/Wishlist'
                                                }
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    total: {
                                                        type: 'integer'
                                                    },
                                                    page: {
                                                        type: 'integer'
                                                    },
                                                    pages: {
                                                        type: 'integer'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        500: {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/wishlist/{productId}': {
                post: {
                    tags: ['Wishlist'],
                    summary: 'Add product to wishlist',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'productId',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID to add to wishlist'
                        }
                    ],
                    responses: {
                        201: {
                            description: 'Product added to wishlist successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Wishlist'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Product already in wishlist',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        }
                    }
                },
                delete: {
                    tags: ['Wishlist'],
                    summary: 'Remove product from wishlist',
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            in: 'path',
                            name: 'productId',
                            required: true,
                            schema: {
                                type: 'string'
                            },
                            description: 'Product ID to remove from wishlist'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Product removed from wishlist successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: {
                                                type: 'string',
                                                example: 'Product removed from wishlist'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            $ref: '#/components/responses/UnauthorizedError'
                        },
                        404: {
                            description: 'Product not found in wishlist',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Server error',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
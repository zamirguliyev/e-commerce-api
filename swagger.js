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
            }
        ]
    },
    apis: [
        './routes/*.js',
        './models/*.js'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
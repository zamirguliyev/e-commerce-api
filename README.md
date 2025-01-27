# E-commerce API

A RESTful API built with Node.js, Express.js, and MongoDB for e-commerce applications.

## Features

- User Authentication with JWT
- Refresh Token Mechanism
- Role-based Authorization (Admin/User)
- User Management
- Product Management with Image Upload
- Category Management
- Shopping Basket
- Wishlist
- Swagger API Documentation
- Pagination and Search Functionality

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

4. Create uploads directory:
```bash
mkdir uploads
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

The API documentation is available through Swagger UI at:
```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### User Management

- `GET /api/users` - Get all users (Admin only, with pagination and search)
- `PUT /api/users/profile` - Update user's own profile
- `PATCH /api/users/:id/status` - Update user status (Admin only)

### Category Management (Admin Only)

- `POST /api/categories` - Create new category
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category and its products

### Product Management

- `POST /api/products` - Create new product (Admin only)
- `GET /api/products` - Get all products (with pagination and category filter)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Shopping Basket

- `POST /api/basket` - Add product to basket
- `GET /api/basket` - Get basket items (with pagination)
- `DELETE /api/basket/:productId` - Remove product from basket

### Wishlist

- `POST /api/wishlist` - Add product to wishlist
- `GET /api/wishlist` - Get wishlist items (with pagination)
- `DELETE /api/wishlist/:productId` - Remove product from wishlist

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:
```
Authorization: Bearer your_access_token
```

## Response Format

Success Response:
```json
{
    "data": {
        // response data
    }
}
```

Error Response:
```json
{
    "message": "Error message"
}
```

## Pagination

For endpoints that support pagination, use the following query parameters:
```
?page=1&limit=10
```

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

Paginated response format:
```json
{
    "items": [...],
    "pagination": {
        "total": 100,
        "page": 1,
        "pages": 10,
        "hasNextPage": true,
        "hasPrevPage": false
    }
}
```

## File Upload

Product images are handled using multipart/form-data:
- `coverImage`: Required main product image
- `images`: Optional additional product images (max 5)

Uploaded files are stored in the `/uploads` directory and served at `/uploads/filename.ext`.

## Error Handling

Common error responses:
- 400: Bad Request - Invalid input
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 409: Conflict - Duplicate entry (e.g., product already in basket)
- 500: Internal Server Error

## Development

The project uses:
- Express.js for the web framework
- MongoDB with Mongoose for the database
- JWT for authentication
- Multer for file uploads
- Swagger UI for API documentation

## License

MIT
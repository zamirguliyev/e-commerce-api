# E-Commerce Backend API

A robust Node.js-based e-commerce backend API with features like user authentication, product management, wishlist, and comments.

## Features

- **User Management**
  - Registration and Authentication
  - JWT-based Authorization
  - Profile Management with Image Upload
  - Password Reset Functionality

- **Product Management**
  - CRUD Operations
  - Image Upload Support
  - Pagination and Filtering
  - Search Functionality

- **Wishlist**
  - Add/Remove Products
  - View User's Wishlist
  - Pagination Support

- **Comments**
  - Add/Edit/Delete Comments on Products
  - View Product Comments
  - Pagination Support

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Swagger UI for API Documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/e-commerce-api.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

4. Start the server:
```bash
npm start
```

## API Documentation

The API is documented using Swagger UI. After starting the server, visit:
```
http://localhost:3000/api-docs
```

### Main Endpoints

#### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/refresh-token - Get new access token
- POST /api/auth/logout - Logout user

#### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- POST /api/users/change-password - Change password
- POST /api/users/forgot-password - Request password reset
- POST /api/users/reset-password - Reset password with code

#### Products
- GET /api/products - Get all products
- POST /api/products - Create new product (Admin)
- GET /api/products/:id - Get product by ID
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)
- POST /api/products/:id/comments - Add comment to product
- GET /api/products/:id/comments - Get product comments

#### Wishlist
- GET /api/wishlist - Get user's wishlist
- POST /api/wishlist/:productId - Add product to wishlist
- DELETE /api/wishlist/:productId - Remove product from wishlist

## Recent Updates

### User Management
- Profile image now accepts only base64 format
- Removed role management for simplified user structure
- Enhanced password reset functionality with email verification
- Improved profile update validation

### Product Management
- Added image upload support with multiple formats
- Enhanced search functionality
- Improved pagination and filtering options
- Added sorting capabilities

### Wishlist
- Implemented pagination for wishlist items
- Added product details in wishlist responses
- Improved error handling

### Comments
- Added comment editing functionality
- Implemented comment moderation features
- Enhanced comment listing with pagination

### API Documentation
- Updated Swagger documentation for all endpoints
- Added request/response examples
- Improved error response documentation
- Added authentication details in Swagger UI

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
    "message": "Error description"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

- JWT-based authentication
- Password hashing
- Rate limiting
- Input validation
- XSS protection
- CORS configuration

## Best Practices

- Use environment variables for sensitive data
- Keep JWT tokens secure
- Send base64 format for image uploads
- Follow REST API conventions
- Use proper HTTP methods
- Implement proper error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
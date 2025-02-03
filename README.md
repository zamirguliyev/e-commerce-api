# E-commerce API with Node.js, Express, and MongoDB

A comprehensive e-commerce API built with Node.js, Express, and MongoDB, featuring user authentication, product management, shopping cart functionality, and more.

## Features

### User Management
- User registration and authentication
- JWT-based authentication
- Role-based access control (Admin and User roles)
- Profile management with profile picture support (Base64)
- Password hashing for security

### Product Management
- CRUD operations for products
- Product categorization
- Product search and filtering
- Image upload support

### Shopping Features
- Shopping cart management
- Wishlist functionality
- Product ratings and reviews
- Comment system with pagination

### Admin Features
- User management
- Product management
- Category management
- Comment moderation
- Order management

## API Documentation

The API is documented using Swagger UI. Access the documentation at:
```
http://localhost:8080/api-docs
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=8080
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user (supports profile image)
- `POST /api/users/login` - Login user
- `PUT /api/users/update-profile` - Update user profile (including profile image)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Comments
- `POST /api/comments/:productId` - Add comment to product
- `GET /api/comments/:productId` - Get product comments (with pagination)
- `PUT /api/comments/:commentId` - Update comment (owner only)
- `DELETE /api/comments/:commentId` - Delete comment (owner or admin)

### Cart
- `GET /api/basket` - Get user's cart
- `POST /api/basket/add` - Add item to cart
- `PUT /api/basket/update` - Update cart item
- `DELETE /api/basket/remove` - Remove item from cart

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove` - Remove item from wishlist

## Profile Image Upload

### Base64 Image Format
Profile images should be sent as base64 strings in the following format:
```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
```

Supported image formats:
- JPEG/JPG
- PNG

Example request for updating profile image:
```json
{
  "name": "User Name",
  "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

## Comment System

Comments support pagination and include user information. Example response:
```json
{
  "comments": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalComments": 50,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- File upload restrictions
- Rate limiting (coming soon)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
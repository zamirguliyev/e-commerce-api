# E-commerce API

A RESTful API built with Node.js, Express.js, and MongoDB for e-commerce applications.

## Features

- User Authentication with JWT
- Refresh Token Mechanism
- Role-based Authorization (Admin/User)
- User Management with Search & Pagination
- Product Management with Image Upload (File & Base64)
- Category Management
- Shopping Basket
- Wishlist
- Swagger API Documentation
- Pagination and Search Functionality
- Image Upload Support (JPG, JPEG, PNG, GIF)
- Base64 Image Support
- Error Handling and Validation

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

- `GET /api/users` - Get all users (Admin only)
  - Supports pagination with page and limit parameters
  - Search functionality for username, email, name, and surname
  - Returns formatted user data without sensitive information
- `PUT /api/users/profile` - Update user's own profile
  - Update name, surname, username, and email
  - Validates for unique username and email
- `PATCH /api/users/:id/status` - Update user status (Admin only)

### Category Management (Admin Only)

- `POST /api/categories` - Create new category
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Product Management

- `POST /api/products` - Create new product (Admin only)
  - Supports both multipart/form-data and application/json with base64 images
  - Accepts JPG, JPEG, PNG, and GIF formats
- `GET /api/products` - Get all products (with pagination and category filter)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (Admin only)
  - Supports both file uploads and base64 images
  - Partial updates available
- `DELETE /api/products/:id` - Delete product (Admin only)

### Shopping Basket

- `POST /api/basket` - Add product to basket
- `GET /api/basket` - Get user's basket items
- `DELETE /api/basket/:id` - Remove item from basket

### Wishlist

- `POST /api/wishlist` - Add product to wishlist
- `GET /api/wishlist` - Get user's wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist

## User Management

The API provides comprehensive user management features:

### User Roles
- **Admin**: Full access to all endpoints and user management
- **User**: Access to own profile and regular features

### User Data
```javascript
{
  "id": "user_id",
  "name": "User Name",
  "surname": "User Surname",
  "username": "username",
  "email": "user@example.com",
  "isAdmin": false,
  "status": "active",
  "createdAt": "2024-01-28T06:57:22.000Z",
  "updatedAt": "2024-01-28T06:57:22.000Z"
}
```

### Search and Pagination
Users can be searched by:
- Username
- Email
- Name
- Surname

Pagination parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

## Image Upload

The API supports two methods for handling product images:

1. File Upload (multipart/form-data):
```javascript
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('price', '99.99');
formData.append('coverImage', imageFile);
formData.append('images', additionalImage1);
formData.append('images', additionalImage2);
```

2. Base64 Images (application/json):
```javascript
{
  "name": "Product Name",
  "price": 99.99,
  "coverImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/png;base64,iVBORw0KGgoAAAA..."
  ]
}
```

Supported image formats:
- JPG/JPEG
- PNG
- GIF

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

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
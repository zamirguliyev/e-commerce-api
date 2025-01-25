# E-commerce API

A RESTful API built with Node.js, Express.js, and MongoDB for e-commerce applications.

## Features

- User Authentication with JWT
- Refresh Token Mechanism
- Role-based Authorization (Admin/User)
- User Management
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

For endpoints that support pagination:

```
GET /api/users?page=1&limit=10&keyword=searchterm
```

Response includes pagination info:
```json
{
    "data": [...],
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalUsers": 48,
        "hasNextPage": true,
        "hasPrevPage": false
    }
}
```

## Error Handling

Common HTTP Status Codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## User Model

```javascript
{
    name: String,          // Required
    surname: String,       // Required
    username: String,      // Required, Unique
    email: String,         // Required, Unique
    password: String,      // Required
    isAdmin: Boolean,      // Default: false
    status: String,        // enum: ['active', 'inactive', 'banned']
    refreshToken: String,  // For token refresh mechanism
    createdAt: Date,      // Automatically managed
    updatedAt: Date       // Automatically managed
}
```

## Security Features

- Password Hashing (bcryptjs)
- JWT Authentication
- Refresh Token Mechanism
- Role-based Access Control
- Input Validation
- Unique Email/Username Validation

## Development

To contribute to this project:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 
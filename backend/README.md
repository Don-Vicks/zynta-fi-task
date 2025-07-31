# User Registration API

A Node.js Express backend API for user registration with referral system.

## Features

- ✅ User registration with name, email, and optional referral code
- ✅ Unique 6-digit referral code generation for each user
- ✅ Referral system with point rewards (10 points per referral)
- ✅ In-memory data storage with sample users
- ✅ Input validation using Zod
- ✅ Comprehensive error handling
- ✅ RESTful API design

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Or start the production server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Get All Users
**GET** `/api/users`

Returns a list of all registered users.

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "referralCode": "ABC123",
      "points": 0
    }
  ],
  "count": 3
}
```

### 2. Register New User
**POST** `/api/register`

Register a new user with optional referral code.

**Request Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "referralCode": "ABC123"  // Optional
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully and 10 points awarded to referrer",
  "data": {
    "id": 4,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "referralCode": "XYZ789",
    "points": 0
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 3. Get User by Referral Code
**GET** `/api/users/:referralCode`

Get a specific user by their referral code.

**Response (Success):**
```json
{
  "success": true,
  "message": "User found successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "referralCode": "ABC123",
    "points": 10
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "User not found with the provided referral code"
}
```

### 4. Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Sample Data

The API comes pre-loaded with 3 sample users:

1. **John Doe** - john.doe@example.com (Referral: ABC123)
2. **Jane Smith** - jane.smith@example.com (Referral: DEF456)
3. **Mike Johnson** - mike.johnson@example.com (Referral: GHI789)

## Validation Rules

### User Registration
- **name**: Required, non-empty string, max 100 characters
- **email**: Required, valid email format, max 255 characters
- **referralCode**: Optional, exactly 6 characters, uppercase letters and numbers only

### Referral Code Format
- Exactly 6 characters
- Contains only uppercase letters (A-Z) and numbers (0-9)
- Example: ABC123, XYZ789

## Error Handling

The API handles various error scenarios:

- **400 Bad Request**: Invalid input data or referral code
- **404 Not Found**: User not found or route not found
- **409 Conflict**: User with email already exists
- **500 Internal Server Error**: Server-side errors

## Example Usage with curl

### Get all users:
```bash
curl http://localhost:3000/api/users
```

### Register a new user:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "referralCode": "ABC123"
  }'
```

### Get user by referral code:
```bash
curl http://localhost:3000/api/users/ABC123
```

## Project Structure

```
backend/
├── models/
│   └── User.js              # User model with in-memory storage
├── controllers/
│   └── userController.js    # Business logic for user operations
├── routes/
│   └── userRoutes.js        # API route definitions
├── middleware/
│   └── validation.js        # Zod validation middleware
├── utils/
│   └── helpers.js           # Utility functions
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Zod**: Schema validation
- **CORS**: Cross-origin resource sharing
- **Nodemon**: Development server with auto-restart

## Notes

- Data is stored in memory and will be reset when the server restarts
- Referral codes are automatically generated as unique 6-digit codes
- Points are awarded immediately when a valid referral code is used during registration
- All email addresses are stored in lowercase for consistency

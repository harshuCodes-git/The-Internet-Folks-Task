# The Internet folk Task 

A robust RESTful API for managing communities, members, and roles. Built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User Authentication (Signup/Signin)
- Community Management
- Role-based Access Control
- Member Management
- JWT-based Authentication
- TypeScript Support
- MongoDB Database

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT Authentication
- bcryptjs for Password Hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/harshuCodes-git/The-Internet-Folks-Task.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=5000
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

#### Signup
- **POST** `/v1/auth/signup`
- Body:
```json
{
    "name": "string",
    "email": "string",
    "password": "string"
}
```

#### Signin
- **POST** `/v1/auth/signin`
- Body:
```json
{
    "email": "string",
    "password": "string"
}
```

#### Get User Info
- **GET** `/v1/auth/me`
- Headers: `Authorization: Bearer <token>`

### Community

#### Create Community
- **POST** `/v1/community`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
    "name": "string"
}
```

#### Get All Communities
- **GET** `/v1/community`
- Headers: `Authorization: Bearer <token>`

### Member

#### Add Member
- **POST** `/v1/member`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
    "community": "string",
    "user": "string",
    "role": "string"
}
```

### Role

#### Create Role
- **POST** `/v1/role`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
    "name": "string"
}
```

#### Get All Roles
- **GET** `/v1/role`

## Deployment

The API is configured for deployment on Render.com. The `render.yaml` file contains the necessary configuration.

### Environment Variables

Required environment variables for deployment:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `JWT_EXPIRES_IN`: JWT expiration time
- `NODE_ENV`: Environment (production/development)
- `PORT`: Server port

## Development

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the project
- `npm start`: Start production server

### Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
└── index.ts        # Entry point
```

## Error Handling

The API uses a consistent error response format:
```json
{
    "status": false,
    "error": {
        "message": "Error message"
    }
}
```

## Security

- Passwords are hashed using bcrypt
- JWT for authentication
- Environment variables for sensitive data
- CORS enabled
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

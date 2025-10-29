# Proxi Server

Backend server for the Proxi mobile application with MongoDB authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your MongoDB connection string is correct in `config.env`

3. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on port 3000 by default.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (requires authentication)
- `GET /api/verify-token` - Verify JWT token

## Environment Variables

- `PROXI_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)

# MERN Stack Admin Dashboard

A full-stack admin dashboard application built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. Features role-based authentication, user management, and a responsive dashboard interface.

## Features

- 🔐 Role-based Authentication (Admin/User)
- 👥 User Management System
- 📊 Dynamic Dashboard
- 🎨 Responsive Design
- 🛡️ Protected Routes
- 🔄 Real-time User Activity Tracking

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Modern CSS with Flexbox/Grid
- Responsive design principles

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store and slices
│   │   └── utils/        # Utility functions
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middlewares/      # Custom middlewares
    ├── models/          # Mongoose models
    ├── routes/          # API routes
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (or your configured port).

## API Endpoints

### Auth Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### User Routes
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React.js documentation
- MongoDB documentation
- Express.js documentation
- Node.js documentation
# MERN Stack Client Application (Vite + React)

## Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm run dev`: Runs the app in development mode with Vite
- `npm run build`: Builds the app for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

## Features

- **Vite**: Fast build tool and development server
- **React 18**: Latest React features
- **Redux Toolkit**: State management for authentication
- **Formik + Yup**: Form validation
- **React Router**: Routing with protected routes
- **Toast Notifications**: User-friendly notifications using react-toastify
- **Role-based Access**: Different UI for admin and regular users
- **Responsive Design**: Modern, clean UI matching the design requirements

## API Configuration

Make sure the backend server is running on `http://localhost:5000` before starting the client.

## Project Structure

```
client/
├── index.html          # Vite entry HTML
├── vite.config.js      # Vite configuration
├── src/
│   ├── main.jsx        # Application entry point
│   ├── App.js          # Main app component
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── store/          # Redux store and slices
│   └── utils/          # Utility functions
└── package.json
```


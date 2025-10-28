// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const helmet = require('helmet'); // --- LATER: Uncomment when you install 'helmet'
// const rateLimit = require('express-rate-limit'); // --- LATER: Uncomment when you install 'express-rate-limit'

const app = express();
const PORT = process.env.PORT || 5000;

// --- NEW: Production-Ready CORS Configuration ---
const allowedOrigins = [
  process.env.CLIENT_URL, // Your Vercel/Netlify URL
  'http://localhost:3000' // Your local client for testing
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you use cookies/sessions
};
app.use(cors(corsOptions)); // --- MODIFIED: Using new corsOptions

// --- LATER: Uncomment these lines when packages are installed ---
// app.use(helmet()); // Sets various HTTP security headers
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
//   message: 'Too many requests from this IP, please try again after 15 minutes'
// });
// app.use('/api/', limiter);

// Standard Middleware
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
// --- IMPORTANT: Change your MONGO_URI in .env to a MongoDB Atlas URL ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/feedback', require('./routes/feedback'));

// --- NEW: Global Error Handler ---
// This MUST be at the end, after all app.use() and routes
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: Access Denied' });
  }
  
  // Generic error response
  res.status(500).json({ 
    message: 'An unexpected error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Production-Ready CORS Configuration ---
// This is the list of websites we will allow to connect.
// We get the URL from the .env file (e.g., https://my-app.vercel.app)
const allowlist = [process.env.CLIENT_URL];

const corsOptions = {
  origin: (origin, callback) => {
    // Check if the incoming website 'origin' is in our allowlist
    // We also add '!origin' to allow tools like Postman (which don't have an origin)
    if (allowlist.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // This allows cookies/tokens to be sent
};

// Use the new, secure CORS options
app.use(cors(corsOptions));
// --- End CORS Configuration ---

// Middleware
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
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

// Global Error Handler
// This should be at the very end, after all routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Check for CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'CORS Error: Access Denied. Your website is not on the allowlist.' });
    }
    // Default 500 server error
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


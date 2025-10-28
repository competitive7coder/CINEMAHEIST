require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
// Allow all websites for now to fix preflight error
app.use(cors());
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
        return res.status(403).json({ message: 'CORS Error: Access Denied' });
    }
    // Default 500 server error
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


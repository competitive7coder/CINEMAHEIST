// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully.'))
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
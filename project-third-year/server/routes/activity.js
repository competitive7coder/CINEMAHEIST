const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// @route   POST api/activity/log
// @desc    Log a new user activity
// @access  Private
router.post('/log', auth, async (req, res) => {
    const { movieId, actionType } = req.body;
    try {
        // Fetch movie details to get title and poster for our log
        const movieRes = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: { api_key: API_KEY },
        });

        const newActivity = new Activity({
            userId: req.user.id,
            actionType,
            movieId,
            movieTitle: movieRes.data.title,
            moviePosterPath: movieRes.data.poster_path,
        });

        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET api/activity/history
// @desc    Get user's activity history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Activity.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(50);
        res.json(history);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/activity/history
// @desc    Clear user's activity history
// @access  Private
router.delete('/history', auth, async (req, res) => {
    try {
        await Activity.deleteMany({ userId: req.user.id });
        res.json({ msg: 'Viewing history cleared.' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
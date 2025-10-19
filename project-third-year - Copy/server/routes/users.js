const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/users/watchlist/:movieId
// @desc    Add or remove a movie from the user's watchlist
// @access  Private
router.post('/watchlist/:movieId', auth, async (req, res) => {
    try {
        const movieId = Number(req.params.movieId);
        const user = await User.findById(req.user.id);

        // Check if the movie is already in the watchlist
        const movieIndex = user.watchlist.indexOf(movieId);

        if (movieIndex > -1) {
            // Movie is in the list, so remove it
            user.watchlist.splice(movieIndex, 1);
            await user.save();
            res.json({ msg: 'Movie removed from watchlist', watchlist: user.watchlist });
        } else {
            // Movie is not in the list, so add it
            user.watchlist.push(movieId);
            await user.save();
            res.json({ msg: 'Movie added to watchlist', watchlist: user.watchlist });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/watchlist
// @desc    Get the user's watchlist
// @access  Private
router.get('/watchlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('watchlist');
        res.json(user.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
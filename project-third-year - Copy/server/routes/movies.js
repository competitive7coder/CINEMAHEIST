const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// List of genres for the homepage
const homepageGenres = [
    { id: 'popular', name: 'Trending Now' },
    { id: 28, name: 'Action Packed' },
    { id: 878, name: 'Science Fiction' },
    { id: 10749, name: 'Romantic Movies' },
    { id: 53, name: 'Thriller Tales' },
];

// Route for the main homepage sections
router.get('/homepage-sections', async (req, res) => {
    try {
        const requests = homepageGenres.map(genre => {
            const url = genre.id === 'popular' ? `${TMDB_BASE_URL}/movie/popular` : `${TMDB_BASE_URL}/discover/movie`;
            return axios.get(url, {
                params: { api_key: API_KEY, with_genres: genre.id === 'popular' ? null : genre.id },
            });
        });
        const responses = await Promise.all(requests);
        const moviesData = {};
        homepageGenres.forEach((genre, index) => {
            moviesData[genre.name] = responses[index].data.results;
        });
        res.json(moviesData);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for the "See All" Popular/Trending page
router.get('/popular', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: { api_key: API_KEY, language: 'en-US', page: 1 },
        });
        res.json(response.data.results);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for the "See All" genre-specific pages
router.get('/genre/:genreId', async (req, res) => {
    const { genreId } = req.params;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: { api_key: API_KEY, with_genres: genreId, language: 'en-US', page: 1 },
        });
        res.json(response.data.results);
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- NEW ROUTE TO GET VIDEOS FOR A MOVIE ---
router.get('/:movieId/videos', async (req, res) => {
    const { movieId } = req.params;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
            params: { api_key: API_KEY },
        });
        const trailer = response.data.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
        res.json(trailer || response.data.results[0] || null);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// --- NEW ROUTE TO GET FULL MOVIE DETAILS ---
// router.get('/details/:movieId', async (req, res) => {
//     const { movieId } = req.params;
//     try {
//         const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
//             params: { api_key: API_KEY, language: 'en-US', append_to_response: 'videos,credits,genres' },
//         });
//         res.json(response.data);
//     } catch (err) {
//         console.error(`Error fetching details for movie ${movieId}:`, err.message);
//         res.status(500).send('Server Error');
//     }
// });

module.exports = router;
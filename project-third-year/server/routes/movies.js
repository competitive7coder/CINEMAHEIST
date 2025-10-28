const express = require('express');
const axios = require('axios');
const router = express.Router();
const NodeCache = require('node-cache'); // Using cache

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const movieCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const homepageGenres = [
    { id: 'popular', name: 'Trending Now' },
    { id: 28, name: 'Action Packed' },
    { id: 878, name: 'Science Fiction' },
    { id: 10749, name: 'Romantic Movies' },
    { id: 53, name: 'Thriller Tales' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy Movies' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror Flicks' }
];

// Helper function for caching
const fetchFromTMDb = async (urlPath, params = {}, cacheKey = null) => {
    const key = cacheKey || `${urlPath}?${JSON.stringify(params)}`;
    const cachedData = movieCache.get(key);
    if (cachedData) {
        console.log(`Cache HIT for key: ${key.substring(0, 50)}...`);
        return cachedData;
    } else {
        console.log(`Cache MISS for key: ${key.substring(0, 50)}...`);
        try {
            const response = await axios.get(`${TMDB_BASE_URL}${urlPath}`, {
                params: { api_key: API_KEY, language: 'en-US', ...params },
            });
            movieCache.set(key, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching from TMDb for ${urlPath}:`, error.message);
            throw error;
        }
    }
};

// Route for homepage sections (no pagination needed here)
router.get('/homepage-sections', async (req, res) => {
    try {
        const requests = homepageGenres.map(async (genre) => {
            const urlPath = genre.id === 'popular' ? '/movie/popular' : '/discover/movie';
            const params = genre.id === 'popular' ? { page: 1 } : { with_genres: genre.id, page: 1 };
            const cacheKey = `homepage-section-${genre.id}`;
            const data = await fetchFromTMDb(urlPath, params, cacheKey);
            return { name: genre.name, data: data.results };
        });
        const results = await Promise.all(requests);
        const moviesData = results.reduce((acc, current) => {
            acc[current.name] = current.data;
            return acc;
        }, {});
        res.json(moviesData);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for "See All" Popular (UPDATED for pagination)
router.get('/popular', async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const data = await fetchFromTMDb('/movie/popular', { page: page });
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for "Now Playing" (UPDATED for pagination)
router.get('/now-playing', async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const data = await fetchFromTMDb('/movie/now_playing', { page: page });
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for "Top Rated in India" (UPDATED for pagination)
router.get('/top-rated-in', async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const data = await fetchFromTMDb('/movie/top_rated', { page: page, region: 'IN' });
        res.json(data.results); // send array directly
    } catch (err) { res.status(500).send('Server Error'); }
});


// Route for "See All" genre pages (UPDATED for pagination)
router.get('/genre/:genreId', async (req, res) => {
    const { genreId } = req.params;
    const { page = 1, sort_by, year } = req.query;
    const params = {
        with_genres: genreId,
        page: page,
        sort_by: sort_by || 'popularity.desc',
        primary_release_year: year || null,
    };
    try {
        const data = await fetchFromTMDb('/discover/movie', params);
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for search (UPDATED for pagination)
router.get('/search', async (req, res) => {
    const { query, page = 1, year } = req.query;
    if (!query) return res.status(400).json({ msg: 'Search query is required' });
    const params = { query: query, page: page, primary_release_year: year || null, include_adult: false };
    try {
        const data = await fetchFromTMDb('/search/movie', params);
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for movie details (no pagination needed)
router.get('/details/:movieId', async (req, res) => {
    const { movieId } = req.params;
    try {
        const data = await fetchFromTMDb(`/movie/${movieId}`, { append_to_response: 'videos,credits,watch/providers' });
        res.json(data);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for movie videos (no pagination needed)
router.get('/:movieId/videos', async (req, res) => {
    const { movieId } = req.params;
    try {
        const data = await fetchFromTMDb(`/movie/${movieId}/videos`);
        const trailer = data.results?.find(video => video.site === 'YouTube' && video.type === 'Trailer');
        res.json(trailer || data.results?.[0] || null);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Route for movie recommendations (no pagination needed)
router.get('/recommendations/:movieId', async (req, res) => {
    const { movieId } = req.params;
    try {
        const data = await fetchFromTMDb(`/movie/${movieId}/recommendations`);
        res.json(data.results);
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
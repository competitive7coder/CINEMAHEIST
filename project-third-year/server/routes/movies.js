const express = require('express');
const axios = require('axios');
const router = express.Router();
const NodeCache = require('node-cache'); 

const authMiddleware = require('../middleware/auth'); 
const User = require('../models/User'); 

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const movieCache = new NodeCache({ stdTTL: 3600 }); 

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

// Get full movie details for IDs
async function getMovieDetailsFromIds(ids) {
    const moviePromises = ids.map(id =>
        fetchFromTMDb(`/movie/${id}`, {
            append_to_response: 'videos,credits,watch/providers'
        })
    );

    const results = await Promise.allSettled(moviePromises);

    const movies = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

    return movies;
}

//   RECOMMENDATION API
router.get("/recommendations/user", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const watchlist_ids = user.watchlist;

        if (!watchlist_ids || watchlist_ids.length === 0) {
            return res.json([]);
        }

        const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:5001/recommend";

        console.log(`Calling ML service at: ${mlServiceUrl} with watchlist:`, watchlist_ids);

        const mlResponse = await axios.post(mlServiceUrl, {
            watchlist_ids: watchlist_ids,
        });

        let recommendedMovieIds = mlResponse.data.recommendations;
        console.log("Received recommendations from ML service:", recommendedMovieIds);

        // ML returned objects, converting to IDs
        if (
            Array.isArray(recommendedMovieIds) &&
            recommendedMovieIds.length > 0 &&
            typeof recommendedMovieIds[0] === "object"
        ) {
            console.log("ML returned objects — extracting IDs...");
            recommendedMovieIds = recommendedMovieIds.map(movie => movie.id);
        }

        console.log("Final movie ID list after normalization:", recommendedMovieIds);

        if (!recommendedMovieIds || recommendedMovieIds.length === 0) {
            return res.json([]);
        }

        const movieDetails = await getMovieDetailsFromIds(recommendedMovieIds);

        res.json(movieDetails);

    } catch (err) {
        console.error("Error in /recommendations/user route:", err.message);

        if (err.response && err.response.data) {
            return res.status(500).json({
                msg: "ML Service Error",
                detail: err.response.data
            });
        }

        res.status(500).send("Server Error");
    }
});

// Homepage sections
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

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Popular
router.get('/popular', async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const data = await fetchFromTMDb('/movie/popular', { page });
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Now Playing
router.get('/now-playing', async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const data = await fetchFromTMDb('/movie/now_playing', { page });
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Top Rated India
router.get('/top-rated-in', async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const data = await fetchFromTMDb('/movie/top_rated', { page, region: 'IN' });
        res.json(data.results);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Genre
router.get('/genre/:genreId', async (req, res) => {
    const { genreId } = req.params;
    const { page = 1, sort_by, year } = req.query;

    const params = {
        with_genres: genreId,
        page,
        sort_by: sort_by || 'popularity.desc',
        primary_release_year: year || null,
    };

    try {
        const data = await fetchFromTMDb('/discover/movie', params);
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Search
router.get('/search', async (req, res) => {
    const { query, page = 1, year } = req.query;

    if (!query) return res.status(400).json({ msg: 'Search query is required' });

    const params = { query, page, primary_release_year: year || null, include_adult: false };

    try {
        const data = await fetchFromTMDb('/search/movie', params);
        res.json({ results: data.results, totalPages: data.total_pages });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Details
router.get('/details/:movieId', async (req, res) => {
    const { movieId } = req.params;
    try {
        const data = await fetchFromTMDb(`/movie/${movieId}`, {
            append_to_response: 'videos,credits,watch/providers'
        });
        res.json(data);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Videos
router.get('/:movieId/videos', async (req, res) => {
    const { movieId } = req.params;

    try {
        const data = await fetchFromTMDb(`/movie/${movieId}/videos`);
        const trailer = data.results?.find(
            video => video.site === 'YouTube' && video.type === 'Trailer'
        );

        res.json(trailer || data.results?.[0] || null);

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Movie Recommendations
router.get('/recommendations/:movieId', async (req, res) => {
    const { movieId } = req.params;
    try {
        const data = await fetchFromTMDb(`/movie/${movieId}/recommendations`);
        res.json(data.results);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

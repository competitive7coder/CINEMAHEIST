const express = require('express');
const axios = require('axios');
const router = express.Router();
const NodeCache = require('node-cache'); // Using cache

// --- ADDED ---
// TODO: Make sure these paths are correct for your project!
const authMiddleware = require('../middleware/auth'); // Or '../middleware/authMiddleware' etc.
const User = require('../models/User'); // Or '../models/User.js' etc.
// --- END ADDED ---

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

// --- ADDED ---
// New helper function to get movie details for a list of IDs
// This uses your existing fetchFromTMDb function so it gets caching for free!
async function getMovieDetailsFromIds(ids) {
    // Create an array of promises, one for each movie ID
    const moviePromises = ids.map(id =>
        // We fetch full details just like your /details/:movieId route
        // Note: Using append_to_response to get videos, credits, etc.
        fetchFromTMDb(`/movie/${id}`, { append_to_response: 'videos,credits,watch/providers' })
    );
    
    // Wait for all promises to resolve
    // Promise.allSettled is safer as it won't fail if one movie ID is bad
    const results = await Promise.allSettled(moviePromises);
    
    // Filter out any failed requests and return the good data
    const movies = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
        
    return movies; // Returns an array of full movie objects
}
// --- END ADDED ---


// --- ADDED ---
// New "Recommended For You" route that calls the Python ML service
router.get("/recommendations/user", authMiddleware, async (req, res) => {
    try {
      // 1. Get the user's ID from your auth middleware
      const userId = req.user.id; // Make sure 'req.user.id' is correct
  
      // 2. Get the user's full watchlist from your database (e.g., MongoDB)
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      
      const watchlist_ids = user.watchlist; // Assumes your model stores IDs in 'watchlist'
  
      if (!watchlist_ids || watchlist_ids.length === 0) {
        // If watchlist is empty, just return an empty array
        return res.json([]); 
      }
  
      // --- THIS IS THE FIX ---
      // Use the environment variable for the deployed URL,
      // but fall back to localhost for development.
      const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:5001/recommend";
      // --- END FIX ---

      // 3. Call your Python ML Service
      console.log(`Calling ML service at: ${mlServiceUrl} with watchlist:`, watchlist_ids);
      const mlResponse = await axios.post(mlServiceUrl, {
        watchlist_ids: watchlist_ids, // Send the list as JSON
      });
  
      // 4. Get the list of IDs back from Python
      const recommendedMovieIds = mlResponse.data.recommendations;
      console.log("Received recommendations from ML service:", recommendedMovieIds);
  
      if (!recommendedMovieIds || recommendedMovieIds.length === 0) {
        return res.json([]); // If Python returns no recs, send an empty array
      }
  
      // 5. Get full movie details for those IDs using our new helper
      const movieDetails = await getMovieDetailsFromIds(recommendedMovieIds); 
      
      // 6. Send the full movie objects back to React
      res.json(movieDetails);
  
    } catch (err) {
      console.error("Error in /recommendations/user route:", err.message);
      // Pass on errors from the Python service if they exist
      if (err.response && err.response.data) {
          return res.status(500).json({ msg: "ML Service Error", detail: err.response.data });
      }
      res.status(500).send("Server Error");
    }
  });
// --- END ADDED ---


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

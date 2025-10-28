import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // <-- This was correct to comment out
import api from '../api'; // <-- You correctly imported this
import HeroSlider from './HeroSlider';
import MovieRow from './MovieRow';
import VideoModal from './VideoModal';
import { toast } from 'react-toastify';
import Top10MovieCard from './Top10MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import LoadingSpinner from './LoadingSpinner'; // Assuming you have this

const genres = [
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

const HomePage = () => {
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [top10Movies, setTop10Movies] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoKey, setVideoKey] = useState(null);

    // const API_BASE_URL = 'http://localhost:5000/api'; // <-- 1. REMOVED THIS

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [sectionsRes, top10Res, newReleasesRes] = await Promise.all([
                    // axios.get(`${API_BASE_URL}/movies/homepage-sections`), // <-- OLD
                    // axios.get(`${API_BASE_URL}/movies/top-rated-in`), // <-- OLD
                    // axios.get(`${API_BASE_URL}/movies/now-playing`) // <-- OLD
                    
                    api.get('/movies/homepage-sections'), // <-- 2. FIXED
                    api.get('/movies/top-rated-in'), // <-- 2. FIXED
                    api.get('/movies/now-playing') // <-- 2. FIXED
                ]);
                setMoviesByGenre(sectionsRes.data);
                setTop10Movies(top10Res.data.slice(0, 10));
                setNewReleases(newReleasesRes.data);
            } catch (err) {
                console.error('Error fetching movies:', err);
                toast.error("Failed to load movies. Please check your connection or try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const logActivity = async (movieId, actionType) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            // await axios.post(`${API_BASE_URL}/activity/log`, { movieId, actionType }, { headers: { 'x-auth-token': token } }); // <-- OLD
            await api.post('/activity/log', { movieId, actionType }); // <-- 3. FIXED (token is added automatically by api.js)
        } catch (err) {
            console.error('Failed to log activity:', err);
        }
    };

    // --- THIS IS THE ROBUST FIX ---
    // This function now correctly handles getting either a full 'movie' object
    // or just a 'movieId' as the parameter.
    const handleWatchTrailerClick = async (movieOrId) => {
        
        // 1. Determine if we have an object or just an ID
        const movieId = (typeof movieOrId === 'object' && movieOrId !== null) 
                            ? movieOrId.id 
                            : movieOrId;

        if (!movieId) {
            console.error("Watch trailer clicked with invalid movie data:", movieOrId);
            return;
        }

        logActivity(movieId, 'trailer_watch'); // Pass the extracted ID
        try {
            // const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/videos`); // <-- OLD
            const res = await api.get(`/movies/${movieId}/videos`); // <-- 4. FIXED
            const trailer = res.data?.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
            setVideoKey(trailer?.key || res.data?.key || null); // Find trailer, but use first key as fallback
            setShowVideoModal(true);
        } catch (err) {
            console.error('Error fetching trailer:', err);
            setVideoKey(null);
            setShowVideoModal(true);
        }
    };

    const handleAddToWatchlist = async (movie) => { 
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add to your watchlist.');
            return;
        }
        try {
            // const res = await axios.post(`${API_BASE_URL}/users/watchlist/${movie.id}`, {}, { headers: { 'x-auth-token': token } }); // <-- OLD
            const res = await api.post(`/users/watchlist/${movie.id}`, {}); // <-- 5. FIXED
            toast.success(res.data.msg);
            if (res.data.msg.includes('added')) {
                logActivity(movie.id, 'watchlist_add');
            }
        } catch (err) {
            console.error('Error updating watchlist:', err);
            toast.error('Could not update watchlist.');
        }
    };

    const handleCloseModal = () => setShowVideoModal(false);

    if (loading) {
        return <LoadingSpinner />;
    }

    const trendingMovies = moviesByGenre['Trending Now'] || [];

    return (
        <div style={{ backgroundColor: '#000000ff', minHeight: '100vh' }}>
            {trendingMovies.length > 0 && (
                <HeroSlider
                    movies={trendingMovies}
                    onWatchTrailerClick={handleWatchTrailerClick}
                    onAddToWatchlist={handleAddToWatchlist}
                />
            )}

            <div className="container-fluid">
                {/* Top 10 Movies Row */}
                {top10Movies.length > 0 && (
                    <div className="movie-row-container">
                         <h3 className="h4 text-light mb-3">Top 10 Movies in India Today</h3>
                         <Swiper
                            modules={[Navigation]}
                            spaceBetween={40}
                            slidesPerView={'auto'}
                            navigation
                         >
                            {top10Movies.map((movie, index) => (
                                <SwiperSlide key={movie.id} style={{ width: 'auto' }}>
                                    <Top10MovieCard
                                        movie={movie}
                                        rank={index + 1}
                                        onWatchTrailerClick={handleWatchTrailerClick}
                                        onWatchlistClick={handleAddToWatchlist}
                                    />
                                </SwiperSlide>
                            ))}
                         </Swiper>
                    </div>
                )}

                {/* New Releases Row */}
                {newReleases.length > 0 && (
                    <MovieRow
                        title="New Releases"
                        movies={newReleases}
                        genreId="new-releases"
                        onWatchTrailerClick={handleWatchTrailerClick}
                        onWatchlistClick={handleAddToWatchlist}
                    />
                )}
                
                {/* Standard Genre Rows */}
                {genres.map(genre => {
                    if (genre.id === 'popular') return null;
                    const movies = moviesByGenre[genre.name];
                    if (movies && movies.length > 0) {
                        return (
                            <MovieRow
                                key={genre.name}
                                title={genre.name}
                                movies={movies}
                                genreId={genre.id}
                                onWatchTrailerClick={handleWatchTrailerClick}
                                onWatchlistClick={handleAddToWatchlist}
                            />
                        );
                    }
                    return null;
                })}
            </div>
            
            <VideoModal
                show={showVideoModal}
                handleClose={handleCloseModal}
                videoKey={videoKey}
            />
        </div>
    );
};

export default HomePage;

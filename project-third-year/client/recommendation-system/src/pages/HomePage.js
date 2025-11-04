import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
// --- FIXED IMPORTS ---
import HeroSlider from '../components/home/HeroSlider';
import MovieRow from '../components/movie/MovieRow';
import VideoModal from '../components/common/VideoModal';
import Top10MovieCard from '../components/movie/Top10MovieCard';
import LoadingSpinner from '../components/common/LoadingSpinner'; 
// --- END OF FIXED IMPORTS ---
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';


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

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [sectionsRes, top10Res, newReleasesRes] = await Promise.all([
                    api.get('/movies/homepage-sections'), 
                    api.get('/movies/top-rated-in'), 
                    api.get('/movies/now-playing') 
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
            await api.post('/activity/log', { movieId, actionType });
        } catch (err) {
            console.error('Failed to log activity:', err);
        }
    };

    const handleWatchTrailerClick = async (movieOrId) => {
        const movieId = (typeof movieOrId === 'object' && movieOrId !== null) 
                            ? movieOrId.id 
                            : movieOrId;

        if (!movieId) {
            console.error("Watch trailer clicked with invalid movie data:", movieOrId);
            return;
        }

        logActivity(movieId, 'trailer_watch'); 
        try {
            const res = await api.get(`/movies/${movieId}/videos`); 
            const trailer = res.data?.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
            setVideoKey(trailer?.key || res.data?.key || null); 
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
            const res = await api.post(`/users/watchlist/${movie.id}`, {}); 
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

            <div className="container-fluid pt-5">
            
                {/* Top 10 Movies Row */}
                {top10Movies.length > 0 && (
                    <div className="movie-row-container">
                         <h3 className="h4 mb-5" style={{ color: 'white' }}>Top 10 Movies in India Today</h3>
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


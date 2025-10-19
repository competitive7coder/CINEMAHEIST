import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from './MovieCard';
import VideoModal from './VideoModal';
import { toast } from 'react-toastify';
import ProfileSettings from './ProfileSettings';
import MovieRow from './MovieRow';
import ActivityFeed from './ActivityFeed'; // Import the ActivityFeed component
import LoadingSpinner from './LoadingSpinner'; // Assuming you have this

const Dashboard = ({ setIsLoggedIn }) => {
    // State to manage which tab is currently visible
    const [activeTab, setActiveTab] = useState('watchlist'); // Default to 'watchlist'

    // State for user data
    const [userName, setUserName] = useState('');
    const [userProfilePicture, setUserProfilePicture] = useState('');
    const [userBio, setUserBio] = useState('');

    // State for movie lists
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [recSourceMovie, setRecSourceMovie] = useState(null); // Movie used for recommendations

    // Utility state
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [currentVideoKey, setCurrentVideoKey] = useState(null);

    const API_BASE_URL = 'http://localhost:5000/api';

    // Effect to fetch all necessary data when the component mounts
    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect if not logged in
                return;
            }
            try {
                // Fetch user info and watchlist IDs concurrently
                const [userRes, watchlistIdsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/auth/user`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${API_BASE_URL}/users/watchlist`, { headers: { 'x-auth-token': token } })
                ]);

                // Update user profile state
                setUserName(userRes.data.name);
                setUserProfilePicture(userRes.data.profilePicture);
                setUserBio(userRes.data.bio);

                // If watchlist has movies, fetch their details and recommendations
                if (watchlistIdsRes.data?.length > 0) {
                    const movieDetailPromises = watchlistIdsRes.data.map(id =>
                        axios.get(`${API_BASE_URL}/movies/details/${id}`)
                    );
                    const movieDetailResponses = await Promise.all(movieDetailPromises);
                    const movies = movieDetailResponses.map(res => res.data);
                    setWatchlistMovies(movies);

                    // Fetch recommendations based on a random movie from the watchlist
                    if (movies.length > 0) {
                        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                        setRecSourceMovie(randomMovie);
                        const recRes = await axios.get(`${API_BASE_URL}/movies/recommendations/${randomMovie.id}`);
                        setRecommendations(recRes.data);
                    }
                } else {
                    setWatchlistMovies([]); // Ensure watchlist is empty if no IDs found
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                // Log out user if fetching data fails (e.g., invalid token)
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                navigate('/login');
            } finally {
                setLoading(false); // Stop loading state
            }
        };
        fetchDashboardData();
    }, [navigate, setIsLoggedIn]); // Dependencies for useEffect

    // Handlers for updating profile info (called from ProfileSettings)
    const handleNameUpdate = (newName) => setUserName(newName);
    const handleBioUpdate = (newBio) => setUserBio(newBio);
    const handlePictureUpdate = (newUrl) => setUserProfilePicture(newUrl);

    // Handler to open the trailer modal
    const handleWatchTrailerClick = async (movieId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/videos`);
            setCurrentVideoKey(res.data?.key || null);
            setShowVideoModal(true);
        } catch (err) {
            console.error('Error fetching trailer:', err);
            toast.error("Could not load trailer.");
        }
    };

    // Handler to close the trailer modal
    const handleCloseVideoModal = () => setShowVideoModal(false);

    // Handler to add a movie to the watchlist (used in Recommendations row)
    const handleAddToWatchlist = async (movieId) => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error('Please log in first.'); return; }
        try {
            const res = await axios.post(`${API_BASE_URL}/users/watchlist/${movieId}`, {}, { headers: { 'x-auth-token': token } });
            toast.success(res.data.msg);
            // Optionally, refresh watchlist data or add movie to local state if needed
        } catch (err) {
            toast.error('Could not update watchlist.');
        }
    };

    // Handler to remove a movie from the watchlist (used in Watchlist tab)
    const handleRemoveFromWatchlist = async (movieId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_BASE_URL}/users/watchlist/${movieId}`, {}, { headers: { 'x-auth-token': token } });
            setWatchlistMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId)); // Update UI instantly
            toast.info('Movie removed from your watchlist.');
        } catch (err) {
            console.error('Error removing from watchlist:', err);
            toast.error("Could not remove movie.");
        }
    };

    // Handler for the logout button
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        toast.info('You have been logged out.');
        navigate('/login');
    };

    // Display loading spinner while data is fetching
    if (loading) {
        return <LoadingSpinner />;
    }

    // Main component render
    return (
        <div className="container" style={{ color: 'white' }}>
            {/* Header section with profile picture, name, and bio */}
            <div className="d-flex align-items-center mb-3 border-bottom pb-3">
                <img
                    src={userProfilePicture || 'https://via.placeholder.com/80?text=User'} // Placeholder image
                    alt="Profile"
                    className="rounded-circle me-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div>
                    <h1 className="h2 mb-0">Welcome, {userName || 'User'}!</h1>
                    <p className="text-muted mb-0 fst-italic">{userBio || 'No bio yet.'}</p>
                </div>
            </div>

            {/* Main content area with sidebar and tab content */}
            <div className="row">
                {/* Sidebar Navigation */}
                <div className="col-md-3">
                    <ul className="nav nav-pills flex-column bg-dark p-3 rounded-3">
                        <li className="nav-item">
                            <button className={`nav-link text-start w-100 ${activeTab === 'watchlist' ? 'active' : 'text-light'}`} onClick={() => setActiveTab('watchlist')}>
                                <i className="bi bi-collection-play-fill me-2"></i> Your Watchlist
                            </button>
                        </li>
                        <li className="nav-item mt-2">
                            <button className={`nav-link text-start w-100 ${activeTab === 'recommendations' ? 'active' : 'text-light'}`} onClick={() => setActiveTab('recommendations')}>
                               <i className="bi bi-magic me-2"></i> For You
                            </button>
                        </li>
                        <li className="nav-item mt-2">
                            <button className={`nav-link text-start w-100 ${activeTab === 'history' ? 'active' : 'text-light'}`} onClick={() => setActiveTab('history')}>
                                <i className="bi bi-clock-history me-2"></i> Viewing History
                            </button>
                        </li>
                        <li className="nav-item mt-2">
                            <button className={`nav-link text-start w-100 ${activeTab === 'settings' ? 'active' : 'text-light'}`} onClick={() => setActiveTab('settings')}>
                                <i className="bi bi-person-circle me-2"></i> Account Settings
                            </button>
                        </li>
                         <li className="nav-item mt-4">
                            <button onClick={handleLogout} className="btn btn-outline-danger w-100">Log Out</button>
                        </li>
                    </ul>
                </div>

                {/* Tab Content Area */}
                <div className="col-md-9">
                    {/* Watchlist Tab Content */}
                    {activeTab === 'watchlist' && (
                        <div>
                            <h3 className="mb-4">Your Watchlist</h3>
                            {watchlistMovies.length > 0 ? (
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                    {watchlistMovies.map(movie => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onWatchTrailerClick={handleWatchTrailerClick}
                                            onWatchlistClick={handleRemoveFromWatchlist}
                                            isOnWatchlistPage={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">You haven't added any movies to your watchlist yet.</p>
                            )}
                        </div>
                    )}

                    {/* Recommendations Tab Content */}
                    {activeTab === 'recommendations' && (
                        <div>
                            <h3 className="mb-4">Recommendations</h3>
                            {recommendations.length > 0 && recSourceMovie ? (
                                <MovieRow
                                    title={`Because you like "${recSourceMovie.title}"`}
                                    movies={recommendations}
                                    onWatchTrailerClick={handleWatchTrailerClick}
                                    onWatchlistClick={handleAddToWatchlist}
                                />
                            ) : (
                                <p className="text-muted">Add movies to your watchlist to get recommendations.</p>
                            )}
                        </div>
                    )}

                    {/* Viewing History Tab Content */}
                    {activeTab === 'history' && <ActivityFeed />}

                    {/* Account Settings Tab Content */}
                    {activeTab === 'settings' && (
                        <div>
                            <h3 className="mb-4">Account Settings</h3>
                            <ProfileSettings
                                userName={userName}
                                userBio={userBio}
                                onNameUpdate={handleNameUpdate}
                                onBioUpdate={handleBioUpdate}
                                onPictureUpdate={handlePictureUpdate}
                            />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Video Modal (used by multiple sections) */}
            <VideoModal
                show={showVideoModal}
                handleClose={handleCloseVideoModal}
                videoKey={currentVideoKey}
            />
        </div>
    );
};

export default Dashboard;
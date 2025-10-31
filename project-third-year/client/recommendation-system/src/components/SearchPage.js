import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // --- 1. REMOVED
import api from '../api'; // --- 1. ADDED
import MovieCard from './MovieCard';
import VideoModal from './VideoModal';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import { Form, Button, Spinner } from 'react-bootstrap';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const initialYear = searchParams.get('year') || '';
    const navigate = useNavigate();

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoKey, setVideoKey] = useState(null);
    const [filterYear, setFilterYear] = useState(initialYear);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    // const API_BASE_URL = 'http://localhost:5000/api'; // --- 2. REMOVED

    // Memoized fetch function for search results
    const fetchSearchResults = useCallback(async (page = 1, loadMore = false) => {
        if (!query) return; // Exit if no query
        if (!loadMore) {
            setLoading(true);
            if (page === 1) setSearchResults([]); // Clear results on new search/filter/page 1
        } else {
            setLoadingMore(true);
        }

        try {
            const params = { query, page };
            if (filterYear) params.year = filterYear; // Add year filter if selected
            // const res = await axios.get(`${API_BASE_URL}/movies/search`, { params }); // --- 3. OLD
            const res = await api.get(`/movies/search`, { params }); // --- 3. FIXED
            setSearchResults(prev => loadMore ? [...prev, ...res.data.results] : res.data.results);
            setTotalPages(res.data.totalPages); // Get total pages from the backend response
        } catch (err) {
            console.error('Error fetching search results:', err);
            toast.error('Could not fetch search results.');
            setSearchResults([]); // Clear results on error
        } finally {
            setLoading(false); // Always turn off main loading spinner
            setLoadingMore(false); // Always turn off "load more" spinner
        }
    }, [query, filterYear]); // Dependencies: re-create function if query or year changes

    // Effect runs on initial load and when query or filterYear changes
    useEffect(() => {
        if (!query) { navigate('/'); return; } // Redirect home if no query
        window.scrollTo(0, 0); // Scroll to top
        setCurrentPage(1); // Reset to page 1 for new search/filter
        fetchSearchResults(1, false); // Fetch the first page
    }, [query, filterYear, navigate, fetchSearchResults]); // Dependencies for the effect

    // Handler for the "Load More" button
    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchSearchResults(nextPage, true); // Fetch the next page and append results
    };

    // Handler for changing the year filter dropdown
    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setFilterYear(newYear); // Update local state
        const newSearchParams = new URLSearchParams(searchParams);
        if (newYear) newSearchParams.set('year', newYear);
        else newSearchParams.delete('year'); // Remove if "All Years" selected
        navigate({ search: newSearchParams.toString() }, { replace: true });
    };

    // --- Functions for card actions ---
    const logActivity = async (movieId, actionType) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            // await axios.post(`${API_BASE_URL}/activity/log`, { movieId, actionType }, { headers: { 'x-auth-token': token } }); // --- 4. OLD
            await api.post(`/activity/log`, { movieId, actionType }); // --- 4. FIXED
        } catch (err) {
            console.error('Failed to log activity:', err);
        }
    };

    const handleWatchTrailerClick = async (movieId) => {
        logActivity(movieId, 'trailer_watch');
        try {
            // const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/videos`); // --- 5. OLD
            const res = await api.get(`/movies/${movieId}/videos`); // --- 5. FIXED
            setVideoKey(res.data?.key || null);
        } catch (err) {
            console.error('Error fetching trailer:', err);
            setVideoKey(null);
        } finally {
            setShowVideoModal(true);
        }
    };

    // ================== THIS IS THE FIX ==================
    const handleAddToWatchlist = async (movie) => { // <-- Changed from (movieId) to (movie)
        const token = localStorage.getItem('token');
        if (!token) { toast.error('Please log in to add to your watchlist.'); return; }
        try {
            // Use movie.id for the API call
            // const res = await axios.post(`${API_BASE_URL}/users/watchlist/${movie.id}`, {}, { headers: { 'x-auth-token': token } }); // --- 6. OLD
            const res = await api.post(`/users/watchlist/${movie.id}`, {}); // --- 6. FIXED
            toast.success(res.data.msg);
            
            // Use movie.id for logging
            if (res.data.msg.includes('added')) logActivity(movie.id, 'watchlist_add');
        } catch (err) {
            console.error('Error updating watchlist:', err);
            toast.error('Could not update watchlist.');
        }
    };
    // =====================================================

    const handleCloseVideoModal = () => setShowVideoModal(false);
    // --- End of Functions ---

    // Show main loader only on initial load (page 1)
    if (loading && currentPage === 1) return <LoadingSpinner />;

    // Generate year options for the filter dropdown
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <div className="container-fluid" style={{ color: 'white' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2 className="mb-0 me-3">Search Results for "{query}"</h2>
                <Form.Select
                    aria-label="Filter by year"
                    value={filterYear}
                    onChange={handleYearChange}
                    style={{ width: '150px' }}
                    className="bg-dark text-light border-secondary form-select-sm ms-auto"
                    size="sm"
                >
                    <option value="">All Years</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </Form.Select>
            </div>

            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
                {searchResults.length > 0 ? (
                    searchResults.map(movie => (
                        <MovieCard
                            key={`${movie.id}-${currentPage}`}
                            movie={movie}
                            onWatchTrailerClick={handleWatchTrailerClick}
                            onWatchlistClick={handleAddToWatchlist} // This now correctly passes the 'movie' object to the fixed function
                        />
                    ))
                ) : (
                    !loading && <p className="text-muted col-12">No movies found matching your criteria.</p>
                )}
            </div>

            <div className="text-center mt-5 mb-4">
                {currentPage < totalPages && !loadingMore && (
                    <Button variant="outline-light" onClick={handleLoadMore}>Load More</Button>
                )}
                {loadingMore && <Spinner animation="border" variant="light" />}
            </div>

            <VideoModal show={showVideoModal} handleClose={handleCloseVideoModal} videoKey={videoKey} />
        </div>
    );
};

export default SearchPage;

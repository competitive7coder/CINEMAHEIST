import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './MovieDetailModal.css'; // We'll create this CSS file next

const MovieDetailModal = ({ show, handleClose, movieId, onWatchTrailer }) => {
    const [movieDetails, setMovieDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!movieId) {
                setMovieDetails(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // Fetch basic movie details
                const detailRes = await axios.get(`http://localhost:5000/api/movies/details/${movieId}`);
                setMovieDetails(detailRes.data);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setMovieDetails(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    // Format runtime from minutes to "Xh Ym"
    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const posterUrl = movieDetails?.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`
        : movieDetails?.poster_path
        ? `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`
        : 'https://via.placeholder.com/1280x720?text=No+Image';

    return (
        <Modal show={show} onHide={handleClose} dialogClassName="movie-detail-modal" centered>
            <Modal.Body className="p-0 bg-dark text-light">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <Spinner animation="border" variant="light" />
                    </div>
                ) : movieDetails ? (
                    <>
                        <div className="detail-header" style={{ backgroundImage: `url(${posterUrl})` }}>
                            <Modal.Header closeButton closeVariant="white" className="border-0 p-3">
                                {/* Title and close button */}
                            </Modal.Header>
                            <div className="detail-overlay">
                                <div className="detail-info">
                                    <h1 className="detail-title">{movieDetails.title}</h1>
                                    <div className="detail-actions">
                                        <Button 
                                            variant="primary" 
                                            className="watch-now-btn"
                                            onClick={() => onWatchTrailer(movieId)} // Trigger watch trailer
                                        >
                                            <i className="bi bi-play-fill me-2"></i> Watch Now
                                        </Button>
                                        <Button variant="secondary" className="add-to-list-btn">
                                            <i className="bi bi-plus"></i>
                                        </Button>
                                    </div>
                                    <div className="detail-meta">
                                        <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                                        <span className="bullet-point">•</span>
                                        <span>U/A 13+</span> {/* This is a placeholder, TMDB doesn't provide this directly */}
                                        <span className="bullet-point">•</span>
                                        <span>{formatRuntime(movieDetails.runtime)}</span>
                                        <span className="bullet-point">•</span>
                                        <span><i className="bi bi-star-fill text-warning"></i> {movieDetails.vote_average.toFixed(1)}</span>
                                        {/* You can add languages here if fetched */}
                                    </div>
                                    <p className="detail-overview">{movieDetails.overview}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="p-4">No details available for this movie.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default MovieDetailModal;
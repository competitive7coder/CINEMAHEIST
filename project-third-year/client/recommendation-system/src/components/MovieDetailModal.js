import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

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

    // ====== Inline Styles ======
    const styles = {
        movieDetailModal: {
            maxWidth: '800px', // Adjust as needed
            width: '90%',
        },
        modalContent: {
            backgroundColor: '#1a1a1a', // Dark background
            borderRadius: '10px',
            border: 'none',
            overflow: 'hidden', // Ensures image corners are rounded
        },
        modalHeader: {
            position: 'absolute', // Position over the image
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 10, // Ensure close button is clickable
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)', // Fades out
            borderBottom: 'none',
            padding: '1rem',
        },
        closeButton: {
            filter: 'invert(1)', // Makes close button white
        },
        detailHeader: {
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '10px 10px 0 0', // Match modal content border-radius
            backgroundImage: `url(${posterUrl})`,
        },
        detailOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 100%)',
            display: 'flex',
            alignItems: 'flex-end', // Push content to bottom
            padding: '30px',
            boxSizing: 'border-box',
            color: 'white',
        },
        detailInfo: {
            maxWidth: '600px', // Limit width of text content
        },
        detailTitle: {
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '15px',
        },
        detailActions: {
            display: 'flex',
            gap: '15px',
            marginBottom: '20px',
        },
        watchNowBtn: {
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            fontWeight: 'bold',
            padding: '10px 25px',
            borderRadius: '5px',
            transition: 'background-color 0.2s',
        },
        addToListBtn: {
            backgroundColor: 'rgba(109, 109, 110, 0.7)',
            color: 'white',
            border: 'none',
            fontSize: '1.5rem',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
        },
        detailMeta: {
            fontSize: '1rem',
            color: '#a0a0a0',
            marginBottom: '15px',
        },
        bulletPoint: {
            margin: '0 5px',
        },
        detailOverview: {
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#e0e0e0',
        },
    };

    return (
        <Modal show={show} onHide={handleClose} dialogClassName="movie-detail-modal" centered style={styles.movieDetailModal}>
            <Modal.Body style={styles.modalContent}>
                {loading ? (
                    <LoadingSpinner/>
                ) : movieDetails ? (
                    <>
                        <div style={styles.detailHeader}>
                            <Modal.Header closeButton closeVariant="white" style={styles.modalHeader}>
                                {/* Title and close button */}
                            </Modal.Header>
                            <div style={styles.detailOverlay}>
                                <div style={styles.detailInfo}>
                                    <h1 style={styles.detailTitle}>{movieDetails.title}</h1>
                                    <div style={styles.detailActions}>
                                        <Button 
                                            variant="primary" 
                                            style={styles.watchNowBtn}
                                            onClick={() => onWatchTrailer(movieId)} // Trigger watch trailer
                                        >
                                            <i className="bi bi-play-fill me-2"></i> Watch Now
                                        </Button>
                                        <Button variant="secondary" style={styles.addToListBtn}>
                                            <i className="bi bi-plus"></i>
                                        </Button>
                                    </div>
                                    <div style={styles.detailMeta}>
                                        <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                                        <span style={styles.bulletPoint}>•</span>
                                        <span>U/A 13+</span> {/* Placeholder */}
                                        <span style={styles.bulletPoint}>•</span>
                                        <span>{formatRuntime(movieDetails.runtime)}</span>
                                        <span style={styles.bulletPoint}>•</span>
                                        <span><i className="bi bi-star-fill text-warning"></i> {movieDetails.vote_average.toFixed(1)}</span>
                                        {/* Languages or other meta can go here */}
                                    </div>
                                    <p style={styles.detailOverview}>{movieDetails.overview}</p>
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

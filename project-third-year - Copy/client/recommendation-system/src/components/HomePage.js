import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieRow from './MovieRow';
import VideoModal from './VideoModal';

const genres = [
    { id: 'popular', name: 'Trending Now' },
    { id: 28, name: 'Action Packed' },
    { id: 878, name: 'Science Fiction' },
    { id: 10749, name: 'Romantic Movies' },
    { id: 53, name: 'Thriller Tales' },
];

const HomePage = () => {
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [videoKey, setVideoKey] = useState(null);

    const API_BASE_URL = 'http://localhost:5000/api/movies';

    useEffect(() => {
        const fetchAllGenres = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/homepage-sections`);
                setMoviesByGenre(res.data);
            } catch (err) {
                console.error('Error fetching movies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllGenres();
    }, []);

    const handleCardClick = async (movieId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/${movieId}/videos`);
            if (res.data && res.data.key) {
                setVideoKey(res.data.key);
            } else {
                setVideoKey(null);
            }
            setShowModal(true);
        } catch (err) {
            console.error('Error fetching trailer:', err);
            setVideoKey(null);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#141414' }}>
                <div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#141414', paddingTop: '80px', minHeight: '100vh' }}>
            <div className="container-fluid">
                {genres.map(genre => {
                    const movies = moviesByGenre[genre.name];
                    if (movies && movies.length > 0) {
                        return (
                            <MovieRow
                                key={genre.name}
                                title={genre.name}
                                movies={movies}
                                genreId={genre.id}
                                onCardClick={handleCardClick}
                            />
                        );
                    }
                    return null;
                })}
            </div>
            <VideoModal
                show={showModal}
                handleClose={handleCloseModal}
                videoKey={videoKey}
            />
        </div>
    );
};

export default HomePage;
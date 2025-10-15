import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from './MovieCard';

const GENRE_MAP = {
    'popular': 'Trending Now',
    '28': 'Action Packed',
    '35': 'Comedy Movies',
    '27': 'Horror Flicks',
    '10749': 'Romantic Movies',
    '878': 'Science Fiction',
    '53': 'Thriller Tales',
};

const GenrePage = () => {
    const { genreId } = useParams();
    const genreName = GENRE_MAP[genreId] || 'Movies';

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            setLoading(true);
            try {
                const url = genreId === 'popular'
                    ? `http://localhost:5000/api/movies/popular`
                    : `http://localhost:5000/api/movies/genre/${genreId}`;
                
                const res = await axios.get(url);
                setMovies(res.data);
            } catch (err) {
                console.error('Error fetching movies by genre:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesByGenre();
    }, [genreId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 80px)' }}>
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={{ color: 'white', paddingTop: '80px' }}>
            <h2 className="mb-4">{genreName}</h2>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default GenrePage;
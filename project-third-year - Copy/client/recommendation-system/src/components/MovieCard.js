import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie, onCardClick }) => {
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : 'https://via.placeholder.com/240x360?text=No+Image';

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';
    const description = movie.overview ? movie.overview : 'No description available.';

    return (
        <div className="movie-card" onClick={() => onCardClick(movie.id)}>
            <img src={posterUrl} alt={movie.title} className="movie-card-img" />
            <div className="card-overlay">
                <div className="overlay-content">
                    <h5 className="card-title text-truncate">{movie.title}</h5>
                    <div className="card-info small text-muted">
                        <span>{year}</span>
                        <span className="mx-2">|</span>
                        <span><i className="bi bi-star-fill text-warning"></i> {rating}</span>
                    </div>
                </div>
            </div>
            <div className="play-button">
                <i className="bi bi-play-circle-fill"></i>
            </div>
        </div>
    );
};

export default MovieCard;
import React from 'react';
import MovieCard from './MovieCard'; // We will now use the main MovieCard

const Top10MovieCard = ({ movie, rank, onWatchTrailerClick, onWatchlistClick }) => {
    // CSS for positioning the number and the card
    const componentStyles = `
        .top-10-wrapper {
            display: flex;
            align-items: center;
        }
        .rank-number {
            font-size: 8rem;
            font-weight: bold;
            color: #141414;
            -webkit-text-stroke: 3px #a0a0a0;
            text-stroke: 3px #a0a0a0;
            transform: translateX(20px);
            z-index: 1;
            pointer-events: none; /* Allows clicks to pass through to the card */
        }
        .top-10-wrapper .card {
            margin-left: -40px; /* Overlap the number */
        }
    `;

    return (
        <>
            <style>{componentStyles}</style>
            <div className="top-10-wrapper">
                <div className="rank-number">{rank}</div>
                <MovieCard 
                    movie={movie}
                    onWatchTrailerClick={onWatchTrailerClick}
                    onWatchlistClick={onWatchlistClick}
                />
            </div>
        </>
    );
};

export default Top10MovieCard;
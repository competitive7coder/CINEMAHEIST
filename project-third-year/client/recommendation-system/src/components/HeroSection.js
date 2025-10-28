import React from 'react';

const HeroSection = ({ movie, onWatchTrailerClick, onAddToWatchlist }) => {
    if (!movie) {
        return null; // Don't render if there is no featured movie
    }

    const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

    // All the CSS for this component is defined here as a string
    const componentStyles = `
        .hero-container {
            height: 85vh;
            width: 100%;
            color: white;
            display: flex;
            align-items: flex-end; /* Aligns content to the bottom */
            background-size: cover;
            background-position: center center;
            position: relative;
            margin-bottom: 2rem;
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            /* Gradient from black at the bottom to transparent at the top */
            background: linear-gradient(to top, rgba(0, 0, 0, 1) 10%, rgba(20, 20, 20, 0) 50%);
        }

        .hero-content {
            position: relative;
            z-index: 10;
            padding: 2rem 4rem;
            max-width: 50%;
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: bold;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        }

        .hero-overview {
            font-size: 1.1rem;
            margin-top: 1rem;
            max-width: 600px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .hero-buttons {
            margin-top: 1.5rem;
        }

        .hero-buttons .btn {
            padding: 0.75rem 1.5rem;
            font-size: 1.1rem;
            font-weight: bold;
            margin-right: 1rem;
            border-radius: 5px;
        }
    `;

    return (
        <>
            {/* We inject the styles directly into the document head */}
            <style>{componentStyles}</style>
            
            <div className="hero-container" style={{ backgroundImage: `url(${backdropUrl})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">{movie.title}</h1>
                    <p className="hero-overview">{movie.overview}</p>
                    <div className="hero-buttons">
                        <button className="btn btn-light" onClick={() => onWatchTrailerClick(movie.id)}>
                            <i className="bi bi-play-fill me-2"></i> Watch Trailer
                        </button>
                        <button className="btn btn-secondary" onClick={() => onAddToWatchlist(movie.id)}>
                            <i className="bi bi-plus-lg me-2"></i> Add to Watchlist
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeroSection;
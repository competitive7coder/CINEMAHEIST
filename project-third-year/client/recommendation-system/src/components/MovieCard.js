import React from 'react';
import { useNavigate } from 'react-router-dom'; // No 'Link' component needed

const MovieCard = ({ movie, onWatchTrailerClick, onWatchlistClick, isOnWatchlistPage = false }) => {
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Safely construct the poster URL
   const posterUrl = movie.poster_path
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : 'https://placehold.co/270x350?text=No+Image';
 // Placeholder if no poster

    // Safely get year and rating
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';
    const description = movie.overview || 'No description available.';

    // --- REMOVED Letterboxd link ---

    // Function to handle clicking the main card area (and now the "Watch" button)
    const handleCardClick = () => {
        navigate(`/movie/${movie.id}`); // Navigate to the detail page
    };

    // Handler for the Watch Trailer button
    const handleTrailerButtonClick = (e) => {
        e.stopPropagation(); // Prevent the card's main click (navigation)
        if (typeof onWatchTrailerClick === "function") {
            onWatchTrailerClick(movie.id); // Passing ID as requested
        }
    };

    // Handler for the Watchlist button
    const handleWatchlistButtonClick = (e) => {
        e.stopPropagation(); // Prevent the card's main click (navigation)
        onWatchlistClick(movie);
    };

    // --- Inject your CSS directly here ---
    const styles = `
.card {
  position: relative;
  width: 300px;    
  height: 350px; 
  border-radius: 12px;
  overflow: hidden;
  perspective: 1000px;
  cursor: pointer;
  box-shadow: 0 0 0 3px #000000;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              box-shadow 0.6s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
}


.card-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.6s ease, transform 0.6s ease;
}

.card:hover .card-poster {
  filter: brightness(0.4) blur(4px);
  transform: scale(1.05);
}


.play-button {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.85);
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
}

.card:hover .play-button {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.15);
  cursor: pointer;
}


.card__content {
  position: absolute;
  bottom: 0;            
  left: 0;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0); 
  color: #fff;
  transform: translateY(100%);
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.card:hover .card__content {
  transform: translateY(0px);
}

.card__title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.card__info {
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  color: #e0e0e0;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.card__description {
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  color: #c0c0c0;
  line-height: 1.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}


.card__buttons {
    display: flex;
    gap: 10px;
    margin-top: 1rem;
    width: 100%;
}

/* Base style for all 3 buttons */
.btn-watch, .btn-trailer, .btn-add {
    flex-grow: 1;
    border: none;
    border-radius: 5px;
    padding: 8px 5px;
    font-weight: 600;
    font-size: 0.8rem;
    transition: background-color 0.2s;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

/* Red "Watch" button */
.btn-watch {
    background-color: #e50914; /* Red */
    color: white;
}
.btn-watch:hover {
    background-color: #f40612;
}

/* White "Trailer" button */
.btn-trailer {
    background-color: white;
    color: black;
}
.btn-trailer:hover {
    background-color: #e6e6e6;
}

/* Blue "Add" button (Watchlist) */
.btn-add {
    background-color: #1a73e8; /* Blue */
    color: white;
}
.btn-add:hover {
    background-color: #1b66c9;
}
`;

    return (
        <>
            <style>{styles}</style>
            <div className="card" onClick={handleCardClick}>
                <img src={posterUrl} alt={movie.title} className="card-poster" />
                <div className="card__content">
                    <h5 className="card__title">{movie.title}</h5>
                    <div className="card__info">
                        <span><i className="bi bi-star-fill text-warning"></i> {rating}</span>
                        <span className="mx-2">|</span>
                        <span>{year}</span>
                    </div>
                    <p className="card__description">{description}</p>
                    
                    {/* --- UPDATED BUTTON LAYOUT --- */}
                    <div className="card__buttons">
                        
                        {/* 1. Watch (Now navigates to detail page) */}
                        <button
                            className="btn-watch"
                            onClick={(e) => {
                                e.stopPropagation(); // Stop card click from firing twice
                                handleCardClick();  // Explicitly call navigation
                            }}
                        >
                           <i className="bi bi-eye-fill"></i> Watch
                        </button>
                        
                        {/* 2. Trailer */}
                        <button
                            className="btn-trailer"
                            onClick={handleTrailerButtonClick}
                        >
                            <i className="bi bi-play-fill"></i> Trailer
                        </button>
                        
                        {/* 3. Add (Watchlist) */}
                        <button
                            className="btn-add"
                            onClick={handleWatchlistButtonClick}
                        >
                            {isOnWatchlistPage ? (
                                <><i className="bi bi-trash-fill"></i> Remove</>
                            ) : (
                                <><i className="bi bi-plus-lg"></i> Add</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MovieCard;
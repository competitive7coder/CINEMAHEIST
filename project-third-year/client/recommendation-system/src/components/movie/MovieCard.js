import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";

const MovieCard = ({
  movie,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  isInWatchlist: isInWatchlistProp = null,
  isOnWatchlistPage = false,
}) => {
  const navigate = useNavigate();
  const [showWatchModal, setShowWatchModal] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/200x300?text=No+Image";

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "N/A";
  const isInWatchlist =
    isInWatchlistProp !== null
      ? isInWatchlistProp
      : watchlist.includes(movie.id);

  const handleCardClick = () => navigate(`/movie/${movie.id}`);

  const stopAndAction = (e, callback) => {
    e.stopPropagation();
    if (callback) callback(movie);
  };

  const handleWatchNow = (e) => {
    e.stopPropagation();
    setShowWatchModal(true);
  };

  const styles = `
  .mc-card {
    position: relative;
    width: 100%; /* Fills the grid column */
    max-width: 160px;
    aspect-ratio: 2 / 3;
    border-radius: 10px;
    overflow: hidden;
    background: #111;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }

  /* Desktop Hover Effects */
  @media (min-width: 992px) {
    .mc-card:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);
      z-index: 50;
    }
    .mc-card:hover .mc-poster { filter: brightness(0.3); transform: scale(1.1); }
    .mc-card:hover .mc-overlay { opacity: 1; transform: translateY(0); }
    .mc-card:hover .mc-rating-badge { opacity: 0; }
  }

  .mc-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease, filter 0.4s ease;
  }

  .mc-rating-badge {
    position: absolute;
    top: 8px; right: 8px;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    border-radius: 5px;
    padding: 2px 6px;
    font-size: 0.7rem;
    font-weight: 700;
    color: #ffd700;
    z-index: 2;
    transition: opacity 0.3s;
  }

  /* Mobile/Tablet Title Bar */
  .mc-mobile-info {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 20px 8px 8px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    z-index: 3;
  }

  .mc-mobile-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Desktop Overlay (Buttons) */
  .mc-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
    background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 100%);
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    z-index: 4;
  }

  @media (max-width: 991px) { .mc-overlay { display: none; } }

  .mc-btn-now {
  width: 100%;
  background: rgba(255,255,255,0.92);
  color: #0a0a0a;
  border: none;
  border-radius: 5px;
  padding: 7px;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.mc-btn-now:hover {
  background: #ffffff;
  transform: translateY(-1px);
}

.mc-btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }

.mc-small-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.85);
  font-size: 0.65rem;
  font-weight: 600;
  padding: 5px 4px;
  border-radius: 5px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mc-small-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.6);
  color: #fff;
}

.mc-small-btn.saved {
  background: transparent;
  border-color: #2ecc71;
  color: #2ecc71;
}

.mc-small-btn.saved:hover {
  background: rgba(46, 204, 113, 0.12);
}
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="mc-card" onClick={handleCardClick}>
        <img src={posterUrl} alt={movie.title} className="mc-poster" />
        <div className="mc-rating-badge">⭐ {rating}</div>

        {/* Mobile Info */}
        <div className="mc-mobile-info d-lg-none">
          <p className="mc-mobile-title">{movie.title}</p>
        </div>

        {/* Desktop Hover Overlay */}
        <div className="mc-overlay">
          <h6
            className="text-white fw-bold mb-1 text-truncate"
            style={{ fontSize: "0.85rem" }}
          >
            {movie.title}
          </h6>
          <div
            className="d-flex gap-2 mb-2"
            style={{ fontSize: "0.7rem", color: "#aaa" }}
          >
            <span>{year}</span>
            <span className="text-warning">⭐ {rating}</span>
          </div>

          <button className="mc-btn-now" onClick={handleWatchNow}>
            ▶ Watch Now
          </button>

          <div className="mc-btn-row">
            <button
              className="mc-small-btn"
              onClick={(e) => stopAndAction(e, onWatchTrailerClick)}
            >
              Trailer
            </button>
            <button
              className={`mc-small-btn ${isInWatchlist ? "saved" : ""}`}
              onClick={(e) => stopAndAction(e, onWatchlistClick)}
            >
              {isInWatchlist ? "✓ Saved" : "+ Save"}
            </button>
          </div>
        </div>
      </div>

      <WatchMovieModal
        show={showWatchModal}
        handleClose={() => setShowWatchModal(false)}
        tmdbId={movie.id}
        movieTitle={movie.title}
      />
    </>
  );
};

export default MovieCard;

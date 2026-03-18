import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";

const MovieCard = ({
  movie,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  isInWatchlist: isInWatchlistProp = null,
  isOnWatchlistPage = false
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

  const description = movie.overview || "No description available.";

  const isInWatchlist =
    isInWatchlistProp !== null
      ? isInWatchlistProp
      : watchlist.includes(movie.id);

  // Mobile — just navigate directly on tap
  // Desktop — overlay handles the buttons
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (onWatchTrailerClick) onWatchTrailerClick(movie);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (onWatchlistClick) onWatchlistClick(movie);
  };

  const handleWatchNow = (e) => {
    e.stopPropagation();
    setShowWatchModal(true);
  };

  const styles = `
  .mc-card {
    position: relative;
    width: 160px;
    height: 240px;
    border-radius: 10px;
    overflow: hidden;
    background: #111;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                box-shadow 0.4s ease;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  @media (max-width: 768px) {
    .mc-card {
      width: 120px;
      height: 180px;
      border-radius: 8px;
    }
  }

  @media (max-width: 380px) {
    .mc-card {
      width: 105px;
      height: 158px;
    }
  }

  /* Desktop hover lift */
  @media (min-width: 769px) {
    .mc-card:hover {
      transform: translateY(-8px) scale(1.03);
      box-shadow:
        0 24px 50px rgba(0,0,0,0.8),
        0 0 0 1px rgba(255,255,255,0.06);
      z-index: 50;
    }
  }

  /* ── Poster ── */
  .mc-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease, filter 0.4s ease;
  }

  @media (min-width: 769px) {
    .mc-card:hover .mc-poster {
      transform: scale(1.08);
      filter: brightness(0.25);
    }
  }

  /* ── Rating badge — always visible ── */
  .mc-rating-badge {
    position: absolute;
    top: 7px;
    right: 7px;
    background: rgba(0,0,0,0.78);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: 3px 7px;
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.65rem;
    font-weight: 700;
    color: #ffd700;
    font-family: 'Poppins', sans-serif;
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.3s ease;
  }

  @media (min-width: 769px) {
    .mc-card:hover .mc-rating-badge {
      opacity: 0;
    }
  }

  /* ── Bottom gradient — always on mobile for title ── */
  .mc-bottom-gradient {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 70px;
    background: linear-gradient(to top, rgba(0,0,0,0.92), transparent);
    pointer-events: none;
    z-index: 2;
  }

  /* Hide on desktop — overlay handles this */
  @media (min-width: 769px) {
    .mc-bottom-gradient { display: none; }
  }

  /* ── Mobile title — always visible at bottom ── */
  .mc-mobile-title {
    position: absolute;
    bottom: 7px;
    left: 8px; right: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    color: #fff;
    z-index: 3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    pointer-events: none;
  }

  /* Hide on desktop */
  @media (min-width: 769px) {
    .mc-mobile-title { display: none; }
  }

  /* ── Desktop overlay — hover only ── */
  .mc-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px 9px 9px;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.97) 0%,
      rgba(0,0,0,0.65) 55%,
      transparent 100%
    );
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 3;
  }

  /* Only show on desktop hover */
  @media (min-width: 769px) {
    .mc-card:hover .mc-overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Always hide overlay on mobile */
  @media (max-width: 768px) {
    .mc-overlay { display: none; }
  }

  /* ── Overlay title ── */
  .mc-title {
    font-family: 'Poppins', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 3px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── Meta ── */
  .mc-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 8px;
  }

  .mc-year {
    font-family: 'Poppins', sans-serif;
    font-size: 0.62rem;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
  }

  .mc-dot {
    width: 2px; height: 2px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    flex-shrink: 0;
  }

  .mc-rating-inline {
    font-family: 'Poppins', sans-serif;
    font-size: 0.62rem;
    color: #ffd700;
    font-weight: 600;
  }

  /* ── Description ── */
  .mc-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 9px;
  }

  /* ── Buttons ── */
  .mc-buttons {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .mc-btn-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }

  .mc-btn {
    border: none;
    border-radius: 6px;
    padding: 7px 4px;
    font-size: 0.62rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: all 0.2s ease;
    font-family: 'Poppins', sans-serif;
    white-space: nowrap;
    position: relative;
    z-index: 10;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .mc-btn-now {
    width: 100%;
    background: #e50914;
    color: #fff;
    padding: 8px 4px;
    font-size: 0.68rem;
    border-radius: 6px;
  }

  .mc-btn-now:hover { background: #ff1a1a; box-shadow: 0 3px 14px rgba(229,9,20,0.5); }

  .mc-btn-trailer {
    background: rgba(255,255,255,0.88);
    color: #111;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .mc-btn-trailer:hover { background: #fff; }

  .mc-btn-add {
    background: rgba(26,115,232,0.15);
    color: #60a5fa;
    border: 1px solid rgba(26,115,232,0.25);
  }

  .mc-btn-add:hover { background: rgba(26,115,232,0.3); border-color: rgba(26,115,232,0.5); color: #93c5fd; }

  .mc-btn-remove {
    background: rgba(198,40,40,0.12);
    color: #f87171;
    border: 1px solid rgba(198,40,40,0.2);
  }

  .mc-btn-remove:hover { background: rgba(198,40,40,0.25); border-color: rgba(198,40,40,0.4); color: #fca5a5; }

  /* ── Border glow desktop only ── */
  @media (min-width: 769px) {
    .mc-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0);
      transition: border-color 0.35s ease;
      pointer-events: none;
      z-index: 4;
    }

    .mc-card:hover::after {
      border-color: rgba(255,255,255,0.08);
    }
  }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="mc-card" onClick={handleCardClick}>

        {/* Poster */}
        <img src={posterUrl} alt={movie.title} className="mc-poster" />

        {/* Rating badge — always visible */}
        <div className="mc-rating-badge">⭐ {rating}</div>

        {/* Mobile only — bottom gradient + title, no buttons */}
        <div className="mc-bottom-gradient" />
        <p className="mc-mobile-title">{movie.title}</p>

        {/* Desktop only — full overlay with buttons on hover */}
        <div className="mc-overlay">
          <h5 className="mc-title">{movie.title}</h5>

          <div className="mc-meta">
            <span className="mc-year">{year}</span>
            <div className="mc-dot" />
            <span className="mc-rating-inline">⭐ {rating}</span>
          </div>

          <p className="mc-desc">{description}</p>

          <div className="mc-buttons">
            <button className="mc-btn mc-btn-now" onClick={handleWatchNow}>
              <i className="bi bi-play-fill"></i> Watch Now
            </button>
            <div className="mc-btn-row">
              <button className="mc-btn mc-btn-trailer" onClick={handleTrailerClick}>
                <i className="bi bi-film"></i> Trailer
              </button>
              <button
                className={`mc-btn ${isOnWatchlistPage || isInWatchlist ? "mc-btn-remove" : "mc-btn-add"}`}
                onClick={handleWatchlistClick}
              >
                {isOnWatchlistPage || isInWatchlist ? (
                  <><i className="bi bi-check-lg"></i> Saved</>
                ) : (
                  <><i className="bi bi-plus-lg"></i> Save</>
                )}
              </button>
            </div>
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
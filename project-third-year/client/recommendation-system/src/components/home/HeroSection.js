import React, { useState } from "react";
import WatchMovieModal from "../movie/WatchMovieModal";
import { BsFillPlayFill, BsFilm, BsPlusLg } from "react-icons/bs";

const HeroSection = ({ movie, onWatchTrailerClick, onAddToWatchlist }) => {
  const [showWatchModal, setShowWatchModal] = useState(false);

  if (!movie) return null;

  const backdropUrl = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  const componentStyles = `
    .hs-container {
      height: 85vh;
      min-height: 500px;
      width: 100%;
      color: white;
      display: flex;
      align-items: flex-end;
      background-size: cover;
      background-position: center center;
      position: relative;
      margin-bottom: 2rem;
      font-family: 'Poppins', sans-serif;
    }

    .hs-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top,
          rgba(0,0,0,1)    0%,
          rgba(0,0,0,0.85) 20%,
          rgba(0,0,0,0.5)  50%,
          rgba(0,0,0,0.1)  80%,
          transparent      100%
        ),
        linear-gradient(to right,
          rgba(0,0,0,0.7) 0%,
          rgba(0,0,0,0.2) 50%,
          transparent     80%
        );
    }

    .hs-content {
      position: relative;
      z-index: 10;
      padding: 0 4rem 4rem;
      max-width: 600px;
    }

    .hs-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .hs-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .hs-badge-live    { background: #e50914; color: #fff; }
    .hs-badge-rating  { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #facc15; }
    .hs-badge-year    { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }

    .hs-title {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 900;
      line-height: 1;
      letter-spacing: -1px;
      color: #fff;
      margin: 0 0 12px;
      text-shadow: 0 2px 30px rgba(0,0,0,0.7);
    }

    .hs-accent {
      display: block;
      width: 50px;
      height: 3px;
      background: linear-gradient(to right, #ff0000, transparent);
      border-radius: 2px;
      margin: 12px 0 16px;
    }

    .hs-overview {
      font-size: 0.95rem;
      line-height: 1.65;
      color: rgba(220,220,220,0.8);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 24px;
      font-weight: 300;
      max-width: 500px;
    }

    .hs-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .hs-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 0.88rem;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .hs-btn-watchnow {
      background: #e50914;
      color: #fff;
      box-shadow: 0 4px 20px rgba(229,9,20,0.4);
    }

    .hs-btn-watchnow:hover {
      background: #ff1a1a;
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(229,9,20,0.5);
    }

    .hs-btn-trailer {
      background: #fff;
      color: #000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .hs-btn-trailer:hover {
      background: #f0f0f0;
      transform: translateY(-3px);
    }

    .hs-btn-watchlist {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(12px);
    }

    .hs-btn-watchlist:hover {
      background: rgba(255,255,255,0.15);
      border-color: rgba(255,255,255,0.4);
      transform: translateY(-3px);
    }

    @media (max-width: 768px) {
      .hs-content { padding: 0 1.5rem 3rem; max-width: 100%; }
      .hs-title { font-size: clamp(2rem, 8vw, 3rem); }
      .hs-overview { font-size: 0.85rem; -webkit-line-clamp: 2; }
      .hs-btn { padding: 10px 18px; font-size: 0.82rem; }
    }

    @media (max-width: 480px) {
      .hs-container { height: 70vh; min-height: 420px; }
      .hs-content { padding: 0 1rem 2.5rem; }
      .hs-overview { display: none; }
      .hs-btn { padding: 9px 14px; font-size: 0.78rem; }
    }
  `;

  return (
    <>
      <style>{componentStyles}</style>

      <div
        className="hs-container"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="hs-overlay" />

        <div className="hs-content">
          <div className="hs-meta">
            <span className="hs-badge hs-badge-live">✦ Featured</span>
            {rating && (
              <span className="hs-badge hs-badge-rating">★ {rating}</span>
            )}
            {year && <span className="hs-badge hs-badge-year">{year}</span>}
          </div>

          <h1 className="hs-title">{movie.title}</h1>
          <div className="hs-accent" />

          {movie.overview && <p className="hs-overview">{movie.overview}</p>}

          <div className="hs-buttons">
            <button
              className="hs-btn hs-btn-watchnow"
              onClick={() => setShowWatchModal(true)}
            >
              <BsFillPlayFill /> Watch Now
            </button>

            <button
              className="hs-btn hs-btn-trailer"
              onClick={() => onWatchTrailerClick(movie.id)}
            >
              <BsFilm />
              Trailer
            </button>

            <button
              className="hs-btn hs-btn-watchlist"
              onClick={() => onAddToWatchlist(movie.id)}
            >
              <BsPlusLg /> My List
            </button>
          </div>
        </div>
      </div>

      <WatchMovieModal
        show={showWatchModal}
        handleClose={() => setShowWatchModal(false)}
        tmdbId={movie?.id}
        movieTitle={movie?.title}
      />
    </>
  );
};

export default HeroSection;

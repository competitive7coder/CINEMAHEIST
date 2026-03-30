import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";

const MovieCard = ({
  movie,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  isInWatchlist: isInWatchlistProp = null,
}) => {
  const navigate = useNavigate();
  const [showWatchModal, setShowWatchModal] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
    : "https://placehold.co/200x300?text=No+Image";

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "N/A";
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const genre = movie.genres?.[0]?.name ?? null;

  const isInWatchlist =
    isInWatchlistProp !== null
      ? isInWatchlistProp
      : watchlist.includes(movie.id);

  const stop = (e, cb) => { e.stopPropagation(); cb?.(movie); };

  const css = `
    .mc {
      position: relative;
      width: 100%;
      max-width: 160px;
      aspect-ratio: 2 / 3;
      border-radius: 12px;
      overflow: hidden;
      background: #111;
      cursor: pointer;
      flex-shrink: 0;
      transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
                  box-shadow 0.35s ease;
      -webkit-tap-highlight-color: transparent;
    }

    @media (min-width: 992px) {
      .mc:hover {
        transform: translateY(-10px) scale(1.03);
        box-shadow: 0 24px 48px rgba(0,0,0,0.7), 0 8px 16px rgba(0,0,0,0.4);
      }
      .mc:hover .mc-poster  { transform: scale(1.08); filter: brightness(0.25) saturate(0.6); }
      .mc:hover .mc-shine   { opacity: 1; }
      .mc:hover .mc-badge   { opacity: 0; transform: scale(0.8); }
      .mc:hover .mc-genre   { opacity: 0; transform: scale(0.8); }
      .mc:hover .mc-overlay { opacity: 1; transform: translateY(0); }
      .mc:hover .mc-title   { opacity: 1; transform: translateY(0); }
      .mc:hover .mc-meta    { opacity: 1; transform: translateY(0); }
      .mc:hover .mc-watch   { opacity: 1; transform: translateY(0); }
      .mc:hover .mc-row     { opacity: 1; transform: translateY(0); }
    }

    .mc-poster {
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      transition: transform 0.4s ease, filter 0.35s ease;
    }

    .mc-shine {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%);
      pointer-events: none; z-index: 1;
      opacity: 0; transition: opacity 0.3s ease;
    }

    .mc-badge {
      position: absolute; top: 9px; right: 9px;
      background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
      border-radius: 6px; padding: 3px 7px;
      font-size: 11px; font-weight: 700; color: #ffd700; z-index: 2;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    .mc-genre {
      position: absolute; top: 9px; left: 9px;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
      border-radius: 5px; padding: 2px 6px;
      font-size: 9.5px; font-weight: 600;
      color: rgba(255,255,255,0.7); letter-spacing: 0.4px;
      text-transform: uppercase; z-index: 2;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    .mc-bottom {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 28px 12px 12px;
      background: linear-gradient(to top, rgba(0,0,0,0.92), transparent);
      z-index: 3;
    }
    .mc-mobile-title {
      font-size: 11.5px; font-weight: 600; color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .mc-overlay {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 14px; z-index: 4;
      opacity: 0; transform: translateY(6px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    @media (max-width: 991px) { .mc-overlay { display: none; } }

    .mc-title {
      font-size: 13px; font-weight: 600; color: #fff;
      margin-bottom: 3px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      opacity: 0; transform: translateY(4px);
      transition: opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s;
    }
    .mc-meta {
      font-size: 10.5px; color: rgba(255,255,255,0.5);
      margin-bottom: 10px;
      opacity: 0; transform: translateY(4px);
      transition: opacity 0.3s ease 0.08s, transform 0.3s ease 0.08s;
    }

    .mc-watch {
      width: 100%; background: #fff; color: #111;
      border: none; border-radius: 7px; padding: 8px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.6px;
      text-transform: uppercase; cursor: pointer; margin-bottom: 7px;
      display: flex; align-items: center; justify-content: center; gap: 5px;
      opacity: 0; transform: translateY(6px);
      transition: opacity 0.3s ease 0.11s, transform 0.3s ease 0.11s, background 0.15s;
    }
    .mc-watch:hover  { background: #f0f0f0; }
    .mc-watch:active { transform: scale(0.97) !important; }

    .mc-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
      opacity: 0; transform: translateY(6px);
      transition: opacity 0.3s ease 0.14s, transform 0.3s ease 0.14s;
    }
    .mc-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.22);
      color: rgba(255,255,255,0.75);
      font-size: 10px; font-weight: 600; padding: 5px 4px;
      border-radius: 6px; letter-spacing: 0.5px;
      text-transform: uppercase; cursor: pointer;
      transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
    }
    .mc-btn:hover  { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.5); color: #fff; }
    .mc-btn:active { transform: scale(0.95); }
    .mc-btn.saved  { border-color: rgba(46,204,113,0.7); color: #2ecc71; }
    .mc-btn.saved:hover { background: rgba(46,204,113,0.1); }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="mc" onClick={() => navigate(`/movie/${movie.id}`)}>
        <img src={posterUrl} alt={movie.title} className="mc-poster" loading="lazy" decoding="async" />
        <div className="mc-shine" />

        {genre && <div className="mc-genre">{genre}</div>}
        <div className="mc-badge">⭐ {rating}</div>

        {/* Mobile title bar */}
        <div className="mc-bottom d-lg-none">
          <div className="mc-mobile-title">{movie.title}</div>
        </div>

        {/* Desktop staggered overlay */}
        <div className="mc-overlay">
          <div className="mc-title">{movie.title}</div>
          <div className="mc-meta">
            {year}{rating !== "N/A" && ` · ★ ${rating}`}{runtime && ` · ${runtime}`}
          </div>
          <button
            className="mc-watch"
            onClick={(e) => { e.stopPropagation(); setShowWatchModal(true); }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <polygon points="2,1 11,6 2,11" fill="#111" />
            </svg>
            Watch Now
          </button>
          <div className="mc-row">
            <button className="mc-btn" onClick={(e) => stop(e, onWatchTrailerClick)}>
              Trailer
            </button>
            <button
              className={`mc-btn ${isInWatchlist ? "saved" : ""}`}
              onClick={(e) => stop(e, onWatchlistClick)}
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
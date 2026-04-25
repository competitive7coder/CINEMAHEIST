import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";
import { toMovieSlug } from "../../utils/movieSlug";

if (typeof document !== "undefined" && !document.getElementById("mc-styles")) {
  const tag = document.createElement("style");
  tag.id = "mc-styles";
  tag.textContent = `
  
    .mc {
      position: relative;
      width: 154px;
      height: 231px;
      border-radius: 10px;
      overflow: hidden;
      background: #111;
      border: 1px solid rgba(255,255,255,0.06);
      cursor: pointer;
      flex-shrink: 0;
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                  box-shadow 0.4s ease,
                  border-color 0.3s ease;
      -webkit-tap-highlight-color: transparent;
      font-family: 'DM Sans', sans-serif;
    }

    @media (min-width: 992px) {
      .mc:hover {
        transform: translateY(-10px) scale(1.04);
        box-shadow: 0 40px 80px rgba(0,0,0,0.9),
                    0 0 0 1px rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.14);
      }
      .mc:hover .mc-poster  { transform: scale(1.08); filter: brightness(0.18) saturate(0.4); }
      .mc:hover .mc-rating  { opacity: 0; }
      .mc:hover .mc-genre   { opacity: 0; }
      .mc:hover .mc-foot    { opacity: 0; }
      .mc:hover .mc-overlay { opacity: 1; }
      .mc:hover .mc-ol-inner { transform: translateY(0); }
    }

    /* poster */
    .mc-poster {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      transition: transform 0.5s ease, filter 0.4s ease;
    }

    /* always-on vignette */
    .mc-vignette {
      position: absolute; inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0,0,0,0) 30%,
        rgba(0,0,0,0.72) 70%,
        rgba(0,0,0,0.95) 100%
      );
      z-index: 2;
      pointer-events: none;
    }

    /* genre — top left, plain label */
    .mc-genre {
      position: absolute; top: 10px; left: 10px; z-index: 4;
      font-size: 8px; font-weight: 700;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase; letter-spacing: 1.2px;
      transition: opacity 0.25s ease;
    }

    /* rating — top right, slim pill */
    .mc-rating {
      position: absolute; top: 10px; right: 10px; z-index: 4;
      display: flex; align-items: center; gap: 3px;
      font-size: 10px; font-weight: 600;
      color: #e8c96e;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 0.5px solid rgba(232,201,110,0.3);
      border-radius: 5px; padding: 3px 7px;
      letter-spacing: 0.2px;
      transition: opacity 0.25s ease;
    }
    .mc-rating svg { flex-shrink: 0; }

    /* always-visible footer */
    .mc-foot {
      position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
      padding: 10px 12px;
      transition: opacity 0.25s ease;
    }
    .mc-foot-title {
      font-size: 11.5px; font-weight: 600; color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      line-height: 1.3; margin-bottom: 2px;
    }
    .mc-foot-meta {
      font-size: 9.5px; color: rgba(255,255,255,0.35);
      letter-spacing: 0.3px;
    }

    /* hover overlay */
    .mc-overlay {
      position: absolute; inset: 0; z-index: 5;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 14px 12px;
      opacity: 0;
      transition: opacity 0.32s ease;
    }
    @media (max-width: 991px) { .mc-overlay { display: none; } }

    .mc-ol-inner {
      transform: translateY(8px);
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
    }

    .mc-ol-title {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-size: 17px; color: #fff; line-height: 1.15;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .mc-ol-meta {
      font-size: 9px; color: rgba(255,255,255,0.38);
      letter-spacing: 0.4px; margin-bottom: 13px;
    }

    /* Watch Now CTA */
    .mc-watch {
      width: 100%;
      background: rgba(255,255,255,0.92);
      color: #0a0a0a;
      border: none; border-radius: 6px;
      padding: 8px 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 700;
      letter-spacing: 1.2px; text-transform: uppercase;
      cursor: pointer; margin-bottom: 8px;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .mc-watch:hover  { background: #fff; }
    .mc-watch:active { transform: scale(0.97); }

    /* Trailer / Save row */
    .mc-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
    }
    .mc-btn {
      background: transparent;
      border: 0.5px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.55);
      font-family: 'DM Sans', sans-serif;
      font-size: 9px; font-weight: 600;
      padding: 6px 4px; border-radius: 5px;
      letter-spacing: 0.8px; text-transform: uppercase;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
    }
    .mc-btn:hover {
      border-color: rgba(255,255,255,0.45);
      color: rgba(255,255,255,0.9);
      background: rgba(255,255,255,0.06);
    }
    .mc-btn:active { transform: scale(0.95); }
    .mc-btn.saved {
      border-color: rgba(74,222,128,0.5);
      color: #4ade80;
      background: rgba(74,222,128,0.06);
    }
    .mc-btn.saved:hover { background: rgba(74,222,128,0.12); }

    /* Mobile sizes */
    @media (max-width: 768px) {
      .mc { width: 120px; height: 180px; }
    }
    @media (max-width: 400px) {
      .mc { width: 110px; height: 165px; }
    }
  `;
  document.head.appendChild(tag);
}

const MovieCard = ({
  movie,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  isInWatchlist: isInWatchlistProp = null,
}) => {
  const navigate = useNavigate();
  const [showWatchModal, setShowWatchModal] = useState(false);

  if (!movie) return null;

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "N/A";
  const runtime = movie.runtime ? `${movie.runtime}m` : null;
  const genre = movie.genres?.[0]?.name ?? null;

  const isInWatchlist =
    isInWatchlistProp !== null
      ? isInWatchlistProp
      : watchlist.includes(movie.id);

  const stop = (e, cb) => {
    e.stopPropagation();
    cb?.(movie);
  };

  return (
    <>
      <div className="mc" onClick={() => navigate(`/movie/${toMovieSlug(movie)}`)}>
        <img
          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
          srcSet={`
            https://image.tmdb.org/t/p/w185${movie.poster_path} 185w,
            https://image.tmdb.org/t/p/w342${movie.poster_path} 342w
          `}
          sizes="(max-width: 400px) 110px, (max-width: 768px) 120px, 154px"
          alt={movie.title}
          className="mc-poster"
          loading="lazy"
          decoding="async"
        />
        <div className="mc-vignette" />

        {genre && <div className="mc-genre">{genre}</div>}

        {rating !== "N/A" && (
          <div className="mc-rating">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#e8c96e">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {rating}
          </div>
        )}

        <div className="mc-foot">
          <div className="mc-foot-title">{movie.title}</div>
          <div className="mc-foot-meta">
            {year}
            {runtime && ` · ${runtime}`}
          </div>
        </div>

        <div className="mc-overlay">
          <div className="mc-ol-inner">
            <div className="mc-ol-title">{movie.title}</div>
            <div className="mc-ol-meta">
              {year}
              {rating !== "N/A" && ` · ★ ${rating}`}
              {runtime && ` · ${runtime}`}
            </div>
            <button
              className="mc-watch"
              onClick={(e) => {
                e.stopPropagation();
                setShowWatchModal(true);
              }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12">
                <polygon points="2,1 11,6 2,11" fill="#0a0a0a" />
              </svg>
              Watch Now
            </button>
            <div className="mc-row">
              <button className="mc-btn" onClick={(e) => stop(e, onWatchTrailerClick)}>
                Trailer
              </button>
              <button
                className={`mc-btn${isInWatchlist ? " saved" : ""}`}
                onClick={(e) => stop(e, onWatchlistClick)}
              >
                {isInWatchlist ? "✓ Saved" : "+ Save"}
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
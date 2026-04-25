import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";
import { toMovieSlug } from "../../utils/movieSlug";

if (typeof document !== "undefined" && !document.getElementById("top10-styles")) {
  const tag = document.createElement("style");
  tag.id = "top10-styles";
  tag.textContent = `

    .t10-card {
      position: relative;
      width: 154px;
      height: 231px;
      border-radius: 12px;
      overflow: hidden;
      background: #0e0e0e;
      border: 1px solid rgba(255,255,255,0.08);
      cursor: pointer;
      flex-shrink: 0;
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                  box-shadow 0.4s ease,
                  border-color 0.3s ease;
      font-family: 'DM Sans', sans-serif;
    }

    @media (min-width: 992px) {
      .t10-card:hover {
        transform: translateY(-10px) scale(1.04);
        box-shadow: 0 40px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.12);
        border-color: rgba(255,255,255,0.16);
      }
      .t10-card:hover .t10-poster   { transform: scale(1.07); filter: brightness(0.15) saturate(0.3); }
      .t10-card:hover .t10-rating   { opacity: 0; transform: translateY(-4px); }
      .t10-card:hover .t10-rank     { opacity: 0; }
      .t10-card:hover .t10-overlay  { opacity: 1; }
      .t10-card:hover .t10-ol-inner { transform: translateY(0); }
    }

    .t10-poster {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease, filter 0.4s ease;
    }

    .t10-gloss {
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      z-index: 5; pointer-events: none;
    }

    .t10-vignette {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%),
        linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.88) 100%);
      z-index: 2; pointer-events: none;
    }

    .t10-rank {
      position: absolute;
      bottom: -14px; left: -7px;
      font-family: 'Bebas Neue', 'Arial Black', Impact, sans-serif;
      font-size: 8.5rem; line-height: 1; letter-spacing: -3px;
      color: transparent;
      -webkit-text-stroke: 2.5px rgba(200,200,200,0.55);
      background: linear-gradient(165deg, rgba(255,255,255,0.8) 0%, rgba(100,100,100,0.3) 55%, transparent 100%);
      -webkit-background-clip: text; background-clip: text;
      z-index: 3; user-select: none; pointer-events: none;
      transition: opacity 0.22s ease;
    }

    .t10-rating {
      position: absolute; top: 10px; right: 10px; z-index: 4;
      display: flex; align-items: center; gap: 3px;
      font-size: 10px; font-weight: 600; color: #e8c96e;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 0.5px solid rgba(232,201,110,0.28);
      border-radius: 5px; padding: 3px 7px; letter-spacing: 0.2px;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }

    .t10-overlay {
      position: absolute; inset: 0; z-index: 5;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 14px 12px; opacity: 0;
      transition: opacity 0.32s ease;
    }

    .t10-ol-inner {
      transform: translateY(8px);
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .t10-ol-title {
      font-family: 'Instrument Serif', serif; font-style: italic;
      font-size: 17px; color: #fff; line-height: 1.15;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .t10-ol-meta {
      font-size: 9px; color: rgba(255,255,255,0.38);
      letter-spacing: 0.4px; margin-bottom: 13px;
    }
    .t10-watch {
      width: 100%; background: rgba(255,255,255,0.92); color: #0a0a0a;
      border: none; border-radius: 6px; padding: 8px 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
      cursor: pointer; margin-bottom: 8px;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: background 0.15s, transform 0.1s;
    }
    .t10-watch:hover  { background: #fff; }
    .t10-watch:active { transform: scale(0.97); }

    .t10-row { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .t10-btn {
      background: transparent;
      border: 0.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.55);
      font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 600;
      padding: 6px 4px; border-radius: 5px; letter-spacing: 0.8px; text-transform: uppercase;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .t10-btn:hover  { border-color: rgba(255,255,255,0.45); color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
    .t10-btn.saved  { border-color: rgba(74,222,128,0.5); color: #4ade80; background: rgba(74,222,128,0.06); }
    .t10-btn.saved:hover { background: rgba(74,222,128,0.12); }
  `;
  document.head.appendChild(tag);
}

const Top10MovieCard = ({
  movie,
  rank,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  isInWatchlist: isInWatchlistProp = null,
}) => {
  const navigate = useNavigate();
  const [showWatchModal, setShowWatchModal] = useState(false);

  if (!movie) return null;

  const year    = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const rating  = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "N/A";
  const runtime = movie.runtime ? `${movie.runtime}m` : null;

  const isInWatchlist =
    isInWatchlistProp !== null ? isInWatchlistProp : watchlist.includes(movie.id);

  const stop = (e, cb) => { e.stopPropagation(); cb?.(movie); };

  return (
    <>
      <div className="t10-card" onClick={() => navigate(`/movie/${toMovieSlug(movie)}`)}>
        <img
          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
          srcSet={`
            https://image.tmdb.org/t/p/w185${movie.poster_path} 185w,
            https://image.tmdb.org/t/p/w342${movie.poster_path} 342w
          `}
          sizes="154px"
          alt={movie.title}
          className="t10-poster"
          loading="lazy"
          decoding="async"
        />
        <div className="t10-vignette" />
        <div className="t10-gloss" />
        <span className="t10-rank">{rank}</span>

        {rating !== "N/A" && (
          <div className="t10-rating">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#e8c96e">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {rating}
          </div>
        )}

        <div className="t10-overlay">
          <div className="t10-ol-inner">
            <div className="t10-ol-title">{movie.title}</div>
            <div className="t10-ol-meta">
              {year}{rating !== "N/A" && ` · ★ ${rating}`}{runtime && ` · ${runtime}`}
            </div>
            <button
              className="t10-watch"
              onClick={(e) => { e.stopPropagation(); setShowWatchModal(true); }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12">
                <polygon points="2,1 11,6 2,11" fill="#0a0a0a" />
              </svg>
              Watch Now
            </button>
            <div className="t10-row">
              <button className="t10-btn" onClick={(e) => stop(e, onWatchTrailerClick)}>Trailer</button>
              <button
                className={`t10-btn${isInWatchlist ? " saved" : ""}`}
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

export default Top10MovieCard;
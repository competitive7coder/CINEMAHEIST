import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";

if (typeof document !== "undefined" && !document.getElementById("top10-styles")) {
  const tag = document.createElement("style");
  tag.id = "top10-styles";
  tag.textContent = `
    .t10-card {
      position: relative;
      width: 154px;
      height: 231px;
      border-radius: 14px;
      overflow: hidden;
      background: #0d0d0d;
      cursor: pointer;
      flex-shrink: 0;
      transition: transform 0.38s cubic-bezier(0.34,1.28,0.64,1),
                  box-shadow 0.38s ease;
      font-family: 'DM Sans', sans-serif;
    }

    @media (min-width: 992px) {
      .t10-card:hover {
        transform: translateY(-12px) scale(1.05);
        box-shadow: 0 32px 56px rgba(0,0,0,0.8), 0 8px 20px rgba(0,0,0,0.5);
      }
      .t10-card:hover .t10-poster   { filter: brightness(0.22) saturate(0.5); }
      .t10-card:hover .t10-rank     { opacity: 0; }
      .t10-card:hover .t10-badge    { opacity: 0; }
      .t10-card:hover .t10-foot     { opacity: 0; }
      .t10-card:hover .t10-overlay  { opacity: 1; }
      .t10-card:hover .t10-ol-inner { transform: translateY(0); }
    }

    .t10-poster {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      transition: filter 0.38s ease;
    }

    /* rank — top left, big, behind everything except poster */
    .t10-rank {
      position: absolute;
      bottom: -16px;
      left: -8px;
      font-size: 9rem;
      font-weight: 900;
      font-family: 'Bebas Neue', 'Arial Black', Impact, sans-serif;
      line-height: 1;
      letter-spacing: -4px;
      color: transparent;
      -webkit-text-stroke: 3px rgba(180,180,180,0.6);
      background: linear-gradient(
        170deg,
        rgba(255,255,255,0.85) 0%,
        rgba(150,150,150,0.4) 50%,
        rgba(0,0,0,0) 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      z-index: 3;
      user-select: none;
      pointer-events: none;
      transition: opacity 0.22s ease;
    }

    .t10-badge {
      position: absolute; top: 10px; right: 10px; z-index: 4;
      display: flex; align-items: center; gap: 4px;
      background: rgba(10,10,10,0.72);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,215,0,0.25);
      border-radius: 8px; padding: 4px 8px;
      font-size: 11px; font-weight: 600; color: #ffd700;
      transition: opacity 0.22s ease;
    }

    .t10-foot {
      position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
      padding: 32px 11px 11px;
      background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
      transition: opacity 0.25s ease;
    }

    .t10-foot-year {
      font-size: 10px; color: rgba(255,255,255,0.42);
    }

    .t10-overlay {
      position: absolute; inset: 0; z-index: 5;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 14px 13px;
      opacity: 0;
      transition: opacity 0.32s ease;
    }

    .t10-ol-inner {
      transform: translateY(10px);
      transition: transform 0.32s cubic-bezier(0.22,1,0.36,1);
    }

    .t10-ol-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px; letter-spacing: 0.8px;
      color: #fff; line-height: 1.1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 3px;
    }

    .t10-ol-meta {
      font-size: 10px; color: rgba(255,255,255,0.45);
      margin-bottom: 12px;
    }

    .t10-watch {
      width: 100%; background: #fff; color: #0d0d0d;
      border: none; border-radius: 8px; padding: 9px 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      cursor: pointer; margin-bottom: 8px;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: background 0.15s;
    }
    .t10-watch:hover { background: #ececec; }

    .t10-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 7px;
    }

    .t10-btn {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.7);
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 600;
      padding: 6px 4px; border-radius: 7px;
      letter-spacing: 0.5px; text-transform: uppercase;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .t10-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
    .t10-btn.saved { border-color: rgba(52,211,153,0.55); color: #34d399; background: rgba(52,211,153,0.08); }
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

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "https://placehold.co/154x231?text=No+Image";

  const year    = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const rating  = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "N/A";
  const runtime = movie.runtime ? `${movie.runtime}m` : null;

  const isInWatchlist =
    isInWatchlistProp !== null ? isInWatchlistProp : watchlist.includes(movie.id);

  const stop = (e, cb) => { e.stopPropagation(); cb?.(movie); };

  return (
    <>
      <div className="t10-card" onClick={() => navigate(`/movie/${movie.id}`)}>
        <img src={posterUrl} alt={movie.title} className="t10-poster" loading="lazy" decoding="async" />

        {/* rank overlaid bottom-left on the poster */}
        <span className="t10-rank">{rank}</span>

        {rating !== "N/A" && (
          <div className="t10-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffd700">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {rating}
          </div>
        )}

        <div className="t10-foot">
          <div className="t10-foot-year">{year}{runtime && ` · ${runtime}`}</div>
        </div>

        <div className="t10-overlay">
          <div className="t10-ol-inner">
            <div className="t10-ol-title">{movie.title}</div>
            <div className="t10-ol-meta">
              {year}{rating !== "N/A" && ` · ★ ${rating}`}{runtime && ` · ${runtime}`}
            </div>
            <button className="t10-watch" onClick={(e) => { e.stopPropagation(); setShowWatchModal(true); }}>
              <svg width="11" height="11" viewBox="0 0 12 12">
                <polygon points="2,1 11,6 2,11" fill="#0d0d0d" />
              </svg>
              Watch Now
            </button>
            <div className="t10-row">
              <button className="t10-btn" onClick={(e) => stop(e, onWatchTrailerClick)}>Trailer</button>
              <button className={`t10-btn${isInWatchlist ? " saved" : ""}`} onClick={(e) => stop(e, onWatchlistClick)}>
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
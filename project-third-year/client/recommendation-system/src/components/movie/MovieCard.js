import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";

/* ─── inject once at module level, never per-render ─────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("mc-styles")) {
  const tag = document.createElement("style");
  tag.id = "mc-styles";
  tag.textContent = `

    .mc {
      position: relative;
      width: 154px;
      height: 231px;          /* strict 2:3 — every card identical */
      border-radius: 14px;
      overflow: hidden;
      background: #0d0d0d;
      cursor: pointer;
      flex-shrink: 0;
      transition: transform 0.38s cubic-bezier(0.34,1.28,0.64,1),
                  box-shadow 0.38s ease;
      -webkit-tap-highlight-color: transparent;
      font-family: 'DM Sans', sans-serif;
    }

    @media (min-width: 992px) {
      .mc:hover {
        transform: translateY(-12px) scale(1.05);
        box-shadow:
          0 32px 56px rgba(0,0,0,0.8),
          0 8px 20px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.07);
      }
      .mc:hover .mc-poster   { transform: scale(1.1); filter: brightness(0.22) saturate(0.5); }
      .mc:hover .mc-badge    { opacity: 0; transform: translateY(-4px); }
      .mc:hover .mc-genre    { opacity: 0; transform: translateY(-4px); }
      .mc:hover .mc-foot     { opacity: 0; }
      .mc:hover .mc-overlay  { opacity: 1; }
      .mc:hover .mc-ol-inner { transform: translateY(0); }
    }

    /* poster */
    .mc-poster {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover; display: block;
      transition: transform 0.42s ease, filter 0.38s ease;
    }

    /* ambient glow at top */
    .mc-shine {
      position: absolute; inset: 0;
      background: linear-gradient(145deg, rgba(255,255,255,0.055) 0%, transparent 45%);
      pointer-events: none; z-index: 1;
    }

    /* rating badge — top right */
    .mc-badge {
      position: absolute; top: 10px; right: 10px; z-index: 3;
      display: flex; align-items: center; gap: 4px;
      background: rgba(10,10,10,0.72);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,215,0,0.25);
      border-radius: 8px; padding: 4px 8px;
      font-size: 11px; font-weight: 600;
      color: #ffd700; letter-spacing: 0.3px;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    .mc-badge svg { flex-shrink: 0; }

    /* genre pill — top left */
    .mc-genre {
      position: absolute; top: 10px; left: 10px; z-index: 3;
      background: rgba(10,10,10,0.65);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px; padding: 3px 7px;
      font-size: 9px; font-weight: 600;
      color: rgba(255,255,255,0.65);
      text-transform: uppercase; letter-spacing: 0.8px;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }

    /* bottom title bar (always visible) */
    .mc-foot {
      position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
      padding: 32px 11px 11px;
      background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%);
      transition: opacity 0.25s ease;
    }
    .mc-foot-title {
      font-size: 12px; font-weight: 600; color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      line-height: 1.3;
    }
    .mc-foot-year {
      font-size: 10px; color: rgba(255,255,255,0.42);
      margin-top: 2px;
    }

    /* hover overlay */
    .mc-overlay {
      position: absolute; inset: 0; z-index: 4;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 14px 13px;
      opacity: 0;
      transition: opacity 0.32s ease;
    }
    @media (max-width: 991px) { .mc-overlay { display: none; } }

    .mc-ol-inner {
      transform: translateY(10px);
      transition: transform 0.32s cubic-bezier(0.22,1,0.36,1);
    }

    .mc-ol-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px; letter-spacing: 0.8px;
      color: #fff; line-height: 1.1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 3px;
    }
    .mc-ol-meta {
      font-size: 10px; color: rgba(255,255,255,0.45);
      margin-bottom: 12px; letter-spacing: 0.3px;
    }

    /* Watch Now CTA */
    .mc-watch {
      width: 100%;
      background: #fff;
      color: #0d0d0d;
      border: none; border-radius: 8px;
      padding: 9px 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      cursor: pointer; margin-bottom: 8px;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: background 0.15s ease, transform 0.12s ease;
    }
    .mc-watch:hover  { background: #ececec; }
    .mc-watch:active { transform: scale(0.97); }

    /* Trailer / Save row */
    .mc-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 7px;
    }
    .mc-btn {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.7);
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 600;
      padding: 6px 4px; border-radius: 7px;
      letter-spacing: 0.5px; text-transform: uppercase;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
    }
    .mc-btn:hover  {
      background: rgba(255,255,255,0.14);
      border-color: rgba(255,255,255,0.4);
      color: #fff;
    }
    .mc-btn:active { transform: scale(0.95); }
    .mc-btn.saved  {
      border-color: rgba(52,211,153,0.55);
      color: #34d399;
      background: rgba(52,211,153,0.08);
    }
    .mc-btn.saved:hover { background: rgba(52,211,153,0.14); }
  `;
  document.head.appendChild(tag);
}

/* ─── component ─────────────────────────────────────────────────────────── */
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

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`  // upgraded from w185
    : "https://placehold.co/154x231?text=No+Image";

  const year    = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const rating  = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "N/A";
  const runtime = movie.runtime ? `${movie.runtime}m` : null;
  const genre   = movie.genres?.[0]?.name ?? null;

  const isInWatchlist =
    isInWatchlistProp !== null ? isInWatchlistProp : watchlist.includes(movie.id);

  const stop = (e, cb) => { e.stopPropagation(); cb?.(movie); };

  return (
    <>
      <div className="mc" onClick={() => navigate(`/movie/${movie.id}`)}>
        <img
          src={posterUrl}
          alt={movie.title}
          className="mc-poster"
          loading="lazy"
          decoding="async"
        />
        <div className="mc-shine" />

        {/* badges */}
        {genre && <div className="mc-genre">{genre}</div>}
        {rating !== "N/A" && (
          <div className="mc-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffd700">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {rating}
          </div>
        )}

        {/* always-visible footer */}
       <div className="mc-foot">
  <div className="mc-foot-year">{year}{runtime && ` · ${runtime}`}</div>
</div>

        {/* desktop hover overlay */}
        <div className="mc-overlay">
          <div className="mc-ol-inner">
            <div className="mc-ol-meta">
              {year}{rating !== "N/A" && ` · ★ ${rating}`}{runtime && ` · ${runtime}`}
            </div>
            <button
              className="mc-watch"
              onClick={(e) => { e.stopPropagation(); setShowWatchModal(true); }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12">
                <polygon points="2,1 11,6 2,11" fill="#0d0d0d" />
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
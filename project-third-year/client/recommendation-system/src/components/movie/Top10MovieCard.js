import React from "react";
import { useNavigate } from "react-router-dom";
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
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 32px 64px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.15);
        border-color: rgba(255,255,255,0.15);
      }
      .t10-card:hover .t10-poster  { filter: brightness(0.38) saturate(0.5); }
      .t10-card:hover .t10-rating  { opacity: 0; transform: translateY(-6px); }
      .t10-card:hover .t10-rank    { opacity: 0; }
      .t10-card:hover .t10-watch-hint { opacity: 1; }
      .t10-card:hover .t10-watch-hint-inner { transform: translateY(0) scale(1); opacity: 1; }
    }

    .t10-poster {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      transition: filter 0.4s ease;
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
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    /* hover hint — same as MovieCard */
    .t10-watch-hint {
      position: absolute; inset: 0; z-index: 5;
      display: flex; align-items: center; justify-content: center;
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
    }

    .t10-watch-hint-inner {
      display: flex; flex-direction: column; align-items: center; gap: 11px;
      transform: translateY(12px) scale(0.93);
      opacity: 0;
      transition: transform 0.42s cubic-bezier(0.22,1,0.36,1),
                  opacity 0.38s ease;
    }

    .t10-play-ring {
      width: 48px; height: 48px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.5);
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.07);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 0 0 6px rgba(255,255,255,0.05);
    }
    .t10-play-ring svg { margin-left: 3px; }

    .t10-watch-divider {
      width: 20px; height: 1px;
      background: rgba(255,255,255,0.22);
      border-radius: 1px;
    }

    .t10-watch-label {
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 2.2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.65);
      white-space: nowrap;
    }
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

  if (!movie) return null;

  const rating = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "N/A";

  return (
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

      <div className="t10-watch-hint">
        <div className="t10-watch-hint-inner">
          <div className="t10-play-ring">
            <svg width="14" height="14" viewBox="0 0 12 12">
              <polygon points="2,1 11,6 2,11" fill="rgba(255,255,255,0.88)" />
            </svg>
          </div>
          <div className="t10-watch-divider" />
          <span className="t10-watch-label">Click to Watch</span>
        </div>
      </div>
    </div>
  );
};

export default Top10MovieCard;
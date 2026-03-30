import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import WatchMovieModal from "../movie/WatchMovieModal";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// ─── TMDB image helpers ────────────────────────────────────────────────────
const TMDB = "https://image.tmdb.org/t/p";

function getDesktopSrc(movie) {
  return `${TMDB}/w1280${movie.backdrop_path}`;
}
function getMobileSrc(movie) {
  return `${TMDB}/w780${movie.poster_path}`;
}

// ─── Component ────────────────────────────────────────────────────────────
const HeroSlider = ({
  movies,
  watchlist = [],
  onWatchTrailerClick,
  onAddToWatchlist,
}) => {
  const navigate  = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [watchModal, setWatchModal]   = useState({
    show: false, tmdbId: null, title: "",
  });

  const sliderMovies = movies.slice(0, 10);


  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);


  const getCurrentMovie = useCallback(() => {
    const realIndex = swiperRef.current?.realIndex ?? activeIndex;
    return sliderMovies[realIndex] || sliderMovies[0];
  }, [activeIndex, sliderMovies]);

  const handleTrailerClick = useCallback(() => {
    const movie = getCurrentMovie();
    if (movie) onWatchTrailerClick(movie);
  }, [getCurrentMovie, onWatchTrailerClick]);

  const handleWatchNowClick = useCallback(() => {
    const movie = getCurrentMovie();
    if (movie) setWatchModal({ show: true, tmdbId: movie.id, title: movie.title });
  }, [getCurrentMovie]);

  const handleInfoClick = useCallback(() => {
    const movie = getCurrentMovie();
    if (movie) navigate(`/movie/${movie.id}`);
  }, [getCurrentMovie, navigate]);

  const componentStyles = `
    .hero-slider {
      height: 100vh;
      min-height: 520px;
      width: 100%;
      position: relative;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
    }

    .hero-slider .swiper,
    .hero-slider .swiper-wrapper,
    .hero-slider .swiper-slide {
      height: 100% !important;
      width: 100% !important;
    }

    .hero-slide-inner {
      position: absolute;
      inset: 0;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    }

    .hero-bg-wrap {
      position: absolute;
      inset: 0;
      will-change: transform;
      overflow: hidden;
    }

    @media (min-width: 769px) {
      .hero-bg-wrap {
        animation: heroKenBurns 20s ease-in-out infinite alternate;
      }
    }

    @keyframes heroKenBurns {
      from { transform: scale(1.05) translateY(-2%); }
      to   { transform: scale(1.15) translateY(-4%); }
    }

    .hero-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
    }

    .hero-overlay-main {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top,
          rgba(4,4,4,1)    0%,
          rgba(4,4,4,0.85) 20%,
          rgba(4,4,4,0.4)  45%,
          rgba(4,4,4,0.08) 70%,
          rgba(4,4,4,0.0)  100%
        ),
        linear-gradient(to bottom,
          rgba(4,4,4,0.55) 0%,
          rgba(4,4,4,0.0)  22%
        ),
        linear-gradient(to right,
          rgba(4,4,4,0.85) 0%,
          rgba(4,4,4,0.5)  30%,
          rgba(4,4,4,0.1)  55%,
          transparent      75%
        );
      z-index: 1;
    }

    .hero-overlay-accent {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 80% 60% at 10% 100%,
        rgba(200,0,0,0.07) 0%,
        transparent 60%
      );
      z-index: 2;
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 10;
      padding: 0 4rem 4.5rem;
      max-width: 560px;
      width: 100%;
      align-self: flex-end;
      animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .hero-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .hero-badge-new    { background: #b30000; color: #ffffff; }
    .hero-badge-rating { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #facc15; }
    .hero-badge-year   { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }

    .hero-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(1.6rem, 3vw, 3rem);
      font-weight: 400;
      letter-spacing: 2px;
      line-height: 1.05;
      color: #fff;
      text-shadow: 0 2px 40px rgba(0,0,0,0.8);
      margin: 0 0 10px;
    }

    .hero-title-accent {
      display: block;
      width: 50px;
      height: 3px;
      background: linear-gradient(to right, #ff0000, transparent);
      border-radius: 2px;
      margin: 10px 0 14px;
    }

    .hero-overview {
      font-size: clamp(0.85rem, 1.8vw, 1rem);
      line-height: 1.65;
      color: rgba(220,220,220,0.82);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 22px;
      font-weight: 300;
      max-width: 540px;
    }

    .hero-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .hero-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 28px;
      font-size: 0.9rem;
      font-weight: 700;
      font-family: 'DM Sans', sans-serif;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      letter-spacing: 0.4px;
      white-space: nowrap;
    }

    .hero-btn-watchnow {
      background: #b30000;
      color: #ffffff;
      box-shadow: 0 3px 10px rgba(179,0,0,0.2);
    }
    .hero-btn-watchnow:hover {
      background: #ff1a1a;
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 4px 14px rgba(229,9,20,0.3);
    }
    .hero-btn-watchnow .play-icon {
      width: 22px; height: 22px;
      background: rgba(255,255,255,0.22);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; padding-left: 2px; flex-shrink: 0;
    }

    .hero-secondary-actions {
      display: inline-flex;
      align-items: center;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 50px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      overflow: hidden;
      padding: 5px 4px;
    }

    .hero-action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 8px 20px;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      color: rgba(255,255,255,0.72);
      font-family: 'DM Sans', sans-serif;
      border-radius: 40px;
    }
    .hero-action-btn:hover {
      color: #fff;
      background: rgba(255,255,255,0.1);
    }
    .hero-action-btn.hero-action-saved .hero-action-icon,
    .hero-action-btn.hero-action-saved .hero-action-label {
      color: #4ade80;
    }

    .hero-action-icon  { font-size: 1rem; line-height: 1; }
    .hero-action-label {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .hero-action-divider {
      width: 1px;
      height: 28px;
      background: rgba(255,255,255,0.1);
      flex-shrink: 0;
    }

    .hero-btn-info {
      background: transparent;
      color: rgba(255,255,255,0.5);
      border: none;
      padding: 13px 6px;
      font-size: 0.82rem;
      font-family: 'DM Sans', sans-serif;
      text-decoration: underline;
      text-underline-offset: 3px;
      cursor: pointer;
      transition: color 0.2s;
      white-space: nowrap;
    }
    .hero-btn-info:hover { color: #fff; }

    .hero-counter {
      position: absolute;
      bottom: 40px; right: 50px;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      color: rgba(255,255,255,0.35);
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 1px;
    }
    .hero-counter strong {
      color: #fff;
      font-size: 1rem;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
    }

    .hero-slider .swiper-pagination {
      bottom: 20px !important;
      left: 5rem !important;
      text-align: left !important;
      width: auto !important;
    }
    .hero-slider .swiper-pagination-bullet {
      width: 6px !important; height: 6px !important;
      background: rgba(255,255,255,0.3) !important;
      opacity: 1 !important;
      transition: all 0.3s ease !important;
      border-radius: 3px !important;
    }
    .hero-slider .swiper-pagination-bullet-active {
      background: #ff0000 !important;
      width: 22px !important;
      border-radius: 3px !important;
    }

    .hero-bottom-fade {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 100px;
      background: linear-gradient(to top, #040404, transparent);
      z-index: 5;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .hero-slider { height: 70vh; min-height: 440px; }
      .hero-content { padding: 0 1.5rem 2.5rem; max-width: 100%; }
      .hero-title { font-size: clamp(2.2rem, 8vw, 3.2rem); }
      .hero-overview { -webkit-line-clamp: 2; margin-bottom: 18px; }
      .hero-btn { padding: 11px 22px; font-size: 0.84rem; }
      .hero-counter { bottom: 30px; right: 18px; }
      .hero-slider .swiper-pagination { left: 1.5rem !important; }
    }

    @media (max-width: 480px) {
      .hero-slider { height: 100svh; min-height: 100svh; }
      .hero-bg-img {
        object-fit: contain;
        object-position: top center;
        background-color: #040404;
      }
      .hero-slide-inner { position: absolute; inset: 0; align-items: flex-end; }
      .hero-overlay-main {
        background:
          linear-gradient(to top,
            rgba(4,4,4,1)    0%,
            rgba(4,4,4,1)    30%,
            rgba(4,4,4,0.7)  52%,
            rgba(4,4,4,0.15) 72%,
            rgba(4,4,4,0.0)  100%
          ),
          linear-gradient(to bottom,
            rgba(4,4,4,0.6)  0%,
            transparent      22%
          );
      }
      .hero-content { padding: 0 1.2rem 2.5rem; width: 100%; }
      .hero-meta { gap: 6px; margin-bottom: 10px; flex-wrap: nowrap; }
      .hero-badge { font-size: 0.56rem; padding: 3px 8px; letter-spacing: 0.8px; }
      .hero-title {
        font-size: clamp(1.75rem, 9vw, 2.4rem);
        line-height: 1.05;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      .hero-title-accent { width: 34px; height: 2px; margin: 7px 0 14px; }
      .hero-overview { display: none; }
      .hero-buttons { flex-direction: column; align-items: stretch; gap: 9px; width: 100%; }
      .hero-btn-watchnow {
        width: 100%;
        justify-content: center;
        padding: 16px;
        font-size: 0.95rem;
        border-radius: 50px;
        letter-spacing: 0.5px;
      }
      .hero-btn-watchnow .play-icon { display: flex; width: 22px; height: 22px; font-size: 9px; }
      .hero-secondary-actions {
        width: 100%;
        justify-content: space-around;
        border-radius: 50px;
        padding: 5px;
      }
      .hero-action-btn { flex: 1; padding: 10px 4px; gap: 5px; }
      .hero-action-icon { font-size: 1.1rem; }
      .hero-action-label { font-size: 0.58rem; letter-spacing: 0.5px; }
      .hero-action-divider { height: 22px; }
      .hero-btn-info { display: none; }
      .hero-slider .swiper-pagination { left: 1.2rem !important; bottom: 12px !important; }
      .hero-counter { display: none; }
      .hero-bottom-fade { height: 60px; }
    }

    @media (max-width: 360px) {
      .hero-slider { height: 100svh; min-height: 580px; }
      .hero-title { font-size: 1.7rem; }
      .hero-content { padding: 0 1rem 2rem; }
      .hero-action-btn { padding: 9px 2px; }
    }
  `;

  return (
    <div className="hero-slider">
      <style>{componentStyles}</style>

      <Swiper
        style={{ height: "100%", width: "100%" }}
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={false}

        effect="fade"
        fadeEffect={{ crossFade: true }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={handleSlideChange}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
      >
        {sliderMovies.map((movie, index) => {
          const isInWatchlist = watchlist.includes(movie.id);
          const rating = movie.vote_average
            ? movie.vote_average.toFixed(1)
            : null;
          const year = movie.release_date
            ? movie.release_date.slice(0, 4)
            : null;

          const imgFetchPriority = index === 0 ? "high"  : index === 1 ? "auto" : "low";
          const imgLoading       = index <= 1  ? "eager" : "lazy";
          const imgDecoding      = index === 0 ? "sync"  : "async";

          return (
            <SwiperSlide
              key={movie.id}
              style={{ height: "100%", position: "relative" }}
            >
              <div className="hero-slide-inner">
                <div className="hero-bg-wrap">
                  <picture>
                    {/* Mobile portrait poster — breakpoint matches index.html preload */}
                    <source
                      media="(max-width: 480px)"
                      srcSet={getMobileSrc(movie)}
                    />
                    {/* Desktop landscape backdrop */}
                    <img
                      className="hero-bg-img"
                      src={getDesktopSrc(movie)}
                      alt={movie.title}
                      fetchPriority={imgFetchPriority}
                      loading={imgLoading}
                      decoding={imgDecoding}
                    />
                  </picture>
                </div>

                <div className="hero-overlay-main" />
                <div className="hero-overlay-accent" />

                <div className="hero-content">
                  <div className="hero-meta">
                    <span className="hero-badge hero-badge-new">✦ Trending</span>
                    {rating && (
                      <span className="hero-badge hero-badge-rating">★ {rating}</span>
                    )}
                    {year && (
                      <span className="hero-badge hero-badge-year">{year}</span>
                    )}
                  </div>

                  <h1 className="hero-title">{movie.title}</h1>
                  <div className="hero-title-accent" />

                  {movie.overview && (
                    <p className="hero-overview">{movie.overview}</p>
                  )}

                  <div className="hero-buttons">
                    <button
                      className="hero-btn hero-btn-watchnow"
                      onClick={handleWatchNowClick}
                    >
                      <span className="play-icon">▶</span>
                      Watch Now
                    </button>

                    <div className="hero-secondary-actions">
                      <button
                        className="hero-action-btn"
                        onClick={handleTrailerClick}
                      >
                        <span className="hero-action-icon">🎬</span>
                        <span className="hero-action-label">Trailer</span>
                      </button>

                      <div className="hero-action-divider" />

                      <button
                        className={`hero-action-btn ${isInWatchlist ? "hero-action-saved" : ""}`}
                        onClick={() => onAddToWatchlist(movie)}
                      >
                        <span className="hero-action-icon">
                          {isInWatchlist ? "✓" : "+"}
                        </span>
                        <span className="hero-action-label">
                          {isInWatchlist ? "Saved" : "My List"}
                        </span>
                      </button>

                      <div className="hero-action-divider" />

                      <button
                        className="hero-action-btn"
                        onClick={handleInfoClick}
                      >
                        <span className="hero-action-icon">ℹ</span>
                        <span className="hero-action-label">Info</span>
                      </button>
                    </div>

                    <button
                      className="hero-btn-info"
                      onClick={handleInfoClick}
                    >
                      More Info ›
                    </button>
                  </div>
                </div>

                <div className="hero-bottom-fade" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="hero-counter">
        <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
        <span>/</span>
        <span>{String(sliderMovies.length).padStart(2, "0")}</span>
      </div>

      <WatchMovieModal
        show={watchModal.show}
        handleClose={() =>
          setWatchModal({ show: false, tmdbId: null, title: "" })
        }
        tmdbId={watchModal.tmdbId}
        movieTitle={watchModal.title}
      />
    </div>
  );
};

export default HeroSlider;
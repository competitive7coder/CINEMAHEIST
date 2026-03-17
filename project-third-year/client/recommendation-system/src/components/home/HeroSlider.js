import React, { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSlider = ({
  movies,
  watchlist = [],
  onWatchTrailerClick,
  onAddToWatchlist
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderMovies = movies.slice(0, 10);

  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const componentStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

    .hero-slider {
      height: 92vh;
      min-height: 520px;
      width: 100%;
      position: relative;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
    }

    /* ── Slide Container ── */
    .hero-slide-inner {
      height: 100%;
      width: 100%;
      position: relative;
      background-size: cover;
      background-position: center top;
      display: flex;
      align-items: flex-end;
    }

    /* ── Cinematic Overlays ── */
    .hero-overlay-main {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          to top,
          rgba(4, 4, 4, 1)     0%,
          rgba(4, 4, 4, 0.88)  18%,
          rgba(4, 4, 4, 0.55)  45%,
          rgba(4, 4, 4, 0.15)  72%,
          rgba(4, 4, 4, 0.04)  100%
        ),
        linear-gradient(
          to right,
          rgba(4, 4, 4, 0.75)  0%,
          rgba(4, 4, 4, 0.3)   40%,
          transparent          70%
        );
      z-index: 1;
    }

    /* Red accent vignette */
    .hero-overlay-accent {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 80% 60% at 10% 100%,
        rgba(200, 0, 0, 0.08) 0%,
        transparent 60%
      );
      z-index: 2;
      pointer-events: none;
    }

    /* ── Slide Zoom ── */
    .hero-slide-inner {
      animation: heroKenBurns 20s ease-in-out infinite alternate;
    }

    @keyframes heroKenBurns {
      from { background-size: 105%; background-position: center 20%; }
      to   { background-size: 115%; background-position: center 30%; }
    }

    /* ── Content ── */
    .hero-content {
      position: relative;
      z-index: 10;
      padding: 0 5rem 4.5rem;
      max-width: 680px;
      animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(36px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Metadata Row ── */
    .hero-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
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

    .hero-badge-new {
      background: #ff0000;
      color: #fff;
    }

    .hero-badge-rating {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      color: #facc15;
    }

    .hero-badge-year {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6);
    }

    /* ── Title ── */
    .hero-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(3rem, 7vw, 6.5rem);
      font-weight: 400;
      letter-spacing: 2px;
      line-height: 0.95;
      color: #fff;
      text-shadow:
        0 2px 40px rgba(0,0,0,0.8),
        0 0 80px rgba(0,0,0,0.4);
      margin: 0 0 16px;
    }

    /* Red underline accent */
    .hero-title-accent {
      display: block;
      width: 60px;
      height: 3px;
      background: linear-gradient(to right, #ff0000, transparent);
      border-radius: 2px;
      margin: 14px 0 18px;
    }

    /* ── Overview ── */
    .hero-overview {
      font-size: clamp(0.85rem, 1.8vw, 1.05rem);
      line-height: 1.65;
      color: rgba(220, 220, 220, 0.85);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 28px;
      font-weight: 300;
      max-width: 540px;
    }

    /* ── Buttons ── */
    .hero-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .hero-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 28px;
      font-size: 0.88rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .hero-btn-play {
      background: #fff;
      color: #000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    .hero-btn-play:hover {
      background: #f0f0f0;
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(0,0,0,0.5);
    }

    .hero-btn-play .play-icon {
      width: 22px;
      height: 22px;
      background: #ff0000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 9px;
      padding-left: 2px;
    }

    .hero-btn-watchlist {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(12px);
    }

    .hero-btn-watchlist:hover {
      background: rgba(255,255,255,0.15);
      border-color: rgba(255,255,255,0.4);
      transform: translateY(-3px);
    }

    .hero-btn-added {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(74, 222, 128, 0.3);
      backdrop-filter: blur(12px);
    }

    .hero-btn-added:hover {
      background: rgba(34, 197, 94, 0.25);
      transform: translateY(-3px);
    }

    /* ── Slide Counter ── */
    .hero-counter {
      position: absolute;
      bottom: 44px;
      right: 60px;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.4);
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 1px;
    }

    .hero-counter strong {
      color: #fff;
      font-size: 1.1rem;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
    }

    /* ── Custom Swiper Arrows ── */
    .hero-slider .swiper-button-next,
    .hero-slider .swiper-button-prev {
      color: white !important;
      background: rgba(255,255,255,0.08);
      width: 48px !important;
      height: 48px !important;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      transition: all 0.25s ease;
      top: 50%;
    }

    .hero-slider .swiper-button-next::after,
    .hero-slider .swiper-button-prev::after {
      font-size: 14px !important;
      font-weight: 900;
    }

    .hero-slider .swiper-button-next:hover,
    .hero-slider .swiper-button-prev:hover {
      background: rgba(255,0,0,0.25);
      border-color: rgba(255,0,0,0.4);
      transform: translateY(-50%) scale(1.1);
    }

    .hero-slider .swiper-button-prev { left: 28px; }
    .hero-slider .swiper-button-next { right: 28px; }

    /* ── Pagination ── */
    .hero-slider .swiper-pagination {
      bottom: 24px !important;
      left: 5rem !important;
      text-align: left !important;
      width: auto !important;
    }

    .hero-slider .swiper-pagination-bullet {
      width: 6px !important;
      height: 6px !important;
      background: rgba(255,255,255,0.3) !important;
      opacity: 1 !important;
      transition: all 0.3s ease !important;
      border-radius: 3px !important;
    }

    .hero-slider .swiper-pagination-bullet-active {
      background: #ff0000 !important;
      width: 24px !important;
      border-radius: 3px !important;
    }

    /* ── Bottom fade ── */
    .hero-bottom-fade {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 120px;
      background: linear-gradient(to top, #040404, transparent);
      z-index: 5;
      pointer-events: none;
    }

    /* ════════════════════════════════
       RESPONSIVE — Tablet (≤ 768px)
    ════════════════════════════════ */
    @media (max-width: 768px) {
      .hero-slider {
        height: 75vh;
        min-height: 460px;
      }

      .hero-content {
        padding: 0 1.5rem 3.5rem;
        max-width: 100%;
      }

      .hero-title {
        font-size: clamp(2.4rem, 9vw, 3.5rem);
      }

      .hero-overview {
        font-size: 0.88rem;
        -webkit-line-clamp: 2;
        margin-bottom: 20px;
      }

      .hero-btn {
        padding: 11px 20px;
        font-size: 0.82rem;
      }

      .hero-counter {
        bottom: 36px;
        right: 20px;
      }

      .hero-slider .swiper-button-next,
      .hero-slider .swiper-button-prev {
        display: none !important;
      }

      .hero-slider .swiper-pagination {
        left: 1.5rem !important;
      }
    }

    /* ════════════════════════════════
       RESPONSIVE — Mobile (≤ 480px)
    ════════════════════════════════ */
    @media (max-width: 480px) {
      .hero-slider {
        height: 70vh;
        min-height: 420px;
      }

      .hero-content {
        padding: 0 1rem 3rem;
      }

      .hero-title {
        font-size: clamp(2rem, 10vw, 2.8rem);
        margin-bottom: 10px;
      }

      .hero-title-accent {
        width: 40px;
        margin: 10px 0 12px;
      }

      .hero-overview {
        font-size: 0.82rem;
        -webkit-line-clamp: 2;
        margin-bottom: 18px;
      }

      .hero-meta {
        gap: 8px;
        margin-bottom: 12px;
      }

      .hero-badge {
        font-size: 0.6rem;
        padding: 3px 7px;
      }

      .hero-buttons {
        gap: 8px;
      }

      .hero-btn {
        padding: 10px 16px;
        font-size: 0.78rem;
        gap: 6px;
      }

      .hero-btn .play-icon {
        width: 18px;
        height: 18px;
        font-size: 7px;
      }

      .hero-counter {
        display: none;
      }

      .hero-slider .swiper-pagination {
        left: 1rem !important;
        bottom: 16px !important;
      }
    }

    /* ════════════════════════════════
       RESPONSIVE — Very small (≤ 360px)
    ════════════════════════════════ */
    @media (max-width: 360px) {
      .hero-slider {
        height: 65vh;
        min-height: 380px;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-btn-play span:not(.play-icon) {
        display: none;
      }

      .hero-btn-play {
        padding: 10px 14px;
      }
    }
  `;

  return (
    <div className="hero-slider">
      <style>{componentStyles}</style>

      <Swiper
        style={{ height: "100%" }}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop
        effect="fade"
        onSlideChange={handleSlideChange}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
      >
        {sliderMovies.map((movie, index) => {
          const isInWatchlist = watchlist.includes(movie.id);
          const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
          const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

          return (
            <SwiperSlide key={movie.id}>
              <div
                className="hero-slide-inner"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                }}
              >
                {/* Overlays */}
                <div className="hero-overlay-main" />
                <div className="hero-overlay-accent" />

                {/* Content */}
                <div className="hero-content">

                  {/* Meta badges */}
                  <div className="hero-meta">
                    <span className="hero-badge hero-badge-new">✦ Now Trending</span>
                    {rating && (
                      <span className="hero-badge hero-badge-rating">
                        ★ {rating}
                      </span>
                    )}
                    {year && (
                      <span className="hero-badge hero-badge-year">{year}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="hero-title">{movie.title}</h1>
                  <div className="hero-title-accent" />

                  {/* Overview */}
                  {movie.overview && (
                    <p className="hero-overview">{movie.overview}</p>
                  )}

                  {/* Buttons */}
                  <div className="hero-buttons">
                    <button
                      className="hero-btn hero-btn-play"
                      onClick={() => onWatchTrailerClick(movie)}
                    >
                      <span className="play-icon">▶</span>
                      Watch Trailer
                    </button>

                    <button
                      className={`hero-btn ${isInWatchlist ? "hero-btn-added" : "hero-btn-watchlist"}`}
                      onClick={() => onAddToWatchlist(movie)}
                    >
                      {isInWatchlist ? (
                        <> ✓ In Watchlist </>
                      ) : (
                        <> + My List </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Bottom fade */}
                <div className="hero-bottom-fade" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Slide counter */}
      <div className="hero-counter">
        <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
        <span>/</span>
        <span>{String(sliderMovies.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default HeroSlider;
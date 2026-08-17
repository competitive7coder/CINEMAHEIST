import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import WatchMovieModal from "../movie/WatchMovieModal";
import { toMovieSlug } from "../../utils/movieSlug";

import "swiper/css";
import "swiper/css/pagination";

const TMDB = "https://image.tmdb.org/t/p";
const getDesktopSrc   = (movie) => `${TMDB}/w1280${movie.backdrop_path}`;
const getDesktopSrcSm = (movie) => `${TMDB}/w780${movie.backdrop_path}`;
const getMobileSrc    = (movie) => `${TMDB}/w342${movie.poster_path}`;

const SLIDE_SPEED = 1100;

const STAGGER = [40, 150, 250, 340, 450];

const replayAnim = (el, delay) => {
  if (!el) return;
  const animClass = el.dataset.animClass;
  if (!animClass) return;

  el.classList.remove("hero-anim-from-top", "hero-anim-from-left", "hero-anim-from-bottom");
  el.style.opacity = "0";

  void el.offsetHeight;

  el.style.setProperty("--delay", `${delay}ms`);
  el.classList.add(animClass);
};

const HeroSlider = ({
  movies,
  watchlist = [],
  onWatchTrailerClick,
  onAddToWatchlist,
}) => {
  const navigate      = useNavigate();
  const swiperRef     = useRef(null);
  const animRefsMap   = useRef({});
  const timerRef      = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [watchModal, setWatchModal]   = useState({ show: false, tmdbId: null, title: "" });

  const sliderMovies = movies.slice(0, 10);

  const setAnimRef = useCallback((el, slideIndex, i) => {
    if (!animRefsMap.current[slideIndex]) animRefsMap.current[slideIndex] = [];
    animRefsMap.current[slideIndex][i] = el;
  }, []);

 const handleSlideChange = useCallback((swiper) => {
  // Skip reset on first mount
  if (!swiper || swiper.destroyed) return;

  if (swiper.previousIndex === undefined) return;

  clearTimeout(timerRef.current);

  const idx = swiper.realIndex;
  const refs = animRefsMap.current[idx] || [];

  refs.forEach((el) => {
    if (!el) return;

    const animClass = el.dataset.animClass;
    if (animClass) {
      el.classList.remove(
        "hero-anim-from-top",
        "hero-anim-from-left",
        "hero-anim-from-bottom"
      );
    }

    el.style.opacity = "0";
  });
}, []);

  const handleTransitionEnd = useCallback((swiper) => {
    const idx = swiper.realIndex;
    setActiveIndex(idx);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const refs = animRefsMap.current[idx] || [];
      refs.forEach((el, i) => replayAnim(el, STAGGER[i]));
    }, 60);
  }, []);

const handleSwiper = useCallback((swiper) => {
  swiperRef.current = swiper;

  //wait until loop clones + DOM ready
  setTimeout(() => {
    const idx = swiper.realIndex ?? 0;
    const refs = animRefsMap.current[idx] || [];

    refs.forEach((el, i) => {
      if (!el) return;
      replayAnim(el, STAGGER[i]);
    });
  }, 250); 
}, []);

  const getCurrentMovie = useCallback(() => {
    const ri = swiperRef.current?.realIndex ?? 0;
    return sliderMovies[ri] ?? sliderMovies[0];
  }, [sliderMovies]);

  const handleTrailerClick  = useCallback(() => { const m = getCurrentMovie(); if (m) onWatchTrailerClick(m); }, [getCurrentMovie, onWatchTrailerClick]);
  const handleWatchNowClick = useCallback(() => { const m = getCurrentMovie(); if (m) setWatchModal({ show: true, tmdbId: m.id, title: m.title }); }, [getCurrentMovie]);
  const handleInfoClick     = useCallback(() => { const m = getCurrentMovie(); if (m) navigate(`/movie/${toMovieSlug(m)}`); }, [getCurrentMovie, navigate]);
  const closeWatchModal     = useCallback(() => setWatchModal({ show: false, tmdbId: null, title: "" }), []);

  return (
    <div className="hero-slider">
      <style>{STYLES}</style>

      <Swiper
        style={{ height: "100%", width: "100%" }}
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        speed={SLIDE_SPEED}
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
        onTransitionEnd={handleTransitionEnd}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {sliderMovies.map((movie, slideIndex) => {
          const isInWatchlist = watchlist.includes(movie.id);
          const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
          const year   = movie.release_date ? movie.release_date.slice(0, 4) : null;
          const r = (i) => (el) => setAnimRef(el, slideIndex, i);

          return (
            <SwiperSlide key={movie.id}>
              <div className="hero-slide-inner">
                <div className="hero-bg-wrap">
                  <picture>
                    <source media="(max-width: 480px)"  srcSet={getMobileSrc(movie)}    type="image/jpeg" />
                    <source media="(max-width: 1024px)" srcSet={getDesktopSrcSm(movie)} type="image/jpeg" />
                    <img
                      className="hero-bg-img"
                      src={getDesktopSrc(movie)}
                      alt={movie.title}
                      fetchPriority={slideIndex === 0 ? "high" : "low"}
                      loading={slideIndex === 0 ? "eager" : "lazy"}
                      decoding={slideIndex === 0 ? "sync" : "async"}
                    />
                  </picture>
                </div>

                <div className="hero-overlay-main" />
                <div className="hero-overlay-accent" />

                <div className="hero-content">

                  {/* [0] Badges  from TOP */}
                  <div
                    ref={r(0)}
                    data-anim-class="hero-anim-from-top"
                    className="hero-meta hero-anim-from-top"
                    style={{ "--delay": `${STAGGER[0]}ms` }}
                  >
                    <span className="hero-badge hero-badge-new"> Trending</span>
                    {rating && <span className="hero-badge hero-badge-rating"> {rating}</span>}
                    {year   && <span className="hero-badge hero-badge-year">{year}</span>}
                  </div>

                  {/* [1] Title  LEFT to RIGHT */}
                  <h1
                    ref={r(1)}
                    data-anim-class="hero-anim-from-left"
                    className="hero-title hero-anim-from-left"
                    style={{ "--delay": `${STAGGER[1]}ms` }}
                  >
                    {movie.title}
                  </h1>

                  {/* [2] Accent  LEFT to RIGHT */}
                  <div
                    ref={r(2)}
                    data-anim-class="hero-anim-from-left"
                    className="hero-title-accent hero-anim-from-left"
                    style={{ "--delay": `${STAGGER[2]}ms` }}
                  />

                  {/* [3] Overview  LEFT to RIGHT */}
                  {movie.overview && (
                    <p
                      ref={r(3)}
                      data-anim-class="hero-anim-from-left"
                      className="hero-overview hero-anim-from-left"
                      style={{ "--delay": `${STAGGER[3]}ms` }}
                    >
                      {movie.overview}
                    </p>
                  )}

                  {/* [4] Buttons  BOTTOM to TOP */}
                  <div
                    ref={r(4)}
                    data-anim-class="hero-anim-from-bottom"
                    className="hero-buttons hero-anim-from-bottom"
                    style={{ "--delay": `${STAGGER[4]}ms` }}
                  >
                    <button className="hero-btn hero-btn-watchnow" onClick={handleWatchNowClick}>
                      <span className="play-icon"></span>
                      Watch Now
                    </button>

                    <div className="hero-secondary-actions">
                      <button className="hero-action-btn" onClick={handleTrailerClick}>
                        <span className="hero-action-icon"></span>
                        <span className="hero-action-label">Trailer</span>
                      </button>

                      <div className="hero-action-divider" />

                      <button
                        className={`hero-action-btn ${isInWatchlist ? "hero-action-saved" : ""}`}
                        onClick={() => onAddToWatchlist(movie)}
                      >
                        <span className="hero-action-icon">{isInWatchlist ? "" : "+"}</span>
                        <span className="hero-action-label">{isInWatchlist ? "Saved" : "My List"}</span>
                      </button>

                      <div className="hero-action-divider" />

                      <button className="hero-action-btn" onClick={handleInfoClick}>
                        <span className="hero-action-icon"></span>
                        <span className="hero-action-label">Info</span>
                      </button>
                    </div>

                    <button className="hero-btn-info" onClick={handleInfoClick}>More Info ›</button>
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
        handleClose={closeWatchModal}
        tmdbId={watchModal.tmdbId}
        movieTitle={watchModal.title}
      />
    </div>
  );
};

const STYLES = `
  /* ─────────────────────────────────────
     SLIDE SWEEP: right to left
  ───────────────────────────────────── */
  .hero-slider .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.77, 0, 0.18, 1) !important;
  }

  .hero-slider .swiper-slide {
    height: 100% !important;
    width: 100% !important;
    will-change: transform;
  }

  /* ─────────────────────────────────────
     KEYFRAMES
  ───────────────────────────────────── */
  @keyframes heroFromTop {
    0%   { opacity: 0;   transform: translateY(-40px); }
    40%  { opacity: 0.4; transform: translateY(-18px); }
    100% { opacity: 1;   transform: translateY(0);     }
  }

  @keyframes heroFromLeft {
    0%   { opacity: 0;   transform: translateX(-60px); }
    30%  { opacity: 0.2; transform: translateX(-36px); }
    100% { opacity: 1;   transform: translateX(0);     }
  }

  @keyframes heroFromBottom {
    0%   { opacity: 0;   transform: translateY(40px); }
    40%  { opacity: 0.4; transform: translateY(18px); }
    100% { opacity: 1;   transform: translateY(0);    }
  }

  /* ─────────────────────────────────────
     ANIMATION CLASSES
  ───────────────────────────────────── */
  .hero-anim-from-top {
    opacity: 0;
    will-change: transform, opacity;
    animation-name: heroFromTop;
    animation-duration: 0.6s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay: var(--delay, 0ms);
  }

  .hero-anim-from-left {
    opacity: 0;
    will-change: transform, opacity;
    animation-name: heroFromLeft;
    animation-duration: 0.7s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay: var(--delay, 0ms);
  }

  .hero-anim-from-bottom {
    opacity: 0;
    will-change: transform, opacity;
    animation-name: heroFromBottom;
    animation-duration: 0.6s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay: var(--delay, 0ms);
  }

  /* ─────────────────────────────────────
     BASE LAYOUT
  ───────────────────────────────────── */
  .hero-slider {
    height: 100vh;
    min-height: 520px;
    width: 100%;
    position: relative;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }

  .hero-slider .swiper,
  .hero-slider .swiper-wrapper {
    height: 100% !important;
    width: 100% !important;
  }

  .hero-slide-inner {
    position: relative;
    height: 100%;
    width: 100%;
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
    .hero-bg-wrap { animation: heroKenBurns 20s ease-in-out infinite alternate; }
  }

  @keyframes heroKenBurns {
    from { transform: scale(1.05) translateY(-2%); }
    to   { transform: scale(1.15) translateY(-4%); }
  }

  .hero-bg-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
  }

  .hero-overlay-main {
    position: absolute; inset: 0;
    background:
      linear-gradient(to top,    rgba(4,4,4,1) 0%, rgba(4,4,4,0.85) 20%, rgba(4,4,4,0.4) 45%, rgba(4,4,4,0.08) 70%, rgba(4,4,4,0.0) 100%),
      linear-gradient(to bottom, rgba(4,4,4,0.55) 0%, rgba(4,4,4,0.0) 22%),
      linear-gradient(to right,  rgba(4,4,4,0.85) 0%, rgba(4,4,4,0.5) 30%, rgba(4,4,4,0.1) 55%, transparent 75%);
    z-index: 1;
  }

  .hero-overlay-accent {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 10% 100%, rgba(200,0,0,0.07) 0%, transparent 60%);
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
    margin: 0 0 10px;
    background: linear-gradient(
      135deg,
      #ff6ec7 0%,
      #ff2d55 20%,
      #ff9500 40%,
      #ffffff 55%,
      #00c8ff 75%,
      #bf5af2 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 20px rgba(255, 46, 85, 0.35));
  }

  .hero-title-accent {
    display: block;
    width: 50px; height: 3px;
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
  .hero-action-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
  .hero-action-btn.hero-action-saved .hero-action-icon,
  .hero-action-btn.hero-action-saved .hero-action-label { color: #4ade80; }

  .hero-action-icon  { font-size: 1rem; line-height: 1; }
  .hero-action-label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; }

  .hero-action-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.1); flex-shrink: 0; }

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
    .hero-bg-img { object-fit: contain; object-position: top center; background-color: #040404; }
    .hero-slide-inner { align-items: flex-end; }
    .hero-overlay-main {
      background:
        linear-gradient(to top, rgba(4,4,4,1) 0%, rgba(4,4,4,1) 30%, rgba(4,4,4,0.7) 52%, rgba(4,4,4,0.15) 72%, rgba(4,4,4,0.0) 100%),
        linear-gradient(to bottom, rgba(4,4,4,0.6) 0%, transparent 22%);
    }
    .hero-content { padding: 0 1.2rem 2.5rem; width: 100%; }
    .hero-meta { gap: 6px; margin-bottom: 10px; flex-wrap: nowrap; }
    .hero-badge { font-size: 0.56rem; padding: 3px 8px; letter-spacing: 0.8px; }
    .hero-title { font-size: clamp(1.75rem, 9vw, 2.4rem); line-height: 1.05; letter-spacing: 1px; margin-bottom: 4px; }
    .hero-title-accent { width: 34px; height: 2px; margin: 7px 0 14px; }
    .hero-overview { display: none; }
    .hero-buttons { flex-direction: column; align-items: stretch; gap: 9px; width: 100%; }
    .hero-btn-watchnow { width: 100%; justify-content: center; padding: 16px; font-size: 0.95rem; border-radius: 50px; letter-spacing: 0.5px; }
    .hero-btn-watchnow .play-icon { display: flex; width: 22px; height: 22px; font-size: 9px; }
    .hero-secondary-actions { width: 100%; justify-content: space-around; border-radius: 50px; padding: 5px; }
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
export default HeroSlider;
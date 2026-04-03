import React, { useRef } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const SeeAllArrow = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
    <path d="M1,5 L11,5" />
    <polyline points="8 1 12 5 8 9" />
  </svg>
);

const MovieRow = ({
  title,
  movies = [],
  genreId,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  onSeeAllClick = null,
  seeAllLink = null,
}) => {
  const swiperRef = useRef(null);

  // Guarantee movies is always a safe array — defensive against any API shape
  const safeMovies = Array.isArray(movies) ? movies : [];

  const stopAutoplay  = () => swiperRef.current?.swiper?.autoplay?.stop();
  const startAutoplay = () => swiperRef.current?.swiper?.autoplay?.start();

  const seeAllButton = (() => {
    const inner = (
      <>
        <span>See All</span>
        <SeeAllArrow />
      </>
    );
    if (onSeeAllClick)
      return <button onClick={onSeeAllClick} className="cta">{inner}</button>;
    if (seeAllLink)
      return <Link to={seeAllLink} className="cta">{inner}</Link>;
    if (genreId)
      return <Link to={`/genre/${genreId}`} className="cta">{inner}</Link>;
    return null;
  })();

  if (safeMovies.length === 0) return null;

  return (
    <div
      className="movie-row-container"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <style>{STYLES}</style>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h4 btn-shine">{title}</h3>
        {seeAllButton}
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        spaceBetween={15}
        slidesPerView="auto"
        navigation
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {safeMovies.map((movie) => (
          <SwiperSlide key={movie.id} style={{ width: "auto" }}>
            <MovieCard
              movie={movie}
              watchlist={watchlist}
              onWatchTrailerClick={onWatchTrailerClick}
              onWatchlistClick={onWatchlistClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const STYLES = `
  .movie-row-container {
    position: relative;
    margin-bottom: 2rem;
    overflow: visible;
  }

  .h4 {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.3px;
    margin: 0;
    text-align: left;
  }

  .btn-shine {
    display: inline-block;
    position: relative;
    color: #606060;
    overflow: hidden;
  }

  .btn-shine::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(255,255,255,0.0) 20%,
      rgba(255,255,255,0.85) 50%,
      rgba(255,255,255,0.0) 80%,
      transparent 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    transform: translateX(-200%);
    animation: shine 4s linear infinite;
    pointer-events: none;
  }

  @keyframes shine {
    0%   { transform: translateX(-200%); }
    100% { transform: translateX(400%); }
  }

  .movie-row-container .swiper-button-next,
  .movie-row-container .swiper-button-prev {
    color: #fff;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 50%;
    width: 38px;
    height: 38px;
    --swiper-navigation-size: 13px;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
  }

  .movie-row-container:hover .swiper-button-next,
  .movie-row-container:hover .swiper-button-prev {
    opacity: 1;
    transform: translateY(-50%) scale(1.0);
  }

  .movie-row-container .swiper-button-next:hover,
  .movie-row-container .swiper-button-prev:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08));
    border-color: rgba(255,255,255,0.35);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
    transform: translateY(-50%) scale(1.12);
  }

  .movie-row-container .swiper-button-next:after,
  .movie-row-container .swiper-button-prev:after {
    font-size: 12px;
    font-weight: 900;
    letter-spacing: -1px;
  }

  .swiper-button-next { right: 6px; }
  .swiper-button-prev { left: 6px; }

  .cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    padding: 4px 0;
    position: relative;
  }

  .cta span {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #666;
    transition: color 0.2s ease;
  }

  .cta svg {
    stroke: #666;
    stroke-width: 2;
    transition: all 0.25s ease;
    transform: translateX(0);
  }

  .cta::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0;
    width: 0%;
    height: 1px;
    background: #fff;
    transition: width 0.25s ease;
  }

  .cta:hover span { color: #fff; }
  .cta:hover svg  { stroke: #fff; transform: translateX(4px); }
  .cta:hover::after { width: 100%; }
`;

export default MovieRow;
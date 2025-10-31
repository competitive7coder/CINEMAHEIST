import React, { useRef } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const MovieRow = ({
  title,
  movies = [],
  genreId,
  seeAllLink,
  onSeeAllClick, // <-- 1. ADD THIS NEW PROP
  onWatchTrailerClick,
  onWatchlistClick,
}) => {
  const swiperRef = useRef(null);


  const handleMouseEnter = () => {
    if (swiperRef.current?.swiper?.autoplay) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };
  const handleMouseLeave = () => {
    if (swiperRef.current?.swiper?.autoplay) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  // ... (Your 'styles' const goes here, unchanged) ...
  const styles = `
  .movie-row-container {
    position: relative;
    margin-bottom: 2rem;
  }

  .title {
    text-align: left;
    animation: fadeIn 1.2s ease-in-out;
  }

  .h4 {
    font-size: 2.4rem;
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    letter-spacing: 1px;
    margin: 0;
  }

  /* Shiny title animation */
  .btn-shine {
    display: inline-block;
    background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s infinite linear;
  }

@keyframes shine {
  0% { /*From right to left*/
    background-position: 100% center;
  }
  100% {
    background-position: -100% center;
  }
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

  /* Swiper Navigation Buttons */

  .movie-row-container .swiper-button-next,
  .movie-row-container .swiper-button-prev {
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    --swiper-navigation-size: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .movie-row-container:hover .swiper-button-next,
  .movie-row-container:hover .swiper-button-prev {
    opacity: 1;
  }

  .swiper-button-next { right: 10px; }
  .swiper-button-prev { left: 10px; }

  /* See All button */
  .cta {
    position: relative;
    padding: 12px 18px;
    transition: all 0.2s ease;
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: none;
  }

  .cta:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border-radius: 50px;
    background: #2a2a2a;
    width: 45px;
    height: 45px;
    transition: all 0.3s ease;
  }

  .cta span {
    position: relative;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #a0a0a0;
  }

  .cta svg {
    position: relative;
    top: 0;
    margin-left: 10px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #a0a0a0;
    stroke-width: 2;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }

  .cta:hover:before {
    width: 100%;
    background: #333;
  }

  .cta:hover span { color: #fff; }

  .cta:hover svg {
    transform: translateX(0);
    stroke: #fff;
  }

  .cta:active { transform: scale(0.95); }
  `;


  // --- 2. UPDATED LOGIC FOR "SEE ALL" BUTTON ---
  let seeAllButton = null;
  if (onSeeAllClick) {
    // Priority 1: Use the click handler if provided (for Recommendations)
    seeAllButton = (
      <button onClick={onSeeAllClick} className="cta">
        <span>See All</span>
        <svg width="15" height="10" viewBox="0 0 13 10">
          <path d="M1,5 L11,5"></path>
          <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
      </button>
    );
  } else if (seeAllLink) {
    // Priority 2: Use the custom link if provided
    seeAllButton = (
      <Link to={seeAllLink} className="cta">
        <span>See All</span>
        <svg width="15" height="10" viewBox="0 0 13 10">
          <path d="M1,5 L11,5"></path>
          <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
      </Link>
    );
  } else if (genreId) {
    // Priority 3: Use the genreId (for standard rows)
    seeAllButton = (
      <Link to={`/genre/${genreId}`} className="cta">
        <span>See All</span>
        <svg width="15" height="10" viewBox="0 0 13 10">
          <path d="M1,5 L11,5"></path>
          <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
      </Link>
    );
  }
  // If none are provided, the button stays hidden

  return (
    <div
      className="movie-row-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{styles}</style>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="title">
          <h3 className="h4 btn-shine">{title}</h3>
        </div>
        
        {/* --- 3. RENDER THE CORRECT BUTTON --- */}
        {seeAllButton}
      
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        spaceBetween={15}
        slidesPerView={"auto"}
        navigation
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {movies.length > 0 ? (
          movies.map((movie) => (
            <SwiperSlide key={movie.id} style={{ width: "auto" }}>
              <MovieCard
                movie={movie}
                onWatchTrailerClick={onWatchTrailerClick}
                onWatchlistClick={onWatchlistClick}
              />
            </SwiperSlide>
          ))
        ) : (
          <div className="text-light px-3 py-2">No movies available.</div>
        )}
      </Swiper>
    </div>
  );
};

export default MovieRow;
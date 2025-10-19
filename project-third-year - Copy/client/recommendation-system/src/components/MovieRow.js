import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// 1. Accept the two specific functions as props
const MovieRow = ({ title, movies, genreId, onWatchTrailerClick, onWatchlistClick }) => {
    const swiperRef = useRef(null);

    const handleMouseEnter = () => {
        if (swiperRef.current?.swiper) swiperRef.current.swiper.autoplay.stop();
    };
    const handleMouseLeave = () => {
        if (swiperRef.current?.swiper) swiperRef.current.swiper.autoplay.start();
    };

    const css = `
.movie-row-container {
    position: relative;
    margin-bottom: 1rem;
}

.title {
  /* position: absolute; */
  /* top: 50%;
  left: 50%; */
  /* transform: translate(-50%, -50%); */
  /* z-index: 5; */
  text-align: left;
  color: #c3baba;
  /* padding: 20px 40px; */
  /* border-radius: 30px; */
  /* background: rgba(0, 0, 0, 0.45); */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  /* box-shadow: 0 0 25px rgba(255, 255, 255, 0.2); */
  animation: fadeIn 1.2s ease-in-out;
}

.title h3 {
  font-size: 2.2rem;
  font-weight: 700;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  margin: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* Style for the Swiper navigation buttons */
.movie-row-container .swiper-button-next,
.movie-row-container .swiper-button-prev {
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    --swiper-navigation-size: 20px;
    opacity: 0; /* Hidden by default */
    transition: opacity 0.3s ease;
}

/* Show arrows only when hovering over the whole row container */
.movie-row-container:hover .swiper-button-next,
.movie-row-container:hover .swiper-button-prev {
    opacity: 1;
}

.swiper-button-next { right: 10px; }
.swiper-button-prev { left: 10px; }
`;

    const ctaButtonStyles = `
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

    return (
        <div
            className="movie-row-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <style>{css + ctaButtonStyles}</style>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h4 text-light">{title}</h3>
                <Link to={`/genre/${genreId}`} className="cta">
                    <span>See All</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </Link>
            </div>

            <Swiper
                ref={swiperRef}
                modules={[Navigation, Autoplay]}
                spaceBetween={15}
                slidesPerView={'auto'}
                navigation={true}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id} style={{ width: 'auto' }}>
                        {/* 2. Pass those two functions down to each MovieCard */}
                        <MovieCard
                            movie={movie}
                            onWatchTrailerClick={onWatchTrailerClick}
                            onWatchlistClick={onWatchlistClick}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MovieRow;

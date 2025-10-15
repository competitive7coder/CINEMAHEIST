import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './MovieRow.css';

const MovieRow = ({ title, movies, genreId, onCardClick }) => {
    const swiperRef = useRef(null);
    const handleMouseEnter = () => { if (swiperRef.current?.swiper) { swiperRef.current.swiper.autoplay.stop(); } };
    const handleMouseLeave = () => { if (swiperRef.current?.swiper) { swiperRef.current.swiper.autoplay.start(); } };

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
        <div className="movie-row-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <style>{ctaButtonStyles}</style>

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
                        <MovieCard movie={movie} onCardClick={onCardClick} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MovieRow;
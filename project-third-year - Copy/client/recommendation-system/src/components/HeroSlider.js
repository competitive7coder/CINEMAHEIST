import React from 'react';
// Import Swiper components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper's required styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider = ({ movies, onWatchTrailerClick, onAddToWatchlist }) => {
    // Take the top 5 trending movies for the slider
    const sliderMovies = movies.slice(0, 10);

    // All the CSS for this component is defined here
    const componentStyles = `
        .hero-slider {
            height: 85vh;
            width: 100%;
            color: white;
            margin-bottom: 2rem;
        }
        .swiper-slide-container {
            height: 100%; /* Make sure the inner container also takes full height */
            width: 100%;
            position: relative;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: flex-end;
        }
        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top, rgba(20, 20, 20, 1) 10%, transparent 50%);
        }
        .hero-content {
            position: relative;
            z-index: 10;
            padding: 2rem 4rem;
            max-width: 50%;
        }
        .hero-title {
            font-size: 3.5rem;
            font-weight: bold;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        }
        .hero-overview {
            font-size: 1.1rem;
            margin-top: 1rem;
            max-width: 600px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .hero-buttons {
            margin-top: 1.5rem;
        }
        .hero-buttons .btn {
            padding: 0.75rem 1.5rem;
            font-size: 1.1rem;
            font-weight: bold;
            margin-right: 1rem;
            border-radius: 5px;
        }
        .hero-slider .swiper-button-next,
        .hero-slider .swiper-button-prev {
            color: white !important;
        }
        .hero-slider .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.5) !important;
        }
        .hero-slider .swiper-pagination-bullet-active {
            background: white !important;
        }
    `;

    return (
        <div className="hero-slider">
            <style>{componentStyles}</style>
            <Swiper
                // 1. Ensure the Swiper component itself takes full height
                style={{ height: '100%' }}
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                effect="fade"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
            >
                {sliderMovies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div
                            className="swiper-slide-container"
                            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
                        >
                            <div className="hero-overlay"></div>
                            <div className="hero-content">
                                <h1 className="hero-title">{movie.title}</h1>
                                <p className="hero-overview">{movie.overview}</p>
                                {/* 2. This is the ONLY place the buttons should be defined */}
                                <div className="hero-buttons">
                                    <button className="btn btn-light" onClick={() => onWatchTrailerClick(movie.id)}>
                                        <i className="bi bi-play-fill me-2"></i> Watch Trailer
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => onAddToWatchlist(movie.id)}>
                                        <i className="bi bi-plus-lg me-2"></i> Add to Watchlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;
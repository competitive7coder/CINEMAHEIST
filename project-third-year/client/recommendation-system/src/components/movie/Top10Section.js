import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Top10MovieCard from "./Top10MovieCard";

const Top10Section = ({
  movies = [],
  watchlist = [],
  title = "Top 10 Movies in India Today",
  onWatchTrailerClick,
  onWatchlistClick,
}) => {
  if (!Array.isArray(movies) || movies.length === 0) return null;

  return (
    <div className="movie-row-container">
      <h3 className="h4 mb-5 text-white">{title}</h3>
      <Swiper
        modules={[Navigation]}
        spaceBetween={40}
        slidesPerView="auto"
        navigation
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id} style={{ width: "auto" }}>
            <Top10MovieCard
              movie={movie}
              rank={index + 1}
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

export default Top10Section;
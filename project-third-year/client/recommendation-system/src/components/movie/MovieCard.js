import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchMovieModal from "./WatchMovieModal";
import { Button, Badge } from "react-bootstrap";

const MovieCard = ({
  movie,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  isInWatchlist: isInWatchlistProp = null,
  isOnWatchlistPage = false
}) => {
  const navigate = useNavigate();
  const [showWatchModal, setShowWatchModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/200x300?text=No+Image";

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  const rating = typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "N/A";
  const description = movie.overview || "No description available.";
  const isInWatchlist = isInWatchlistProp !== null ? isInWatchlistProp : watchlist.includes(movie.id);

  const handleCardClick = () => navigate(`/movie/${movie.id}`);

  const handleAction = (e, callback) => {
    e.stopPropagation();
    if (callback) callback(movie);
  };

  const handleWatchNow = (e) => {
    e.stopPropagation();
    setShowWatchModal(true);
  };

  // responsive card styles using Bootstrap-like sizing
  const cardStyle = {
    position: "relative",
    width: "100%",
    aspectRatio: "2/3",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#111",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: isHovered ? "translateY(-8px) scale(1.02)" : "scale(1)",
    boxShadow: isHovered ? "0 15px 30px rgba(0,0,0,0.8)" : "none",
    zIndex: isHovered ? 10 : 1
  };

  return (
    <>
      <div 
        className="position-relative overflow-hidden shadow-sm m-auto" 
        style={cardStyle}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster Image */}
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-100 h-100 object-fit-cover d-block" 
          style={{ 
            transition: "filter 0.3s ease", 
            filter: isHovered ? "brightness(0.3)" : "brightness(1)" 
          }}
        />

        {/* Rating Badge */}
        <Badge 
          bg="dark" 
          className="position-absolute border border-secondary text-warning d-flex align-items-center gap-1"
          style={{ top: "8px", right: "8px", backdropFilter: "blur(5px)", opacity: isHovered ? 0 : 1, transition: "opacity 0.2s" }}
        >
          ⭐ {rating}
        </Badge>

        {/* Mobile Title Overlay (Hidden on Desktop hover) */}
        {!isHovered && (
          <div 
            className="position-absolute bottom-0 start-0 end-0 p-2 d-md-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
          >
            <p className="text-white small fw-bold mb-0 text-truncate">{movie.title}</p>
          </div>
        )}

        {/* Desktop Overlay Content */}
        <div 
          className={`position-absolute inset-0 d-flex flex-column justify-content-end p-2 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={{ 
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            transition: "opacity 0.3s ease"
          }}
        >
          <h6 className="text-white fw-bold mb-1 text-truncate" style={{ fontSize: "0.85rem" }}>{movie.title}</h6>
          
          <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.7rem" }}>
            <span className="text-secondary">{year}</span>
            <span className="text-warning fw-bold">⭐ {rating}</span>
          </div>

          <p className="text-secondary mb-3 overflow-hidden" style={{ fontSize: "0.65rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {description}
          </p>

          <div className="d-grid gap-1">
            <Button size="sm" variant="danger" className="py-1 fw-bold" style={{ fontSize: "0.7rem" }} onClick={handleWatchNow}>
              <i className="bi bi-play-fill"></i> Watch Now
            </Button>
            <div className="d-flex gap-1">
              <Button size="sm" variant="light" className="flex-grow-1 py-1 fw-bold" style={{ fontSize: "0.65rem" }} onClick={(e) => handleAction(e, onWatchTrailerClick)}>
                <i className="bi bi-film"></i> Trailer
              </Button>
              <Button 
                size="sm" 
                variant={isOnWatchlistPage || isInWatchlist ? "outline-danger" : "outline-primary"} 
                className="flex-grow-1 py-1 fw-bold" 
                style={{ fontSize: "0.65rem" }} 
                onClick={(e) => handleAction(e, onWatchlistClick)}
              >
                {isOnWatchlistPage || isInWatchlist ? <i className="bi bi-check-lg"></i> : <i className="bi bi-plus-lg"></i>}
                {isOnWatchlistPage || isInWatchlist ? " Saved" : " Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <WatchMovieModal
        show={showWatchModal}
        handleClose={() => setShowWatchModal(false)}
        tmdbId={movie.id}
        movieTitle={movie.title}
      />
    </>
  );
};

export default MovieCard;
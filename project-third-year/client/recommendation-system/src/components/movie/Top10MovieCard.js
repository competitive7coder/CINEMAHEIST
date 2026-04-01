import React from "react";
import MovieCard from "./MovieCard";

const Top10MovieCard = ({
  movie,
  rank,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick
}) => {
  if (!movie) return null;

  return (
    <div style={styles.wrapper}>
      <span style={styles.rank} aria-label={`Rank ${rank}`}>
        {rank}
      </span>
      <div style={styles.cardWrap}>
        <MovieCard
          movie={movie}
          watchlist={watchlist}
          onWatchTrailerClick={onWatchTrailerClick}
          onWatchlistClick={onWatchlistClick}
        />
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "flex-end",
    position: "relative",
  },
  rank: {
    fontSize: "11rem",
    fontWeight: 900,
    fontFamily: "'Arial Black', Impact, sans-serif",
    lineHeight: 1,
    letterSpacing: "-4px",
    flexShrink: 0,
    userSelect: "none",
    color: "transparent",
    WebkitTextStroke: "2px rgba(255,255,255,0.55)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(180,180,180,0.4) 60%, rgba(255,255,255,0.05) 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    filter:
      "drop-shadow(0 4px 24px rgba(0,0,0,0.85)) drop-shadow(0 1px 0px rgba(255,255,255,0.15))",
    position: "relative",
    zIndex: 1,
    marginRight: "-3rem",
  },
  cardWrap: {
    position: "relative",
    zIndex: 2,
    flexShrink: 0,
  },
};

export default Top10MovieCard;
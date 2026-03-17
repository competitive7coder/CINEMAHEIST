import React from "react";
import MovieCard from "./MovieCard";

const Top10MovieCard = ({
  movie,
  rank,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick
}) => {

  const componentStyles = `
.top-10-wrapper{
display:flex;
align-items:center;
position:relative;
}

.rank-number{
font-size:8rem;
font-weight:900;
color:transparent;
-webkit-text-stroke:3px #ffffff;
text-shadow:
0 10px 40px rgba(0,0,0,.9),
0 0 25px rgba(255,255,255,.25);
transform:translateX(20px);
z-index:1;
pointer-events:none;
}

.top-10-wrapper .card{
margin-left:-40px;
}
`;

  return (
    <>
      <style>{componentStyles}</style>

      <div className="top-10-wrapper">

        <div className="rank-number">
          {rank}
        </div>

        <MovieCard
          movie={movie}
          watchlist={watchlist}
          onWatchTrailerClick={onWatchTrailerClick}
          onWatchlistClick={onWatchlistClick}
        />

      </div>
    </>
  );
};

export default Top10MovieCard;
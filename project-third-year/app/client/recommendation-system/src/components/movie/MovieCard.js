import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({
  movie,
  watchlist = [],
  onWatchTrailerClick,
  onWatchlistClick,
  isInWatchlist: isInWatchlistProp = null,  // FIX: accept prop from Dashboard
  isOnWatchlistPage = false
}) => {

  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/270x350?text=No+Image";

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "N/A";

  const description = movie.overview || "No description available.";

  // FIX: use prop if provided, otherwise fall back to watchlist array check
  const isInWatchlist =
    isInWatchlistProp !== null
      ? isInWatchlistProp
      : watchlist.includes(movie.id);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (onWatchTrailerClick) {
      onWatchTrailerClick(movie); // FIX: pass full movie object, not movie.id
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (onWatchlistClick) {
      onWatchlistClick(movie);
    }
  };

 const styles = `
.card{
position:relative;
width:270px;
height:380px;
border-radius:14px;
overflow:hidden;
background:#0e0e0e;
cursor:pointer;
transition:transform .35s ease, box-shadow .35s ease;
}

.card:hover{
transform:translateY(-12px) scale(1.06);
box-shadow:
0 25px 60px rgba(0,0,0,0.7),
0 0 40px rgba(229,9,20,0.35);
z-index:50;
}

.card-poster{
width:100%;
height:100%;
object-fit:cover;
transition:all .4s ease;
}

.card:hover .card-poster{
filter:brightness(.4) blur(4px);
transform:scale(1.12);
}

.card__content{
position:absolute;
bottom:0;
left:0;
width:100%;
padding:1rem;
background:linear-gradient(to top, rgba(0,0,0,.9), transparent);
color:white;
transform:translateY(100%);
transition:transform .35s ease;
}

.card:hover .card__content{
transform:translateY(0);
}

.card__title{
font-size:1.3rem;
font-weight:700;
margin-bottom:.3rem;
}

.card__info{
font-size:.85rem;
display:flex;
gap:.5rem;
margin-bottom:.5rem;
align-items:center;
color:#ddd;
}

.card__description{
font-size:.8rem;
color:#bbb;
display:-webkit-box;
-webkit-line-clamp:3;
-webkit-box-orient:vertical;
overflow:hidden;
}

.card__buttons{
display:flex;
gap:8px;
margin-top:.8rem;
}

.btn-watch,
.btn-trailer,
.btn-add,
.btn-remove{
flex:1;
border:none;
border-radius:6px;
padding:8px 6px;
font-size:.78rem;
font-weight:600;
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
gap:4px;
transition:all .2s ease;
}

.btn-watch{
background:#e50914;
color:white;
}

.btn-watch:hover{
background:#ff0a16;
}

.btn-trailer{
background:white;
color:black;
}

.btn-trailer:hover{
background:#f0f0f0;
}

.btn-add{
background:#1a73e8;
color:white;
}

.btn-add:hover{
background:#1c7fff;
}

.btn-remove{
background:#c62828;
color:white;
}

.btn-remove:hover{
background:#d32f2f;
}
`;

  return (
    <>
      <style>{styles}</style>

      <div className="card" onClick={handleCardClick}>

        <img
          src={posterUrl}
          alt={movie.title}
          className="card-poster"
        />

        <div className="card__content">

          <h5 className="card__title">{movie.title}</h5>

          <div className="card__info">
            <span>
              ⭐ {rating}
            </span>
            <span>|</span>
            <span>{year}</span>
          </div>

          <p className="card__description">{description}</p>

          <div className="card__buttons">

            {/* Watch */}
            <button
              className="btn-watch"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <i className="bi bi-eye-fill"></i> Watch
            </button>

            {/* Trailer */}
            <button
              className="btn-trailer"
              onClick={handleTrailerClick}
            >
              <i className="bi bi-play-fill"></i> Trailer
            </button>

            {/* Watchlist */}
            <button
              className={isOnWatchlistPage || isInWatchlist ? "btn-remove" : "btn-add"}
              onClick={handleWatchlistClick}
            >
              {isOnWatchlistPage || isInWatchlist ? (
                <>
                  <i className="bi bi-check-lg"></i> In List
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg"></i> Add
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default MovieCard;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import VideoModal from './VideoModal';
import MovieCard from './MovieCard';

const styles = {
  page: {
    backgroundColor: '#141414',
    color: 'white',
    paddingBottom: '3rem',
  },
  backdrop: {
    height: '60vh',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center 30%',
    position: 'relative',
  },
  backdropOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, #141414 10%, transparent 70%)',
  },
  content: {
    marginTop: '-150px',
    position: 'relative',
    zIndex: 10,
  },
  poster: {
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    maxWidth: '300px',
    width: '100%',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  meta: {
    fontSize: '1rem',
    color: '#a0a0a0',
  },
  bullet: {
    margin: '0 8px',
  },
  badge: {
    fontSize: '0.8rem',
    padding: '5px 10px',
    backgroundColor: '#6c757d',
    borderRadius: '5px',
    marginRight: '0.5rem',
  },
  overview: {
    fontSize: '1rem',
    lineHeight: 1.6,
    marginTop: '1rem',
    maxWidth: '80%',
  },
  actionsBtn: {
    padding: '0.75rem 1.5rem',
    fontWeight: 'bold',
  },
  section: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #333',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem',
  },
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  dt: {
    color: '#a0a0a0',
    fontWeight: 'normal',
    width: '120px',
    flexShrink: 0,
  },
  dd: {
    color: '#e0e0e0',
    marginLeft: '1rem',
  },
  castList: {
    display: 'flex',
    gap: '1.5rem',
    overflowX: 'auto',
    paddingBottom: '1rem',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  castListHideScroll: {
    scrollbarWidth: 'none',
  },
  castMember: {
    textAlign: 'center',
    width: '100px',
    flexShrink: 0,
  },
  castImg: {
    width: '100px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    backgroundColor: '#2a2a2a',
  },
  castName: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    marginBottom: '0.1rem',
  },
  castCharacter: {
    fontSize: '0.8rem',
    color: '#a0a0a0',
  }

};

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [detailsRes, recRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/movies/details/${movieId}`),
          axios.get(`${API_BASE_URL}/movies/recommendations/${movieId}`)
        ]);
        setMovie(detailsRes.data);
        setRelatedMovies(recRes.data);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        toast.error("Could not load movie details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]);

  const handleWatchTrailerClick = () => {
    const trailer = movie?.videos?.results?.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
    setVideoKey(trailer?.key || null);
    setShowVideoModal(true);
  };

  const handleAddToWatchlist = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please log in first."); return; }
    try {
      const res = await axios.post(`${API_BASE_URL}/users/watchlist/${id}`, {}, { headers: { "x-auth-token": token } });
      toast.success(res.data.msg);
    } catch (err) { toast.error("Could not update watchlist."); }
  };

  const handleCloseVideoModal = () => setShowVideoModal(false);

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div className="container text-light pt-5 mt-5">Movie details not found.</div>;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';
  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast.slice(0, 10) || [];

  return (
    <div style={styles.page}>
      <div style={{ ...styles.backdrop, backgroundImage: `url(${backdropUrl})` }}>
        <div style={styles.backdropOverlay}></div>
      </div>

      <div className="container" style={styles.content}>
        <div className="row">
          <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
            <img src={posterUrl} alt={movie.title} style={styles.poster} className="img-fluid" />
          </div>
          <div className="col-md-8">
            <h1 style={styles.title}>{movie.title}</h1>
            <div style={styles.meta} className="mb-3">
              <span>{year}</span>
              <span style={styles.bullet}>•</span>
              <span>{formatRuntime(movie.runtime)}</span>
              <span style={styles.bullet}>•</span>
              <span><i className="bi bi-star-fill text-warning"></i> {rating} / 10</span>
            </div>
            <div className="genres mb-3">
              {movie.genres?.map(g => (
                <span key={g.id} style={styles.badge}>{g.name}</span>
              ))}
            </div>
            <p style={styles.overview}>{movie.overview}</p>
            <div className="detail-actions mt-4 mb-4">
              <button className="btn btn-light me-3" style={styles.actionsBtn} onClick={handleWatchTrailerClick}>
                <i className="bi bi-play-fill me-2"></i> Watch Trailer
              </button>
              <button className="btn btn-outline-light" style={styles.actionsBtn} onClick={() => handleAddToWatchlist(movie.id)}>
                <i className="bi bi-plus-lg me-2"></i> Add to Watchlist
              </button>
            </div>

            {/* Movie Info */}
            <dl style={styles.detailList}>
              {director && (
                <>
                  <dt style={styles.dt}>Director</dt>
                  <dd style={styles.dd}>{director.name}</dd>
                </>
              )}
              <dt style={styles.dt}>Budget</dt>
              <dd style={styles.dd}>{formatCurrency(movie.budget)}</dd>
              <dt style={styles.dt}>Revenue</dt>
              <dd style={styles.dd}>{formatCurrency(movie.revenue)}</dd>
              <dt style={styles.dt}>Language</dt>
              <dd style={styles.dd}>{movie.original_language?.toUpperCase()}</dd>
            </dl>
          </div>
        </div>

        {/* Cast */}
        {mainCast.length > 0 && (
          <div style={styles.section}>
            <h5 style={styles.sectionTitle}>Top Cast</h5>
            <div style={styles.castList}>
              {mainCast.map(actor => (
                <div key={actor.cast_id} style={styles.castMember}>
                  <img
                    src={actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://via.placeholder.com/100x150?text=No+Image'}
                    alt={actor.name}
                    style={styles.castImg}
                  />
                  <p style={styles.castName}>{actor.name}</p>
                  <p style={styles.castCharacter}>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Movies */}
{/* Related Movies */}
          {/* Related Movies */}
{relatedMovies.length > 0 && (
  <section className="container mt-5" style={styles.section}>
    <h3 className="mb-4" style={{ fontWeight: 600 }}>Related Movies</h3>

    <div
      className="related-movies-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch',
      }}
    >
      {relatedMovies.slice(0, 15).map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onCardClick={() => navigate(`/movie/${movie.id}`)}
          onWatchlistClick={handleAddToWatchlist}
        />
      ))}
    </div>
  </section>
)}




      <VideoModal show={showVideoModal} handleClose={handleCloseVideoModal} videoKey={videoKey} />
    </div>
  );
};

export default MovieDetailPage;

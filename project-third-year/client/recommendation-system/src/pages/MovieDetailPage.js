import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";
import VideoModal from "../components/common/VideoModal";
import WatchMovieModal from "../components/movie/WatchMovieModal";
import MovieCard from "../components/movie/MovieCard";

const styles = {
  page: {
    backgroundColor: "#000",
    color: "white",
    paddingBottom: "3rem",
  },
  backdrop: {
    height: "60vh",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center 30%",
    position: "relative",
  },
  backdropOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to top, #000000ff 10%, transparent 70%)",
  },
  content: {
    marginTop: "-150px",
    position: "relative",
    zIndex: 10,
  },
  poster: {
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    maxWidth: "300px",
    width: "100%",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  meta: {
    fontSize: "1rem",
    color: "#a0a0a0",
  },
  bullet: { margin: "0 8px" },
  badge: {
    fontSize: "0.8rem",
    padding: "5px 10px",
    backgroundColor: "#6c757d",
    borderRadius: "5px",
    marginRight: "0.5rem",
    marginBottom: "0.3rem",
    display: "inline-block",
  },
  overview: {
    fontSize: "1rem",
    lineHeight: 1.6,
    marginTop: "1rem",
    maxWidth: "100%",
  },
  actionsBtn: { padding: "0.75rem 1.5rem", fontWeight: "bold" },
  watchNowBtn: {
    padding: "0.75rem 1.5rem",
    fontWeight: "bold",
    backgroundColor: "#e50914",
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    fontFamily: "'Poppins', sans-serif",
  },
  section: {
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #333",
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "1rem",
  },
  castList: {
    display: "flex",
    gap: "1.5rem",
    overflowX: "auto",
    paddingBottom: "1rem",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  castMember: {
    textAlign: "center",
    width: "100px",
    flexShrink: 0,
  },
  castImg: {
    width: "100px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "0.5rem",
    backgroundColor: "#2a2a2a",
  },
  castName: {
    fontSize: "0.9rem",
    color: "#e0e0e0",
    marginBottom: "0.1rem",
  },
  castCharacter: {
    fontSize: "0.8rem",
    color: "#a0a0a0",
  },
  providerLink: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#1a73e8",
    color: "white",
    textDecoration: "none",
    borderRadius: "20px",
    fontWeight: "600",
  },
  providerSection: {
    marginBottom: "1.25rem",
  },
  providerSubTitle: {
    color: "#a0a0a0",
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  providerList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    alignItems: "center",
  },
  providerIconLink: {
    display: "block",
    textDecoration: "none",
    transition: "transform 0.2s ease",
  },
  providerLogo: {
    width: "45px",
    height: "45px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  detailList: {
    display: "flex",
    flexDirection: "column",
  },
  detailRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: "0.75rem",
    fontSize: "1rem",
  },
  dt: {
    color: "#a0a0a0",
    fontWeight: "normal",
    width: "120px",
    flexShrink: 0,
  },
  dd: {
    color: "#e0e0e0",
    marginLeft: "1rem",
    fontWeight: "600",
  },
};

const providerHomepages = {
  Netflix: "https://www.netflix.com",
  "Amazon Prime Video": "https://www.primevideo.com",
  "Disney Plus": "https://www.disneyplus.com",
  "Disney+ Hotstar": "https://www.hotstar.com",
  Hulu: "https://www.hulu.com",
  "Apple TV Plus": "https://tv.apple.com",
  YouTube: "https://www.youtube.com",
  "YouTube Premium": "https://www.youtube.com",
  "Google Play Movies": "https://play.google.com/store/movies",
  JioCinema: "https://www.jiocinema.com",
  Zee5: "https://www.zee5.com",
  "Sony Liv": "https://www.sonyliv.com",
};

const ProviderSection = ({ title, providers }) => {
  if (!providers || providers.length === 0) return null;
  return (
    <div style={styles.providerSection}>
      <h6 style={styles.providerSubTitle}>{title}</h6>
      <div style={styles.providerList}>
        {providers.map((p) => {
          const homepageUrl = providerHomepages[p.provider_name];
          const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(p.provider_name)}`;
          const finalUrl = homepageUrl || fallbackUrl;
          return (
            <a
              key={p.provider_id}
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.providerIconLink}
              title={`Go to ${p.provider_name}`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                alt={p.provider_name}
                style={styles.providerLogo}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};

const MOVIES_PER_PAGE = 10;

const MovieDetailPage = () => {
  const { movieId } = useParams();

  const logActivity = async (movieData, actionType) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api.post("/activity/log", {
        movie_id:          movieData.id,
        action_type:       actionType,
        movie_title:       movieData.title       || "Unknown",
        movie_poster_path: movieData.poster_path || "",
      });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  const [movie, setMovie]                             = useState(null);
  const [relatedMovies, setRelatedMovies]             = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [showVideoModal, setShowVideoModal]           = useState(false);
  const [videoKey, setVideoKey]                       = useState(null);
  const [showWatchModal, setShowWatchModal]           = useState(false);
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(MOVIES_PER_PAGE);
  const [isInWatchlist, setIsInWatchlist]             = useState(false);
  const [watchlistIds, setWatchlistIds]               = useState([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [detailsRes, recRes] = await Promise.all([
          api.get(`/movies/details/${movieId}`),
          api.get(`/movies/recommendations/${movieId}`),
        ]);

        const movieData = detailsRes.data;
        setMovie(movieData);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const check = await api.get(`/users/watchlist/check/${movieId}`);
            setIsInWatchlist(check.data.isInWatchlist);
            const wlRes = await api.get("/users/watchlist");
            setWatchlistIds(Array.isArray(wlRes.data) ? wlRes.data : []);
          } catch (err) {
            console.error("Watchlist check failed:", err);
          }
          try {
            await api.post("/activity/log", {
              movie_id:          movieData.id,
              action_type:       "search_click",
              movie_title:       movieData.title       || "Unknown",
              movie_poster_path: movieData.poster_path || "",
            });
          } catch (_) {}
        }

        const uniqueRelated = recRes.data.filter(
          (m, index, self) =>
            index === self.findIndex((x) => x.id === m.id)
        );
        setRelatedMovies(uniqueRelated);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        toast.error("Failed to load movie details.");
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]);

  useEffect(() => {
    if (movie && window.location.hash === "#watch") {
      const el = document.getElementById("watch-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [movie]);

  const handleWatchMainTrailerClick = async () => {
    try {
      if (movie) logActivity(movie, "trailer_watch");
      const res = await api.get(`/movies/${movieId}/videos`);
      const trailer = res.data;
      if (trailer && trailer.key) {
        setVideoKey(trailer.key);
        setShowVideoModal(true);
      } else {
        toast.info("No trailer available for this movie.");
      }
    } catch (err) {
      console.error("Error fetching main trailer:", err);
      toast.error("Could not load trailer.");
    }
  };

  const handleWatchRelatedTrailerClick = async (relatedMovie) => {
    const relatedMovieId = relatedMovie?.id ?? relatedMovie;
    if (!relatedMovieId) return;
    try {
      const res = await api.get(`/movies/${relatedMovieId}/videos`);
      const trailer = res.data;
      if (trailer && trailer.key) {
        setVideoKey(trailer.key);
        setShowVideoModal(true);
      } else {
        toast.info("No trailer available for this movie.");
      }
    } catch (err) {
      console.error("Error fetching related trailer:", err);
      toast.error("Could not load trailer.");
    }
  };

  const handleWatchlistToggle = async (movieToToggle) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please log in first."); return; }
    try {
      const check = await api.get(`/users/watchlist/check/${movieToToggle.id}`);
      if (check.data.isInWatchlist) {
        await api.delete(`/users/watchlist/${movieToToggle.id}`);
        logActivity(movieToToggle, "removed_from_watchlist");
        toast.success("Removed from watchlist");
        setIsInWatchlist(false);
        setWatchlistIds((prev) => prev.filter((id) => id !== movieToToggle.id));
      } else {
        await api.post(`/users/watchlist/${movieToToggle.id}`);
        logActivity(movieToToggle, "added_to_watchlist");
        toast.success("Added to watchlist");
        setIsInWatchlist(true);
        setWatchlistIds((prev) => [...prev, movieToToggle.id]);
      }
    } catch (err) {
      console.error("Watchlist update error:", err);
      toast.error("Could not update watchlist.");
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setVideoKey(null);
  };

  const handleLoadMore = () => {
    setVisibleRelatedCount((prev) => prev + MOVIES_PER_PAGE);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return `$${amount.toLocaleString("en-US")}`;
  };

  const newButtonStyles = `
    .load-more-btn {
      transform: rotate(-25deg) skew(25deg);
      transform-style: preserve-3d;
      position: relative;
      list-style: none;
      width: 120px;
      height: 40px;
      border: none;
      background: transparent;
      font-family: inherit;
      cursor: pointer;
      margin: 1rem 0;
    }
    .load-more-btn:before {
      content: '';
      position: absolute;
      bottom: -10px;
      left: -5px;
      width: 100%;
      height: 10px;
      background: #2a2a2a;
      transform: skewX(-41deg);
    }
    .load-more-btn:after {
      content: '';
      position: absolute;
      top: 5px;
      left: -9px;
      width: 9px;
      height: 100%;
      background: #2a2a2a;
      transform: skewY(-49deg);
    }
    .load-more-btn span {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: #2a2a2a;
      color: #fff;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 1.1s ease-out;
    }
    .load-more-btn:hover span { z-index:1000; transition:.3s; color:#fff; background:#848987ff; }
    .load-more-btn:hover span:nth-child(5) { transform:translate(40px,-40px); opacity:1; }
    .load-more-btn:hover span:nth-child(4) { transform:translate(30px,-30px); opacity:.8; }
    .load-more-btn:hover span:nth-child(3) { transform:translate(20px,-20px); opacity:.6; }
    .load-more-btn:hover span:nth-child(2) { transform:translate(10px,-10px); opacity:.4; }
    .load-more-btn:hover span:nth-child(1) { transform:translate(0px,0px); opacity:.2; }
    .watch-now-btn:hover {
      background: #ff0a16 !important;
      box-shadow: 0 0 20px rgba(229,9,20,0.45);
      transform: translateY(-1px);
    }
    .provider-icon-hover:hover {
      transform: translateY(-3px) scale(1.05);
    }
    .cast-list::-webkit-scrollbar { display: none; }
  `;

  if (loading) return <LoadingSpinner />;
  if (!movie)
    return (
      <div className="container text-light pt-5 mt-5 text-center">
        <h2>Movie Not Found</h2>
        <p>The requested movie details could not be loaded.</p>
      </div>
    );

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Poster";
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : "N/A";
  const director   = movie.credits?.crew?.find((p) => p.job === "Director");
  const mainCast   = movie.credits?.cast?.slice(0, 10) || [];
  const providers  =
    movie["watch/providers"]?.results?.IN ||
    movie["watch/providers"]?.results?.US ||
    {};
  const streamingProviders = providers.flatrate;
  const rentProviders      = providers.rent;
  const buyProviders       = providers.buy;
  const freeProviders      = providers.ads;
  const hasProviders = streamingProviders || rentProviders || buyProviders || freeProviders;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`watch ${movie.title} ${year} online`)}`;

  return (
    <div style={styles.page}>
      <style>{newButtonStyles}</style>

      {/* ── Backdrop ── */}
      <div
        style={{
          ...styles.backdrop,
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
          backgroundColor: "#111",
        }}
      >
        <div style={styles.backdropOverlay} />
      </div>

      {/* ── Main Content ── */}
      <div className="container" style={{ ...styles.content, padding: "0 2rem" }}>
        <div className="row">

          {/* Poster */}
          <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              style={styles.poster}
              className="img-fluid"
            />
          </div>

          {/* Details */}
          <div className="col-md-8">
            <h1 style={styles.title}>{movie.title}</h1>

            <div style={styles.meta} className="mb-3 d-flex align-items-center flex-wrap">
              <span>{year}</span>
              {movie.runtime > 0 && (
                <>
                  <span style={styles.bullet}>•</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                </>
              )}
              {rating !== "N/A" && (
                <>
                  <span style={styles.bullet}>•</span>
                  <span>
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    {rating} / 10
                  </span>
                </>
              )}
            </div>

            <div className="genres mb-3">
              {movie.genres?.map((g) => (
                <span key={g.id} style={styles.badge}>{g.name}</span>
              ))}
            </div>

            <p style={styles.overview}>
              {movie.overview || "No overview available."}
            </p>

            {/* ── Action Buttons ── */}
            <div
              className="detail-actions mt-4 mb-4 d-flex flex-wrap"
              style={{ gap: "1rem", alignItems: "center" }}
            >
              {/* Watch Now */}
              <button
                className="watch-now-btn"
                style={styles.watchNowBtn}
                onClick={() => setShowWatchModal(true)}
              >
                <i className="bi bi-play-fill"></i> Watch Now
              </button>

              {/* Watch Trailer */}
              <button
                className="btn btn-light"
                style={styles.actionsBtn}
                onClick={handleWatchMainTrailerClick}
              >
                <i className="bi bi-film me-2"></i> Watch Trailer
              </button>

              {/* Watchlist */}
              <button
                className="btn btn-outline-light"
                style={styles.actionsBtn}
                onClick={() => handleWatchlistToggle(movie)}
              >
                {isInWatchlist ? (
                  <><i className="bi bi-check-lg me-2"></i> In Watchlist</>
                ) : (
                  <><i className="bi bi-plus-lg me-2"></i> Add to Watchlist</>
                )}
              </button>
            </div>

            {/* Movie Info */}
            <dl style={{ ...styles.detailList, marginTop: "2rem" }}>
              {director && (
                <div style={styles.detailRow}>
                  <dt style={styles.dt}>Director</dt>
                  <dd style={styles.dd}>{director.name}</dd>
                </div>
              )}
              {movie.budget > 0 && (
                <div style={styles.detailRow}>
                  <dt style={styles.dt}>Budget</dt>
                  <dd style={styles.dd}>{formatCurrency(movie.budget)}</dd>
                </div>
              )}
              {movie.revenue > 0 && (
                <div style={styles.detailRow}>
                  <dt style={styles.dt}>Revenue</dt>
                  <dd style={styles.dd}>{formatCurrency(movie.revenue)}</dd>
                </div>
              )}
              {movie.original_language && (
                <div style={styles.detailRow}>
                  <dt style={styles.dt}>Language</dt>
                  <dd style={styles.dd}>{movie.original_language.toUpperCase()}</dd>
                </div>
              )}
            </dl>

            {/* Where to Watch */}
            {hasProviders ? (
              <div
                id="watch-section"
                style={{ ...styles.section, paddingTop: "1.5rem", marginTop: "2rem" }}
              >
                <h5 style={styles.sectionTitle}>Where to Watch</h5>
                <ProviderSection title="Stream"        providers={streamingProviders} />
                <ProviderSection title="Rent"          providers={rentProviders} />
                <ProviderSection title="Buy"           providers={buyProviders} />
                <ProviderSection title="Free with Ads" providers={freeProviders} />
              </div>
            ) : (
              <div style={{ ...styles.section, paddingTop: "1.5rem", marginTop: "2rem" }}>
                <h5 style={styles.sectionTitle}>Where to Watch</h5>
                <p style={{ color: "#a0a0a0" }}>
                  No streaming information currently available.
                </p>
                <a
                  href={googleSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.providerLink, marginTop: "0.5rem" }}
                >
                  Find Stream Online
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Cast ── */}
        {mainCast.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div style={styles.section}>
                <h5
                  style={{
                    ...styles.sectionTitle,
                    fontWeight: 800,
                    textAlign: "center",
                    fontSize: "2.3rem",
                  }}
                >
                  Top Cast
                </h5>
                <div className="cast-list" style={styles.castList}>
                  {mainCast.map((actor) => (
                    <div key={actor.cast_id || actor.id} style={styles.castMember}>
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "https://placehold.co/100x150?text=N/A"
                        }
                        alt={actor.name}
                        style={styles.castImg}
                      />
                      <p style={{ ...styles.castName, marginTop: "0.25rem" }}>
                        {actor.name}
                      </p>
                      <p style={styles.castCharacter}>
                        {actor.character || actor.job}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Related Movies ── */}
      {relatedMovies.length > 0 && (
        <div className="container mt-5">
          <div className="row">
            <div className="col-12">
              <section style={styles.section}>
                <h3
                  className="mb-4"
                  style={{ fontWeight: 800, textAlign: "center", fontSize: "2.5rem" }}
                >
                  Related Movies
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "2rem",
                    alignItems: "start",
                  }}
                >
                  {relatedMovies.slice(0, visibleRelatedCount).map((relMovie) => (
                    <div
                      key={relMovie.id}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <MovieCard
                        movie={relMovie}
                        watchlist={watchlistIds}
                        onWatchlistClick={handleWatchlistToggle}
                        onWatchTrailerClick={handleWatchRelatedTrailerClick}
                      />
                    </div>
                  ))}
                </div>

                {visibleRelatedCount < relatedMovies.length && (
                  <div className="text-center mt-5 mb-4">
                    <button className="load-more-btn" onClick={handleLoadMore}>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span>Load More</span>
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* ── Trailer Modal ── */}
      <VideoModal
        show={showVideoModal}
        handleClose={handleCloseVideoModal}
        videoKey={videoKey}
      />

      {/* ── Watch Now Modal ── */}
      <WatchMovieModal
        show={showWatchModal}
        handleClose={() => setShowWatchModal(false)}
        tmdbId={movie?.id}
        movieTitle={movie?.title}
      />
    </div>
  );
};

export default MovieDetailPage;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";
import VideoModal from "./VideoModal";
import MovieCard from "./MovieCard";

// ALL STYLES ARE IN THIS OBJECT
const styles = {
  page: {
    backgroundColor: "#000", // Simplified color
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
  },
  overview: {
    fontSize: "1rem",
    lineHeight: 1.6,
    marginTop: "1rem",
    maxWidth: "100%", // Adjusted width
  },
  actionsBtn: { padding: "0.75rem 1.5rem", fontWeight: "bold" },
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
  scrollbarWidth: "none",       // Firefox
  msOverflowStyle: "none",      // IE/Edge
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
    // Added from previous for consistency
    fontSize: "0.9rem",
    color: "#e0e0e0",
    marginBottom: "0.1rem",
  },
  castCharacter: {
    // Added from previous for consistency
    fontSize: "0.8rem",
    color: "#a0a0a0",
  },
  providerLink: {
    // Fallback link style
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
    // Added from previous version
    display: "flex",
    flexDirection: "column",
  },
  detailRow: {
    // Added from previous version
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: "0.75rem",
    fontSize: "1rem",
  },

  dt: {
    // Added from previous version
    color: "#a0a0a0",
    fontWeight: "normal",
    width: "120px",
    flexShrink: 0,
  },
  dd: {
    // Added from previous version
    color: "#e0e0e0",
    marginLeft: "1rem",
    fontWeight: "600",
  },
};

// Provider Homepages
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

// Provider Section Sub-Component (simplified from your provided code)
const ProviderSection = ({ title, providers }) => {
  if (!providers || providers.length === 0) return null;
  return (
    <div style={styles.providerSection}>
      {" "}
      {/* Use style from object */}
      <h6 style={styles.providerSubTitle}>
        {" "}
        {/* Use style from object */}
        {title}
      </h6>
      <div style={styles.providerList}>
        {" "}
        {/* Use style from object */}
        {providers.map((p) => {
          const homepageUrl = providerHomepages[p.provider_name];
          const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(
            p.provider_name
          )}`;
          const finalUrl = homepageUrl || fallbackUrl;
          return (
            <a
              key={p.provider_id}
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.providerIconLink} /* Use style from object */
              title={`Go to ${p.provider_name}`}
              className="provider-icon-hover" // Class for potential CSS hover
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                alt={p.provider_name}
                style={styles.providerLogo} /* Use style from object */
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
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoKey, setVideoKey] = useState(null); // Keep track of the video key
  const [visibleRelatedCount, setVisibleRelatedCount] =
    useState(MOVIES_PER_PAGE);

  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch Movie Data Effect
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        // Fetch details (including videos/credits/providers) and recommendations
        const [detailsRes, recRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/movies/details/${movieId}`), // Assuming backend adds providers
          axios.get(`${API_BASE_URL}/movies/recommendations/${movieId}`),
        ]);
        setMovie(detailsRes.data);
        setRelatedMovies(recRes.data);
        setVisibleRelatedCount(MOVIES_PER_PAGE); // Reset visible count on new movie load

        // Find the trailer key after movie data is fetched
        const trailer = detailsRes.data?.videos?.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        const fallbackVideo = detailsRes.data?.videos?.results?.find(
          (vid) => vid.site === "YouTube"
        );
        setVideoKey(trailer?.key || fallbackVideo?.key || null); // Set video key here
      } catch (err) {
        console.error("Error fetching movie data:", err);
        toast.error("Failed to load movie details.");
        setMovie(null); // Set movie to null on error
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]);

  // Scroll Effect
  useEffect(() => {
    if (movie && window.location.hash === "#watch") {
      const el = document.getElementById("watch-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [movie]);

  // --- Event Handlers ---

  // Handle Trailer Click (Simplified: uses videoKey state)
  const handleWatchMainTrailerClick = () => {
    if (videoKey) {
      setShowVideoModal(true);
    } else {
      toast.info("No trailer available for this movie.");
    }
  };

  // Handle Related Trailer Click (fetches video for related movie)
  const handleWatchRelatedTrailerClick = async (relatedMovieId) => {
    if (!relatedMovieId) {
      console.error("Watch trailer clicked with invalid movie ID");
      return;
    }
    try {
      const res = await axios.get(
        `${API_BASE_URL}/movies/${relatedMovieId}/videos`
      );
      const trailer = res.data?.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      const fallbackVideo = res.data?.results?.find(
        (vid) => vid.site === "YouTube"
      );
      const keyToUse = trailer?.key || fallbackVideo?.key || null;

      if (keyToUse) {
        // We need to temporarily store the key for the modal,
        // but don't overwrite the main movie's videoKey state permanently
        setShowVideoModal(true);
        // Pass the key directly or use a temporary state if needed
        // For simplicity, let's reuse videoKey state, but fetch it here
        setVideoKey(keyToUse);
      } else {
        toast.info("No trailer available for this movie.");
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
      toast.error("Could not load trailer.");
      setVideoKey(null); // Ensure key is null on error
      setShowVideoModal(true); // Still show modal, it handles 'no key' message
    }
  };

  // Handle Add to Watchlist
  const handleAddToWatchlist = async (movieToAdd) => {
    // Use distinct parameter name
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }
    try {
      // Use movieToAdd.id
      const res = await axios.post(
        `${API_BASE_URL}/users/watchlist/${movieToAdd.id}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      toast.success(res.data.msg);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      toast.error(err.response?.data?.msg || "Could not update watchlist.");
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    // Optional: Reset videoKey if it was temporary for related movies
    // This depends if you want the main trailer button to remember the related key
    // Maybe better to re-fetch main movie trailer key if needed?
    // For now, let's leave it as is.
  };

  // Handle Load More Related Movies
  const handleLoadMore = () => {
    setVisibleRelatedCount((prev) => prev + MOVIES_PER_PAGE);
  };

  // --- Helper Functions ---
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

  // --- Load More Button Styles ---
  const newButtonStyles = `
    .load-more-btn { transform: rotate(-25deg) skew(25deg); transform-style: preserve-3d; position: relative; list-style: none; width: 120px; height: 40px; border: none; background: transparent; font-family: inherit; cursor: pointer; margin: 1rem 0; }
    .load-more-btn:before { content: ''; position: absolute; bottom: -10px; left: -5px; width: 100%; height: 10px; background: #2a2a2a; transform: skewX(-41deg); }
    .load-more-btn:after { content: ''; position: absolute; top: 5px; left: -9px; width: 9px; height: 100%; background: #2a2a2a; transform: skewY(-49deg); }
    .load-more-btn span { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #2a2a2a; color: #fff; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: 1.1s ease-out; }
    .load-more-btn:hover span { z-index: 1000; transition: .3s; color: #fff; background: #848987ff; }
    .load-more-btn:hover span:nth-child(5) { transform: translate(40px, -40px); opacity: 1; }
    .load-more-btn:hover span:nth-child(4) { transform: translate(30px, -30px); opacity: .8; }
    .load-more-btn:hover span:nth-child(3) { transform: translate(20px, -20px); opacity: .6; }
    .load-more-btn:hover span:nth-child(2) { transform: translate(10px, -10px); opacity: .4; }
    .load-more-btn:hover span:nth-child(1) { transform: translate(0px, 0px); opacity: .2; }
    .load-more-btn:active span:nth-child(5) { transform: translate(20px, -20px); opacity: 1; }
    .load-more-btn:active span:nth-child(4) { transform: translate(15px, -15px); }
    .load-more-btn:active span:nth-child(3) { transform: translate(10px, -10px); }
    .load-more-btn:active span:nth-child(2) { transform: translate(5px, -5px); }
    .load-more-btn:active span:nth-child(1) { transform: translate(0px, 0px); }
  `;

  // --- Render Logic ---
  if (loading) return <LoadingSpinner />;
  if (!movie)
    return (
      <div className="container text-light pt-5 mt-5 text-center">
        <h2>Movie Not Found</h2>
        <p>The requested movie details could not be loaded.</p>
      </div>
    );

  // Destructure data after loading checks
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
  const director = movie.credits?.crew?.find(
    (person) => person.job === "Director"
  );
  const mainCast = movie.credits?.cast?.slice(0, 10) || [];
  const providers =
    movie["watch/providers"]?.results?.IN ||
    movie["watch/providers"]?.results?.US ||
    {};
  const streamingProviders = providers.flatrate;
  const rentProviders = providers.rent;
  const buyProviders = providers.buy;
  const freeProviders = providers.ads;
  const hasProviders =
    streamingProviders || rentProviders || buyProviders || freeProviders;
  const watchQuery = `watch ${movie.title} ${year} online`;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    watchQuery
  )}`;

  return (
    <div style={styles.page}>
      <style>{newButtonStyles}</style> {/* Inject button styles */}
      {/* Backdrop */}
      <div
        style={{
          ...styles.backdrop,
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
          backgroundColor: "#111",
        }}
      >
        <div style={styles.backdropOverlay}></div>
      </div>
      {/* Main Content Container */}
      <div
        className="container"
        style={{ ...styles.content, padding: "0 2rem" }}
      >
        {/* Row for Poster and Main Details */}
        <div className="row">
          {/* Poster Column */}
          <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              style={styles.poster}
              className="img-fluid"
            />
          </div>

          {/* Details Column */}
          <div className="col-md-8">
            <h1 style={styles.title}>{movie.title}</h1>
            {/* Using text-wrap for meta info */}
            <div
              style={styles.meta}
              className="mb-3 d-flex align-items-center flex-wrap"
            >
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
                <span key={g.id} style={styles.badge}>
                  {g.name}
                </span>
              ))}
            </div>
            <p style={styles.overview}>
              {movie.overview || "No overview available."}
            </p>
            <div
              className="detail-actions mt-4 mb-4 d-flex flex-wrap"
              style={{ gap: "1.25rem" }}
            >
              <button
                className="btn btn-light"
                style={styles.actionsBtn}
                onClick={handleWatchMainTrailerClick}
              >
                <i className="bi bi-play-fill me-2"></i> Watch Trailer
              </button>
              <button
                className="btn btn-outline-light"
                style={styles.actionsBtn}
                onClick={() => handleAddToWatchlist(movie)}
              >
                <i className="bi bi-plus-lg me-2"></i> Add to Watchlist
              </button>
            </div>

            {/* Movie Info (Director, Budget, etc.) */}
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
                  <dd style={styles.dd}>
                    {movie.original_language.toUpperCase()}
                  </dd>
                </div>
              )}
            </dl>

            {/* "WHERE TO WATCH" SECTION */}
            {hasProviders ? (
              <div
                id="watch-section"
                style={{
                  ...styles.section,
                  paddingTop: "1.5rem",
                  marginTop: "2rem",
                }}
              >
                <h5 style={styles.sectionTitle}>Where to Watch</h5>
                <ProviderSection
                  title="Stream"
                  providers={streamingProviders}
                />
                <ProviderSection title="Rent" providers={rentProviders} />
                <ProviderSection title="Buy" providers={buyProviders} />
                <ProviderSection
                  title="Free with Ads"
                  providers={freeProviders}
                />
              </div>
            ) : (
              <div
                style={{
                  ...styles.section,
                  paddingTop: "1.5rem",
                  marginTop: "2rem",
                }}
              >
                <h5 style={styles.sectionTitle}>Where to Watch</h5>
                <p style={{ color: styles.meta.color }}>
                  No streaming information currently available.
                </p>
                <a
                  href={googleSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.providerLink, marginTop: "0.5rem" }}
                  className="provider-link-hover"
                >
                  {" "}
                  Find Stream Online{" "}
                </a>
              </div>
            )}
          </div>
        </div>{" "}
        {/* End Row for Poster/Details */}
        {/* Row for Cast Section (Full Width Below) */}
        {mainCast.length > 0 && (
          <div className="row">
            <div className="col-12">
              <div style={styles.section}>
                <h5 style={{ ...styles.sectionTitle, fontWeight: 800, textAlign: "center", fontSize: "2.3rem" }}>Top Cast</h5>
                <div className="cast-list" style={styles.castList}>
                  {mainCast.map((actor) => (
                    <div
                      key={actor.cast_id || actor.id}
                      style={styles.castMember}
                    >
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "https://placehold.co/100x150?text=N/A"
                        }
                        alt={actor.name}
                        style={styles.castImg}
                      />
                      {/* Use styles object for consistency */}
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
      </div>{" "}
      {/* End Main Content Container */}
      {/* Related Movies Section (Uses its own Container for padding) */}
      {relatedMovies.length > 0 && (
        <div className="container mt-5">
          <div className="row">
            <div className="col-12">
              <section style={styles.section}>
                <h3 className="mb-4" style={{ fontWeight: 800, textAlign: "center", fontSize: "2.5rem" }}>
                  Related Movies
                </h3>
                <div
                  className="related-movies-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(270px, 1fr))",
                    gap: "1.5rem",
                    alignItems: "stretch", // Changed from justifyItems
                  }}
                >
                  {relatedMovies
                    .slice(0, visibleRelatedCount)
                    .map((relMovie) => (
                      // Center card in grid cell using flex
                      <div
                        key={relMovie.id}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <MovieCard
                          movie={relMovie}
                          // Pass correct handler for adding related movies to watchlist
                          onWatchlistClick={handleAddToWatchlist}
                          onWatchTrailerClick={handleWatchRelatedTrailerClick}
                        />
                      </div>
                    ))}
                </div>
                {visibleRelatedCount < relatedMovies.length && (
                  <div className="text-center mt-5 mb-4">
                    {/* Use styled Load More button */}
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
      {/* Video Modal */}
      <VideoModal
        show={showVideoModal}
        handleClose={handleCloseVideoModal}
        videoKey={videoKey}
      />
    </div> // End Page Div
  );
};

export default MovieDetailPage;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import VideoModal from "../components/common/VideoModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MovieCard from "../components/movie/MovieCard";
import { toast } from "react-toastify";
import { Form, Button, Spinner } from "react-bootstrap";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const initialYear = searchParams.get("year") || "";
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const [filterYear, setFilterYear] = useState(initialYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState([]);

  // Multi-signal filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const fetchSearchResults = useCallback(
    async (page = 1, loadMore = false) => {
      if (!query) return;
      if (!loadMore) {
        setLoading(true);
        if (page === 1) setSearchResults([]);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = { query, page };
        if (filterYear) params.year = filterYear;
        if (selectedLanguage) params.language = selectedLanguage;
        const res = await api.get(`/movies/search`, { params });
        setSearchResults((prev) =>
          loadMore ? [...prev, ...res.data.results] : res.data.results
        );
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        toast.error("Search results fetch nhi ho rha😑");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, filterYear, selectedLanguage]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get("/users/watchlist")
      .then(res => setWatchlistIds(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query) {
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);
    setCurrentPage(1);
    fetchSearchResults(1, false);
  }, [query, filterYear, selectedLanguage, navigate, fetchSearchResults]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSearchResults(nextPage, true);
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setFilterYear(newYear);
    const newSearchParams = new URLSearchParams(searchParams);
    if (newYear) newSearchParams.set("year", newYear);
    else newSearchParams.delete("year");
    navigate({ search: newSearchParams.toString() }, { replace: true });
  };

  const handleWatchTrailerClick = async (movie) => {
    try {
      const res = await api.get(`/movies/${movie.id}/videos`);
      setVideoKey(res.data?.key || null);
    } catch (err) {
      setVideoKey(null);
    } finally {
      setShowVideoModal(true);
    }
  };

  const handleWatchlistClick = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Nhi nhi phele Login karo 👀", {
        toastId: "watchlist-auth",
      });
      return;
    }
    const alreadyAdded = watchlistIds.includes(movie.id);
    try {
      if (alreadyAdded) {
        await api.delete(`/users/watchlist/${movie.id}`);
        setWatchlistIds(prev => prev.filter(id => id !== movie.id));
        toast.info(`"${movie.title}" remove kardiya😤`);
      } else {
        await api.post(`/users/watchlist/${movie.id}`, {});
        setWatchlistIds(prev => [...prev, movie.id]);
        toast.success(`"${movie.title}" add kardiya😎`);
      }
    } catch (err) {
      toast.error("Update nhi ho rha😑");
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  // Memoized filter and sort pipeline
  const filteredAndSortedResults = useMemo(() => {
    return searchResults
      .filter((movie) => {
        // 1. Genre filter
        if (selectedGenres.length > 0) {
          const hasGenre = movie.genre_ids && movie.genre_ids.some((id) => selectedGenres.includes(id));
          if (!hasGenre) return false;
        }
        // 2. Rating filter
        const rating = movie.vote_average || 0;
        if (rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        // 3. Sorting options
        if (sortBy === "rating-desc") return (b.vote_average || 0) - (a.vote_average || 0);
        if (sortBy === "rating-asc") return (a.vote_average || 0) - (b.vote_average || 0);
        if (sortBy === "year-desc") {
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateB - dateA;
        }
        if (sortBy === "year-asc") {
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateA - dateB;
        }
        if (sortBy === "popularity") return (b.popularity || 0) - (a.popularity || 0);
        return 0; // relevance (TMDB order)
      });
  }, [searchResults, selectedGenres, minRating, sortBy]);

  if (loading && currentPage === 1) return <LoadingSpinner />;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="container-fluid py-6" style={{ color: "white", paddingTop: "100px", minHeight: "100vh", background: "radial-gradient(circle at 50% 50%, #0e111a 0%, #050609 100%)" }}>
      <style>{`
        @media (min-width: 992px) {
          .sh-grid {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 12px !important;
          }
          .sh-grid > .col {
            width: 100% !important;
            max-width: none !important;
            flex: 0 0 auto !important;
          }
        }
        
        .sh-load-more-btn {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 30px;
          padding: 12px 40px;
          font-weight: 600;
          color: #fff;
          transition: 0.3s;
        }
        .sh-load-more-btn:hover {
          background: #3a7bd5 !important;
          border-color: rgba(58,123,213,0.3) !important;
          color: #fff !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(58,123,213,0.25);
        }

        /* Glassmorphic filter panel */
        .filter-panel {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 1.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
        }

        /* Genre pills */
        .genre-pill {
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.18);
          color: #cbd5e1;
          border-radius: 100px;
          padding: 6px 15px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .genre-pill:hover {
          color: #fff;
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
        }
        .genre-pill.active {
          background: rgba(58,123,213,0.9);
          border-color: rgba(58,123,213,0.4);
          color: #fff;
          box-shadow: 0 0 15px rgba(58,123,213,0.4);
        }

        .filter-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 5px;
          background: rgba(255,255,255,0.15);
          outline: none;
        }
        .filter-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3a7bd5;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(58,123,213,0.5);
          transition: 0.1s;
        }
        .filter-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>

      {/* Header Container */}
      <div className="mx-auto px-2 mb-4" style={{ maxWidth: "1500px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0" style={{ letterSpacing: "-1px" }}>Results for "{query}"</h2>
          <div className="d-flex gap-2">
            <Form.Select
              value={filterYear}
              onChange={handleYearChange}
              className="bg-dark text-light border-secondary"
              style={{ width: "110px", borderRadius: "10px" }}
              size="sm"
            >
              <option value="">Year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </Form.Select>
          </div>
        </div>

        {/* Multi-signal filter bento block */}
        <div className="filter-panel">
          <div className="mb-4">
            <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", color: "#cbd5e1" }}>Filter by Genre</h6>
            <div className="d-flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <div
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  className={`genre-pill${selectedGenres.includes(g.id) ? " active" : ""}`}
                >
                  {g.name}
                </div>
              ))}
            </div>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-md-6 col-lg-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", color: "#cbd5e1" }}>Minimum Rating</span>
                <span className="badge px-2 py-1" style={{ fontSize: "0.75rem", backgroundColor: "rgba(58, 123, 213, 0.2)", color: "#7cb1ff", border: "0.5px solid rgba(58, 123, 213, 0.4)" }}>
                  ★ {minRating.toFixed(1)}+
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="filter-slider"
              />
            </div>

            <div className="col-md-6 col-lg-4">
              <span className="fw-bold text-uppercase d-block mb-2" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", color: "#cbd5e1" }}>Original Language</span>
              <Form.Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-dark text-light border-secondary"
                style={{ borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                size="sm"
              >
                <option value="" style={{ backgroundColor: "#111" }}>All Languages</option>
                <option value="hi" style={{ backgroundColor: "#111" }}>🇮🇳 Hindi (Bollywood)</option>
                <option value="en" style={{ backgroundColor: "#111" }}>🇺🇸 English (Hollywood)</option>
                <option value="ko" style={{ backgroundColor: "#111" }}>🇰🇷 Korean</option>
                <option value="ja" style={{ backgroundColor: "#111" }}>🇯🇵 Japanese</option>
              </Form.Select>
            </div>

            <div className="col-md-6 col-lg-4 ms-auto">
              <span className="fw-bold text-uppercase d-block mb-2" style={{ fontSize: "0.75rem", letterSpacing: "1.5px", color: "#cbd5e1" }}>Sort By</span>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark text-light border-secondary"
                style={{ borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.05)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                size="sm"
              >
                <option value="relevance" style={{ backgroundColor: "#111" }}>Relevance</option>
                <option value="rating-desc" style={{ backgroundColor: "#111" }}>Rating: High to Low</option>
                <option value="rating-asc" style={{ backgroundColor: "#111" }}>Rating: Low to High</option>
                <option value="year-desc" style={{ backgroundColor: "#111" }}>Release Date: Newest</option>
                <option value="year-asc" style={{ backgroundColor: "#111" }}>Release Date: Oldest</option>
                <option value="popularity" style={{ backgroundColor: "#111" }}>Popularity</option>
              </Form.Select>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div 
          className="row row-cols-2 row-cols-md-4 row-cols-lg-7 sh-grid w-100 justify-content-center"
          style={{ maxWidth: "1500px", overflow: "visible" }}
        >
          {filteredAndSortedResults.length > 0 ? (
            filteredAndSortedResults.map((movie) => (
              <div className="col d-flex justify-content-center mb-4" key={`${movie.id}-${currentPage}`} style={{ overflow: "visible" }}>
                <MovieCard
                  movie={movie}
                  watchlist={watchlistIds}
                  onWatchTrailerClick={handleWatchTrailerClick}
                  onWatchlistClick={handleWatchlistClick}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">No movies match your filters.</div>
          )}
        </div>
      </div>

      <div className="text-center mt-5 mb-5">
        {currentPage < totalPages && !loadingMore && (
          <Button variant="outline-light" onClick={handleLoadMore} className="sh-load-more-btn">
            Load More
          </Button>
        )}
        {loadingMore && <Spinner animation="border" variant="danger" size="sm" />}
      </div>

      <VideoModal show={showVideoModal} handleClose={() => setShowVideoModal(false)} videoKey={videoKey} />
    </div>
  );
};

export default SearchPage;
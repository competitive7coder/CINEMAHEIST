import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import VideoModal from "../components/common/VideoModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MovieCard from "../components/movie/MovieCard";
import { toast } from "react-toastify";
import { Form, Button, Spinner } from "react-bootstrap";

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
        const res = await api.get(`/movies/search`, { params });
        setSearchResults((prev) =>
          loadMore ? [...prev, ...res.data.results] : res.data.results
        );
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        toast.error("Could not fetch search results.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, filterYear]
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
  }, [query, filterYear, navigate, fetchSearchResults]);

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
      toast.error("Please log in to manage your watchlist.");
      return;
    }
    const alreadyAdded = watchlistIds.includes(movie.id);
    try {
      if (alreadyAdded) {
        await api.delete(`/users/watchlist/${movie.id}`);
        setWatchlistIds(prev => prev.filter(id => id !== movie.id));
        toast.info(`Removed "${movie.title}" from watchlist`);
      } else {
        await api.post(`/users/watchlist/${movie.id}`, {});
        setWatchlistIds(prev => [...prev, movie.id]);
        toast.success(`Added "${movie.title}" to watchlist`);
      }
    } catch (err) {
      toast.error("Update failed. Please try again.");
    }
  };

  if (loading && currentPage === 1) return <LoadingSpinner />;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="container-fluid py-6" style={{ color: "white", paddingTop: "100px" }}>
      <style>{`
        @media (min-width: 992px) {
          .sh-grid {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 10px !important;
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
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 12px 40px;
          font-weight: 600;
          color: #fff;
          transition: 0.3s;
        }
        .sh-load-more-btn:hover {
          background: #fff !important;
          color: #000 !important;
          transform: translateY(-3px);
        }
      `}</style>

      {/* Header Container */}
      <div className="d-flex justify-content-between align-items-center mb-4 mx-auto px-2" style={{ maxWidth: "1500px" }}>
        <h4 className="fw-bold mb-0">Results for "{query}"</h4>
        <Form.Select
          value={filterYear}
          onChange={handleYearChange}
          className="bg-dark text-light border-secondary"
          style={{ width: "100px" }}
          size="sm"
        >
          <option value="">Year</option>
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </Form.Select>
      </div>

      <div className="d-flex justify-content-center">
        <div 
          className="row row-cols-3 sh-grid w-100 justify-content-center"
          style={{ maxWidth: "1500px" }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((movie) => (
              <div className="col d-flex justify-content-center mb-3" key={`${movie.id}-${currentPage}`}>
                <MovieCard
                  movie={movie}
                  watchlist={watchlistIds}
                  onWatchTrailerClick={handleWatchTrailerClick}
                  onWatchlistClick={handleWatchlistClick}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">No movies found.</div>
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
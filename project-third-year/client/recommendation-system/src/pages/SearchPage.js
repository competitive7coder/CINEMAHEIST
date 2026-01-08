import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
// --- FIXED IMPORTS ---
import VideoModal from "../components/common/VideoModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MovieCard from "../components/movie/MovieCard"; // Corrected path
// --- END OF FIXED IMPORTS ---
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

  // Memoized fetch function for search results
  const fetchSearchResults = useCallback(
    async (page = 1, loadMore = false) => {
      if (!query) return; // Exit if no query
      if (!loadMore) {
        setLoading(true);
        if (page === 1) setSearchResults([]); // Clear results on new search/filter/page 1
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
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching search results:", err);
        toast.error("Could not fetch search results.");
        setSearchResults([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, filterYear]
  );

  // Effect runs on initial load and when query or filterYear changes
  useEffect(() => {
    if (!query) {
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);
    setCurrentPage(1);
    fetchSearchResults(1, false);
  }, [query, filterYear, navigate, fetchSearchResults]);

  // Handler for the "Load More" button
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSearchResults(nextPage, true);
  };

  // Handler for changing the year filter dropdown
  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setFilterYear(newYear);
    const newSearchParams = new URLSearchParams(searchParams);
    if (newYear) newSearchParams.set("year", newYear);
    else newSearchParams.delete("year");
    navigate({ search: newSearchParams.toString() }, { replace: true });
  };

  // --- Functions for card actions ---
  const logActivity = async (movieId, actionType) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api.post(`/activity/log`, { movieId, actionType });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  const handleWatchTrailerClick = async (movieId) => {
    logActivity(movieId, "trailer_watch");
    try {
      const res = await api.get(`/movies/${movieId}/videos`);
      setVideoKey(res.data?.key || null);
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setVideoKey(null);
    } finally {
      setShowVideoModal(true);
    }
  };

  // ================== THIS IS THE FIX ==================
  const handleAddToWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add to your watchlist.");
      return;
    }

    try {
      const res = await api.post(`/users/watchlist/${movie.id}`, {});
      toast.success(res.data.msg);

      if (res.data.msg.includes("added"))
        logActivity(movie.id, "watchlist_add");
    } catch (err) {
      // This is the new error handling block
      console.error("Error updating watchlist:", err); // This was line 122

      if (err.response?.status === 401) {
        // If token is expired, log them out
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        // We can't call setIsLoggedIn here, but we can force a redirect
        navigate("/login");
      } else {
        // For any other error
        toast.error(err.response?.data?.msg || "Could not update watchlist.");
      }
    }
  };
  // =====================================================

  const handleCloseVideoModal = () => setShowVideoModal(false);
  // --- End of Functions ---

  if (loading && currentPage === 1) return <LoadingSpinner />;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div
      className="container-fluid"
      style={{ color: "white", marginTop: "20px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="mb-0 me-3">Search Results for "{query}"</h2>
        <Form.Select
          aria-label="Filter by year"
          value={filterYear}
          onChange={handleYearChange}
          style={{ width: "150px" }}
          className="bg-dark text-light border-secondary form-select-sm ms-auto"
          size="sm"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Form.Select>
      </div>

      <div style={{ width: "100%" }}>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {searchResults.length > 0
            ? searchResults.map((movie) => (
                <div className="col" key={`${movie.id}-${currentPage}`}>
                  <MovieCard
                    movie={movie}
                    onWatchTrailerClick={handleWatchTrailerClick}
                    onWatchlistClick={handleAddToWatchlist}
                  />
                </div>
              ))
            : !loading && (
                <p className="text-muted col-12">
                  No movies found matching your criteria.
                </p>
              )}
        </div>
      </div>

      <div className="text-center mt-5 mb-4">
        {currentPage < totalPages && !loadingMore && (
          <Button variant="outline-light" onClick={handleLoadMore}>
            Load More
          </Button>
        )}
        {loadingMore && <Spinner animation="border" variant="light" />}
      </div>

      <VideoModal
        show={showVideoModal}
        handleClose={handleCloseVideoModal}
        videoKey={videoKey}
      />
    </div>
  );
};

export default SearchPage;

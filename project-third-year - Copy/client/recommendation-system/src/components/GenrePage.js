import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MovieCard from "./MovieCard";
import VideoModal from "./VideoModal";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";
import { Dropdown, Form, Button, Spinner } from "react-bootstrap";

const GENRE_MAP = {
  popular: "Trending Now",
  "new-releases": "New Releases",
  28: "Action Packed",
  35: "Comedy Movies",
  27: "Horror Flicks",
  10749: "Romantic Movies",
  878: "Science Fiction",
  53: "Thriller Tales",
  12: "Adventure",
  16: "Animation",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
};

const GenrePage = () => {
  const { genreId } = useParams();
  const genreName = GENRE_MAP[genreId] || "Movies";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [filterYear, setFilterYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

  // ✅ Safe fetch function
  const fetchMoviesByGenre = useCallback(
    async (page = 1, loadMore = false) => {
      if (!loadMore) {
        setLoading(true);
        if (page === 1) setMovies([]);
      } else setLoadingMore(true);

      try {
        let url;
        const params = { page };

        if (genreId === "popular") url = `${API_BASE_URL}/movies/popular`;
        else if (genreId === "new-releases")
          url = `${API_BASE_URL}/movies/now-playing`;
        else {
          url = `${API_BASE_URL}/movies/genre/${genreId}`;
          params.sort_by = sortBy;
          if (filterYear) params.year = filterYear;
        }

        const res = await axios.get(url, { params });
        const newResults = Array.isArray(res.data) 
  ? res.data  // if backend returns array directly
  : Array.isArray(res.data?.results) 
    ? res.data.results 
    : [];


        setMovies((prev) =>
          loadMore ? [...prev, ...newResults] : newResults
        );
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching movies:", err);
        toast.error("Could not load movies.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [genreId, sortBy, filterYear]
  );

  // ✅ Fetch movies on mount / filter change
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
    fetchMoviesByGenre(1, false);
  }, [genreId, sortBy, filterYear, fetchMoviesByGenre]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMoviesByGenre(nextPage, true);
  };

  const handleSortChange = (value) => value && setSortBy(value);
  const handleYearChange = (e) => setFilterYear(e.target.value);

  const handleWatchTrailerClick = async (movieId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/videos`);
      setVideoKey(res.data?.key || null);
      setShowVideoModal(true);
    } catch {
      setVideoKey(null);
      setShowVideoModal(true);
    }
  };

  const handleAddToWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add to your watchlist.");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/watchlist/${movieId}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      toast.success(res.data.msg);
    } catch {
      toast.error("Could not update watchlist.");
    }
  };

  if (loading && currentPage === 1) return <LoadingSpinner />;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="container-fluid" style={{ color: "white" }}>
      {/* ====== Header with Sorting and Filtering ====== */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="mb-0 me-3">{genreName}</h2>

        {genreId !== "popular" && genreId !== "new-releases" && (
          <div className="d-flex gap-3 ms-auto">
            <Dropdown onSelect={handleSortChange}>
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-sort"
                size="sm"
              >
                Sort By:{" "}
                {sortBy.includes("pop")
                  ? "Popularity"
                  : sortBy.includes("release")
                  ? "Release Date"
                  : "Rating"}
              </Dropdown.Toggle>
              <Dropdown.Menu variant="dark">
                <Dropdown.Item eventKey="popularity.desc">
                  Popularity
                </Dropdown.Item>
                <Dropdown.Item eventKey="release_date.desc">
                  Release Date
                </Dropdown.Item>
                <Dropdown.Item eventKey="vote_average.desc">
                  Rating
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Form.Select
              aria-label="Filter by year"
              value={filterYear}
              onChange={handleYearChange}
              style={{ width: "150px" }}
              className="bg-dark text-light border-secondary form-select-sm"
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
        )}
      </div>

      {/* ====== Movies Grid ====== */}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={`${movie.id}-${currentPage}`}
              movie={movie}
              onWatchTrailerClick={handleWatchTrailerClick}
              onWatchlistClick={handleAddToWatchlist}
            />
          ))
        ) : (
          !loading && <p className="text-muted col-12">No movies found.</p>
        )}
      </div>

      {/* ====== Load More Button ====== */}
      <div className="text-center mt-5 mb-4">
        {currentPage < totalPages && !loadingMore && (
          <Button variant="outline-light" onClick={handleLoadMore}>
            Load More
          </Button>
        )}
        {loadingMore && <Spinner animation="border" variant="light" />}
      </div>

      {/* ====== Video Modal ====== */}
      <VideoModal
        show={showVideoModal}
        handleClose={() => setShowVideoModal(false)}
        videoKey={videoKey}
      />
    </div>
  );
};

export default GenrePage;

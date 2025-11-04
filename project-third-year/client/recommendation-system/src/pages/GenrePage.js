import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios"; // --- 1. REMOVED
import api from "../services/api"; 
// import MovieCard from "./MovieCard";
// import VideoModal from "./VideoModal";
import { toast } from "react-toastify";
// import LoadingSpinner from "./LoadingSpinner";
import { Dropdown, Form, Spinner } from "react-bootstrap";
import MovieCard from "../components/movie/MovieCard";
import VideoModal from "../components/common/VideoModal";
import LoadingSpinner from "../components/common/LoadingSpinner";

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

  // const API_BASE_URL = "http://localhost:5000/api"; // --- 2. REMOVED

  const fetchMoviesByGenre = useCallback(
    async (page = 1, loadMore = false) => {
      if (!loadMore) {
        setLoading(true);
        if (page === 1) setMovies([]);
      } else setLoadingMore(true);

      try {
        let url;
        const params = { page };

        if (genreId === "popular") url = `/movies/popular`; // --- 3. FIXED
        else if (genreId === "new-releases")
          url = `/movies/now-playing`; // --- 3. FIXED
        else {
          url = `/movies/genre/${genreId}`; // --- 3. FIXED
          params.sort_by = sortBy;
          if (filterYear) params.year = filterYear;
        }

        // const res = await axios.get(url, { params }); // --- 3. OLD
        const res = await api.get(url, { params }); // --- 3. FIXED
        const newResults = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];

        setMovies((prev) => (loadMore ? [...prev, ...newResults] : newResults));
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
      // const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/videos`); // --- 4. OLD
      const res = await api.get(`/movies/${movieId}/videos`); // --- 4. FIXED
      const trailer = res.data?.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      const fallbackVideo = res.data?.results?.find(
        (vid) => vid.site === "YouTube"
      );
      setVideoKey(trailer?.key || fallbackVideo?.key || res.data?.key || null);
      setShowVideoModal(true);
    } catch (err) {
      console.error("Error fetching trailer:", err);
      toast.error("Could not load trailer.");
      setVideoKey(null);
      setShowVideoModal(true);
    }
  };

  const handleAddToWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add to your watchlist.");
      return;
    }
    try {
      // const res = await axios.post( // --- 5. OLD
      //   `${API_BASE_URL}/users/watchlist/${movie.id}`,
      //   {},
      //   { headers: { "x-auth-token": token } }
      // );
      const res = await api.post(`/users/watchlist/${movie.id}`, {}); // --- 5. FIXED
      toast.success(res.data.msg);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      toast.error(err.response?.data?.msg || "Could not update watchlist.");
    }
  };

  if (loading && currentPage === 1) return <LoadingSpinner />;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // --- Load More Button styles ---
  const buttonStyles = `
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
    .load-more-btn:before { content: ''; position: absolute; bottom: -10px; left: -5px; width: 100%; height: 10px; background: #2a2a2a; transform: skewX(-41deg); }
    .load-more-btn:after { content: ''; position: absolute; top: 5px; left: -9px; width: 9px; height: 100%; background: #2a2a2a; transform: skewY(-49deg); }
    .load-more-btn span { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #2a2a2a; color: #fff; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: 1.1s ease-out; }
    .load-more-btn:hover span { z-index: 1000; transition: .3s; color: #fff; background: #8a928fff; }
    .load-more-btn:hover span:nth-child(5) { transform: translate(40px, -40px); opacity: 1; }
    .load-more-btn:hover span:nth-child(4) { transform: translate(30px, -30px); opacity: .8; }
    .load-more-btn:hover span:nth-child(3) { transform: translate(20px, -20px); opacity: .6; }
    .load-more-btn:hover span:nth-child(2) { transform: translate(10px, -10px); opacity: .4; }
    .load-more-btn:hover span:nth-child(1) { transform: translate(0px, 0px); opacity: .2; }
  `;

  const headerStyles = `
    .genre-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0 3rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .genre-title {
    width: 90%;
      font-weight: 800;
      font-size: 1.8em;
      color: #fff;
      margin: 0;
      flex: 1;
      text-align: left;
      padding: 0 .5rem;
    }
    .genre-filters {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.75rem;
    }
    .genre-filters .dropdown-toggle, 
    .genre-filters .form-select {
      background-color: #343a40 !important;
      border-color: #6c757d !important;
      color: #fff !important;
      font-size: 0.9rem;
      padding: 0.3rem 0.75rem;
      height: auto;
      line-height: 1.5;
    }
    .genre-filters .form-select {
      width: 130px;
    }
    .genre-filters .dropdown-menu {
      font-size: 0.9rem;
    }
  `;

  return (
    <div className="container-fluid pt-3 pb-5" style={{ color: "white" }}>
      <style>{buttonStyles}</style>
      <style>{headerStyles}</style>

      {/* Header Section */}
      <div className="genre-header">
        <h2 className="genre-title">{genreName}</h2>

        {genreId !== "popular" && genreId !== "new-releases" && (
          <div className="genre-filters">
            <Dropdown onSelect={handleSortChange}>
              <Dropdown.Toggle variant="dark" id="dropdown-sort" size="sm">
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

      {/* Movies Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((movie) => (
            <div
              className="col d-flex justify-content-center"
              key={`${movie.id}-${currentPage}`}
            >
              <MovieCard
                movie={movie}
                onWatchTrailerClick={handleWatchTrailerClick}
                onWatchlistClick={handleAddToWatchlist}
              />
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-muted col-12 text-center">No movies found.</p>
          )
        )}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-5 mb-4">
        {currentPage < totalPages && !loadingMore && (
          <button className="load-more-btn" onClick={handleLoadMore}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span>Load More</span>
          </button>
        )}
        {loadingMore && <Spinner animation="border" variant="light" />}
      </div>

      {/* Video Modal */}
      <VideoModal
        show={showVideoModal}
        handleClose={() => setShowVideoModal(false)}
        videoKey={videoKey}
      />
    </div>
  );
};

export default GenrePage;

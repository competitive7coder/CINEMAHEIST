import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { Dropdown, Form, Spinner, Button } from "react-bootstrap";
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
  const [watchlistIds, setWatchlistIds] = useState([]);

  const fetchMoviesByGenre = useCallback(
    async (page = 1, loadMore = false) => {
      if (!loadMore) {
        setLoading(true);
        if (page === 1) setMovies([]);
      } else setLoadingMore(true);

      try {
        let url;
        const params = { page };

        if (genreId === "popular") url = `/movies/popular`;
        else if (genreId === "new-releases") url = `/movies/now-playing`;
        else {
          url = `/movies/genre/${genreId}`;
          params.sort_by = sortBy;
          if (filterYear) params.year = filterYear;
        }

        const res = await api.get(url, { params });
        const newResults = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
            ? res.data.results
            : [];

        setMovies((prev) => (loadMore ? [...prev, ...newResults] : newResults));
        setTotalPages(res.data?.total_pages || res.data?.totalPages || 1);
      } catch (err) {
        toast.error("Movies load nahi ho rha😑");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [genreId, sortBy, filterYear],
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api
      .get("/users/watchlist")
      .then((res) => setWatchlistIds(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

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

  const handleWatchTrailerClick = async (movie) => {
    const movieId = movie?.id ?? movie;
    try {
      const res = await api.get(`/movies/${movieId}/videos`);
      const trailer = res.data?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      const fallback = res.data?.results?.find((v) => v.site === "YouTube");
      setVideoKey(trailer?.key || fallback?.key || res.data?.key || null);
      setShowVideoModal(true);
    } catch (err) {
      setVideoKey(null);
      setShowVideoModal(true);
    }
  };

  const handleWatchlistClick = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Nahi hoga🫠, Login karne se hoga😎", {
        toastId: "watchlist-auth",
      });
      return;
    }
    const inList = watchlistIds.includes(movie.id);
    setWatchlistIds((prev) =>
      inList ? prev.filter((id) => id !== movie.id) : [...prev, movie.id],
    );
    try {
      if (inList) {
        await api.delete(`/users/watchlist/${movie.id}`);
        toast.info(`"${movie.title || "Movie"}" remove kardiya😤`);
      } else {
        await api.post(`/users/watchlist/${movie.id}`, {});
        toast.success(`"${movie.title || "Movie"}" add kardiya😎`);
      }
    } catch (err) {
      toast.error("Areh 👀,nahi hoga🥹");
      setWatchlistIds((prev) =>
        inList ? [...prev, movie.id] : prev.filter((id) => id !== movie.id),
      );
    }
  };

  if (loading && currentPage === 1) return <LoadingSpinner />;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div
      className="container-fluid py-4 px-1 px-md-3"
      style={{ color: "white", paddingTop: "100px" }}
    >
      <style>{`
        /* Force 7-column desktop grid */
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

        /* Professional Glass Header */
        .sh-genre-header {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        /* Stylish Dropdown Styling */
        .sh-custom-select {
          background-color: rgba(20, 20, 20, 0.8) !important;
          color: #efefef !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          padding: 8px 35px 8px 15px !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 16px 12px !important;
        }
        .sh-custom-select:hover { border-color: rgba(255, 255, 255, 0.5) !important; background-color: rgba(40, 40, 40, 0.9) !important; }

        /* Stylish Load More Button */
        .sh-load-more-btn {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 12px 45px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 0.75rem;
          transition: all 0.3s ease;
          color: #fff;
        }
        .sh-load-more-btn:hover {
          background: #fff !important;
          color: #000 !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      {/* Glassmorphism Header Bar */}
      <div
        className="sh-genre-header d-flex flex-wrap justify-content-between align-items-center mx-auto"
        style={{
          maxWidth: "1450px",
          marginTop: "40px",
          marginBottom: "35px",
          padding: "18px 25px",

          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          borderRadius: "15px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: "4px",
              height: "26px",
              background: "#e50914",
              borderRadius: "2px",
            }}
          />
          <h3
            className="fw-bold mb-0 text-truncate"
            style={{ letterSpacing: "0.5px" }}
          >
            {genreName}
          </h3>
        </div>

        {genreId !== "popular" && genreId !== "new-releases" && (
          <div className="d-flex align-items-center gap-3 mt-3 mt-sm-0">
            <Dropdown onSelect={handleSortChange}>
              <Dropdown.Toggle
                variant="dark"
                id="dropdown-sort"
                className="sh-custom-select"
                style={{ width: "auto" }}
              >
                Sort:{" "}
                {sortBy.includes("pop")
                  ? "Popular"
                  : sortBy.includes("release")
                    ? "Recent"
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
              value={filterYear}
              onChange={handleYearChange}
              className="sh-custom-select"
              style={{ width: "135px" }}
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center">
        <div
          className="row row-cols-3 sh-grid w-100 justify-content-center"
          style={{ maxWidth: "1450px" }}
        >
          {movies.length > 0
            ? movies.map((movie) => (
                <div
                  className="col d-flex justify-content-center mb-3"
                  key={`${movie.id}-${currentPage}`}
                >
                  <MovieCard
                    movie={movie}
                    watchlist={watchlistIds}
                    onWatchTrailerClick={handleWatchTrailerClick}
                    onWatchlistClick={handleWatchlistClick}
                  />
                </div>
              ))
            : !loading && (
                <div className="col-12 text-center py-5 text-muted">
                  No movies found in this genre.
                </div>
              )}
        </div>
      </div>

      {/* Load More Section */}
      <div className="text-center mt-5 mb-5">
        {currentPage < totalPages && !loadingMore && (
          <Button
            variant="outline-light"
            className="sh-load-more-btn"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        )}
        {loadingMore && (
          <Spinner animation="border" variant="danger" size="sm" />
        )}
      </div>

      <VideoModal
        show={showVideoModal}
        handleClose={() => setShowVideoModal(false)}
        videoKey={videoKey}
      />
    </div>
  );
};

export default GenrePage;

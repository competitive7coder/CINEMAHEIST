import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

import HeroSlider from "../components/home/HeroSlider";
import MovieRow from "../components/movie/MovieRow";
import VideoModal from "../components/common/VideoModal";
import Top10MovieCard from "../components/movie/Top10MovieCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const GENRE_ORDER = [
  { id: 28,    name: "Action Packed" },
  { id: 878,   name: "Science Fiction" },
  { id: 10749, name: "Romantic Movies" },
  { id: 53,    name: "Thriller Tales" },
  { id: 12,    name: "Adventure" },
  { id: 16,    name: "Animation" },
  { id: 35,    name: "Comedy Movies" },
  { id: 80,    name: "Crime" },
  { id: 18,    name: "Drama" },
  { id: 27,    name: "Horror Flicks" },
];

// Shimmer skeleton for a single MovieRow while it's loading
const RowSkeleton = ({ title }) => (
  <div style={{ marginBottom: "2.5rem" }}>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 14, gap: 12 }}>
      <div style={skeletonStyle(180, 20)} />
      {title && <span style={{ color: "#333", fontSize: "0.75rem" }}>{title}</span>}
    </div>
    <div style={{ display: "flex", gap: 12, overflow: "hidden" }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ ...skeletonStyle(160, 240), borderRadius: 12, flexShrink: 0, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  </div>
);

function skeletonStyle(w, h) {
  return {
    width: w, height: h, borderRadius: 6,
    background: "linear-gradient(90deg,#161616 25%,#242424 50%,#161616 75%)",
    backgroundSize: "400% 100%",
    animation: "shimmer 1.5s infinite",
  };
}

const HomePage = () => {
  // Phase 1 — critical above-the-fold content
  const [trendingMovies, setTrendingMovies]   = useState([]);
  const [top10Movies, setTop10Movies]         = useState([]);
  const [newReleases, setNewReleases]         = useState([]);
  const [watchlist, setWatchlist]             = useState([]);
  const [heroReady, setHeroReady]             = useState(false);

  // Phase 2 — genre rows stream in one by one
  const [moviesByGenre, setMoviesByGenre]     = useState({});
  const [streamDone, setStreamDone]           = useState(false);
  const [loadedCount, setLoadedCount]         = useState(0);

  const [showVideoModal, setShowVideoModal]   = useState(false);
  const [videoKey, setVideoKey]               = useState(null);
  const esRef                                 = useRef(null);

  // ── PHASE 1: load hero + top10 + new releases in parallel ──────────────
  useEffect(() => {
    let cancelled = false; // guard against React StrictMode double-invoke
    const token = localStorage.getItem("token");

    Promise.all([
      api.get("/movies/trending"),
      api.get("/movies/top-rated-in"),
      api.get("/movies/now-playing"),
      token ? api.get("/users/watchlist").catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
    ])
      .then(([trendRes, top10Res, newRelRes, wlRes]) => {
        if (cancelled) return; // StrictMode unmounted — discard result
        setTrendingMovies(trendRes.data?.results?.slice(0, 8) || []);
        setTop10Movies(top10Res.data.slice(0, 10));
        setNewReleases(newRelRes.data);
        setWatchlist(Array.isArray(wlRes.data) ? wlRes.data : []);
        setHeroReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Homepage phase 1 error:", err);
        toast.error("Failed to load movies.");
        setHeroReady(true);
      });

    return () => { cancelled = true; }; // cleanup cancels stale response
  }, []);

  // ── PHASE 2: stream genre rows via SSE once hero is visible ────────────
  useEffect(() => {
    if (!heroReady) return;

    // Close any previous connection (StrictMode double-invoke guard)
    if (esRef.current) { esRef.current.close(); esRef.current = null; }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";
    const es = new EventSource(
      `${SOCKET_URL}/api/v1/movies/homepage-sections/stream`
    );
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.done) { setStreamDone(true); es.close(); return; }
        setMoviesByGenre((prev) => ({ ...prev, [data.name]: data.movies }));
        setLoadedCount((prev) => prev + 1);
      } catch {}
    };

    es.onerror = () => { setStreamDone(true); es.close(); };

    return () => { es.close(); esRef.current = null; };
  }, [heroReady]);

  // ── ACTIVITY LOG ───────────────────────────────────────────────────────
  const logActivity = useCallback(async (movie, actionType) => {
    if (!movie) return;
    try {
      await api.post("/activity/log", {
        action_type:       actionType,
        movie_id:          movie.id,
        movie_title:       movie.title || movie.name,
        movie_poster_path: movie.poster_path,
      });
    } catch {}
  }, []);

  // ── TRAILER ────────────────────────────────────────────────────────────
  const handleWatchTrailerClick = useCallback(async (movieOrId) => {
    const movie    = typeof movieOrId === "object" ? movieOrId : null;
    const movieId  = movie ? movie.id : movieOrId;
    if (!movieId) return;
    if (movie) logActivity(movie, "trailer_watch");
    try {
      const res     = await api.get(`/movies/${movieId}/videos`);
      const trailer = res.data?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      ) || res.data;
      setVideoKey(trailer?.key || null);
    } catch {
      setVideoKey(null);
    }
    setShowVideoModal(true);
  }, [logActivity]);

  // ── WATCHLIST TOGGLE ───────────────────────────────────────────────────
  const handleWatchlistToggle = useCallback(async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Sign in to save movies to your watchlist!", {
        toastId: "watchlist-auth", // prevent duplicate toasts on rapid clicks
      });
      return;
    }

    const inList = watchlist.includes(movie.id);
    // Optimistic update — button flips instantly
    setWatchlist((prev) =>
      inList ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
    );
    try {
      if (inList) {
        await api.delete(`/users/watchlist/${movie.id}`);
        logActivity(movie, "removed_from_watchlist");
        toast.info("Removed from watchlist");
      } else {
        await api.post(`/users/watchlist/${movie.id}`);
        logActivity(movie, "added_to_watchlist");
        toast.success("Added to watchlist");
      }
    } catch (err) {
      // Revert optimistic update on failure
      setWatchlist((prev) =>
        inList ? [...prev, movie.id] : prev.filter((id) => id !== movie.id)
      );
      toast.error("Could not update watchlist.");
    }
  }, [watchlist, logActivity]);

  // ── RENDER ─────────────────────────────────────────────────────────────
  if (!heroReady) return <LoadingSpinner />;

  const totalGenres   = GENRE_ORDER.length;
  const progressPct   = streamDone ? 100 : Math.round((loadedCount / totalGenres) * 100);

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .stream-progress {
          position: fixed; top: 0; left: 0; right: 0; height: 3px;
          background: rgba(255,255,255,0.05); z-index: 9999;
          transition: opacity 0.6s 0.5s;
        }
        .stream-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #e50914, #ff6b35);
          transition: width 0.35s ease;
          border-radius: 0 2px 2px 0;
        }
      `}</style>

      {/* Thin progress bar — disappears when all rows loaded */}
      {!streamDone && (
        <div className="stream-progress">
          <div className="stream-progress-bar" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {/* ── HERO SLIDER — renders as soon as phase 1 is done ── */}
      {trendingMovies.length > 0 && (
        <HeroSlider
          movies={trendingMovies}
          watchlist={watchlist}
          onWatchTrailerClick={handleWatchTrailerClick}
          onAddToWatchlist={handleWatchlistToggle}
        />
      )}

      <div className="container-fluid pt-5">

        {/* ── TOP 10 ── */}
        {top10Movies.length > 0 && (
          <div className="movie-row-container">
            <h3 className="h4 mb-5 text-white">Top 10 Movies in India Today</h3>
            <Swiper modules={[Navigation]} spaceBetween={40} slidesPerView="auto" navigation>
              {top10Movies.map((movie, index) => (
                <SwiperSlide key={movie.id} style={{ width: "auto" }}>
                  <Top10MovieCard
                    movie={movie}
                    rank={index + 1}
                    watchlist={watchlist}
                    onWatchTrailerClick={handleWatchTrailerClick}
                    onWatchlistClick={handleWatchlistToggle}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* ── NEW RELEASES ── */}
        {newReleases.length > 0 && (
          <MovieRow
            title="New Releases"
            movies={newReleases}
            genreId="new-releases"
            watchlist={watchlist}
            onWatchTrailerClick={handleWatchTrailerClick}
            onWatchlistClick={handleWatchlistToggle}
          />
        )}

        {/* ── GENRE ROWS — appear one by one as SSE streams them in ── */}
        {GENRE_ORDER.map((genre) => {
          const movies = moviesByGenre[genre.name];
          if (!movies) return <RowSkeleton key={genre.name} />;
          if (movies.length === 0) return null;
          return (
            <MovieRow
              key={genre.name}
              title={genre.name}
              movies={movies}
              genreId={genre.id}
              watchlist={watchlist}
              onWatchTrailerClick={handleWatchTrailerClick}
              onWatchlistClick={handleWatchlistToggle}
            />
          );
        })}

      </div>

      <VideoModal
        show={showVideoModal}
        handleClose={() => setShowVideoModal(false)}
        videoKey={videoKey}
      />
    </div>
  );
};

export default HomePage;
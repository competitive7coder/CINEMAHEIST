import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from "react";
import api from "../services/api";

import HeroSlider from "../components/home/HeroSlider";
import MovieRow from "../components/movie/MovieRow";
import { toast } from "react-toastify";

// Lazy-load below-fold components — don't block hero paint
const VideoModal = lazy(() => import("../components/common/VideoModal"));
const Top10Section = lazy(() => import("../components/movie/Top10Section"));

// ── Constants ────────────────────────────────────────────────────────────────
const GENRE_ORDER = [
  { id: 28, name: "Action Packed" },
  { id: 878, name: "Science Fiction" },
  { id: 10749, name: "Romantic Movies" },
  { id: 53, name: "Thriller Tales" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy Movies" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror Flicks" },
];

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

// ── Skeletons ────────────────────────────────────────────────────────────────
const skeletonStyle = (w, h) => ({
  width: w,
  height: h,
  borderRadius: 6,
  background: "linear-gradient(90deg,#161616 25%,#242424 50%,#161616 75%)",
  backgroundSize: "400% 100%",
  animation: "shimmer 1.5s infinite",
});

const RowSkeleton = () => (
  <div style={{ marginBottom: "2.5rem" }}>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 14, gap: 12 }}>
      <div style={skeletonStyle(180, 20)} />
    </div>
    <div style={{ display: "flex", gap: 12, overflow: "hidden" }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          style={{
            ...skeletonStyle(160, 240),
            borderRadius: 12,
            flexShrink: 0,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// ── Component ────────────────────────────────────────────────────────────────
const HomePage = () => {
  // Phase 1a — hero
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heroReady, setHeroReady] = useState(false);

  // Phase 1b — below-hero content
  const [top10Movies, setTop10Movies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  // Phase 2 — genre rows via SSE
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [streamDone, setStreamDone] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Video modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoKey, setVideoKey] = useState(null);

  const esRef = useRef(null);

  // ── PHASE 1a ─────────────────────────────────────────────────────────────
  // Uses prefetch from index.html if available, else falls back to api.get.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const prefetch = window.__trendingPrefetch;
        const data = prefetch ? await prefetch : null;
        if (cancelled) return;

        if (data?.results?.length) {
          setTrendingMovies(data.results.slice(0, 8));
          setHeroReady(true);
        } else {
          const res = await api.get("/movies/trending");
          if (cancelled) return;
          setTrendingMovies(res.data?.results?.slice(0, 8) || []);
          setHeroReady(true);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Trending fetch error:", err);
        setHeroReady(true);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // ── PHASE 1b ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("token");

    Promise.all([
      api.get("/movies/top-rated-in"),
      api.get("/movies/now-playing"),
      token
        ? api.get("/users/watchlist").catch(() => ({ data: [] }))
        : Promise.resolve({ data: [] }),
    ])
      .then(([top10Res, newRelRes, wlRes]) => {
        if (cancelled) return;
        setTop10Movies(top10Res.data.slice(0, 10));
        setNewReleases(newRelRes.data);
        setWatchlist(Array.isArray(wlRes.data) ? wlRes.data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Homepage secondary fetch error:", err);
        toast.error("Failed to load some content.");
      });

    return () => { cancelled = true; };
  }, []);

  // ── PHASE 2: SSE ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!heroReady) return;

    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const es = new EventSource(
      `${SOCKET_URL}/api/v1/movies/homepage-sections/stream`,
    );
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.done) {
          setStreamDone(true);
          es.close();
          return;
        }
        setMoviesByGenre((prev) => ({ ...prev, [data.name]: data.movies }));
        setLoadedCount((prev) => prev + 1);
      } catch { /* ignore malformed frames */ }
    };

    es.onerror = () => {
      setStreamDone(true);
      es.close();
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [heroReady]);

  // ── ACTIVITY LOG ─────────────────────────────────────────────────────────
  const logActivity = useCallback(async (movie, actionType) => {
    if (!movie) return;
    try {
      await api.post("/activity/log", {
        action_type: actionType,
        movie_id: movie.id,
        movie_title: movie.title || movie.name,
        movie_poster_path: movie.poster_path,
      });
    } catch { /* non-critical */ }
  }, []);

  // ── TRAILER ──────────────────────────────────────────────────────────────
  const handleWatchTrailerClick = useCallback(
    async (movieOrId) => {
      const movie = typeof movieOrId === "object" ? movieOrId : null;
      const movieId = movie ? movie.id : movieOrId;
      if (!movieId) return;
      if (movie) logActivity(movie, "trailer_watch");

      // Close modal first + clear key — ensures no stale trailer
      // from a previous movie ever plays, even if modal was already open
      setShowVideoModal(false);
      setVideoKey(null);

      try {
        const res = await api.get(`/movies/${movieId}/videos`);
        const trailer =
          res.data?.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube",
          ) || res.data;
        setVideoKey(trailer?.key || null);
      } catch {
        setVideoKey(null);
      }

      // Open modal after fetch — correct key is now set
      setShowVideoModal(true);
    },
    [logActivity],
  );

  // ── WATCHLIST ─────────────────────────────────────────────────────────────
  const handleWatchlistToggle = useCallback(
    async (movie) => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.info("Sign in to save movies to your watchlist!", {
          toastId: "watchlist-auth",
        });
        return;
      }

      const inList = watchlist.includes(movie.id);
      setWatchlist((prev) =>
        inList ? prev.filter((id) => id !== movie.id) : [...prev, movie.id],
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
      } catch {
        setWatchlist((prev) =>
          inList ? [...prev, movie.id] : prev.filter((id) => id !== movie.id),
        );
        toast.error("Could not update watchlist.");
      }
    },
    [watchlist, logActivity],
  );

  // ── DERIVED ───────────────────────────────────────────────────────────────
  const progressPct = streamDone
    ? 100
    : Math.round((loadedCount / GENRE_ORDER.length) * 100);

  // ── RENDER ────────────────────────────────────────────────────────────────
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
        }
        .stream-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #e50914, #ff6b35);
          transition: width 0.35s ease;
          border-radius: 0 2px 2px 0;
        }

        /* ── CLS FIX ────────────────────────────────────────────────────────
           OLD: conditional render swaps HeroSkeleton ↔ HeroSlider.
           The skeleton is removed from DOM and HeroSlider inserted —
           this is a full layout shift = CLS 0.224.

           NEW: HeroSlider always occupies the space (height: 100vh).
           Before data arrives it shows a shimmer background via CSS.
           When data arrives it fades in — zero DOM size change = CLS 0.
        ── */
        .hero-wrapper {
          position: relative;
          height: 100vh;
          min-height: 520px;
          background: linear-gradient(90deg,#0e0e0e 25%,#1a1a1a 50%,#0e0e0e 75%);
          background-size: 400% 100%;
        }
        .hero-wrapper.loading {
          animation: shimmer 1.5s infinite;
        }
        .hero-wrapper .hero-inner {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .hero-wrapper.ready .hero-inner {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>

      {/* SSE progress bar */}
      {!streamDone && (
        <div className="stream-progress">
          <div className="stream-progress-bar" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      {/*
        ── CLS FIX: hero-wrapper always holds 100vh space ──────────────────
        Before heroReady: shows shimmer background (loading class)
        After heroReady:  fades in HeroSlider (ready class), removes shimmer
        The viewport height NEVER changes — browser sees no layout shift.
      */}
      <div className={`hero-wrapper ${heroReady ? "ready" : "loading"}`}>
        <div className="hero-inner">
          {trendingMovies.length > 0 && (
            <HeroSlider
              movies={trendingMovies}
              watchlist={watchlist}
              onWatchTrailerClick={handleWatchTrailerClick}
              onAddToWatchlist={handleWatchlistToggle}
            />
          )}
        </div>
      </div>

      <div className="container-fluid pt-5">
        {top10Movies.length > 0 && (
          <Suspense fallback={<RowSkeleton />}>
            <Top10Section
              movies={top10Movies}
              watchlist={watchlist}
              onWatchTrailerClick={handleWatchTrailerClick}
              onWatchlistClick={handleWatchlistToggle}
            />
          </Suspense>
        )}

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

      {showVideoModal && (
        <Suspense fallback={null}>
          <VideoModal
            show={showVideoModal}
            handleClose={() => setShowVideoModal(false)}
            videoKey={videoKey}
          />
        </Suspense>
      )}
    </div>
  );
};

export default HomePage;
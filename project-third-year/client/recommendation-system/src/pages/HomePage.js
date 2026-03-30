import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import HeroSlider from "../components/home/HeroSlider";

const VideoModal    = lazy(() => import("../components/common/VideoModal"));
const Top10Section  = lazy(() => import("../components/movie/Top10Section"));
const MovieRow      = lazy(() => import("../components/movie/MovieRow"));

// ── Constants ────────────────────────────────────────────────────────────────
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

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

// ── Skeleton components ──────────────────────────────────────────────────────
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
  const [trendingMovies, setTrendingMovies]   = useState([]);
  const [heroReady, setHeroReady]             = useState(false);

  // Phase 1b — below-hero content
  const [top10Movies, setTop10Movies]         = useState([]);
  const [newReleases, setNewReleases]         = useState([]);
  const [watchlist, setWatchlist]             = useState([]);

  // Phase 2 — genre rows via SSE
  const [moviesByGenre, setMoviesByGenre]     = useState({});
  const [streamDone, setStreamDone]           = useState(false);
  const [loadedCount, setLoadedCount]         = useState(0);

  // Video modal
  const [showVideoModal, setShowVideoModal]   = useState(false);
  const [videoKey, setVideoKey]               = useState(null);

  const esRef = useRef(null);

  // ── PHASE 1a — Hero data ──────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Fast path: prefetch already resolved before React mounted
        if (window.__trendingResolved?.results?.length) {
          const results = window.__trendingResolved.results.slice(0, 8);
          if (!cancelled) {
            setTrendingMovies(results);
            setHeroReady(true);
          }
          return;
        }

        // Medium path: prefetch in-flight, await it
        const prefetch = window.__trendingPrefetch;
        const data = prefetch ? await prefetch : null;
        if (cancelled) return;

        if (data?.results?.length) {
          setTrendingMovies(data.results.slice(0, 8));
          setHeroReady(true);
          return;
        }

        // Slow path: no prefetch available, fetch fresh
        const res = await api.get("/movies/trending");
        if (cancelled) return;
        setTrendingMovies(res.data?.results?.slice(0, 8) || []);
        setHeroReady(true);
      } catch (err) {
        if (cancelled) return;
        console.error("Trending fetch error:", err);
        setHeroReady(true);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // ── PHASE 1b — Secondary above-fold data ─────────────────────────────────
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

  // ── PHASE 2 — Genre rows via SSE ─────────────────────────────────────────
 
 useEffect(() => {
  if (!heroReady) return;

  let es = null;

  const openSSE = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    es = new EventSource(
      `${SOCKET_URL}/api/v1/movies/homepage-sections/stream`
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
  };
  
  let timerFired = false;

  const fallbackTimer = setTimeout(() => {
    timerFired = true;
    openSSE();
  }, 2000);

  // PerformanceObserver: open SSE as soon as LCP is painted
  let observer = null;
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0 && !timerFired) {
          timerFired = true;
          clearTimeout(fallbackTimer);
          // Small buffer so image decode + paint fully complete
          setTimeout(openSSE, 100);
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      
    }
  }

  return () => {
    clearTimeout(fallbackTimer);
    if (observer) observer.disconnect();
    if (es) {
      es.close();
      esRef.current = null;
    }
  };
}, [heroReady]);

  // ── Activity log ─────────────────────────────────────────────────────────
  const logActivity = useCallback(async (movie, actionType) => {
    if (!movie) return;
    try {
      await api.post("/activity/log", {
        action_type:       actionType,
        movie_id:          movie.id,
        movie_title:       movie.title || movie.name,
        movie_poster_path: movie.poster_path,
      });
    } catch { /* non-critical */ }
  }, []);

  // ── Trailer handler ───────────────────────────────────────────────────────
  const handleWatchTrailerClick = useCallback(
    async (movieOrId) => {
      const movie   = typeof movieOrId === "object" ? movieOrId : null;
      const movieId = movie ? movie.id : movieOrId;
      if (!movieId) return;
      if (movie) logActivity(movie, "trailer_watch");

      setShowVideoModal(false);
      setVideoKey(null);

      try {
        const res = await api.get(`/movies/${movieId}/videos`);
        const trailer =
          res.data?.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          ) || res.data;
        setVideoKey(trailer?.key || null);
      } catch {
        setVideoKey(null);
      }

      setShowVideoModal(true);
    },
    [logActivity]
  );

  // ── Watchlist handler ─────────────────────────────────────────────────────
  const handleWatchlistToggle = useCallback(
    async (movie) => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Sign in to save movies to your watchlist!", {
          toastId: "watchlist-auth",
        });
        return;
      }

      const inList = watchlist.includes(movie.id);
      // Optimistic update
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
      } catch {
        // Rollback on failure
        setWatchlist((prev) =>
          inList ? [...prev, movie.id] : prev.filter((id) => id !== movie.id)
        );
        toast.error("Could not update watchlist.");
      }
    },
    [watchlist, logActivity]
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  const progressPct = streamDone
    ? 100
    : Math.round((loadedCount / GENRE_ORDER.length) * 100);

  // ── Render ────────────────────────────────────────────────────────────────
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

        /*
          CLS FIX: hero-wrapper always holds 100vh.
          Before heroReady → shimmer placeholder.
          After heroReady  → fade in HeroSlider.
          The viewport height never changes = zero layout shift.
        */
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
          <div
            className="stream-progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Hero — always occupies 100vh to prevent CLS */}
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

      {/* Below-fold content — all lazy-loaded to protect TBT */}
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
          <Suspense fallback={<RowSkeleton />}>
            <MovieRow
              title="New Releases"
              movies={newReleases}
              genreId="new-releases"
              watchlist={watchlist}
              onWatchTrailerClick={handleWatchTrailerClick}
              onWatchlistClick={handleWatchlistToggle}
            />
          </Suspense>
        )}

        {GENRE_ORDER.map((genre) => {
          const movies = moviesByGenre[genre.name];
          if (!movies) return <RowSkeleton key={genre.name} />;
          if (movies.length === 0) return null;
          return (
            <Suspense key={genre.name} fallback={<RowSkeleton />}>
              <MovieRow
                title={genre.name}
                movies={movies}
                genreId={genre.id}
                watchlist={watchlist}
                onWatchTrailerClick={handleWatchTrailerClick}
                onWatchlistClick={handleWatchlistToggle}
              />
            </Suspense>
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
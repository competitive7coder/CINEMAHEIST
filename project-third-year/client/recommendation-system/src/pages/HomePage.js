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

const VideoModal = lazy(() => import("../components/common/VideoModal"));
const Top10Section = lazy(() => import("../components/movie/Top10Section"));
const MovieRow = lazy(() => import("../components/movie/MovieRow"));

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

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 14,
        gap: 12,
      }}
    >
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

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heroReady, setHeroReady] = useState(false);
  const [top10Movies, setTop10Movies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [streamDone, setStreamDone] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoKey, setVideoKey] = useState(null);

  const esRef = useRef(null);

  //Hero 
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        if (window.__trendingResolved?.results?.length) {
          if (!cancelled) {
            setTrendingMovies(window.__trendingResolved.results.slice(0, 8));
            setHeroReady(true);
          }
          return;
        }

        const prefetch = window.__trendingPrefetch;
        const data = prefetch ? await prefetch : null;
        if (cancelled) return;

        if (data?.results?.length) {
          setTrendingMovies(data.results.slice(0, 8));
          setHeroReady(true);
          return;
        }

        const res = await api.get("/movies/trending");
        if (cancelled) return;
        setTrendingMovies(toArray(res.data).slice(0, 8));
        setHeroReady(true);
      } catch (err) {
        if (cancelled) return;
        console.error("Trending fetch error:", err);
        setHeroReady(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  //  Secondary data 
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
        // Both endpoints return plain arrays 
        setTop10Movies(toArray(top10Res.data).slice(0, 10));
        setNewReleases(toArray(newRelRes.data));
        setWatchlist(toArray(wlRes.data));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Homepage secondary fetch error:", err);
        toast.error("Failed to load some content.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  //  SSE genre rows
  useEffect(() => {
    if (!heroReady) return;

    let es = null;
    let timerFired = false;

    const openSSE = () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }

      es = new EventSource(
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
          // SSE sends { name, movies } where movies is always a plain array
          const movies = Array.isArray(data.movies) ? data.movies : [];
          setMoviesByGenre((prev) => ({ ...prev, [data.name]: movies }));
          setLoadedCount((prev) => prev + 1);
        } catch {
          /* ignore malformed frames */
        }
      };

      es.onerror = () => {
        setStreamDone(true);
        es.close();
      };
    };

    const fallbackTimer = setTimeout(() => {
      timerFired = true;
      openSSE();
    }, 2000);

    let observer = null;
    if (typeof PerformanceObserver !== "undefined") {
      try {
        observer = new PerformanceObserver((list) => {
          if (list.getEntries().length > 0 && !timerFired) {
            timerFired = true;
            clearTimeout(fallbackTimer);
            setTimeout(openSSE, 100);
          }
        });
        observer.observe({ type: "largest-contentful-paint", buffered: true });
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

  // Activity log
  const logActivity = useCallback(async (movie, actionType) => {
    if (!movie) return;
    try {
      await api.post("/activity/log", {
        action_type: actionType,
        movie_id: movie.id,
        movie_title: movie.title || movie.name,
        movie_poster_path: movie.poster_path,
      });
    } catch {
      /* non-critical */
    }
  }, []);

  //  Trailer 
  const handleWatchTrailerClick = useCallback(
    async (movieOrId) => {
      const movie = typeof movieOrId === "object" ? movieOrId : null;
      const movieId = movie ? movie.id : movieOrId;
      if (!movieId) return;
      if (movie) logActivity(movie, "trailer_watch");

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

      setShowVideoModal(true);
    },
    [logActivity],
  );

  //  Watchlist 
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

  const progressPct = streamDone
    ? 100
    : Math.round((loadedCount / GENRE_ORDER.length) * 100);

  return (
    <div className="home-page">
      <style>{`
      @keyframes shimmer {
        0%   { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }

      /* HERO NORMAL  */
      .hero-wrapper {
        position: relative;
        height: 100svh;
        min-height: 520px;
      }

      .hero-wrapper .hero-inner {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      .hero-wrapper.ready .hero-inner {
        opacity: 1;
      }

      /* HERO BACKGROUND */
      .fixed-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100svh;
  z-index: 0;

  background-image: url("https://i.pinimg.com/736x/08/c7/84/08c7841dfeec2437071c0a3b21aad528.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: scroll;

  pointer-events: none;
  will-change: transform;
}

.fixed-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
}

.fixed-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  pointer-events: none;
}

      /*  CONTENT SCROLLS ABOVE BG */
      .content-wrapper {
        position: relative;
        z-index: 2;
        background: transparent;
      }

      /* smooth transition after hero */
      .content-wrapper::before {
        content: "";
        position: absolute;
        top: -120px;
        left: 0;
        width: 100%;
        height: 120px;
       background: linear-gradient(
  to top,
  rgba(0,0,0,0.6),
  transparent
);
        z-index: 2;
      }

      .stream-progress {
        position: fixed; top: 0; left: 0; right: 0; height: 3px;
        background: rgba(255,255,255,0.05); z-index: 9999;
      }

      .stream-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #e50914, #ff6b35);
        transition: width 0.35s ease;
      }
    `}</style>

      <div className="fixed-bg" />

      {/* progress */}
      {!streamDone && (
        <div className="stream-progress">
          <div
            className="stream-progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* HERO */}
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

      {/*  CONTENT OVERLAY */}
      <div className="content-wrapper container-fluid pt-5">
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

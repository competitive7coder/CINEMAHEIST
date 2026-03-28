import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";
import VideoModal from "../components/common/VideoModal";
import WatchMovieModal from "../components/movie/WatchMovieModal";
import MovieCard from "../components/movie/MovieCard";
import useSEO from "../hooks/useSEO";
import { 
  BsFillPlayFill, 
  BsFilm, 
  BsCheck2, 
  BsBookmark 
} from 'react-icons/bs'
const MovieDetailPage = () => {
  const { movieId } = useParams();

  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoKey, setVideoKey] = useState(null);
  const [showWatchModal, setShowWatchModal] = useState(false);
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(20);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState([]);

  // ── Dynamic SEO per movie ──
  useSEO({
    title: movie
      ? `${movie.title} (${movie.release_date?.split("-")[0] || ""})`
      : "Watch Movie",
    description: movie
      ? `Watch ${movie.title} online free on StreamHub. ${movie.overview?.slice(0, 120)}...`
      : "Watch movies online free on StreamHub.",
    image: movie?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : movie?.poster_path
        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
        : null,
    url: movie ? `/movie/${movie.id}` : null,
    type: "video.movie",
    structuredData: movie
      ? {
          "@context": "https://schema.org",
          "@type": "Movie",
          name: movie.title,
          description: movie.overview,
          datePublished: movie.release_date,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
            : null,
          aggregateRating: movie.vote_average
            ? {
                "@type": "AggregateRating",
                ratingValue: movie.vote_average.toFixed(1),
                ratingCount: movie.vote_count,
                bestRating: "10",
                worstRating: "1",
              }
            : undefined,
          genre: movie.genres?.map((g) => g.name),
          url: `https://streamhub-research.vercel.app/movie/${movie.id}`,
        }
      : null,
  });

  const logActivity = async (movieData, actionType) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api.post("/activity/log", {
        movie_id: movieData.id,
        action_type: actionType,
        movie_title: movieData.title || "Unknown",
        movie_poster_path: movieData.poster_path || "",
      });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [detailsRes, recRes] = await Promise.all([
          api.get(`/movies/details/${movieId}`),
          api.get(`/movies/recommendations/${movieId}`),
        ]);
        const movieData = detailsRes.data;
        setMovie(movieData);
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const check = await api.get(`/users/watchlist/check/${movieId}`);
            setIsInWatchlist(check.data.isInWatchlist);
            const wlRes = await api.get("/users/watchlist");
            setWatchlistIds(Array.isArray(wlRes.data) ? wlRes.data : []);
          } catch (err) {
            console.error("Watchlist check failed:", err);
          }
          try {
            await api.post("/activity/log", {
              movie_id: movieData.id,
              action_type: "search_click",
              movie_title: movieData.title || "Unknown",
              movie_poster_path: movieData.poster_path || "",
            });
          } catch (_) {}
        }
        setRelatedMovies(
          recRes.data.filter(
            (m, i, self) => i === self.findIndex((x) => x.id === m.id),
          ),
        );
      } catch (err) {
        toast.error("Failed to load movie details.");
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]);

  useEffect(() => {
    if (movie && window.location.hash === "#watch") {
      const el = document.getElementById("watch-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [movie]);

  const handleWatchMainTrailerClick = async () => {
    try {
      if (movie) logActivity(movie, "trailer_watch");
      const res = await api.get(`/movies/${movieId}/videos`);
      if (res.data?.key) {
        setVideoKey(res.data.key);
        setShowVideoModal(true);
      } else toast.info("No trailer available.");
    } catch {
      toast.error("Could not load trailer.");
    }
  };

  const handleWatchRelatedTrailerClick = async (relatedMovie) => {
    const id = relatedMovie?.id ?? relatedMovie;
    if (!id) return;
    try {
      const res = await api.get(`/movies/${id}/videos`);
      if (res.data?.key) {
        setVideoKey(res.data.key);
        setShowVideoModal(true);
      } else toast.info("No trailer available.");
    } catch {
      toast.error("Could not load trailer.");
    }
  };

  const handleWatchlistToggle = async (movieToToggle) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }
    try {
      const check = await api.get(`/users/watchlist/check/${movieToToggle.id}`);
      if (check.data.isInWatchlist) {
        await api.delete(`/users/watchlist/${movieToToggle.id}`);
        logActivity(movieToToggle, "removed_from_watchlist");
        toast.success("Removed from watchlist");
        setIsInWatchlist(false);
        setWatchlistIds((prev) => prev.filter((id) => id !== movieToToggle.id));
      } else {
        await api.post(`/users/watchlist/${movieToToggle.id}`);
        logActivity(movieToToggle, "added_to_watchlist");
        toast.success("Added to watchlist");
        setIsInWatchlist(true);
        setWatchlistIds((prev) => [...prev, movieToToggle.id]);
      }
    } catch {
      toast.error("Could not update watchlist.");
    }
  };

  const handleLoadMore = () => {
    const increment = 6;
    setVisibleRelatedCount((prev) => prev + increment);
  };

  const formatRuntime = (m) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : null);

  const css = `

    .mdp { background: #0c0c0f; color: #fff; font-family: 'Inter', sans-serif; min-height: 100vh; }

    /* ── Full backdrop ── */
    .mdp-backdrop {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 640px;
      background-size: cover;
      background-position: center center;
    }
    .mdp-backdrop-overlay {
      position: absolute; inset: 0;
      background:
        linear-gradient(to right, #0c0c0f 25%, rgba(12,12,15,0.55) 65%, rgba(12,12,15,0.15) 100%),
        linear-gradient(to top, #0c0c0f 0%, rgba(12,12,15,0.5) 30%, transparent 60%);
    }

    /* ── Hero sits inside the backdrop ── */
    .mdp-hero-wrap {
      position: absolute; inset: 0;
      display: flex; align-items: flex-end;
      padding-bottom: 3.5rem;
    }
    .mdp-hero {
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
      padding: 0 3rem;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2.5rem;
      align-items: flex-end;
    }
    .mdp-poster {
      width: 200px;
      border-radius: 12px;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.8);
      display: block;
      flex-shrink: 0;
    }

    /* ── Info ── */
    .mdp-title {
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.08;
      margin: 0 0 0.4rem;
    }
    .mdp-tagline {
      font-size: 0.88rem;
      color: #666;
      font-style: italic;
      margin-bottom: 0.75rem;
    }
    .mdp-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 0.75rem;
      font-size: 0.82rem;
      color: #777;
    }
    .mdp-meta-sep { color: #2a2a2a; }
    .mdp-rating {
      display: inline-flex; align-items: center; gap: 4px;
      background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2);
      border-radius: 5px; padding: 2px 8px;
      font-size: 0.78rem; font-weight: 700; color: #f59e0b;
    }
    .mdp-genres {
      display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 0.85rem;
    }
    .mdp-genre {
      font-size: 0.68rem; font-weight: 600; padding: 3px 10px;
      border-radius: 20px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1); color: #999;
    }
    .mdp-crew {
      display: flex; gap: 16px; margin-bottom: 0.85rem; flex-wrap: wrap;
    }
    .mdp-crew-item { font-size: 0.78rem; color: #666; }
    .mdp-crew-item b { color: #bbb; font-weight: 500; margin-left: 4px; }
    .mdp-overview {
      font-size: 0.88rem; line-height: 1.75; color: #888;
      max-width: 600px; margin-bottom: 1.5rem;
      display: -webkit-box; -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; overflow: hidden;
    }

    /* ── Buttons ── */
    .mdp-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .mdp-actions-top-row { display: contents; }

    .mdp-btn-watch {
      display: inline-flex; align-items: center; gap: 9px;
      height: 46px; padding: 0 26px;
      background: #fff; color: #000;
      border: none; border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
      letter-spacing: 0.1px;
    }
    .mdp-btn-watch:hover { background: #e0e0e0; transform: translateY(-1px); }

    .mdp-btn-trailer {
      display: inline-flex; align-items: center; gap: 9px;
      height: 46px; padding: 0 22px;
      background: rgba(109,109,110,0.7); color: #fff;
      border: none; border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .mdp-btn-trailer:hover { background: rgba(109,109,110,0.9); transform: translateY(-1px); }

    .mdp-btn-wl {
      display: inline-flex; align-items: center; gap: 9px;
      height: 46px; padding: 0 22px;
      background: transparent; color: #fff;
      border: 2px solid rgba(255,255,255,0.5); border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .mdp-btn-wl:hover { border-color: #fff; background: rgba(255,255,255,0.08); }
    .mdp-btn-wl.on {
      color: #4ade80; border-color: rgba(74,222,128,0.6);
      background: rgba(74,222,128,0.08);
    }

    /* ── Body below hero ── */
    .mdp-body {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2.5rem 5rem 0;
    }

    /* ── Cast section ── */
    .mdp-sec-title {
      font-size: 1.5rem; font-weight: 700; letter-spacing: 3px;
      text-transform: uppercase; color: #e50914;
      display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem;
    }
    .mdp-sec-title::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.05); }

    .mdp-cast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 10px;
    }
    .mdp-cast-item {
      border-radius: 15px; overflow: hidden;
      background: #111116;
      transition: transform 0.18s; cursor: default;
      position: relative;
    }
    .mdp-cast-item:hover { transform: translateY(-4px); }
    .mdp-cast-item:hover .mdp-cast-photo { filter: brightness(1.1); }
    .mdp-cast-photo {
      width: 100%; aspect-ratio: 2/3; object-fit: cover;
      display: block; background: #1c1c25;
      transition: filter 0.2s;
    }
    .mdp-cast-info {
      padding: 8px 10px 10px;
      background: linear-gradient(to bottom, #111116, #0d0d12);
    }
    .mdp-cast-name {
      font-size: 0.75rem; font-weight: 600; color: #e8e8e8;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
    }
    .mdp-cast-char {
      font-size: 0.63rem; color: #555; font-style: italic;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    /* ── Related ── */
    .mdp-related {
      max-width: 1240px; margin: 0 auto;
      padding: 2rem 5rem 5rem;
      border-top: 1px solid rgb(0, 0, 0);
    }
    .mdp-related-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
    }
    .mdp-load-more-wrap { display: flex; justify-content: center; margin-top: 2rem; }
    .mdp-load-more {
      padding: 10px 32px; background: transparent;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
      color: #666; font-family: 'Inter', sans-serif;
      font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .mdp-load-more:hover { border-color: rgba(255,255,255,0.2); color: #bbb; }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .mdp-related-grid { grid-template-columns: repeat(4, 1fr); }
      .mdp-hero { padding: 0 2rem; }
      .mdp-body { padding: 2rem 2rem 0; }
      .mdp-related { padding: 2rem 2rem 4rem; }
    }

    /* ── Mobile ── */
    @media (max-width: 768px) {
      .mdp-backdrop {
        height: 100svh;
        min-height: 600px;
        background-position: center top;
      }
      .mdp-backdrop-overlay {
        background: linear-gradient(
          to top,
          #0c0c0f 0%,
          rgba(12,12,15,0.97) 28%,
          rgba(12,12,15,0.55) 58%,
          rgba(12,12,15,0.0) 85%
        );
      }
      /* Push content down enough to clear the navbar (~60px) */
      .mdp-hero-wrap { padding-bottom: 2rem; padding-top: 60px; align-items: flex-end; }
      .mdp-hero { grid-template-columns: 1fr; gap: 0; padding: 0 1.2rem; align-items: flex-end; }
      .mdp-poster { display: none; }

      .mdp-title { font-size: 1.55rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 0.25rem; }
      .mdp-tagline { font-size: 0.72rem; color: #555; font-style: italic; margin-bottom: 0.55rem; }
      .mdp-meta { font-size: 0.76rem; gap: 5px; margin-bottom: 0.55rem; }
      .mdp-genres { gap: 5px; margin-bottom: 0.6rem; }
      .mdp-genre { font-size: 0.65rem; padding: 3px 9px; }
      .mdp-crew { flex-direction: column; gap: 2px; margin-bottom: 0.6rem; }
      .mdp-crew-item { font-size: 0.72rem; color: #555; line-height: 1.45; }
      .mdp-crew-item b { color: #bbb; font-weight: 500; margin-left: 5px; }
      .mdp-overview { font-size: 0.8rem; line-height: 1.65; -webkit-line-clamp: 3; margin-bottom: 1.25rem; color: #888; }

      /* ── Buttons ── */
      .mdp-actions { display: flex; flex-direction: column; gap: 9px; }
      .mdp-actions-top-row { display: flex; gap: 9px; width: 100%; }
      .mdp-btn-watch {
        flex: 1; height: 50px; padding: 0; font-size: 0.9rem; font-weight: 700;
        border-radius: 8px; justify-content: center;
        background: #fff; color: #000;
      }
      .mdp-btn-watch:hover { background: #e0e0e0; }
      .mdp-btn-trailer {
        flex: 1; height: 50px; padding: 0; font-size: 0.9rem;
        border-radius: 8px; justify-content: center;
        background: rgba(109,109,110,0.7); border: none;
      }
      .mdp-btn-wl {
        width: 100%; height: 46px; padding: 0; font-size: 0.86rem;
        border-radius: 8px; justify-content: center;
        border: 2px solid rgba(255,255,255,0.4); color: #fff; background: transparent;
      }

      /* Body */
      .mdp-body { padding: 1.5rem 1.2rem 0; }
      .mdp-sec-title { font-size: 1.2rem; letter-spacing: 2.5px; margin-bottom: 0.9rem;  }
      .mdp-cast-grid { grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .mdp-cast-info { padding: 5px 6px 7px; }
      .mdp-cast-name { font-size: 0.67rem; }
      .mdp-cast-char { font-size: 0.58rem; }
      .mdp-related { padding: 1.5rem 1.2rem 3rem; }
      .mdp-related-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .mdp-load-more { padding: 10px 28px; font-size: 0.8rem; border-radius: 10px; }
    }
    @media (max-width: 400px) {
      .mdp-cast-grid { grid-template-columns: repeat(5, 1fr); }
      .mdp-related-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `;

  if (loading) return <LoadingSpinner />;
  if (!movie)
    return (
      <div className="container text-light pt-5 mt-5 text-center">
        <h2>Movie Not Found</h2>
        <p>The requested movie details could not be loaded.</p>
      </div>
    );

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/200x300?text=No+Poster";
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : null;
  const director = movie.credits?.crew?.find((p) => p.job === "Director");
  const writers = movie.credits?.crew
    ?.filter((p) => ["Writer", "Screenplay", "Story"].includes(p.job))
    .slice(0, 2);
  const mainCast = movie.credits?.cast?.slice(0, 10) || [];

  return (
    <div className="mdp">
      <style>{css}</style>

      {/* ── Backdrop ── */}
      <div
        className="mdp-backdrop"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
          backgroundColor: "#0c0c0f",
        }}
        data-poster={posterUrl}
      >
        {/* Mobile uses poster via inline style override below */}
        <style>{`@media (max-width: 768px) { .mdp-backdrop { background-image: url('${posterUrl}') !important; background-position: center top !important; } }`}</style>
        <div className="mdp-backdrop-overlay" />

        <div className="mdp-hero-wrap">
          <div className="mdp-hero">
            <img src={posterUrl} alt={movie.title} className="mdp-poster" />

            <div>
              <h1 className="mdp-title">{movie.title}</h1>
              {movie.tagline && (
                <p className="mdp-tagline">"{movie.tagline}"</p>
              )}

              <div className="mdp-meta">
                {year && <span>{year}</span>}
                {movie.runtime > 0 && (
                  <>
                    <span className="mdp-meta-sep">·</span>
                    <span>{formatRuntime(movie.runtime)}</span>
                  </>
                )}
                {rating && (
                  <>
                    <span className="mdp-meta-sep">·</span>
                    <span className="mdp-rating">
                      <i
                        className="bi bi-star-fill"
                        style={{ fontSize: "0.6rem" }}
                      ></i>{" "}
                      {rating}
                    </span>
                  </>
                )}
              </div>

              <div className="mdp-genres">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="mdp-genre">
                    {g.name}
                  </span>
                ))}
              </div>

              {(director || writers?.length > 0) && (
                <div className="mdp-crew">
                  {director && (
                    <span className="mdp-crew-item">
                      DIR<b>{director.name}</b>
                    </span>
                  )}
                  {writers?.length > 0 && (
                    <span className="mdp-crew-item">
                      WRT<b>{writers.map((w) => w.name).join(", ")}</b>
                    </span>
                  )}
                </div>
              )}

              <p className="mdp-overview">
                {movie.overview || "No overview available."}
              </p>

              <div className="mdp-actions">
                <div className="mdp-actions-top-row">
                  <button
                    className="mdp-btn-watch"
                    onClick={() => setShowWatchModal(true)}
                  >
                    <BsFillPlayFill /> Watch Now
                  </button>
                  <button
                    className="mdp-btn-trailer"
                    onClick={handleWatchMainTrailerClick}
                  >
                    <BsFilm /> Trailer
                  </button>
                </div>
                <button
                  className={`mdp-btn-wl${isInWatchlist ? " on" : ""}`}
                  onClick={() => handleWatchlistToggle(movie)}
                >
                  {isInWatchlist ? (
                    <>
                      <BsCheck2 /> Saved
                    </>
                  ) : (
                    <>
                      <BsBookmark /> Watchlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mdp-body">
        {mainCast.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <p className="mdp-sec-title">Cast</p>
            <div className="mdp-cast-grid">
              {mainCast.map((actor) => (
                <div key={actor.cast_id || actor.id} className="mdp-cast-item">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "https://placehold.co/110x165/13131a/333?text=?"
                    }
                    alt={actor.name}
                    className="mdp-cast-photo"
                  />
                  <div className="mdp-cast-info">
                    <p className="mdp-cast-name">{actor.name}</p>
                    <p className="mdp-cast-char">
                      {actor.character || actor.job}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Related ── */}
      {relatedMovies.length > 0 && (
        <div className="mdp-related">
          <p className="mdp-sec-title">More Like This</p>
          <div className="mdp-related-grid">
            {relatedMovies.slice(0, visibleRelatedCount).map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                watchlist={watchlistIds}
                onWatchlistClick={handleWatchlistToggle}
                onWatchTrailerClick={handleWatchRelatedTrailerClick}
              />
            ))}
          </div>
          {visibleRelatedCount < relatedMovies.length && (
            <div className="mdp-load-more-wrap">
              <button className="mdp-load-more" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      <VideoModal
        show={showVideoModal}
        handleClose={() => {
          setShowVideoModal(false);
          setVideoKey(null);
        }}
        videoKey={videoKey}
      />
      <WatchMovieModal
        show={showWatchModal}
        handleClose={() => setShowWatchModal(false)}
        tmdbId={movie?.id}
        movieTitle={movie?.title}
      />
    </div>
  );
};

export default MovieDetailPage;

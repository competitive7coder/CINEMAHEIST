import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";
import VideoModal from "../components/common/VideoModal";
import WatchMovieModal from "../components/movie/WatchMovieModal";
import MovieCard from "../components/movie/MovieCard";
import useSEO from "../hooks/useSEO";
import { BsFillPlayFill, BsFilm, BsCheck2, BsBookmark } from 'react-icons/bs';

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

  useSEO({
    title: movie ? `${movie.title} (${movie.release_date?.split("-")[0] || ""})` : "Watch Movie",
    description: movie ? `Watch ${movie.title} online free on StreamHub. ${movie.overview?.slice(0, 120)}...` : "Watch movies online free on StreamHub.",
    image: movie?.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : movie?.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : null,
    url: movie ? `/movie/${movie.id}` : null,
    type: "video.movie",
    structuredData: movie ? {
      "@context": "https://schema.org", "@type": "Movie",
      name: movie.title, description: movie.overview, datePublished: movie.release_date,
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : null,
      aggregateRating: movie.vote_average ? { "@type": "AggregateRating", ratingValue: movie.vote_average.toFixed(1), ratingCount: movie.vote_count, bestRating: "10", worstRating: "1" } : undefined,
      genre: movie.genres?.map((g) => g.name),
      url: `https://streamhub-research.vercel.app/movie/${movie.id}`,
    } : null,
  });

  const logActivity = async (movieData, actionType) => {
    if (!localStorage.getItem("token")) return;
    try {
      await api.post("/activity/log", { movie_id: movieData.id, action_type: actionType, movie_title: movieData.title || "Unknown", movie_poster_path: movieData.poster_path || "" });
    } catch (err) { console.error("Failed to log activity:", err); }
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
          } catch (err) { console.error("Watchlist check failed:", err); }
          try {
            await api.post("/activity/log", { movie_id: movieData.id, action_type: "search_click", movie_title: movieData.title || "Unknown", movie_poster_path: movieData.poster_path || "" });
          } catch (_) {}
        }
        setRelatedMovies(recRes.data.filter((m, i, self) => i === self.findIndex((x) => x.id === m.id)));
      } catch (err) {
        toast.error("Failed to load movie details.");
        setMovie(null);
      } finally { setLoading(false); }
    };
    fetchMovieData();
  }, [movieId]);

  useEffect(() => {
    if (movie && window.location.hash === "#watch") {
      document.getElementById("watch-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [movie]);

  const handleWatchMainTrailerClick = async () => {
    try {
      if (movie) logActivity(movie, "trailer_watch");
      const res = await api.get(`/movies/${movieId}/videos`);
      if (res.data?.key) { setVideoKey(res.data.key); setShowVideoModal(true); }
      else toast.info("No trailer available.");
    } catch { toast.error("Could not load trailer."); }
  };

  const handleWatchRelatedTrailerClick = async (relatedMovie) => {
    const id = relatedMovie?.id ?? relatedMovie;
    if (!id) return;
    try {
      const res = await api.get(`/movies/${id}/videos`);
      if (res.data?.key) { setVideoKey(res.data.key); setShowVideoModal(true); }
      else toast.info("No trailer available.");
    } catch { toast.error("Could not load trailer."); }
  };

  const handleWatchlistToggle = async (movieToToggle) => {
    if (!localStorage.getItem("token")) { toast.error("Please log in first."); return; }
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
    } catch { toast.error("Could not update watchlist."); }
  };

  const handleLoadMore = () => setVisibleRelatedCount((prev) => prev + 6);
  const formatRuntime = (m) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : null);

  const css = `
    .mdp { background: #0c0c0f; color: #fff; font-family: 'DM Sans', 'Inter', sans-serif; min-height: 100vh; }

    /* ══ HERO ══ */
    .mdp-backdrop {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 640px;
      background-size: cover;
      background-position: center center;
      overflow: hidden;
    }

    /* Ken Burns */
    .mdp-backdrop::before {
      content: '';
      position: absolute;
      inset: -6%;
      background: inherit;
      background-size: cover;
      background-position: center center;
      animation: mdpKenBurns 18s ease-in-out infinite alternate;
      z-index: 0;
    }
    @keyframes mdpKenBurns {
      from { transform: scale(1) translateY(0); }
      to   { transform: scale(1.08) translateY(-2%); }
    }

    .mdp-backdrop-overlay {
      position: absolute; inset: 0; z-index: 1;
      background:
        linear-gradient(to right, rgba(12,12,15,0.97) 0%, rgba(12,12,15,0.7) 40%, rgba(12,12,15,0.15) 75%, transparent 100%),
        linear-gradient(to top,   rgba(12,12,15,1)    0%, rgba(12,12,15,0.6) 25%, transparent 55%),
        linear-gradient(to bottom,rgba(12,12,15,0.65) 0%, transparent 18%);
    }

    /* Grain */
    .mdp-backdrop-grain {
      position: absolute; inset: 0; z-index: 2; opacity: 0.03; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    .mdp-hero-wrap {
      position: absolute; inset: 0; z-index: 3;
      display: flex; align-items: flex-end;
      padding-bottom: 3.5rem;
    }

    .mdp-hero {
      max-width: 1240px; width: 100%; margin: 0 auto;
      padding: 0 3rem;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2.5rem;
      align-items: flex-end;
      animation: mdpFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both;
    }
    @keyframes mdpFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Poster */
    .mdp-poster-wrap { width: 200px; flex-shrink: 0; }
    .mdp-poster {
      width: 100%;
      border-radius: 14px;
      display: block;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 28px 70px rgba(0,0,0,0.9);
    }
    .mdp-poster-rating {
      display: flex; align-items: center; justify-content: center; gap: 5px;
      margin-top: 10px;
      background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2);
      border-radius: 8px; padding: 7px 0;
      font-size: 0.82rem; font-weight: 700; color: #f59e0b; letter-spacing: 0.5px;
    }

    /* Badge row */
    .mdp-badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 0.9rem; flex-wrap: wrap; }
    .mdp-badge {
      font-size: 0.6rem; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; padding: 4px 11px; border-radius: 4px;
    }
    .mdp-badge-brand   { background: #e50914; color: #fff; }
    .mdp-badge-meta    { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); }

    /* Title */
    .mdp-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2.8rem, 5.5vw, 5rem);
      font-weight: 400;
      letter-spacing: 3px;
      line-height: 0.95;
      color: #fff;
      text-shadow: 0 4px 40px rgba(0,0,0,0.5);
      margin: 0 0 0.5rem;
    }
    .mdp-tagline {
      font-size: 0.88rem; color: rgba(255,255,255,0.35);
      font-style: italic; margin-bottom: 0.9rem; letter-spacing: 0.3px;
    }
    .mdp-title-divider {
      width: 46px; height: 2px;
      background: linear-gradient(to right, #e50914, transparent);
      border-radius: 2px; margin-bottom: 1rem;
    }

    .mdp-genres { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 0.9rem; }
    .mdp-genre {
      font-size: 0.65rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
      padding: 4px 13px; border-radius: 20px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.6); transition: all 0.2s;
    }
    .mdp-genre:hover { background: rgba(229,9,20,0.1); border-color: rgba(229,9,20,0.3); color: #ff6b6b; }

    .mdp-crew { display: flex; gap: 16px; margin-bottom: 0.85rem; flex-wrap: wrap; }
    .mdp-crew-item { font-size: 0.78rem; color: rgba(255,255,255,0.35); }
    .mdp-crew-item b { color: rgba(255,255,255,0.75); font-weight: 500; margin-left: 4px; }

    .mdp-overview {
      font-size: 0.88rem; line-height: 1.75; color: rgba(255,255,255,0.5);
      max-width: 600px; margin-bottom: 1.5rem;
      display: -webkit-box; -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; overflow: hidden;
    }

    /* ── Buttons ── */
    .mdp-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .mdp-actions-top-row { display: contents; }

    .mdp-btn-watch {
      display: inline-flex; align-items: center; gap: 9px;
      height: 50px; padding: 0 28px;
      background: #fff; color: #000;
      border: none; border-radius: 50px;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
      letter-spacing: 0.2px; white-space: nowrap;
    }
    .mdp-btn-watch:hover { background: #ebebeb; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
    .mdp-btn-watch-icon {
      width: 26px; height: 26px; border-radius: 50%;
      background: rgba(0,0,0,0.1);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; padding-left: 2px;
    }

    .mdp-btn-trailer {
      display: inline-flex; align-items: center; gap: 8px;
      height: 50px; padding: 0 24px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14);
      color: #fff; border-radius: 50px;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      backdrop-filter: blur(12px); white-space: nowrap;
    }
    .mdp-btn-trailer:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }

    .mdp-btn-wl {
      display: inline-flex; align-items: center; gap: 9px;
      height: 50px; padding: 0 24px;
      background: transparent; color: rgba(255,255,255,0.75);
      border: 1px solid rgba(255,255,255,0.2); border-radius: 50px;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .mdp-btn-wl:hover { border-color: rgba(255,255,255,0.4); color: #fff; }
    .mdp-btn-wl.on { color: #4ade80; border-color: rgba(74,222,128,0.5); background: rgba(74,222,128,0.07); }

    /* Scroll hint */
    .mdp-scroll-hint {
      position: absolute; bottom: 1.8rem; left: 50%; transform: translateX(-50%);
      z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 5px;
      opacity: 0.25; animation: mdpBob 2.2s ease-in-out infinite;
    }
    @keyframes mdpBob {
      0%,100% { transform: translateX(-50%) translateY(0); }
      50%      { transform: translateX(-50%) translateY(7px); }
    }
    .mdp-scroll-line { width: 1px; height: 34px; background: linear-gradient(to bottom, transparent, #fff); }
    .mdp-scroll-dot  { width: 4px; height: 4px; border-radius: 50%; background: #fff; }

    /* ══ BODY & CAST — unchanged from original ══ */
    .mdp-body { max-width: 1240px; margin: 0 auto; padding: 2.5rem 5rem 0; }

    .mdp-sec-title {
      font-size: 1.5rem; font-weight: 700; letter-spacing: 3px;
      text-transform: uppercase; color: #e50914;
      display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem;
    }
    .mdp-sec-title::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.05); }

    .mdp-cast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px; }
    .mdp-cast-item {
      border-radius: 15px; overflow: hidden; background: #111116;
      transition: transform 0.18s; cursor: default; position: relative;
    }
    .mdp-cast-item:hover { transform: translateY(-4px); }
    .mdp-cast-item:hover .mdp-cast-photo { filter: brightness(1.1); }
    .mdp-cast-photo { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; background: #1c1c25; transition: filter 0.2s; }
    .mdp-cast-info { padding: 8px 10px 10px; background: linear-gradient(to bottom, #111116, #0d0d12); }
    .mdp-cast-name { font-size: 0.75rem; font-weight: 600; color: #e8e8e8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
    .mdp-cast-char { font-size: 0.63rem; color: #555; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ══ RELATED — unchanged from original ══ */
    .mdp-related { max-width: 1240px; margin: 0 auto; padding: 2rem 5rem 5rem; border-top: 1px solid rgb(0,0,0); }
    .mdp-related-grid { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 10px; }
    .mdp-load-more-wrap { display: flex; justify-content: center; margin-top: 2rem; }
    .mdp-load-more {
      padding: 10px 32px; background: transparent;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
      color: #666; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
      cursor: pointer; transition: all 0.18s;
    }
    .mdp-load-more:hover { border-color: rgba(255,255,255,0.2); color: #bbb; }

    /* ══ RESPONSIVE ══ */
    @media (max-width: 1024px) {
      .mdp-related-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
      .mdp-hero { padding: 0 2rem; }
      .mdp-body { padding: 2rem 2rem 0; }
      .mdp-related { padding: 2rem 2rem 4rem; }
    }

    @media (max-width: 768px) {
      .mdp-backdrop { height: 100svh; min-height: 600px; background-position: center top; }
      .mdp-backdrop-overlay {
        background: linear-gradient(to top, rgba(12,12,15,1) 0%, rgba(12,12,15,0.97) 28%, rgba(12,12,15,0.55) 58%, transparent 85%),
                    linear-gradient(to bottom, rgba(12,12,15,0.65) 0%, transparent 20%);
      }
      .mdp-hero-wrap { padding-bottom: 2rem; padding-top: 60px; align-items: flex-end; }
      .mdp-hero { grid-template-columns: 1fr; gap: 0; padding: 0 1.2rem; }
      .mdp-poster-wrap { display: none; }
      .mdp-title { font-size: clamp(2.4rem, 9vw, 3.4rem); letter-spacing: 2px; }
      .mdp-overview { -webkit-line-clamp: 2; font-size: 0.82rem; }
      .mdp-actions { flex-direction: column; gap: 9px; }
      .mdp-actions-top-row { display: flex; gap: 9px; width: 100%; }
      .mdp-btn-watch   { flex:1; justify-content:center; border-radius:10px; height:52px; }
      .mdp-btn-trailer { flex:1; justify-content:center; border-radius:10px; height:52px; }
      .mdp-btn-wl      { width:100%; justify-content:center; border-radius:10px; height:48px; }
      .mdp-scroll-hint { display: none; }
      .mdp-body { padding: 1.5rem 1.2rem 0; }
      .mdp-sec-title { font-size: 1.2rem; letter-spacing: 2.5px; margin-bottom: 0.9rem; }
      .mdp-cast-grid { grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .mdp-cast-info { padding: 5px 6px 7px; }
      .mdp-cast-name { font-size: 0.67rem; }
      .mdp-cast-char { font-size: 0.58rem; }
      .mdp-related { padding: 1.5rem 1.2rem 3rem; }
      .mdp-related-grid { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
      .mdp-load-more { padding: 10px 28px; font-size: 0.8rem; border-radius: 10px; }
    }

    @media (max-width: 480px) {
      .mdp-related-grid { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
      .mdp-cast-grid { grid-template-columns: repeat(4, 1fr); }
    }

    @media (max-width: 360px) {
      .mdp-related-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .mdp-cast-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `;

  if (loading) return <LoadingSpinner />;
  if (!movie) return (
    <div className="container text-light pt-5 mt-5 text-center">
      <h2>Movie Not Found</h2>
      <p>The requested movie details could not be loaded.</p>
    </div>
  );

  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null;
  const posterUrl   = movie.poster_path   ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`   : "https://placehold.co/200x300?text=No+Poster";
  const mobileImgUrl= movie.poster_path   ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`   : backdropUrl;
  const year        = movie.release_date  ? new Date(movie.release_date).getFullYear() : null;
  const rating      = typeof movie.vote_average === "number" && movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;
  const director    = movie.credits?.crew?.find((p) => p.job === "Director");
  const writers     = movie.credits?.crew?.filter((p) => ["Writer","Screenplay","Story"].includes(p.job)).slice(0, 2);
  const mainCast    = movie.credits?.cast?.slice(0, 10) || [];

  return (
    <div className="mdp">
      <style>{css}</style>

      {/* ══ HERO — new stylish design ══ */}
      <div
        className="mdp-backdrop"
        style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none", backgroundColor: "#0c0c0f" }}
      >
        <style>{`@media(max-width:768px){.mdp-backdrop{background-image:url('${mobileImgUrl}') !important; background-position:center top !important;}}`}</style>
        <div className="mdp-backdrop-overlay" />
        <div className="mdp-backdrop-grain" />

        <div className="mdp-hero-wrap">
          <div className="mdp-hero">

            {/* Poster — desktop only */}
            <div className="mdp-poster-wrap">
              <img src={posterUrl} alt={movie.title} className="mdp-poster" />
              {rating && (
                <div className="mdp-poster-rating">★ {rating} / 10</div>
              )}
            </div>

            {/* Info */}
            <div>
              {/* Badge row */}
              <div className="mdp-badge-row">
                <span className="mdp-badge mdp-badge-brand">✦ StreamHub</span>
                {year && <span className="mdp-badge mdp-badge-meta">{year}</span>}
                {movie.runtime > 0 && <span className="mdp-badge mdp-badge-meta">{formatRuntime(movie.runtime)}</span>}
                {rating && <span className="mdp-badge mdp-badge-meta">★ {rating}</span>}
              </div>

              <h1 className="mdp-title">{movie.title}</h1>
              {movie.tagline && <p className="mdp-tagline">"{movie.tagline}"</p>}
              <div className="mdp-title-divider" />

              <div className="mdp-genres">
                {movie.genres?.map((g) => <span key={g.id} className="mdp-genre">{g.name}</span>)}
              </div>

              {(director || writers?.length > 0) && (
                <div className="mdp-crew">
                  {director && <span className="mdp-crew-item">DIR <b>{director.name}</b></span>}
                  {writers?.length > 0 && <span className="mdp-crew-item">WRT <b>{writers.map((w) => w.name).join(", ")}</b></span>}
                </div>
              )}

              <p className="mdp-overview">{movie.overview || "No overview available."}</p>

              <div className="mdp-actions">
                <div className="mdp-actions-top-row">
                  <button className="mdp-btn-watch" onClick={() => setShowWatchModal(true)}>
                    <span className="mdp-btn-watch-icon"><BsFillPlayFill /></span>
                    Watch Now
                  </button>
                  <button className="mdp-btn-trailer" onClick={handleWatchMainTrailerClick}>
                    <BsFilm /> Trailer
                  </button>
                </div>
                <button className={`mdp-btn-wl${isInWatchlist ? " on" : ""}`} onClick={() => handleWatchlistToggle(movie)}>
                  {isInWatchlist ? <><BsCheck2 /> Saved</> : <><BsBookmark /> Add to Watchlist</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mdp-scroll-hint">
          <div className="mdp-scroll-line" />
          <div className="mdp-scroll-dot" />
        </div>
      </div>

      {/* ══ CAST — exactly as original ══ */}
      <div className="mdp-body">
        {mainCast.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <p className="mdp-sec-title">Cast</p>
            <div className="mdp-cast-grid">
              {mainCast.map((actor) => (
                <div key={actor.cast_id || actor.id} className="mdp-cast-item">
                  <img
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://placehold.co/110x165/13131a/333?text=?"}
                    alt={actor.name}
                    className="mdp-cast-photo"
                    loading="lazy"
                  />
                  <div className="mdp-cast-info">
                    <p className="mdp-cast-name">{actor.name}</p>
                    <p className="mdp-cast-char">{actor.character || actor.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══ RELATED — exactly as original ══ */}
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
              <button className="mdp-load-more" onClick={handleLoadMore}>Load More</button>
            </div>
          )}
        </div>
      )}

      <VideoModal
        show={showVideoModal}
        handleClose={() => { setShowVideoModal(false); setVideoKey(null); }}
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
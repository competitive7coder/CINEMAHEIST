import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import MovieCard from "../components/movie/MovieCard";
import MovieRow from "../components/movie/MovieRow";
import VideoModal from "../components/common/VideoModal";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import ProfileSettings from "./ProfileSettings";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { io } from "socket.io-client";
import {
  BsXLg,
  BsBoxArrowRight,
  BsList,
  BsFilm,
  BsCameraFill,
  BsPerson,
  BsShieldLock,
} from "react-icons/bs";

const ACTION = {
  ADDED: "added_to_watchlist",
  REMOVED: "removed_from_watchlist",
  TRAILER: "trailer_watch",
};

const Dashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("watchlist");
  const [settingsSubTab, setSettingsSubTab] = useState("profile");

  const [userName, setUserName] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [userBio, setUserBio] = useState("");

  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(null);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [recsLoaded, setRecsLoaded] = useState(false);
  const [recsLoading, setRecsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [triggerDelete, setTriggerDelete] = useState(false);

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const fetchWatchlist = useCallback(async () => {
    try {
      // ✅ Single call — returns full movie objects, no N individual calls
      const res = await api.get("/users/watchlist/full");
      setWatchlistMovies(res.data || []);
    } catch (error) {
      console.error("Watchlist fetch failed:", error);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get("/activity/history");
      setHistory(response.data);
    } catch (error) {
      console.error("History fetch failed:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // ── Lazy load recommendations only when tab clicked ─────────────────────────
  const fetchRecommendations = useCallback(async () => {
    if (recsLoaded || recsLoading) return;
    setRecsLoading(true);
    try {
      const res = await api.get("/movies/recommendations/user");
      const unique = res.data.filter(
        (m, i, self) => i === self.findIndex((x) => x.id === m.id),
      );
      setRecommendations(unique);
      setRecsLoaded(true);
    } catch (err) {
      console.error("Recommendations fetch failed:", err);
    } finally {
      setRecsLoading(false);
    }
  }, [recsLoaded, recsLoading]);

  // ── Socket setup ─────────────────────────────────────────────────────────────
  // IMPORTANT: only connect AFTER the dashboard has finished loading.
  // Connecting during the loading phase causes a race condition where the
  // WebSocket handshake starts before the server is ready to accept it,
  // resulting in "WebSocket closed before connection established".
  useEffect(() => {
    // Gate: don't connect until initial data load is complete
    if (loading) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    // Decode userId from JWT payload (standard base64url JSON)
    let userId;
    try {
      userId = JSON.parse(atob(token.split(".")[1])).sub;
    } catch {
      console.error("❌ Could not decode token for socket room");
      return;
    }

    // IMPORTANT: python-socketio requires the handshake to start over HTTP
    // polling before upgrading to WebSocket. Starting with ["websocket"] only
    // skips the HTTP handshake and causes the "closed before established" error.
    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
    const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["polling", "websocket"], // polling first → upgrades to WS
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: Infinity, // keep retrying — don't give up
      reconnectionDelay: 1000, // 1s first retry
      reconnectionDelayMax: 10000, // cap at 10s between retries
      randomizationFactor: 0.3, // jitter so all clients don't retry at once
      timeout: 20000, // 20s handshake timeout (was 10s — too short)
      forceNew: false, // reuse connection if it exists
    });

    socket.on("connect", () => {
      // Join the private room so server can target this user
      socket.emit("join_room", { userId });
    });

    socket.on("activity_update", (data) => {
      // Always prepend to history feed — no extra API call needed
      setHistory((prev) => [data, ...prev].slice(0, 20));

      // Sync watchlist UI based on action type
      if (data.action_type === ACTION.ADDED) {
        fetchWatchlist(); // re-fetch to get full movie object
        toast.success(`✅ Added "${data.movie_title}" to watchlist`);
      } else if (data.action_type === ACTION.REMOVED) {
        setWatchlistMovies((prev) =>
          prev.filter((m) => m.id !== data.movie_id),
        );
        toast.info(`Removed "${data.movie_title}"`);
      }
      // TRAILER action only updates history feed (handled above)
    });

    socket.on("connect_error", (err) => {});

    socket.on("disconnect", (reason) => {
      // "io server disconnect" means server actively kicked us — must reconnect manually
      if (reason === "io server disconnect") socket.connect();
    });

    socket.on("reconnect_attempt", (n) => {});

    socket.on("reconnect", () => {
      socket.emit("join_room", { userId }); // re-join private room after reconnect
    });

    return () => {
      socket.off("activity_update");
      socket.disconnect();
    };
  }, [loading, fetchWatchlist]); // `loading` gates the connection — socket only starts when dashboard is ready

  // ── Initial dashboard load ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const [userRes, watchlistRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/users/watchlist/full"), // ✅ full movie objects in 1 call
        ]);

        setUserName(userRes.data.name || userRes.data.username || "");
        setUserProfilePicture(
          userRes.data.profilePicture || userRes.data.profile_picture || "",
        );
        setUserBio(userRes.data.bio || "");

        // ✅ Full movie objects returned directly — no N individual calls
        setWatchlistMovies(watchlistRes.data || []);

        fetchHistory(); // background — doesn't block
        // Recommendations load lazily when user clicks Discovery tab
      } catch (err) {
        console.error(err);
        toast.error("Failed loading dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate, fetchHistory]);

  // ── Activity logger (fire-and-forget — socket handles the UI update) ─────────
  const logActivity = useCallback(async (movie, actionType) => {
    const token = localStorage.getItem("token");
    if (!token || !movie) return;
    try {
      await api.post("/activity/log", {
        movie_id: movie.id,
        action_type: actionType,
        movie_title: movie.title || "Unknown",
        movie_poster_path: movie.poster_path || "",
      });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  }, []);

  // ── Action handlers ──────────────────────────────────────────────────────────
  const handleWatchTrailerClick = async (movie) => {
    try {
      const res = await api.get(`/movies/${movie.id}/videos`);
      const trailer = res.data;
      if (!trailer?.key) {
        toast.error("Trailer not available");
        return;
      }

      setCurrentVideoKey(trailer.key);
      setShowVideoModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      const res = await api.post(`/users/watchlist/${movie.id}`);
      toast.success(res.data.msg);
      // Optimistic UI update
      setWatchlistMovies((prev) =>
        prev.some((m) => m.id === movie.id) ? prev : [movie, ...prev],
      );
      // Fire-and-forget — socket confirms and updates history
      logActivity(movie, ACTION.ADDED);
    } catch (err) {
      console.error(err);
      toast.error("Could not add movie");
    }
  };

  const handleRemoveFromWatchlist = async (movie) => {
    try {
      const res = await api.delete(`/users/watchlist/${movie.id}`);
      toast.info(res.data.msg);
      // Optimistic UI update
      setWatchlistMovies((prev) => prev.filter((m) => m.id !== movie.id));
      // Fire-and-forget — socket updates history
      logActivity(movie, ACTION.REMOVED);
    } catch (err) {
      console.error(err);
      toast.error("Could not remove movie");
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.delete("/activity/history");
      setHistory([]);
      toast.success("History cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear history");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) return <LoadingSpinner />;

  return (
    <div className="modern-dashboard">
      <div className="bg-glow"></div>
      <div className="bg-glow-alt"></div>

      <div className="dashboard-layout">
        {/* ── MOBILE OVERLAY ── */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar-glass${sidebarOpen ? " sidebar-open" : ""}`}>
          <div className="brand-zone">
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <BsXLg />
            </button>
          </div>

          <nav className="main-nav">
            <div className="nav-label">Main Menu</div>
            {[
              {
                id: "watchlist",
                label: "My Library",
                icon: "bi-collection-play",
              },
              { id: "recommendations", label: "Discovery", icon: "bi-compass" },
              { id: "history", label: "Activity", icon: "bi-clock-history" },
              { id: "settings", label: "Settings", icon: "bi-sliders" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                  if (item.id === "recommendations") fetchRecommendations();
                }}
                className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
              >
                <div className="active-indicator"></div>
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="profile-footer-card">
            <div className="profile-top">
              <img
                src={userProfilePicture || "https://placehold.co/40"}
                alt="user"
              />
              <div className="profile-info">
                <span className="user-name">{userName}</span>
                <span className="user-status">Online</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn-refined">
              <BsBoxArrowRight />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ── MOBILE TOP BAR ── */}
        <div className="mobile-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <BsList />
          </button>
          <h2 className="brand-text" style={{ margin: 0 }}>
            STREAM<span>HUB</span>
          </h2>
          <img
            src={userProfilePicture || "https://placehold.co/36"}
            alt="user"
            className="mobile-avatar"
          />
        </div>

        {/* ── MAIN CONTENT ── */}
        <main
          className="content-hub custom-scrollbar py-5"
          style={{ paddingTop: "4rem" }}
        >
          <header className="content-header-refined">
            <div className="header-left">
              <span className="breadcrumb-mini">Pages / {activeTab}</span>
              <h1>
                {activeTab === "watchlist"
                  ? "Your Collection"
                  : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>
          </header>

          <div className="scroll-content">
            {/* ── WATCHLIST TAB ── */}
            {activeTab === "watchlist" && (
              <div className="grid-reveal">
                {watchlistMovies.length > 0 ? (
                  <div className="movie-grid-refined">
                    {watchlistMovies.map((movie) => (
                      <div key={movie.id} className="grid-item-refined">
                        <MovieCard
                          movie={movie}
                          onWatchTrailerClick={() =>
                            handleWatchTrailerClick(movie)
                          }
                          onWatchlistClick={() =>
                            handleRemoveFromWatchlist(movie)
                          }
                          isInWatchlist={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-refined">
                    <div className="empty-icon">
                      <BsFilm />
                    </div>
                    <h3>Your library is empty</h3>
                    <p>Start adding movies you want to watch later.</p>
                    <button
                      onClick={() => setActiveTab("recommendations")}
                      className="btn-action-refined"
                    >
                      Explore Movies
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── RECOMMENDATIONS TAB ── */}
            {activeTab === "recommendations" && (
              <div className="fade-in-section">
                {recsLoading && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "5rem 0",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        border: "3px solid rgba(255,255,255,0.06)",
                        borderTopColor: "#e50914",
                        borderRadius: "50%",
                        animation: "rec-spin 0.8s linear infinite",
                      }}
                    />
                    <p
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontFamily: "Poppins",
                        fontSize: "0.82rem",
                        margin: 0,
                      }}
                    >
                      Finding your perfect movies...
                    </p>
                    <style>{`@keyframes rec-spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}
                {recsLoaded &&
                  !recsLoading &&
                  (!showAllRecommendations ? (
                    <MovieRow
                      title="Tailored Discovery"
                      movies={recommendations}
                      onWatchTrailerClick={handleWatchTrailerClick}
                      onSeeAllClick={() => setShowAllRecommendations(true)}
                      onWatchlistClick={(m) =>
                        watchlistMovies.some((w) => w.id === m.id)
                          ? handleRemoveFromWatchlist(m)
                          : handleAddToWatchlist(m)
                      }
                    />
                  ) : (
                    <div className="movie-grid-refined">
                      {recommendations.map((movie) => (
                        <div key={movie.id} className="grid-item-refined">
                          <MovieCard
                            movie={movie}
                            onWatchTrailerClick={() =>
                              handleWatchTrailerClick(movie)
                            }
                            onWatchlistClick={() =>
                              watchlistMovies.some((m) => m.id === movie.id)
                                ? handleRemoveFromWatchlist(movie)
                                : handleAddToWatchlist(movie)
                            }
                            isInWatchlist={watchlistMovies.some(
                              (m) => m.id === movie.id,
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {activeTab === "history" && (
              <div className="bento-container fade-in-section">
                <ActivityFeed
                  history={history}
                  loading={historyLoading}
                  onClearHistory={handleClearHistory}
                />
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === "settings" && (
              <div className="settings-bento-grid fade-in-section">
                <div className="settings-sidebar-card">
                  <div className="profile-edit-header">
                    <div className="avatar-upload-wrapper">
                      <img
                        src={userProfilePicture || "https://placehold.co/120"}
                        alt="User"
                        className="settings-avatar"
                      />
                      <button className="avatar-edit-btn">
                        <BsCameraFill />
                      </button>
                    </div>
                    <h3 className="settings-username">{userName}</h3>
                    <p className="settings-status-pill">Member Since 2026</p>
                  </div>

                  <div className="settings-mini-nav">
                    <div
                      className={`s-nav-item ${settingsSubTab === "profile" ? "active" : ""}`}
                      onClick={() => setSettingsSubTab("profile")}
                    >
                      <BsPerson /> Account Details
                    </div>
                    <div
                      className={`s-nav-item ${settingsSubTab === "security" ? "active" : ""}`}
                      onClick={() => setSettingsSubTab("security")}
                    >
                      <BsShieldLock />
                      Security
                    </div>
                  </div>
                </div>

                <div className="settings-main-form">
                  <ProfileSettings
                    userName={userName}
                    userBio={userBio}
                    userProfilePicture={userProfilePicture}
                    onNameUpdate={(name) => setUserName(name)}
                    onBioUpdate={(bio) => setUserBio(bio)}
                    onPictureUpdate={(url) => setUserProfilePicture(url)}
                    activeSubTab={settingsSubTab}
                    triggerDelete={triggerDelete}
                  />

                  <div className="danger-zone-wrapper">
                    <h5 className="danger-title">Danger Zone</h5>
                    <div className="danger-card">
                      <div className="danger-text">
                        <p className="mb-0 fw-bold">Delete Account</p>
                        <small>
                          Once deleted, all your data is lost forever.
                        </small>
                      </div>
                      <button
                        className="danger-btn"
                        onClick={() => setTriggerDelete((t) => !t)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="mobile-bottom-nav">
          {[
            { id: "watchlist", icon: "bi-collection-play" },
            { id: "recommendations", icon: "bi-compass" },
            { id: "history", icon: "bi-clock-history" },
            { id: "settings", icon: "bi-sliders" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`bottom-nav-btn${activeTab === item.id ? " active" : ""}`}
            >
              <i className={`bi ${item.icon}`}></i>
            </button>
          ))}
        </nav>
      </div>

      <VideoModal
        show={showVideoModal}
        handleClose={() => setShowVideoModal(false)}
        videoKey={currentVideoKey}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --accent:       #3a7bd5;
          --accent-glow:  rgba(58,123,213,0.35);
          --sidebar-bg:   rgba(8,9,13,0.92);
          --card-bg:      rgba(255,255,255,0.03);
          --border:       rgba(255,255,255,0.07);
          --text-muted:   #64748b;
          --danger:       #ef4444;
        }

        *, *::before, *::after { box-sizing: border-box; }

        /* ── SHELL ── */
        .modern-dashboard {
          background: #08090d; color: #e2e8f0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          height: 100dvh; overflow: hidden; position: relative;
        }
        .bg-glow     { position:absolute; top:-10%; right:-5%; width:45%; height:50%; background:radial-gradient(circle,rgba(58,123,213,0.1) 0%,transparent 70%); z-index:0; pointer-events:none; }
        .bg-glow-alt { position:absolute; bottom:-10%; left:-5%; width:40%; height:40%; background:radial-gradient(circle,rgba(91,58,213,0.07) 0%,transparent 70%); z-index:0; pointer-events:none; }
        .dashboard-layout { display:flex; height:100%; position:relative; z-index:1; }

        /* ── SIDEBAR ── */
        .sidebar-glass {
          width: 260px; flex-shrink: 0;
          background: var(--sidebar-bg);
          backdrop-filter: blur(30px);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 2rem 1.25rem;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar-close-btn { display: none; }

        .brand-zone { display:flex; align-items:center; gap:12px; margin-bottom:3rem; padding-left:4px; }
        .brand-logo {
          width:34px; height:34px; background:var(--accent); border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          transform:rotate(-10deg); box-shadow:0 0 20px var(--accent-glow); flex-shrink:0;
        }
        .logo-inner { width:12px; height:12px; border:2.5px solid #fff; border-radius:3px; }
        .brand-text { font-size:1.35rem; font-weight:800; letter-spacing:-1px; margin:0; }
        .brand-text span { color:var(--accent); }

        .main-nav  { display:flex; flex-direction:column; gap:4px; flex-grow:1; }
        .nav-label { font-size:0.65rem; text-transform:uppercase; letter-spacing:1.8px; color:#334155; margin-bottom:0.75rem; padding-left:1rem; font-weight:700; }

        .nav-btn {
          background: transparent; border: none; color: #64748b;
          display: flex; align-items: center; gap: 13px;
          padding: 13px 16px; border-radius: 12px;
          transition: all 0.2s ease; text-align: left;
          position: relative; cursor: pointer; font-size: 0.9rem; font-weight: 600;
          width: 100%;
        }
        .nav-btn:hover { color: #cbd5e1; background: rgba(255,255,255,0.04); }
        .nav-btn.active {
          color: #fff;
          background: linear-gradient(90deg, rgba(58,123,213,0.18) 0%, rgba(58,123,213,0.04) 100%);
        }
        .active-indicator {
          position:absolute; left:0; top:22%; bottom:22%;
          width:3px; background:var(--accent); border-radius:0 4px 4px 0; display:none;
        }
        .nav-btn.active .active-indicator { display:block; }
        .nav-btn i { font-size:1rem; width:18px; text-align:center; flex-shrink:0; }

        /* ── PROFILE FOOTER ── */
        .profile-footer-card {
          background: rgba(255,255,255,0.025); border:1px solid var(--border);
          border-radius:18px; padding:1rem; margin-top:1.5rem;
        }
        .profile-top { display:flex; align-items:center; gap:10px; margin-bottom:1rem; }
        .profile-top img { width:40px; height:40px; border-radius:11px; object-fit:cover; border:1.5px solid var(--border); flex-shrink:0; }
        .user-name   { font-weight:700; font-size:0.83rem; color:#f1f5f9; display:block; }
        .user-status { font-size:0.62rem; color:#10b981; font-weight:600; display:flex; align-items:center; gap:4px; }
        .user-status::before { content:''; width:5px; height:5px; background:#10b981; border-radius:50%; display:inline-block; }
        .logout-btn-refined {
          width:100%; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.18);
          color:#ef4444; padding:9px; border-radius:10px; font-size:0.82rem; font-weight:700;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:all 0.2s; cursor:pointer;
        }
        .logout-btn-refined:hover { background:#ef4444; color:#fff; box-shadow:0 4px 15px rgba(239,68,68,0.3); }

        /* ── MOBILE TOP BAR ── */
        .mobile-topbar { display:none; }
        .hamburger-btn { background:none; border:none; color:#e2e8f0; font-size:1.55rem; cursor:pointer; padding:4px 6px; line-height:1; flex-shrink:0; }
        .mobile-avatar { width:34px; height:34px; border-radius:10px; object-fit:cover; border:1.5px solid var(--border); flex-shrink:0; }

        /* ── OVERLAY ── */
        .sidebar-overlay {
          display:none; position:fixed; inset:0;
          background:rgba(0,0,0,0.65); backdrop-filter:blur(3px); z-index:99;
        }

        /* ── BOTTOM NAV ── */
        .mobile-bottom-nav { display:none; }
        .bottom-nav-btn {
          flex:1; background:none; border:none; color:#475569;
          font-size:1.25rem; padding:8px 0; cursor:pointer;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:3px; transition:all 0.2s; position:relative;
        }
        .bottom-nav-btn .bnav-label { font-size:0.55rem; font-weight:600; letter-spacing:0.3px; }
        .bottom-nav-btn.active { color:var(--accent); }
        .bottom-nav-btn.active::before {
          content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:28px; height:2px; background:var(--accent); border-radius:0 0 4px 4px;
        }

        /* ── CONTENT HUB ── */
        .content-hub { flex-grow:1; overflow-y:auto; padding:2.25rem 3rem; min-width:0; }
        .content-header-refined { margin-bottom:2.5rem; }
        .breadcrumb-mini { font-size:0.72rem; color:var(--text-muted); margin-bottom:4px; display:block; font-weight:500; }
        .header-left h1 { font-size:2.2rem; font-weight:800; letter-spacing:-1.5px; margin:0; }

        /* ── MOVIE GRID ── */
        .movie-grid-refined {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          /* visible so hover shadows aren't clipped */
          overflow: visible;
        }

        /* grid-item-refined CONSTRAINS the fixed-width card to the cell.
           overflow:hidden clips the card at cell boundary so it can never
           overlap neighbours, while the negative margin trick gives the
           hover shadow a little breathing room. */
        .grid-item-refined {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          box-shadow: 0 0 0 0 transparent;
          transition: box-shadow 0.35s ease;
          /* enable container queries so buttons can respond to cell width */
          container-type: inline-size;
        }

        /* Forward the card's hover shadow onto the wrapper instead */
        .grid-item-refined:has(.card:hover) {
          box-shadow: 0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(229,9,20,0.35);
          overflow: visible;
          z-index: 2;
        }

        /* Make the card fill the wrapper cell completely */
        .grid-item-refined .card {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: 270 / 380;
          position: relative;
        }

        /* On hover scale, keep within cell by clamping transform origin */
        .grid-item-refined .card:hover {
          transform: translateY(-8px) scale(1.04);
        }

        /* ── BUTTON FIX for grid cards ──
           Shrink buttons to fit 3 across any card width. */
        .grid-item-refined .btn-watch,
        .grid-item-refined .btn-trailer,
        .grid-item-refined .btn-add,
        .grid-item-refined .btn-remove {
          font-size: 0.6rem;
          padding: 5px 2px;
          gap: 2px;
          min-width: 0;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          letter-spacing: -0.2px;
        }

        .grid-item-refined .btn-watch i,
        .grid-item-refined .btn-trailer i,
        .grid-item-refined .btn-add i,
        .grid-item-refined .btn-remove i {
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        /* ── EMPTY STATE ── */
        .empty-state-refined {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; text-align:center;
          padding:5rem 2rem;
          background:rgba(255,255,255,0.015);
          border:2px dashed rgba(255,255,255,0.05);
          border-radius:32px; margin-top:1rem;
        }
        .empty-icon {
          width:90px; height:90px;
          background:linear-gradient(135deg,rgba(58,123,213,0.12) 0%,transparent 100%);
          border-radius:26px; display:flex; align-items:center; justify-content:center;
          margin-bottom:1.5rem; animation:float 4s ease-in-out infinite;
        }
        .empty-icon i { font-size:2.6rem; color:var(--accent); filter:drop-shadow(0 0 12px var(--accent-glow)); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .empty-state-refined h3 { font-size:1.6rem; font-weight:800; margin-bottom:6px; color:#fff; }
        .empty-state-refined p  { color:#64748b; margin-bottom:2rem; max-width:280px; line-height:1.6; font-size:0.9rem; }

        .btn-action-refined {
          background:var(--accent); color:#fff; border:none;
          padding:13px 28px; border-radius:14px; font-weight:700; font-size:0.9rem;
          cursor:pointer; box-shadow:0 8px 20px var(--accent-glow);
          transition:all 0.25s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .btn-action-refined:hover  { transform:translateY(-2px) scale(1.04); box-shadow:0 12px 28px var(--accent-glow); }
        .btn-action-refined:active { transform:scale(0.97); }

        /* ── BENTO ── */
        .bento-container { background:var(--card-bg); border:1px solid var(--border); border-radius:24px; padding:2rem; }

        /* ── SETTINGS ── */
        .settings-bento-grid   { display:grid; grid-template-columns:300px 1fr; gap:1.75rem; max-width:1050px; }
        .settings-sidebar-card { background:var(--card-bg); border:1px solid var(--border); border-radius:22px; padding:2rem 1.25rem; height:fit-content; text-align:center; }
        .avatar-upload-wrapper { position:relative; width:110px; margin:0 auto 1.25rem; }
        .settings-avatar       { width:110px; height:110px; border-radius:28px; object-fit:cover; border:3px solid rgba(58,123,213,0.2); }
        .avatar-edit-btn       { position:absolute; bottom:-5px; right:-5px; background:var(--accent); border:none; color:#fff; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .settings-mini-nav     { text-align:left; margin-top:1.25rem; }
        .s-nav-item            { padding:11px 14px; border-radius:10px; color:#64748b; font-size:0.875rem; font-weight:600; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:10px; margin-bottom:4px; }
        .s-nav-item:hover      { background:rgba(255,255,255,0.04); color:#cbd5e1; }
        .s-nav-item.active     { background:rgba(58,123,213,0.1); color:var(--accent); }
        .settings-main-form    { background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:28px; padding:2.5rem; }
        .premium-input { background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:11px; padding:11px 14px; color:#fff; width:100%; outline:none; transition:0.25s; margin-top:5px; font-family:inherit; font-size:0.9rem; }
        .premium-input:focus { border-color:var(--accent); background:rgba(58,123,213,0.07); }
        .custom-form-group       { margin-bottom:1.25rem; }
        .custom-form-group label { font-size:0.82rem; font-weight:600; color:#94a3b8; }
        .danger-zone-wrapper   { margin-top:3rem; padding-top:1.75rem; border-top:1px solid var(--border); }
        .danger-title          { font-size:0.8rem; text-transform:uppercase; letter-spacing:1.5px; color:#64748b; margin-bottom:1rem; font-weight:700; }
        .danger-card           { background:rgba(239,68,68,0.04); border:1px solid rgba(239,68,68,0.12); padding:1.25rem; border-radius:14px; display:flex; justify-content:space-between; align-items:center; gap:1rem; }
        .danger-btn            { background:transparent; border:1px solid var(--danger); color:var(--danger); padding:8px 18px; border-radius:9px; font-weight:700; font-size:0.85rem; cursor:pointer; flex-shrink:0; transition:0.2s; }
        .danger-btn:hover      { background:var(--danger); color:#fff; }
        .btn-save-settings     { background:var(--accent); color:#fff; border:none; padding:11px 22px; border-radius:11px; font-weight:700; font-size:0.9rem; transition:0.2s; cursor:pointer; }
        .btn-save-settings:hover { background:#4a8be6; }

        /* ── SCROLLBAR ── */
        .custom-scrollbar::-webkit-scrollbar       { width:5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:10px; }

        /* ════════ TABLET ≤ 1024px ════════ */
        @media (max-width:1024px) {
          .sidebar-glass        { width:230px; padding:1.75rem 1rem; }
          .content-hub          { padding:2rem 1.75rem; }
          .settings-bento-grid  { grid-template-columns:250px 1fr; }
          .header-left h1       { font-size:1.9rem; }
          .movie-grid-refined   { grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:1rem; }
        }

        /* ════════ MOBILE ≤ 768px ════════ */
        @media (max-width:768px) {
          .modern-dashboard  { height:100dvh; }
          .dashboard-layout  { flex-direction:column; height:100dvh; overflow:hidden; }

          /* Sidebar → slide-in drawer */
          .sidebar-glass {
  position:fixed; top:20; left:0; height:100dvh; width:270px;
  z-index:200; transform:translateX(-100%); padding:1.5rem 1.25rem;
}
          .sidebar-glass.sidebar-open { transform:translateX(0); }
.sidebar-overlay { display:block; z-index:199; }

          /* Close btn */
          .sidebar-close-btn {
            display:flex; align-items:center; justify-content:center;
            background:rgba(255,255,255,0.06); border:1px solid var(--border);
            color:#94a3b8; width:32px; height:32px; border-radius:9px;
            cursor:pointer; font-size:0.9rem; flex-shrink:0;
            margin-right:auto; order:-1;
          }

          /* Mobile top bar */
       .mobile-topbar { display: none; }

          /* Main content area */
          .content-hub {
            flex:1; height:0; overflow-y:auto;
            padding:1rem 0.875rem calc(64px + 1rem);
          }
          .content-header-refined { margin-bottom:1.25rem; }
          .header-left h1  { font-size:1.5rem; letter-spacing:-0.8px; }
          .breadcrumb-mini { display:none; }

          /* Bottom nav */
          .mobile-bottom-nav {
            display:flex; position:fixed; bottom:0; left:0; right:0;
            background:rgba(8,9,13,0.96); backdrop-filter:blur(24px);
            border-top:1px solid var(--border); height:58px; z-index:50;
            padding:0 0.5rem;
          }
            .brand-zone { display: none; }

          /* Grid — 2 columns, tight */
          .movie-grid-refined { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .grid-item-refined { overflow: hidden; border-radius: 14px; }

          /* Settings */
          .settings-bento-grid { grid-template-columns:1fr; }
          .settings-main-form  { padding:1.25rem; border-radius:18px; }
          .danger-card         { flex-direction:column; align-items:flex-start; }

          /* Bento */
          .bento-container { padding:1rem; border-radius:18px; }

          /* Empty state */
          .empty-state-refined { padding:3rem 1.25rem; border-radius:22px; }
          .empty-state-refined h3 { font-size:1.35rem; }
        }

        /* ════════ SMALL ≤ 400px ════════ */
        @media (max-width:400px) {
          .content-hub          { padding:0.75rem 0.65rem calc(64px + 0.75rem); }
          .movie-grid-refined   { gap:0.45rem; }
          .header-left h1       { font-size:1.3rem; }
          .settings-main-form   { padding:1rem; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

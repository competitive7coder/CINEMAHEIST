import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // --- 1. REMOVED
import api from "../api"; // --- 1. ADDED
import MovieCard from "./MovieCard";
import VideoModal from "./VideoModal";
import { toast } from "react-toastify";
import ProfileSettings from "./ProfileSettings";
import MovieRow from "./MovieRow";
import ActivityFeed from "./ActivityFeed";
import LoadingSpinner from "./LoadingSpinner";

const Dashboard = ({ setIsLoggedIn }) => {
  // State to manage which tab is currently visible
  const [activeTab, setActiveTab] = useState("watchlist"); // Default to 'watchlist'

  // State for user data
  const [userName, setUserName] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [userBio, setUserBio] = useState("");

  // State for movie lists
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recSourceMovie, setRecSourceMovie] = useState(null); // Movie used for recommendations

  // State for activity history (MOVED FROM ACTIVITYFEED)
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Utility state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(null);

  // --- ADDED STATE ---
  // This state toggles the view in the recommendations tab
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  // const API_BASE_URL = "http://localhost:5000/api"; // --- 2. REMOVED

  // --- Activity & History Functions ---

  const logActivity = useCallback(async (movieId, actionType) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      // await axios.post( // --- 3. OLD
      //   `${API_BASE_URL}/activity/log`,
      //   { movieId, actionType },
      //   { headers: { "x-auth-token": token } }
      // );
      await api.post(`/activity/log`, { movieId, actionType }); // --- 3. FIXED
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  }, []); // Empty dependency array, this function is stable

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setHistoryLoading(false);
      return;
    }
    setHistoryLoading(true); // Always set loading when fetching
    try {
      // const res = await axios.get(`${API_BASE_URL}/activity/history`, { // --- 4. OLD
      //   headers: { "x-auth-token": token },
      // });
      const res = await api.get(`/activity/history`); // --- 4. FIXED
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast.error("Could not fetch viewing history.");
    } finally {
      setHistoryLoading(false);
    }
  }, []); // Empty dependency array, this function is stable

  const handleClearHistory = useCallback(async () => {
    if (
      window.confirm(
        "Are you sure you want to clear your entire viewing history? This cannot be undone."
      )
    ) {
      const token = localStorage.getItem("token");
      if (!token) return; // Added check just in case
      try {
        // const res = await axios.delete(`${API_BASE_URL}/activity/history`, { // --- 5. OLD
        //   headers: { "x-auth-token": token },
        // });
        const res = await api.delete(`/activity/history`); // --- 5. FIXED
        toast.info(res.data.msg);
        setHistory([]); // Clear the history from the UI instantly
      } catch (err) {
        toast.error("Could not clear history.");
      }
    }
  }, []); // Empty dependency array, this function is stable

  // --- Initial Data Load Effect ---

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if not logged in
        return;
      }
      try {
        // Fetch user info and watchlist IDs concurrently
        const [userRes, watchlistIdsRes] = await Promise.all([
          // axios.get(`${API_BASE_URL}/auth/user`, { // --- 6. OLD
          //   headers: { "x-auth-token": token },
          // }),
          // axios.get(`${API_BASE_URL}/users/watchlist`, { // --- 6. OLD
          //   headers: { "x-auth-token": token },
          // }),
          api.get(`/auth/user`), // --- 6. FIXED
          api.get(`/users/watchlist`), // --- 6. FIXED
        ]);

        // Update user profile state
        setUserName(userRes.data.name);
        setUserProfilePicture(userRes.data.profilePicture);
        setUserBio(userRes.data.bio);

        // If watchlist has movies, fetch their details and recommendations
        if (watchlistIdsRes.data?.length > 0) {
          const movieDetailPromises = watchlistIdsRes.data.map((id) =>
            // axios.get(`${API_BASE_URL}/movies/details/${id}`) // --- 7. OLD
            api.get(`/movies/details/${id}`) // --- 7. FIXED
          );
          const movieDetailResponses = await Promise.all(movieDetailPromises);
          const movies = movieDetailResponses.map((res) => res.data);
          setWatchlistMovies(movies);

          // Fetch recommendations based on a random movie from the watchlist
          if (movies.length > 0) {
            const randomMovie =
              movies[Math.floor(Math.random() * movies.length)];
            setRecSourceMovie(randomMovie);
            // const recRes = await axios.get( // --- 8. OLD
            //   `${API_BASE_URL}/movies/recommendations/${randomMovie.id}`
            // );
            const recRes = await api.get(`/movies/recommendations/${randomMovie.id}`); // --- 8. FIXED
            setRecommendations(recRes.data);
          }
        } else {
          setWatchlistMovies([]); // Ensure watchlist is empty if no IDs found
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Log out user if fetching data fails (e.g., invalid token)
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
      } finally {
        setLoading(false); // Stop loading state
        fetchHistory(); // Fetch history after initial data load
      }
    };
    fetchDashboardData();
  }, [navigate, setIsLoggedIn, fetchHistory]);

  // --- ADDED EFFECT ---
  // Resets the "For You" tab to the row view when switching tabs
  useEffect(() => {
    if (activeTab !== "recommendations") {
      setShowAllRecommendations(false);
    }
  }, [activeTab]);

  // --- Profile Settings Handlers ---

  const handleNameUpdate = (newName) => setUserName(newName);
  const handleBioUpdate = (newBio) => setUserBio(newBio);
  const handlePictureUpdate = (newUrl) => setUserProfilePicture(newUrl);

  // --- Movie & Modal Handlers (NOW UPDATED TO REFRESH HISTORY) ---

  const handleWatchTrailerClick = async (movieId) => {
    try {
      await logActivity(movieId, "trailer_watch"); // Log first
      // const res = await axios.get(`${API_BASE_URL}/movies/${movieId}/videos`); // --- 9. OLD
      const res = await api.get(`/movies/${movieId}/videos`); // --- 9. FIXED
      setCurrentVideoKey(res.data?.key || null);
      setShowVideoModal(true);
      fetchHistory(); // This will now run AFTER the log is saved
    } catch (err) {
      console.error("Error fetching trailer:", err);
      toast.error("Could not load trailer.");
    }
  };

  const handleCloseVideoModal = () => setShowVideoModal(false);

  const handleAddToWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }
    try {
      // const res = await axios.post( // --- 10. OLD
      //   `${API_BASE_URL}/users/watchlist/${movie.id}`,
      //   {},
      //   { headers: { "x-auth-token": token } }
      // );
      const res = await api.post(`/users/watchlist/${movie.id}`, {}); // --- 10. FIXED
      toast.success(res.data.msg);

      if (res.data.msg && res.data.msg.includes("added")) {
        setWatchlistMovies((prevMovies) => [movie, ...prevMovies]);
        await logActivity(movie.id, "watchlist_add"); // Log after success
        fetchHistory(); // This will now run AFTER the log is saved
      }
    } catch (err) {
      toast.error("Could not update watchlist.");
    }
  };

  const handleRemoveFromWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) return; // Added check
    try {
      // await axios.post( // --- 11. OLD
      //   `${API_BASE_URL}/users/watchlist/${movie.id}`,
      //   {},
      //   { headers: { "x-auth-token": token } }
      // );
      await api.post(`/users/watchlist/${movie.id}`, {}); // --- 11. FIXED
      setWatchlistMovies((prevMovies) =>
        prevMovies.filter((m) => m.id !== movie.id)
      ); // Update UI instantly
      toast.info("Movie removed from your watchlist.");
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error("Error removing from watchlist:", err);
      toast.error("Could not remove movie.");
    }
  };

  // --- Logout Handler ---

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.info("You have been logged out.");
    navigate("/login");
  };

  // Display loading spinner while data is fetching
  if (loading) {
    return <LoadingSpinner />;
  }

  // Main component render
  return (
    <div className="container" style={{ color: "white" }}>
      {/* Header section with profile picture, name, and bio */}
      <div className="d-flex align-items-center mb-3 border-bottom pb-3">
        <img
          src={userProfilePicture || "https://placehold.co/80x80/212529/dee2e6?text=User"} // Better Placeholder
          alt="Profile"
          className="rounded-circle me-3"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/212529/dee2e6?text=Err"}} // Fallback for image error
        />
        <div>
          <h1 className="h2 mb-0">Welcome, {userName || "User"}!</h1>
          <p className="text-muted mb-0 fst-italic">
            {userBio || "No bio yet."}
          </p>
        </div>
      </div>

      {/* Main content area with sidebar and tab content */}
      <div className="row">
        {/* Sidebar Navigation */}
        <div className="col-md-3">
          <ul className="nav nav-pills flex-column bg-dark p-3 rounded-3">
            <li className="nav-item">
              <button
                className={`nav-link text-start w-100 ${
                  activeTab === "watchlist" ? "active" : "text-light"
                }`}
                onClick={() => setActiveTab("watchlist")}
              >
                <i className="bi bi-collection-play-fill me-2"></i> Your
                Watchlist
              </button>
            </li>
            <li className="nav-item mt-2">
              <button
                className={`nav-link text-start w-100 ${
                  activeTab === "recommendations" ? "active" : "text-light"
                }`}
                onClick={() => setActiveTab("recommendations")}
              >
                <i className="bi bi-magic me-2"></i> For You
              </button>
            </li>
            <li className="nav-item mt-2">
              <button
                className={`nav-link text-start w-100 ${
                  activeTab === "history" ? "active" : "text-light"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <i className="bi bi-clock-history me-2"></i> Viewing History
              </button>
            </li>
            <li className="nav-item mt-2">
              <button
                className={`nav-link text-start w-100 ${
                  activeTab === "settings" ? "active" : "text-light"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <i className="bi bi-person-circle me-2"></i> Account Settings
              </button>
            </li>
            <li className="nav-item mt-4">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger w-100"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content Area */}
        <div className="col-md-9">
          {/* Watchlist Tab Content */}
          {activeTab === "watchlist" && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "#fff",
                  marginBottom: "1.5rem",
                }}
              >
                Your Watchlist
              </h3>
              {watchlistMovies.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    alignItems: "start",
                    width: "100%",
                    margin: "0 auto",
                    padding: "0 1rem",
                  }}
                >
                  {watchlistMovies.map((movie) => (
                    <div
                      key={movie.id}
                      style={{
                        width: "100%",
                        maxWidth: "240px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0 0 20px rgba(255,255,255,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <MovieCard
                        movie={movie}
                        onWatchTrailerClick={handleWatchTrailerClick}
                        onWatchlistClick={handleRemoveFromWatchlist} // Pass remove handler here
                        isOnWatchlistPage={true} // Indicate it's the watchlist page
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">
                  You haven't added any movies to your watchlist yet.
                </p>
              )}
            </div>
          )}

          {/* --- UPDATED Recommendations Tab Content --- */}
         {activeTab === 'recommendations' && (
  <div style={{ width: "100%", textAlign: "center" }}>
    {recommendations.length > 0 && recSourceMovie ? (
      !showAllRecommendations ? (
        // ---- ROW VIEW ----
        <>
          <h3 style={{ fontSize: "2rem", fontWeight: "800", color: "#fff", marginBottom: "1.5rem" }}>
            Recommendations
          </h3>
          <MovieRow
            title={`Because you like "${recSourceMovie.title}"`}
            movies={recommendations}
            onWatchTrailerClick={handleWatchTrailerClick}
            onWatchlistClick={handleAddToWatchlist}
            onSeeAllClick={() => setShowAllRecommendations(true)}
          />
        </>
      ) : (
        // ---- GRID VIEW ----
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "800",
                color: "#fff",
                margin: 0,
              }}
            >
              All Recommendations
            </h3>
            <button
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid #fff",
                borderRadius: "8px",
                padding: "6px 14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
              onClick={() => setShowAllRecommendations(false)}
            >
              <i className="bi bi-arrow-left me-2"></i>Back to Row
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem",
              alignItems: "start",
              width: "100%",
              margin: "0 auto",
              padding: "0 1rem",
            }}
          >
            {recommendations.map((movie) => (
              <div
                key={movie.id}
                style={{
                  width: "100%",
                  maxWidth: "240px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <MovieCard
                  movie={movie}
                  onWatchTrailerClick={handleWatchTrailerClick}
                  onWatchlistClick={handleAddToWatchlist}
                />
              </div>
            ))}
          </div>
        </>
      )
    ) : (
      <p className="text-muted">Add movies to your watchlist to get recommendations.</p>
    )}
  </div>
)}
          {/* --- END OF UPDATED SECTION --- */}

          {/* Viewing History Tab Content (PASSING PROPS) */}
          {activeTab === "history" && (
            <ActivityFeed
              history={history}
              loading={historyLoading}
              onClearHistory={handleClearHistory}
            />
          )}

          {/* Account Settings Tab Content */}
          {activeTab === "settings" && (
            <div>
              <h3 className="mb-4">Account Settings</h3>
              <ProfileSettings
                userName={userName}
                userBio={userBio}
                onNameUpdate={handleNameUpdate}
                onBioUpdate={handleBioUpdate}
                onPictureUpdate={handlePictureUpdate}
              />
            </div>
          )}
        </div>
      </div>

      {/* Video Modal (used by multiple sections) */}
      <VideoModal
        show={showVideoModal}
        handleClose={handleCloseVideoModal}
        videoKey={currentVideoKey}
      />
    </div>
  );
};

export default Dashboard;

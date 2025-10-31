import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
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

  // --- Activity & History Functions ---

  const logActivity = useCallback(async (movieId, actionType) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await api.post(`/activity/log`, { movieId, actionType });
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
      const res = await api.get(`/activity/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
      // Only show toast if it's not a 401 (handled by fetchDashboardData)
      if (err.response?.status !== 401) {
        toast.error("Could not fetch viewing history.");
      }
    } finally {
      setHistoryLoading(false);
    }
  }, []); // Empty dependency array, this function is stable

  const handleClearHistory = useCallback(async () => {
    if (
      !window.confirm( // Use standard confirm
        "Are you sure you want to clear your entire viewing history? This cannot be undone."
      )
    ) return; // Exit if user cancels

    const token = localStorage.getItem("token");
    if (!token) return; // Added check just in case
    try {
      const res = await api.delete(`/activity/history`);
      toast.info(res.data.msg);
      setHistory([]); // Clear the history from the UI instantly
    } catch (err) {
      console.error("Error clearing history:", err) // Log the error
      // Check for specific errors if needed, otherwise show generic message
      if (err.response?.status === 401) {
         toast.error("Authentication failed. Please log in again.");
         // Optionally log out here too, consistent with fetchDashboardData
         localStorage.removeItem("token");
         setIsLoggedIn(false);
         navigate("/login");
      } else {
         toast.error(err.response?.data?.msg || "Could not clear history.");
      }
    }
  }, [navigate, setIsLoggedIn]); // Added dependencies

  // --- Initial Data Load Effect ---

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if not logged in
        return;
      }
      setLoading(true); // Ensure loading is true at the start
      try {
        // Fetch user info and watchlist IDs concurrently
        const [userRes, watchlistIdsRes] = await Promise.all([
          api.get(`/auth/user`),
          api.get(`/users/watchlist`),
        ]);

        // Update user profile state
        setUserName(userRes.data.name);
        setUserProfilePicture(userRes.data.profilePicture);
        setUserBio(userRes.data.bio);

        // If watchlist has movies, fetch their details and recommendations
        const watchlistIds = watchlistIdsRes.data || []; // Ensure it's an array
        if (watchlistIds.length > 0) {
          const movieDetailPromises = watchlistIds.map((id) =>
            api.get(`/movies/details/${id}`)
          );
          // Use Promise.allSettled to handle potential errors fetching individual movies
          const movieDetailResults = await Promise.allSettled(movieDetailPromises);
          const movies = movieDetailResults
              .filter(result => result.status === 'fulfilled') // Keep only successful fetches
              .map((res) => res.value.data); // Extract movie data

          setWatchlistMovies(movies);

          // --- THIS IS THE "BECAUSE YOU LIKE" LOGIC ---
          // Fetch recommendations based on a random movie from the watchlist
          if (movies.length > 0) {
            const randomMovie =
              movies[Math.floor(Math.random() * movies.length)];
            setRecSourceMovie(randomMovie);
            // This calls the standard TMDB recommendations, not your ML server
            const recRes = await api.get(`/movies/recommendations/${randomMovie.id}`);
            
            // --- FIX FOR DUPLICATE KEY WARNING ---
            // Filter out duplicate movies from the recommendations array
            const uniqueMovies = recRes.data.filter((movie, index, self) =>
              index === self.findIndex((m) => m.id === movie.id)
            );
            setRecommendations(uniqueMovies);
            // --- END FIX ---

          } else {
             setRecommendations([]); // Clear recommendations if no movies loaded
             setRecSourceMovie(null);
          }
          // --- END "BECAUSE YOU LIKE" LOGIC ---

        } else {
          setWatchlistMovies([]); // Ensure watchlist is empty if no IDs found
          setRecommendations([]); // Clear recommendations if watchlist is empty
          setRecSourceMovie(null);
        }
        // Fetch history only after successful initial data load
        fetchHistory();

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // --- MODIFIED CATCH BLOCK ---
        // Check if the error is specifically a 401 Unauthorized
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login");
        } else {
          // For any other error, show a message but don't log out
          toast.error(err.response?.data?.msg || "Failed to load dashboard data. Please try again later.");
           // Optional: You might want to clear some state here if data loading failed partially
           setWatchlistMovies([]);
           setRecommendations([]);
           setRecSourceMovie(null);
           setHistory([]); // Clear history if initial load fails
        }
        // --- END OF MODIFIED CATCH BLOCK ---
      } finally {
        setLoading(false); // Stop loading state
        // fetchHistory(); // Moved inside successful try block
      }
    };
    fetchDashboardData();
  }, [navigate, setIsLoggedIn, fetchHistory]); // fetchHistory added as dependency

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
      // Ensure movieId is valid before proceeding
      if (!movieId) {
         console.error("handleWatchTrailerClick called with invalid movieId:", movieId);
         toast.error("Could not load trailer for this item.");
         return;
      }
      await logActivity(movieId, "trailer_watch"); // Log first
      // This calls your backend: router.get('/:movieId/videos', ...)
      const res = await api.get(`/movies/${movieId}/videos`); 
      
      // Your backend already finds the trailer, so res.data is the trailer object
      const trailer = res.data; 

      if (trailer && trailer.key) {
        setCurrentVideoKey(trailer.key); // <-- Set the key
        setShowVideoModal(true); // <-- Show the modal
        fetchHistory(); // This will now run AFTER the log is saved and modal shown
      } else {
        toast.info("No trailer available for this movie."); // Inform if no key found
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
       if (err.response?.status === 401) { // Handle auth error
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login");
       } else {
          toast.error(err.response?.data?.msg || "Could not load trailer.");
       }
      setCurrentVideoKey(null); // Ensure key is null on error
    }
  };

  // --- THIS IS THE TRAILER BUG FIX ---
  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoKey(null); // <-- Resets the video key
  };

  const handleAddToWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      return;
    }
    // Ensure movie object and id exist
    if (!movie || !movie.id) {
       console.error("handleAddToWatchlist called with invalid movie object:", movie);
       toast.error("Could not add item to watchlist.");
       return;
    }
    try {
      const res = await api.post(`/users/watchlist/${movie.id}`, {});
      toast.success(res.data.msg);

      if (res.data.msg && res.data.msg.includes("added")) {
         // Add only if not already present to avoid duplicates
         setWatchlistMovies((prevMovies) => {
             if (prevMovies.find(m => m.id === movie.id)) {
                 return prevMovies; // Already exists, don't add again
             }
             return [movie, ...prevMovies];
         });
        await logActivity(movie.id, "watchlist_add"); // Log after success
        fetchHistory(); // This will now run AFTER the log is saved
      } else if (res.data.msg && res.data.msg.includes("removed")) {
         // Also handle removal if API toggles
         setWatchlistMovies((prevMovies) => prevMovies.filter((m) => m.id !== movie.id));
         // Optionally log removal here too
      }
    } catch (err) {
       console.error("Error updating watchlist:", err); // Log the error
       if (err.response?.status === 401) { // Handle auth error
          toast.error("Authentication failed. Please log in again.");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login");
       } else {
          toast.error(err.response?.data?.msg || "Could not update watchlist.");
       }
    }
  };

  const handleRemoveFromWatchlist = async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) return; // Added check
    // Ensure movie object and id exist
    if (!movie || !movie.id) {
       console.error("handleRemoveFromWatchlist called with invalid movie object:", movie);
       toast.error("Could not remove item from watchlist.");
       return;
    }
    try {
      // Assuming the same endpoint toggles add/remove
      const res = await api.post(`/users/watchlist/${movie.id}`, {});
      setWatchlistMovies((prevMovies) =>
        prevMovies.filter((m) => m.id !== movie.id)
      ); // Update UI instantly
      toast.info(res.data.msg || "Movie removed from your watchlist."); // Use msg from response
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error("Error removing from watchlist:", err);
       if (err.response?.status === 401) { // Handle auth error
          toast.error("Authentication failed. Please log in again.");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login");
       } else {
          toast.error(err.response?.data?.msg || "Could not remove movie.");
       }
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
    <div className="container mt-4" style={{ color: "white" }}> {/* Added mt-4 for spacing */}
      {/* Header section with profile picture, name, and bio */}
      <div className="d-flex align-items-center mb-4 border-bottom pb-3"> {/* Increased mb */}
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
        <div className="col-md-3 mb-4 mb-md-0"> {/* Added mb for small screens */}
          <ul className="nav nav-pills flex-column bg-dark p-3 rounded-3 shadow-sm"> {/* Added shadow */}
            <li className="nav-item">
              <button
                className={`nav-link text-start w-100 ${
                  activeTab === "watchlist" ? "active btn-primary" : "text-light" // Ensure active has background
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
                  activeTab === "recommendations" ? "active btn-primary" : "text-light"
                }`}
                onClick={() => setActiveTab("recommendations")}
              >
                <i className="bi bi-magic me-2"></i> For You
              </button>
            </li>
            <li className="nav-item mt-2">
              <button
                className={`nav-link text-start w-100 ${
                  activeTab === "history" ? "active btn-primary" : "text-light"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <i className="bi bi-clock-history me-2"></i> Viewing History
              </button>
            </li>
            <li className="nav-item mt-2">
              <button
                className={`nav-link text-start w-100 ${
                  activeTab === "settings" ? "active btn-primary" : "text-light"
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
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
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
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <MovieCard
                         movie={movie}
                         onWatchTrailerClick={handleWatchTrailerClick}
                         onWatchlistClick={handleRemoveFromWatchlist}
                         isOnWatchlistPage={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mt-3">
                  You haven't added any movies to your watchlist yet. Explore and add some!
                </p>
              )}
            </div>
          )}


          {/* --- "BECAUSE YOU LIKE" Recommendations Tab Content --- */}
         {activeTab === 'recommendations' && (
  <div style={{ width: "100%", textAlign: "center" }}>
    
    {/* This logic checks that recommendations exist AND we have a source movie to name */}
    {recommendations.length > 0 && recSourceMovie ? (
      !showAllRecommendations ? (
        // ---- ROW VIEW ----
        <>
          <h3 style={{ fontSize: "2rem", fontWeight: "800", color: "#fff", marginBottom: "1.5rem" }}>
            Recommendations
          </h3>
          <MovieRow
            // This title uses the random movie's name
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
                fontWeight: "700",
                color: "#fff",
                margin: 0,
              }}
            >
              {/* This title also uses the random movie's name */}
              All Recommendations (Based on "{recSourceMovie.title}")
            </h3>
            <button
               className="btn btn-sm btn-outline-light"
               style={{
                  transition: "all 0.3s ease",
               }}
               onClick={() => setShowAllRecommendations(false)}
            >
              <i className="bi bi-arrow-left me-2"></i>Back to Row
            </button>
          </div>

          <div
            style={{
               display: "grid",
               gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
               gap: "1rem",
               alignItems: "start",
               width: "100%",
               margin: "0 auto",
            }}
          >
            {recommendations.map((movie) => (
               <MovieCard
                  key={movie.id}
                  movie={movie}
                  onWatchTrailerClick={handleWatchTrailerClick}
                  onWatchlistClick={handleAddToWatchlist}
               />
            ))}
          </div>
        </>
      )
    ) : (
      <p className="text-muted mt-3">Add movies to your watchlist to get personalized recommendations.</p>
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
                userProfilePicture={userProfilePicture}
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


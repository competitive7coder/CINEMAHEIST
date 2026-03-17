import React from "react";
import LoadingSpinner from "../common/LoadingSpinner";

const ActivityFeed = ({ history, loading, onClearHistory }) => {
  const renderActivity = (activity) => {
    if (!activity || !activity.movie_title) return null;

    const timeAgo = new Date(activity.timestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const posterUrl = activity.movie_poster_path
      ? `https://image.tmdb.org/t/p/w92${activity.movie_poster_path}`
      : "https://via.placeholder.com/50x75";

    let actionText = "";
    let icon = "";

    switch (activity.action_type) {
      case "watchlist_add":
        actionText = `Added "${activity.movie_title}" to watchlist`;
        icon = "bi-bookmark-plus-fill text-success";
        break;

      case "watchlist_remove":
        actionText = `Removed "${activity.movie_title}" from watchlist`;
        icon = "bi-bookmark-dash-fill text-danger";
        break;

      case "trailer_watch":
        actionText = `Watched trailer for "${activity.movie_title}"`;
        icon = "bi-play-circle-fill text-primary";
        break;

      default:
        actionText = `Activity on "${activity.movie_title}"`;
        icon = "bi-activity text-secondary";
    }

    return (
      <li
        key={activity._id}
        className="list-group-item bg-dark text-light d-flex align-items-center border-secondary"
      >
        <img
          src={posterUrl}
          alt={activity.movie_title}
          className="rounded me-3"
          style={{ width: "50px", height: "75px", objectFit: "cover" }}
        />

        <div className="flex-grow-1">
          <p className="mb-0">
            <i className={`bi ${icon} me-2`}></i>
            {actionText}
          </p>

          <div style={{ marginTop: "4px" }}>
            <small style={{ color: "#9ca3af", fontSize: "12px" }}>
              {timeAgo}
            </small>
          </div>
        </div>
      </li>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Viewing History</h3>

        {history.length > 0 && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={onClearHistory}
          >
            <i className="bi bi-trash-fill me-2"></i>
            Clear History
          </button>
        )}
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <ul className="list-group">{history.map(renderActivity)}</ul>
      ) : (
        <p className="text-secondary">
          Your viewing history is empty. Actions like watching trailers or
          adding movies to your watchlist will appear here.
        </p>
      )}
    </div>
  );
};

export default ActivityFeed;

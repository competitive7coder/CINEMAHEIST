import React from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { BsFillTrashFill } from 'react-icons/bs'


const formatTimeAgo = (dateInput) => {
  if (!dateInput) return "Unknown time";
  
  let formatted = dateInput;
  if (typeof formatted === "string") {
    // Replace space with 'T' for safari/mobile compatibility
    formatted = formatted.replace(" ", "T");
    
    // Check timezone offset in the time component (after 'T') to avoid matching date hyphens
    const parts = formatted.split("T");
    if (parts.length > 1) {
      const timePart = parts[1];
      const hasTimezone = formatted.endsWith("Z") || timePart.includes("+") || timePart.includes("-");
      if (!hasTimezone) {
        formatted = formatted + "Z";
      }
    } else {
      if (!formatted.endsWith("Z")) {
        formatted = formatted + "Z";
      }
    }
  }

  let date = new Date(formatted);
  if (isNaN(date.getTime())) {
    return "Just now";
  }

  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  // If time is negative or less than a minute (handles small client/server clock drifts)
  if (seconds < 60) return "Just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ActivityFeed = ({ history, loading, onClearHistory }) => {
  const renderActivity = (activity) => {
    if (!activity || !activity.movie_title) return null;

    let formatted = activity.timestamp;
    if (typeof formatted === "string") {
      formatted = formatted.replace(" ", "T");
      const parts = formatted.split("T");
      if (parts.length > 1) {
        const timePart = parts[1];
        const hasTimezone = formatted.endsWith("Z") || timePart.includes("+") || timePart.includes("-");
        if (!hasTimezone) {
          formatted = formatted + "Z";
        }
      } else if (!formatted.endsWith("Z")) {
        formatted = formatted + "Z";
      }
    }
    const parsedDate = new Date(formatted);
    const timeAgo = formatTimeAgo(activity.timestamp);
    const absoluteDate = !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    const posterUrl = activity.movie_poster_path
      ? `https://image.tmdb.org/t/p/w92${activity.movie_poster_path}`
      : "https://via.placeholder.com/50x75";

    let actionText = "";
    let icon = "";

    switch (activity.action_type) {
      case "added_to_watchlist":
        actionText = `Added "${activity.movie_title}" to watchlist`;
        icon = "bi-bookmark-plus-fill text-success";
        break;

      case "removed_from_watchlist":
        actionText = `Removed "${activity.movie_title}" from watchlist`;
        icon = "bi-bookmark-dash-fill text-danger";
        break;

      case "trailer_watch":
        actionText = `Watched trailer for "${activity.movie_title}"`;
        icon = "bi-play-circle-fill text-primary";
        break;

      case "search_click":
        actionText = `Viewed "${activity.movie_title}"`;
        icon = "bi-eye-fill text-info";
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
              {timeAgo} {absoluteDate && `• ${absoluteDate}`}
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
<BsFillTrashFill className="me-2" />
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
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

// This component now receives all its data and functions as props
const ActivityFeed = ({ history, loading, onClearHistory }) => {

    const renderActivity = (activity) => {
        // Handle potential missing data
        if (!activity || !activity.movieTitle) {
            return null;
        }

        const timeAgo = new Date(activity.timestamp).toLocaleString();
        const posterUrl = activity.moviePosterPath ? `https://image.tmdb.org/t/p/w92${activity.moviePosterPath}` : 'https://via.placeholder.com/50x75?text=N/A';
        
        let actionText = '';
        let icon = '';
        
        if (activity.actionType === 'watchlist_add') {
            actionText = `You added "${activity.movieTitle}" to your watchlist.`;
            icon = 'bi-plus-circle-fill text-success';
        } else if (activity.actionType === 'trailer_watch') {
            actionText = `You watched the trailer for "${activity.movieTitle}".`;
            icon = 'bi-play-circle-fill text-primary';
        } else {
            // Fallback for any other unknown activity types
            actionText = `You performed an action with "${activity.movieTitle}".`;
            icon = 'bi-gear-fill text-muted';
        }

        return (
            <li key={activity._id} className="list-group-item bg-dark text-light d-flex align-items-center border-secondary">
                <img src={posterUrl} alt="" className="rounded me-3" style={{width: '50px', height: '75px', objectFit: 'cover'}} />
                <div className="flex-grow-1">
                    <p className="mb-0"><i className={`bi ${icon} me-2`}></i>{actionText}</p>
                    <small className="text-muted">{timeAgo}</small>
                </div>
            </li>
        );
    };

    if (loading) {
         return <LoadingSpinner />;
    }
    
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Viewing History</h3>
                {history.length > 0 && (
                    // This button now calls the onClearHistory prop from Dashboard.js
                    <button className="btn btn-outline-danger btn-sm" onClick={onClearHistory}>
                        <i className="bi bi-trash-fill me-2"></i>Clear History
                    </button>
                )}
            </div>
            {history.length > 0 ? (
                <ul className="list-group">
                    {history.map(renderActivity)}
                </ul>
            ) : (
                <p className="text-muted">Your viewing history is empty. Actions like adding to watchlist or watching trailers will appear here.</p>
            )}
        </div>
    );
};

export default ActivityFeed;
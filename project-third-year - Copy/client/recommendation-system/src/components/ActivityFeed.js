import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';

const ActivityFeed = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your setup

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
             setLoading(false); // No token, stop loading
             return; // Can't fetch history if not logged in
        }
        try {
            const res = await axios.get(`${API_BASE_URL}/activity/history`, { headers: { 'x-auth-token': token } });
            setHistory(res.data);
        } catch (err) {
            console.error('Error fetching history:', err);
            toast.error("Could not fetch viewing history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear your entire viewing history? This cannot be undone.')) {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.delete(`${API_BASE_URL}/activity/history`, { headers: { 'x-auth-token': token } });
                toast.info(res.data.msg);
                setHistory([]); // Clear the history from the UI instantly
            } catch (err) {
                toast.error('Could not clear history.');
            }
        }
    };

    const renderActivity = (activity) => {
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
                    <button className="btn btn-outline-danger btn-sm" onClick={handleClearHistory}>
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
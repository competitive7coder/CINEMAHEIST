import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ setIsLoggedIn }) => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    // Fetch user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get token from local storage
                const token = localStorage.getItem('token');
                if (!token) {
                    // If no token, redirect to login
                    navigate('/login');
                    return;
                }

                // API call to get user data
                const res = await axios.get('http://localhost:5000/api/auth/user', {
                    headers: {
                        'x-auth-token': token,
                    },
                });

                // Set user name from the response
                setUserName(res.data.name);
            } catch (err) {
                console.error('Error fetching user data:', err);
                // If token is invalid or expired, remove it and redirect
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate, setIsLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div style={{  paddingTop: '100px', backgroundColor: '#000000ff', minHeight: '100vh', color: '#fff' }}>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                {/* Display the user's name in the header */}
                <h1 className="h2">Welcome, {userName || 'User'}!</h1>
            </div>

            <p>This is your personal dashboard. Here you can manage your account and activities.</p>

            {/* Card layout for dashboard items */}
            <div className="row g-4 mt-3">
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-person-circle fs-1 text-primary"></i>
                            <h5 className="card-title mt-3">Profile Settings</h5>
                            <p className="card-text">Update your name, email, and password.</p>
                            <button className="btn btn-outline-primary">Go to Profile</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-bar-chart-line-fill fs-1 text-success"></i>
                            <h5 className="card-title mt-3">My Activity</h5>
                            <p className="card-text">View your recent activity and statistics.</p>
                            <button className="btn btn-outline-success">View Stats</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-envelope-fill fs-1 text-warning"></i>
                            <h5 className="card-title mt-3">Messages</h5>
                            <p className="card-text">Check your inbox for new messages.</p>
                            <button className="btn btn-outline-warning">Check Inbox</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout button at the bottom */}
            <div className="mt-5 text-center">
                <button onClick={handleLogout} className="btn btn-danger btn-lg">
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
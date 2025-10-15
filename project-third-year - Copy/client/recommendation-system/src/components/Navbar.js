import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; 

// Accept isLoggedIn and setIsLoggedIn as props
const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from storage
        setIsLoggedIn(false); // Update the state in App.js
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    AuthProject
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                Home
                            </NavLink>
                        </li>
                        {/* If logged in, show a link to the Dashboard */}
                        {isLoggedIn && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dashboard">
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* --- THIS IS THE MODIFIED PART --- */}
                    <div className="d-flex">
                        {isLoggedIn ? (
                            // If logged in, show Logout button
                            <button onClick={handleLogout} className="btn btn-outline-light">
                                Logout
                            </button>
                        ) : (
                            // If not logged in, show Login and Sign Up buttons
                            <>
                                <Link to="/login" className="btn btn-outline-light me-2">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
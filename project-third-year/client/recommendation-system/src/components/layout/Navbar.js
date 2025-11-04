import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// ... (all your Fa icons) ...
import {
    FaSearch,
    FaUser,
    FaFistRaised,
    FaCompass,
    FaSmile,
    FaLaugh,
    FaUserSecret,
    FaTheaterMasks,
    FaGhost,
    FaHeart,
    FaRocket,
    FaEye,
} from "react-icons/fa";


const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate(); 
    const [searchQuery, setSearchQuery] = useState(''); 

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate('/'); // This is now correct, it will go to PublicHome
    };

    const genres = [
        { name: "Action", icon: <FaFistRaised className="text-danger" />, path: "/genre/28" },
        { name: "Adventure", icon: <FaCompass className="text-info" />, path: "/genre/12" },
        { name: "Animation", icon: <FaSmile className="text-warning" />, path: "/genre/16" },
        { name: "Comedy", icon: <FaLaugh className="text-success" />, path: "/genre/35" },
        { name: "Crime", icon: <FaUserSecret className="text-secondary" />, path: "/genre/80" },
        { name: "Drama", icon: <FaTheaterMasks className="text-light" />, path: "/genre/18" },
        { name: "Horror", icon: <FaGhost className="text-danger" />, path: "/genre/27" },
        { name: "Romance", icon: <FaHeart style={{color: 'pink'}} />, path: "/genre/10749" },
        { name: "Science Fiction", icon: <FaRocket className="text-primary" />, path: "/genre/878" },
        { name: "Thriller", icon: <FaEye className="text-warning" />, path: "/genre/53" },
    ];

    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery(''); 
        }
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark bg-black fixed-top shadow-sm"
            style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.5px" }}
        >
            <div className="container-fluid">
                {/* Brand Link */}
                <Link className="navbar-brand fs-4 fw-bold text-danger" to={isLoggedIn ? "/home" : "/"}>
                    🎬 StreamHub
                </Link>

                {/* Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Content */}
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    {/* Left Links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/home">
                                Home
                            </NavLink>
                        </li>

                        {/* Movies Dropdown */}
                        <li className="nav-item dropdown position-static">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="moviesDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Movies
                            </a>
                            <div
                                className="dropdown-menu w-100 mt-0 position-absolute start-0"
                                aria-labelledby="moviesDropdown"
                                style={{ backgroundColor: "#111", border: "none", boxShadow: "0 8px 20px rgba(0,0,0,0.8)", padding: "20px 80px" }}
                            >
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                                    {genres.map((genre) => (
                                        <Link
                                            key={genre.name}
                                            to={genre.path}
                                            className="dropdown-item d-flex align-items-center justify-content-center"
                                            style={{ color: "#ccc", fontWeight: "500", padding: "10px", borderRadius: "8px", transition: "0.3s" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0d6efd20"; e.currentTarget.style.color = "#0d6efd"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ccc"; }}
                                        >
                                            <span className="me-2">{genre.icon}</span>
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">
                                About Us
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">
                                Contact Us
                            </NavLink>
                        </li>
                    </ul>
                    
                    {/* Right Side */}
                    <ul className="navbar-nav ms-auto d-flex align-items-lg-center">
                        {/* Search Bar */}
                        <li className="nav-item me-2">
                            <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                                <div className="input-group">
                                    <input
                                        className="form-control form-control-sm bg-dark text-white border-secondary"
                                        type="search"
                                        placeholder="Search Titles"
                                        aria-label="Search"
                                        value={searchQuery}
                                        // =================== THIS IS THE FIX ===================
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                        // =======================================================
                                    />
                                    <button type="submit" className="input-group-text bg-dark border-secondary">
                                        <FaSearch className="text-white" />
                                    </button>
                                </div>
                            </form>
                        </li>

                        {/* User Section */}
                        {isLoggedIn ? (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <FaUser className="fs-5 ms-lg-3" />
                                </a>
                                <ul
                                    className="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                                    aria-labelledby="userDropdown"
                                >
                                    <li>
                                        <Link className="dropdown-item" to="/dashboard">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-3 my-2 my-lg-0">
                                    <Link to="/login" className="btn btn-outline-light btn-sm">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item ms-lg-2 my-2 my-lg-0">
                                    <Link to="/signup" className="btn btn-primary btn-sm">
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
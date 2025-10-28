import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import PublicHome from './components/PublicHome'; 
//Protected Pages
import HomePage from './components/HomePage'; 
import Dashboard from './components/Dashboard';
import GenrePage from './components/GenrePage';
import SearchPage from './components/SearchPage'; 
import MovieDetailPage from './components/MovieDetailPage';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import FAQ from './footer/FAQ';
import PrivacyPolicy from './footer/PrivacyPolicy';
import TermsOfService from './footer/TermsOfService';
import CareersPage from './footer/CareersPage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token on initial app load
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
      
      <Routes>
        
        {/* ================================================================== */}
        {/* === GROUP 1: PUBLIC ROUTES (No Navbar/Footer, Logged-Out) === */}
        {/* ================================================================== */}

        {/* The public homepage. If you're logged in, redirect to /home. */}
        <Route 
          path="/" 
          element={!isLoggedIn ? <PublicHome /> : <Navigate to="/home" />} 
        />
        {/* The login page. If you're logged in, redirect to /home. */}
        <Route 
          path="/login" 
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/home" />} 
        />
        {/* The signup page. If you're logged in, redirect to /home. */}
        <Route 
          path="/signup" 
          element={!isLoggedIn ? <Signup /> : <Navigate to="/home" />} 
        />

        {/* =================================================================== */}
        {/* === GROUP 2: PROTECTED ROUTES (With Navbar/Footer, Logged-In) === */}
        {/* =================================================================== */}

        {/* This parent route is the protector. 
          If logged in, it renders MainLayout (Navbar/Footer).
          If not logged in, it redirects to the public homepage (/).
        */}
        <Route 
          element={isLoggedIn ? <MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        >
          <Route exact path="/home" element={<HomePage />} />
          <Route exact path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route exact path="/genre/:genreId" element={<GenrePage />} />
          <Route exact path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route exact path="/search" element={<SearchPage />} />
          <Route exact path="/contact" element={<ContactUs />} />
          <Route exact path="/about" element={<AboutUs />} />
          <Route exact path="/FAQ" element={<FAQ />} />
          <Route exact path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route exact path="/TermsOfService" element={<TermsOfService />} />
          <Route exact path="/careers" element={<CareersPage />} />
        </Route>
        
        {/* Catch-all route to redirect unknown paths */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />

      </Routes>
    </Router>
  );
}

export default App;
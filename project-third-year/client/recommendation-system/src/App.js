import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- FIXED IMPORTS (assuming new structure) ---
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicHome from './pages/PublicHome'; 
import HomePage from './pages/HomePage'; 
import Dashboard from './pages/Dashboard';
import GenrePage from './pages/GenrePage';
import SearchPage from './pages/SearchPage'; 
import MovieDetailPage from './pages/MovieDetailPage';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
// --- END FIXED IMPORTS ---

// --- NEW PAGE IMPORTS ---
import ResetPassword from './components/auth/ResetPassword'; // <-- ADD THIS
import FAQ from './footer/FAQ';
import PrivacyPolicy from './footer/PrivacyPolicy';
import TermsOfService from './footer/TermsOfService';
import CareersPage from './footer/CareersPage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []); 

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

        <Route 
          path="/" 
          element={!isLoggedIn ? <PublicHome /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/login" 
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/signup" 
          element={!isLoggedIn ? <Signup /> : <Navigate to="/home" />} 
        />
        
        {/* --- ADD THIS NEW ROUTE --- */}
        <Route 
          path="/reset-password/:token" 
          element={!isLoggedIn ? <ResetPassword /> : <Navigate to="/home" />}
        />


        {/* =================================================================== */}
        {/* === GROUP 2: PROTECTED ROUTES (With Navbar/Footer, Logged-In) === */}
        {/* =================================================================== */}

        <Route 
          element={isLoggedIn ? <MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/genre/:genreId" element={<GenrePage />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/careers" element={<CareersPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />

      </Routes>
    </Router>
  );
}

export default App;



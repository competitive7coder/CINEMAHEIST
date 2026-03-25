import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import ResetPassword from './components/auth/ResetPassword';
import FAQ from './footer/FAQ';
import DMCA from './footer/Dmca';
import PrivacyPolicy from './footer/PrivacyPolicy';
import TermsOfUse from './footer/Termsofuse';
import Disclaimer from './footer/Disclaimer';



function App() {
  // Synchronous init — no useEffect, no re-render, no CLS
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Routes>

        {/* ================================================================== */}
        {/* === GROUP 1: AUTH ROUTES (redirect if already logged in) ========= */}
        {/* ================================================================== */}

        <Route path="/"
          element={!isLoggedIn ? <PublicHome /> : <Navigate to="/home" />}
        />
        <Route path="/login"
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/home" />}
        />
        <Route path="/signup"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/home" />}
        />
        <Route path="/reset-password/:token"
          element={!isLoggedIn ? <ResetPassword /> : <Navigate to="/home" />}
        />

        {/* ================================================================== */}
        {/* === GROUP 2: PUBLIC ROUTES (Navbar + Footer, no login needed) ==== */}
        {/* ================================================================== */}

        <Route
          element={<MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        >
          <Route path="/home"           element={<HomePage />} />
          <Route path="/genre/:genreId" element={<GenrePage />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="/search"         element={<SearchPage />} />
          <Route path="/contact"        element={<ContactUs />} />
          <Route path="/about"          element={<AboutUs />} />
          <Route path="/faq"            element={<FAQ />} />
          <Route path="/FAQ"            element={<FAQ />} />
          <Route path="/dmca"           element={<DMCA />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />
          <Route path="/terms"          element={<TermsOfUse />} />
          <Route path="/disclaimer"     element={<Disclaimer />} />
        </Route>

        {/* ================================================================== */}
        {/* === GROUP 3: PROTECTED ROUTES (Login required) =================== */}
        {/* ================================================================== */}

        <Route path="/dashboard"
          element={isLoggedIn
            ? <Dashboard setIsLoggedIn={setIsLoggedIn} />
            : <Navigate to="/login" state={{ from: '/dashboard' }} />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />

      </Routes>
    </Router>
  );
}

export default App;
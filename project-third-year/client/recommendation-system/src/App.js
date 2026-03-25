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
import Footer from './footer/Footer';

// Wrapper for public legal pages — adds Footer, sticks it to bottom
const PublicPageWithFooter = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#000' }}>
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);

function App() {
  // ✅ FIX: synchronous init — no useEffect, no re-render, no CLS
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />

      <Routes>

        {/* ================================================================== */}
        {/* === GROUP 1: PUBLIC ROUTES (No Navbar/Footer, Logged-Out only) === */}
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
        {/* === GROUP 2: LEGAL ROUTES (Public — no login required) =========== */}
        {/* ================================================================== */}

        <Route path="/dmca"       element={<PublicPageWithFooter><DMCA /></PublicPageWithFooter>} />
        <Route path="/privacy"    element={<PublicPageWithFooter><PrivacyPolicy /></PublicPageWithFooter>} />
        <Route path="/terms"      element={<PublicPageWithFooter><TermsOfUse /></PublicPageWithFooter>} />
        <Route path="/disclaimer" element={<PublicPageWithFooter><Disclaimer /></PublicPageWithFooter>} />
        <Route path="/faq"        element={<PublicPageWithFooter><FAQ /></PublicPageWithFooter>} />

        {/* ================================================================== */}
        {/* === GROUP 3: PROTECTED ROUTES (Navbar + Footer, Login required) == */}
        {/* ================================================================== */}

        <Route
          element={isLoggedIn
            ? <MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            : <Navigate to="/" />
          }
        >
          <Route path="/home"           element={<HomePage />} />
          <Route path="/dashboard"      element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/genre/:genreId" element={<GenrePage />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="/search"         element={<SearchPage />} />
          <Route path="/contact"        element={<ContactUs />} />
          <Route path="/about"          element={<AboutUs />} />
          <Route path="/FAQ"            element={<FAQ />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />

      </Routes>
    </Router>
  );
}

export default App;
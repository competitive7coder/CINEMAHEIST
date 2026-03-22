import React, { useState, useEffect } from 'react';
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
// import CareersPage from './footer/CareersPage';      // kept — move to pages/footer/ if needed

// Legal pages — public, no login required
import DMCA from './footer/Dmca';
import PrivacyPolicy from './footer/PrivacyPolicy';
import TermsOfUse from './footer/Termsofuse';
import Disclaimer from './footer/Disclaimer';


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
        {/* === GROUP 1: PUBLIC ROUTES (No Navbar/Footer, Logged-Out) ======== */}
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
        <Route
          path="/reset-password/:token"
          element={!isLoggedIn ? <ResetPassword /> : <Navigate to="/home" />}
        />

        {/* ================================================================== */}
        {/* === GROUP 2: LEGAL ROUTES (Public — no login required) =========== */}
        {/* Legal pages must be public so DMCA bots/studios can always reach   */}
        {/* them without needing an account.                                    */}
        {/* ================================================================== */}

        <Route path="/dmca"       element={<DMCA />} />
        <Route path="/privacy"    element={<PrivacyPolicy />} />
        <Route path="/terms"      element={<TermsOfUse />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/faq"        element={<FAQ />} />

        {/* Legacy footer routes — kept for backward compatibility */}
        {/* <Route path="/PrivacyPolicy"   element={<PrivacyPolicy />} /> */}
        {/* <Route path="/TermsOfService"  element={<TermsOfUse />} />   */}


        {/* =================================================================== */}
        {/* === GROUP 3: PROTECTED ROUTES (With Navbar/Footer, Logged-In) ==== */}
        {/* =================================================================== */}

        <Route
          element={isLoggedIn ? <MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        >
          <Route path="/home"              element={<HomePage />} />
          <Route path="/dashboard"         element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/genre/:genreId"    element={<GenrePage />} />
          <Route path="/movie/:movieId"    element={<MovieDetailPage />} />
          <Route path="/search"            element={<SearchPage />} />
          <Route path="/contact"           element={<ContactUs />} />
          <Route path="/about"             element={<AboutUs />} />
          <Route path="/FAQ"            element={<FAQ />} />
          {/* <Route path="/careers"        element={<CareersPage />} /> */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} />} />

      </Routes>
    </Router>
  );
}

export default App;
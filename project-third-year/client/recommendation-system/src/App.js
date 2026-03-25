import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/layout/MainLayout';

// Lazy-loaded pages — each becomes its own chunk
const Login           = lazy(() => import('./pages/Login'));
const Signup          = lazy(() => import('./pages/Signup'));
const PublicHome      = lazy(() => import('./pages/PublicHome'));
const HomePage        = lazy(() => import('./pages/HomePage'));
const Dashboard       = lazy(() => import('./pages/Dashboard'));
const GenrePage       = lazy(() => import('./pages/GenrePage'));
const SearchPage      = lazy(() => import('./pages/SearchPage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const ContactUs       = lazy(() => import('./pages/ContactUs'));
const AboutUs         = lazy(() => import('./pages/AboutUs'));
const ResetPassword   = lazy(() => import('./components/auth/ResetPassword'));
const FAQ             = lazy(() => import('./footer/FAQ'));
const DMCA            = lazy(() => import('./footer/Dmca'));
const PrivacyPolicy   = lazy(() => import('./footer/PrivacyPolicy'));
const TermsOfUse      = lazy(() => import('./footer/Termsofuse'));
const Disclaimer      = lazy(() => import('./footer/Disclaimer'));

// Minimal black fallback — matches your app background, zero CLS
const PageFallback = () => (
  <div style={{ background: '#000', minHeight: '100vh' }} />
);

function App() {
  // Synchronous init — no useEffect, no re-render, no CLS
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Suspense fallback={<PageFallback />}>
        <Routes>

          {/* ================================================================== */}
          {/* === GROUP 1: AUTH ROUTES (redirect if already logged in) ========= */}
          {/* ================================================================== */}

          <Route path="/"
            element={!isLoggedIn ? <PublicHome setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/home" />}
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
      </Suspense>
    </Router>
  );
}

export default App;
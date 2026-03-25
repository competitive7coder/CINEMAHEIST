import React, { useState, Suspense, lazy, useEffect, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Toast 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ===============================
// Lazy-loaded routes (grouped)
// ===============================
const PublicHome      = lazy(() => import('./pages/PublicHome'));
const HomePage        = lazy(() => import('./pages/HomePage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));

const Login           = lazy(() => import('./pages/Login'));
const Signup          = lazy(() => import('./pages/Signup'));
const ResetPassword   = lazy(() => import('./components/auth/ResetPassword'));

const Dashboard       = lazy(() => import('./pages/Dashboard'));
const GenrePage       = lazy(() => import('./pages/GenrePage'));
const SearchPage      = lazy(() => import('./pages/SearchPage'));

const ContactUs       = lazy(() => import('./pages/ContactUs'));
const AboutUs         = lazy(() => import('./pages/AboutUs'));

const FAQ             = lazy(() => import('./footer/FAQ'));
const DMCA            = lazy(() => import('./footer/Dmca'));
const PrivacyPolicy   = lazy(() => import('./footer/PrivacyPolicy'));
const TermsOfUse      = lazy(() => import('./footer/Termsofuse'));
const Disclaimer      = lazy(() => import('./footer/Disclaimer'));

// ===============================
// Lightweight fallback
// ===============================
const PageFallback = memo(() => (
  <div
    style={{
      background: '#000',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#888'
    }}
  >
    Loading...
  </div>
));

// ===============================
// Error Boundary
// ===============================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          Something went wrong. Please refresh.
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  useEffect(() => {
    import('./pages/HomePage');
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>

          <>
            <Routes>

              {/* Auth routes */}
              <Route
                path="/"
                element={
                  !isLoggedIn
                    ? <PublicHome setIsLoggedIn={setIsLoggedIn} />
                    : <Navigate to="/home" />
                }
              />

              <Route
                path="/login"
                element={
                  !isLoggedIn
                    ? <Login setIsLoggedIn={setIsLoggedIn} />
                    : <Navigate to="/home" />
                }
              />

              <Route
                path="/signup"
                element={
                  !isLoggedIn ? <Signup /> : <Navigate to="/home" />
                }
              />

              <Route
                path="/reset-password/:token"
                element={
                  !isLoggedIn ? <ResetPassword /> : <Navigate to="/home" />
                }
              />

              {/* Main layout routes */}
              <Route
                element={
                  <MainLayout
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                }
              >
                <Route path="/home" element={<HomePage />} />
                <Route path="/genre/:genreId" element={<GenrePage />} />
                <Route path="/movie/:movieId" element={<MovieDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/dmca" element={<DMCA />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
              </Route>

              {/* Protected route */}
              <Route
                path="/dashboard"
                element={
                  isLoggedIn
                    ? <Dashboard setIsLoggedIn={setIsLoggedIn} />
                    : <Navigate to="/login" state={{ from: '/dashboard' }} />
                }
              />

              {/* Fallback */}
              <Route
                path="*"
                element={<Navigate to={isLoggedIn ? "/home" : "/"} />}
              />

            </Routes>

            {/*  Toast global */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="dark"
              newestOnTop
              style={{ zIndex: 999999 }}
            />

          </>

        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
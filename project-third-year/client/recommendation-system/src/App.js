import React, { useState, Suspense, lazy, useEffect, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Toast 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ===============================
// Lazy-loaded routes (with deployment update retry wrapper)
// ===============================
const lazyWithRetry = (componentImport) => 
  lazy(async () => {
    const hasRetried = window.sessionStorage.getItem('retry-lazy');
    try {
      const result = await componentImport();
      window.sessionStorage.removeItem('retry-lazy');
      return result;
    } catch (error) {
      if (!hasRetried) {
        window.sessionStorage.setItem('retry-lazy', 'true');
        window.location.reload();
        return new Promise(() => {}); // Pause execution while reloading page
      }
      throw error;
    }
  });

const PublicHome      = lazyWithRetry(() => import('./pages/PublicHome'));
const HomePage        = lazyWithRetry(() => import('./pages/HomePage'));
const MovieDetailPage = lazyWithRetry(() => import('./pages/MovieDetailPage'));

const Login           = lazyWithRetry(() => import('./pages/Login'));
const Signup          = lazyWithRetry(() => import('./pages/Signup'));
const ResetPassword   = lazyWithRetry(() => import('./components/auth/ResetPassword'));

const Dashboard       = lazyWithRetry(() => import('./pages/Dashboard'));
const GenrePage       = lazyWithRetry(() => import('./pages/GenrePage'));
const SearchPage      = lazyWithRetry(() => import('./pages/SearchPage'));
const AdminDashboard  = lazyWithRetry(() => import('./pages/AdminDashboard'));

const ContactUs       = lazyWithRetry(() => import('./pages/ContactUs'));
const AboutUs         = lazyWithRetry(() => import('./pages/AboutUs'));

const FAQ             = lazyWithRetry(() => import('./footer/FAQ'));
const DMCA            = lazyWithRetry(() => import('./footer/Dmca'));
const PrivacyPolicy   = lazyWithRetry(() => import('./footer/PrivacyPolicy'));
const TermsOfUse      = lazyWithRetry(() => import('./footer/Termsofuse'));
const Disclaimer      = lazyWithRetry(() => import('./footer/Disclaimer'));

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

    // Show PWA install helper toast on first visit
    const hasSeenTip = sessionStorage.getItem("hasSeenInstallTip");
    if (!hasSeenTip) {
      sessionStorage.setItem("hasSeenInstallTip", "true");
      setTimeout(() => {
        toast.info(
          "💡 Pro Tip: Install StreamHub to your phone or PC. On PC, click the 'Install' icon in your browser's address bar. On mobile, tap the browser menu (3-dots in Chrome, or the Share button in iOS Safari) scroll down and select 'Install and Create Shortcut'.",
          {
            position: "top-center",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            style: {
              width: "600px",
              maxWidth: "90vw",
              fontSize: "0.9rem"
            }
          }
        );
      }, 3500); // 3.5 second delay so the page loads first
    }
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          newestOnTop
          style={{ zIndex: 999999 }}
        />
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
                <Route path="/movie/:slug" element={<MovieDetailPage />} />
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

              {/* Admin route */}
              <Route
                path="/admin"
                element={
                  isLoggedIn
                    ? <AdminDashboard />
                    : <Navigate to="/login" state={{ from: '/admin' }} />
                }
              />

              {/* Fallback */}
              <Route
                path="*"
                element={<Navigate to={isLoggedIn ? "/home" : "/"} />}
              />

            </Routes>
          </>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
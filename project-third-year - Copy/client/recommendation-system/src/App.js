import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// 1. Import the ToastContainer and its CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Layouts and Pages
import MainLayout from './components/MainLayout';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import GenrePage from './components/GenrePage';
import SearchPage from './components/SearchPage'; 
import MovieDetailPage from './components/MovieDetailPage'; // <-- IMPORT

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      {/* 2. Add the ToastContainer here for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="dark"
      />
      
      <Routes>
        {/* All routes inside this group will have the Navbar and Footer */}
        <Route element={<MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/genre/:genreId" element={<GenrePage />} />
          <Route path="/movie/:movieId" element={<MovieDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

        {/* These routes are standalone */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
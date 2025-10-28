import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../footer/Footer';

const MainLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#000000ff' }}>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main style={{ flex: 1 }} className="pt-5 mt-4">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
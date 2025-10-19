import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#141414' }}>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {/* ADD PADDING HERE to push content down from the fixed navbar */}
      <main style={{ flex: 1 }} className="pt-5 mt-4">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
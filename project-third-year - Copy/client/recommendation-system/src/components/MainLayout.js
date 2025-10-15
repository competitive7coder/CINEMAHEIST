import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#000000ff' }}>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {/* --- ADD THE CLASSES TO THIS MAIN TAG --- */}
      <main style={{ flex: 1 }} >
        <Outlet /> {/* Child pages will render here */}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
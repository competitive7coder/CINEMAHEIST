import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import {
    FaSearch, FaUser, FaFistRaised, FaCompass, FaSmile,
    FaLaugh, FaUserSecret, FaTheaterMasks, FaGhost,
    FaHeart, FaRocket, FaEye, FaTimes, FaBars,
    FaSignOutAlt, FaTachometerAlt, FaChevronDown,
} from "react-icons/fa";

const fadeSlideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
  50%       { box-shadow: 0 0 12px 2px rgba(255, 0, 0, 0.15); }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  font-family: 'Poppins', sans-serif;
  transform: translateY(${({ $visible }) => $visible ? '0' : '-100%'});
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.4s ease,
              box-shadow 0.4s ease;

  ${({ $scrolled }) => $scrolled ? css`
    background: rgba(5, 5, 5, 0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 4px 30px rgba(0,0,0,0.6);
  ` : css`
    background: linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  `}

  @media (max-width: 768px) { padding: 0 18px; }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;

  .brand-icon {
    width: 32px; height: 32px;
    background: #ff0000;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    animation: ${glowPulse} 4s infinite;
  }

  .brand-name {
    font-size: 1.25rem;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.5px;
    span { color: #ff0000; }
  }
`;

const DesktopLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0 0 0 36px;
  padding: 0;

  @media (max-width: 992px) { display: none; }
`;

const NavItem = styled.li`position: relative;`;

const navLinkStyle = css`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: none;
  border: none;
  font-family: 'Poppins', sans-serif;

  &:hover, &.active {
    color: #fff;
    background: rgba(255,255,255,0.07);
  }
`;

const StyledNavLink = styled(NavLink)`${navLinkStyle}`;
const NavButton = styled.button`${navLinkStyle}`;

const MegaDropdown = styled.div`
  position: fixed;
  top: 68px; left: 0; right: 0;
  background: rgba(8, 8, 8, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 28px 60px;
  z-index: 999;
  animation: ${fadeSlideDown} 0.22s ease;
  display: ${({ $open }) => $open ? 'block' : 'none'};
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 1200px) { grid-template-columns: repeat(4, 1fr); }
`;

const GenreLabel = styled.p`
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ff0000;
  text-transform: uppercase;
  margin-bottom: 16px;
  text-align: center;
`;

const GenreLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255,255,255,0.65);
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  .icon { font-size: 14px; opacity: 0.8; }

  &:hover {
    color: #fff;
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.08);
    transform: translateY(-1px);
  }
`;

const RightSide = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchWrapper = styled.form`
  display: flex;
  align-items: center;
  position: relative;

  @media (max-width: 992px) { display: none; }
`;

const SearchInput = styled.input`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 8px 40px 8px 14px;
  color: #fff;
  font-size: 0.82rem;
  font-family: 'Poppins', sans-serif;
  outline: none;
  transition: all 0.3s ease;
  width: 160px;

  &::placeholder { color: rgba(255,255,255,0.3); }
  &:focus {
    border-color: rgba(255,0,0,0.4);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(255,0,0,0.06);
    width: 240px;
  }
`;

const SearchBtn = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;

  &:hover { color: #ff0000; }
`;

const LoginBtn = styled(Link)`
  padding: 8px 18px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255,255,255,0.5);
    color: #fff;
    background: rgba(255,255,255,0.06);
  }

  @media (max-width: 992px) { display: none; }
`;

const SignupBtn = styled(Link)`
  padding: 8px 18px;
  background: #ff0000;
  border-radius: 10px;
  color: #fff;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background: #e00;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(255,0,0,0.3);
  }

  @media (max-width: 992px) { display: none; }
`;

const UserMenuWrapper = styled.div`
  position: relative;

  /* Hide entirely on mobile — hamburger handles everything */
  @media (max-width: 992px) { display: none; }
`;

const UserBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;

  .avatar {
    width: 26px; height: 26px;
    background: #ff0000;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 180px;
  background: rgba(12, 12, 12, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  animation: ${fadeSlideDown} 0.2s ease;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.15s ease;

  svg { font-size: 13px; }
  &:hover { color: #fff; background: rgba(255,255,255,0.06); }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 4px 0;
`;

const LogoutItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: rgba(255, 80, 80, 0.8);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;

  svg { font-size: 13px; }
  &:hover { color: #ff4444; background: rgba(255,0,0,0.06); }
`;

// ── Mobile only ───────────────────────────────────────────────────────────────
const HamburgerBtn = styled.button`
  display: none;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 10px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.2);
  }

  @media (max-width: 992px) { display: flex; align-items: center; justify-content: center; }
`;

const MobileMenu = styled.div`
  position: fixed;
  inset: 0;
  background: #080808;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: ${fadeIn} 0.25s ease;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
`;

const MobileMenuClose = styled.button`
  width: 38px; height: 38px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover { background: rgba(255,0,0,0.15); border-color: rgba(255,0,0,0.2); color: #ff4444; }
`;

const MobileMenuBody = styled.div`
  flex: 1;
  padding: 8px 0 40px;
  overflow-y: auto;
`;

/* User profile card inside mobile menu */
const MobileUserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 8px;
`;

const MobileAvatar = styled.div`
  width: 44px; height: 44px;
  background: #ff0000;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(229,9,20,0.35);
`;

const MobileUserInfo = styled.div`
  .name {
    font-family: 'Poppins', sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    color: #fff;
  }
  .sub {
    font-family: 'Poppins', sans-serif;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.35);
    margin-top: 2px;
  }
`;

const MobileSearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  overflow: hidden;
  margin: 12px 24px 8px;

  input {
    flex: 1;
    background: none;
    border: none;
    padding: 12px 16px;
    color: #fff;
    font-size: 0.88rem;
    font-family: 'Poppins', sans-serif;
    outline: none;
    &::placeholder { color: rgba(255,255,255,0.25); }
  }

  button {
    background: none;
    border: none;
    padding: 12px 16px;
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    transition: color 0.2s;
    &:hover { color: #ff0000; }
  }
`;

const MobileSectionLabel = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  padding: 16px 24px 8px;
`;

const MobileNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 24px;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;
  border-radius: 0;

  svg { font-size: 14px; opacity: 0.7; }

  &:hover, &.active {
    color: #fff;
    background: rgba(255,255,255,0.05);
    padding-left: 28px;
  }
`;

const MobileGenreToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 24px;
  color: rgba(255,255,255,0.65);
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { color: #fff; background: rgba(255,255,255,0.05); }
`;

const MobileGenreGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 8px 24px 4px;
`;

const MobileGenreLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.12);
    color: #fff;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 8px 24px;
`;

const MobileActionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 24px;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;

  svg { font-size: 14px; opacity: 0.7; }
  &:hover { color: #fff; background: rgba(255,255,255,0.05); padding-left: 28px; }
`;

const MobileAuthRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 16px 24px;

  a {
    flex: 1;
    text-align: center;
    padding: 13px;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    text-decoration: none;
    transition: all 0.2s;
  }

  .login {
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.8);
    &:hover { background: rgba(255,255,255,0.06); color: #fff; }
  }

  .signup {
    background: #ff0000;
    color: #fff;
    &:hover { background: #e00; box-shadow: 0 4px 15px rgba(255,0,0,0.3); }
  }
`;

const MobileLogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 48px);
  margin: 8px 24px 0;
  padding: 13px 16px;
  background: rgba(255,0,0,0.07);
  border: 1px solid rgba(255,0,0,0.12);
  border-radius: 12px;
  color: #f87171;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  svg { font-size: 14px; }
  &:hover { background: rgba(255,0,0,0.14); border-color: rgba(255,0,0,0.25); color: #fca5a5; }
`;

const genres = [
  { name: "Action",    icon: <FaFistRaised   style={{color:'#ef4444'}} />, path: "/genre/28"    },
  { name: "Adventure", icon: <FaCompass      style={{color:'#38bdf8'}} />, path: "/genre/12"    },
  { name: "Animation", icon: <FaSmile        style={{color:'#facc15'}} />, path: "/genre/16"    },
  { name: "Comedy",    icon: <FaLaugh        style={{color:'#4ade80'}} />, path: "/genre/35"    },
  { name: "Crime",     icon: <FaUserSecret   style={{color:'#a78bfa'}} />, path: "/genre/80"    },
  { name: "Drama",     icon: <FaTheaterMasks style={{color:'#e2e8f0'}} />, path: "/genre/18"    },
  { name: "Horror",    icon: <FaGhost        style={{color:'#f87171'}} />, path: "/genre/27"    },
  { name: "Romance",   icon: <FaHeart        style={{color:'#f9a8d4'}} />, path: "/genre/10749" },
  { name: "Sci-Fi",    icon: <FaRocket       style={{color:'#60a5fa'}} />, path: "/genre/878"   },
  { name: "Thriller",  icon: <FaEye          style={{color:'#fbbf24'}} />, path: "/genre/53"    },
];

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]   = useState('');
  const [scrolled, setScrolled]         = useState(false);
  const [visible, setVisible]           = useState(true);
  const [megaOpen, setMegaOpen]         = useState(false);
  const [userOpen, setUserOpen]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileGenres, setMobileGenres] = useState(false);
  const lastScrollY = useRef(0);
  const userRef     = useRef(null);
  const megaRef     = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY < 10) {
        setVisible(true);
      } else if (currentY > lastScrollY.current + 6) {
        setVisible(false);
        setMegaOpen(false);
        setUserOpen(false);
      } else if (currentY < lastScrollY.current - 6) {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserOpen(false);
    closeMobile();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMobile();
    }
  };

  return (
    <>
      <Nav $scrolled={scrolled} $visible={visible}>

        <Brand to={isLoggedIn ? "/home" : "/"}>
          <div className="brand-icon">🎬</div>
          <span className="brand-name">Stream<span>Hub</span></span>
        </Brand>

        <DesktopLinks>
          <NavItem>
            <StyledNavLink to="/home">Home</StyledNavLink>
          </NavItem>
          <NavItem ref={megaRef}>
            <NavButton onClick={() => setMegaOpen(v => !v)}>
              Movies
              <FaChevronDown style={{
                fontSize: 10,
                transition: 'transform 0.3s',
                transform: megaOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }} />
            </NavButton>
            <MegaDropdown $open={megaOpen}>
              <GenreLabel>Browse by Genre</GenreLabel>
              <GenreGrid>
                {genres.map((g) => (
                  <GenreLink key={g.name} to={g.path} onClick={() => setMegaOpen(false)}>
                    <span className="icon">{g.icon}</span>
                    {g.name}
                  </GenreLink>
                ))}
              </GenreGrid>
            </MegaDropdown>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/about">About</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/contact">Contact</StyledNavLink>
          </NavItem>
        </DesktopLinks>

        <RightSide>
          <SearchWrapper onSubmit={handleSearchSubmit}>
            <SearchInput
              type="search"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchBtn type="submit"><FaSearch size={13} /></SearchBtn>
          </SearchWrapper>

          {/* Desktop user menu only */}
          {isLoggedIn ? (
            <UserMenuWrapper ref={userRef}>
              <UserBtn onClick={() => setUserOpen(v => !v)}>
                <div className="avatar"><FaUser size={11} /></div>
                My Account
                <FaChevronDown size={10} style={{
                  transition: 'transform 0.3s',
                  transform: userOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </UserBtn>
              {userOpen && (
                <UserDropdown>
                  <DropdownItem to="/dashboard" onClick={() => setUserOpen(false)}>
                    <FaTachometerAlt /> Dashboard
                  </DropdownItem>
                  <DropdownItem to="/profile" onClick={() => setUserOpen(false)}>
                    <FaUser /> Profile
                  </DropdownItem>
                  <DropdownDivider />
                  <LogoutItem onClick={handleLogout}>
                    <FaSignOutAlt /> Sign Out
                  </LogoutItem>
                </UserDropdown>
              )}
            </UserMenuWrapper>
          ) : (
            <>
              <LoginBtn to="/login">Login</LoginBtn>
              <SignupBtn to="/signup">Sign Up</SignupBtn>
            </>
          )}

          {/* Hamburger — mobile only */}
          <HamburgerBtn onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <FaBars />
          </HamburgerBtn>
        </RightSide>
      </Nav>

      {/* ── Professional Mobile Menu ── */}
      {mobileOpen && (
        <MobileMenu>

          {/* Header */}
          <MobileMenuHeader>
            <Brand to={isLoggedIn ? "/home" : "/"} onClick={closeMobile}>
              <div className="brand-icon">🎬</div>
              <span className="brand-name">Stream<span>Hub</span></span>
            </Brand>
            <MobileMenuClose onClick={closeMobile}>
              <FaTimes />
            </MobileMenuClose>
          </MobileMenuHeader>

          <MobileMenuBody>

            {/* User card — if logged in */}
            {isLoggedIn && (
              <MobileUserCard>
                <MobileAvatar><FaUser size={18} /></MobileAvatar>
                <MobileUserInfo>
                  <p className="name">My Account</p>
                  <p className="sub">Logged in</p>
                </MobileUserInfo>
              </MobileUserCard>
            )}

            {/* Search */}
            <MobileSearchForm onSubmit={handleSearchSubmit}>
              <input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit"><FaSearch size={13} /></button>
            </MobileSearchForm>

            {/* Nav */}
            <MobileSectionLabel>Navigate</MobileSectionLabel>
            <MobileNavLink to="/home" onClick={closeMobile}>
              Home
            </MobileNavLink>

            <MobileGenreToggle onClick={() => setMobileGenres(v => !v)}>
              <span>Movies</span>
              <FaChevronDown style={{
                fontSize: 11,
                transform: mobileGenres ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} />
            </MobileGenreToggle>

            {mobileGenres && (
              <MobileGenreGrid>
                {genres.map((g) => (
                  <MobileGenreLink key={g.name} to={g.path} onClick={closeMobile}>
                    {g.icon} {g.name}
                  </MobileGenreLink>
                ))}
              </MobileGenreGrid>
            )}

            <MobileNavLink to="/about" onClick={closeMobile}>About</MobileNavLink>
            <MobileNavLink to="/contact" onClick={closeMobile}>Contact</MobileNavLink>

            {/* Account section */}
            {isLoggedIn ? (
              <>
                <MobileDivider />
                <MobileSectionLabel>Account</MobileSectionLabel>
                <MobileActionLink to="/dashboard" onClick={closeMobile}>
                  <FaTachometerAlt /> Dashboard
                </MobileActionLink>
                <MobileActionLink to="/profile" onClick={closeMobile}>
                  <FaUser /> Profile
                </MobileActionLink>
                <MobileLogoutBtn onClick={handleLogout}>
                  <FaSignOutAlt /> Sign Out
                </MobileLogoutBtn>
              </>
            ) : (
              <>
                <MobileDivider />
                <MobileAuthRow>
                  <Link to="/login" className="login" onClick={closeMobile}>Login</Link>
                  <Link to="/signup" className="signup" onClick={closeMobile}>Sign Up</Link>
                </MobileAuthRow>
              </>
            )}

          </MobileMenuBody>
        </MobileMenu>
      )}
    </>
  );
};

export default Navbar;
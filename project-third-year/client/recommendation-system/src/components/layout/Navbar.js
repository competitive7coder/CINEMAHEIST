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

  /* Slide hide/show */
  transform: translateY(${({ $visible }) => $visible ? '0' : '-100%'});
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.4s ease,
              backdrop-filter 0.4s ease,
              box-shadow 0.4s ease;

  /* Background based on scroll */
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

  @media (max-width: 768px) { padding: 0 20px; }
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

const UserMenuWrapper = styled.div`position: relative;`;

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

  .btn-label,
  .btn-chevron {
    @media (max-width: 992px) { display: none; }
  }

  @media (max-width: 992px) {
    padding: 5px;
    background: transparent;
    border-color: transparent;
    gap: 0;

    &:hover {
      background: rgba(255,255,255,0.06);
      border-color: rgba(255,255,255,0.1);
    }
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

const HamburgerBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 6px;
  margin-left: 4px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.08); }

  @media (max-width: 992px) { display: flex; align-items: center; }
`;

const MobileMenu = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1002;
  display: flex;
  flex-direction: column;
  padding: 80px 28px 40px;
  animation: ${fadeIn} 0.2s ease;
  overflow-y: auto;
`;

const MobileClose = styled.button`
  position: absolute;
  top: 18px; right: 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover { background: rgba(255,0,0,0.15); color: #ff0000; }
`;

const MobileSearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 28px;

  input {
    flex: 1;
    background: none;
    border: none;
    padding: 12px 16px;
    color: #fff;
    font-size: 0.9rem;
    font-family: 'Poppins', sans-serif;
    outline: none;
    &::placeholder { color: rgba(255,255,255,0.3); }
  }

  button {
    background: none;
    border: none;
    padding: 12px 16px;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    &:hover { color: #ff0000; }
  }
`;

const MobileNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 14px 0;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: color 0.2s;

  &:hover, &.active { color: #fff; }
`;

const MobileGenreToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 0;
  color: rgba(255,255,255,0.7);
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: color 0.2s;

  svg { transition: transform 0.3s; }
  &:hover { color: #fff; }
`;

const MobileGenreGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 0 16px;
`;

const MobileGenreLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover { background: rgba(255,255,255,0.08); color: #fff; }
`;

const MobileAuthRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 28px;

  a {
    flex: 1;
    text-align: center;
    padding: 13px;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 700;
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

const MobileLogout = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 13px 16px;
  width: 100%;
  background: rgba(255,0,0,0.08);
  border: 1px solid rgba(255,0,0,0.15);
  border-radius: 12px;
  color: #ff4444;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: rgba(255,0,0,0.15); }
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

  // ── Scroll: hide on down, show on up, bg on scrolled ──
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // Background
      setScrolled(currentY > 20);

      // Visibility
      if (currentY < 10) {
        // At very top — always show
        setVisible(true);
      } else if (currentY > lastScrollY.current + 6) {
        // Scrolling DOWN
        setVisible(false);
        setMegaOpen(false);
        setUserOpen(false);
      } else if (currentY < lastScrollY.current - 6) {
        // Scrolling UP
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
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
            <SearchBtn type="submit">
              <FaSearch size={13} />
            </SearchBtn>
          </SearchWrapper>

          {isLoggedIn ? (
            <UserMenuWrapper ref={userRef}>
              <UserBtn onClick={() => setUserOpen(v => !v)}>
                <div className="avatar"><FaUser size={11} /></div>
                <span className="btn-label">My Account</span>
                <FaChevronDown
                  size={10}
                  className="btn-chevron"
                  style={{
                    transition: 'transform 0.3s',
                    transform: userOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
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

          <HamburgerBtn onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <FaBars />
          </HamburgerBtn>
        </RightSide>
      </Nav>

      {mobileOpen && (
        <MobileMenu>
          <MobileClose onClick={() => setMobileOpen(false)}>
            <FaTimes />
          </MobileClose>

          <Brand
            to={isLoggedIn ? "/home" : "/"}
            onClick={() => setMobileOpen(false)}
            style={{ marginBottom: 28 }}
          >
            <div className="brand-icon">🎬</div>
            <span className="brand-name">Stream<span>Hub</span></span>
          </Brand>

          <MobileSearchForm onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><FaSearch /></button>
          </MobileSearchForm>

          <MobileNavLink to="/home" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>

          <MobileGenreToggle onClick={() => setMobileGenres(v => !v)}>
            Movies
            <FaChevronDown style={{
              transform: mobileGenres ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} />
          </MobileGenreToggle>

          {mobileGenres && (
            <MobileGenreGrid>
              {genres.map((g) => (
                <MobileGenreLink key={g.name} to={g.path} onClick={() => setMobileOpen(false)}>
                  {g.icon} {g.name}
                </MobileGenreLink>
              ))}
            </MobileGenreGrid>
          )}

          <MobileNavLink to="/about" onClick={() => setMobileOpen(false)}>About</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileNavLink>

          {isLoggedIn ? (
            <>
              <MobileNavLink to="/dashboard" onClick={() => setMobileOpen(false)}>
                <FaTachometerAlt style={{ marginRight: 10 }} /> Dashboard
              </MobileNavLink>
              <MobileNavLink to="/profile" onClick={() => setMobileOpen(false)}>
                <FaUser style={{ marginRight: 10 }} /> Profile
              </MobileNavLink>
              <MobileLogout onClick={handleLogout}>
                <FaSignOutAlt /> Sign Out
              </MobileLogout>
            </>
          ) : (
            <MobileAuthRow>
              <Link to="/login" className="login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" className="signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </MobileAuthRow>
          )}
        </MobileMenu>
      )}
    </>
  );
};

export default Navbar;
import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: #000;
    color: #fff;
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ::selection { background: #2e62ff; color: white; }
`;

// ---------------- ANIMATIONS ----------------
const grain = keyframes`
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -1%); }
  50% { transform: translate(1%, 2%); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const pulse = keyframes`
  0%, 100% { height: 20%; opacity: 0.3; }
  50% { height: 80%; opacity: 1; }
`;

const marqueeMove = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

// ---------------- STYLED COMPONENTS ----------------

const PageWrapper = styled.div`
  position: relative;
  background: #000;
  &::after {
    content: "";
    position: fixed;
    top: -100%; left: -100%; width: 300%; height: 300%;
    background: url('https://grainy-gradients.vercel.app/noise.svg');
    opacity: 0.04;
    pointer-events: none;
    animation: ${grain} 8s steps(10) infinite;
    z-index: 50;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 30px 6%;
  position: fixed;
  top: 0; width: 100%; z-index: 100;
  mix-blend-mode: difference;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 0.7rem;
  letter-spacing: 4px;
  font-weight: 800;
  text-transform: uppercase;
  transition: opacity 0.3s;
  &:hover { opacity: 0.5; }
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 5%;
`;

const MassiveTitle = styled.h1`
  font-size: clamp(5rem, 15vw, 12rem);
  font-weight: 900;
  line-height: 0.8;
  letter-spacing: -0.06em;
  margin: 0;
  text-align: center;
  .top {
    display: block;
    background: linear-gradient(180deg, #fff 30%, rgba(255,255,255,0.1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .bottom {
    display: block;
    -webkit-text-stroke: 1px rgba(255,255,255,0.2);
    color: transparent;
    margin-top: -0.05em;
  }
`;

const ActionButton = styled(Link)`
  padding: 20px 50px;
  background: #fff;
  color: #000;
  text-decoration: none;
  font-weight: 900;
  font-size: 0.7rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  margin-top: 60px;
  transition: all 0.3s ease;
  &:hover {
    background: #2e62ff;
    color: #fff;
    transform: translateY(-5px);
  }
`;

const MarqueeSection = styled.div`
  background: #050505;
  padding: 35px 0;
  border-top: 1px solid #111;
  border-bottom: 1px solid #111;
  overflow: hidden;
  .track { display: flex; gap: 80px; animation: ${marqueeMove} 40s linear infinite; }
  span {
    font-family: monospace; font-size: 0.7rem; font-weight: 400; color: #444;
    white-space: nowrap; letter-spacing: 5px;
    em { color: #2e62ff; font-style: normal; margin-right: 10px; }
  }
`;

const TechSection = styled.section`
  padding: 180px 8%;
  display: flex;
  flex-direction: column;
  gap: 250px;
`;

const TechContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  align-items: center;
  direction: ${props => props.reverse ? 'rtl' : 'ltr'};
  @media (max-width: 1024px) { 
    grid-template-columns: 1fr; 
    direction: ltr; 
    gap: 60px;
  }
`;

const VisualFrame = styled.div`
  height: 450px;
  position: relative;
  background: #080808;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 30px);
    pointer-events: none;
  }

  .scan-line {
    position: absolute; width: 100%; height: 50%;
    background: linear-gradient(to bottom, transparent, rgba(46, 98, 255, 0.05), transparent);
    animation: ${scanline} 6s linear infinite;
  }
`;

const SpectrumBar = styled.div`
  width: 4px;
  background: #2e62ff;
  margin: 0 2px;
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay || "0s"};
`;

const ContentBox = styled.div`
  direction: ltr;
  .label {
    font-family: monospace; font-size: 0.6rem; color: #2e62ff;
    letter-spacing: 8px; text-transform: uppercase;
    margin-bottom: 30px; display: block;
  }
  h2 { font-size: 3.5rem; font-weight: 800; margin: 0 0 30px 0; letter-spacing: -3px; line-height: 1; }
  p { font-size: 1rem; color: #777; line-height: 1.8; margin-bottom: 40px; max-width: 450px; }
  
  .grid-data {
    display: flex; gap: 40px;
    border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px;
    .item {
      font-family: monospace; font-size: 0.5rem; color: #444; text-transform: uppercase; letter-spacing: 2px;
      b { display: block; color: #fff; font-size: 1rem; margin-top: 8px; letter-spacing: 0; }
    }
  }
`;

const FooterBig = styled.footer`
  padding: 180px 6% 100px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  background: radial-gradient(circle at 50% 100%, rgba(46, 98, 255, 0.03) 0%, transparent 70%);

  h2 {
    font-size: clamp(4rem, 15vw, 12rem); 
    font-weight: 950;
    margin: 0;
    line-height: 0.75;
    letter-spacing: -0.09em; 
    background: linear-gradient(180deg, #fff 10%, rgba(255,255,255,0.1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// ---------------- MAIN COMPONENT ----------------

const PublicHome = () => {
  return (
    <PageWrapper>
      <GlobalStyle />
      
      <Nav>
        <NavLink to="/">STREAMHUB</NavLink>
        <div style={{ display: 'flex', gap: '40px' }}>
          <NavLink to="/login">LOGIN</NavLink>
          <NavLink to="/signup" style={{ color: '#2e62ff' }}>JOIN</NavLink>
        </div>
      </Nav>

      <HeroSection>
        <MassiveTitle>
          <span className="top">CINEMA</span>
          <span className="bottom">DISCOVERY</span>
        </MassiveTitle>
        <ActionButton to="/signup">Initialize Access</ActionButton>
      </HeroSection>

      <MarqueeSection>
        <div className="track">
          {[...Array(4)].map((_, i) => (
            <span key={i}>
              <em>STUDIO RAW</em> // SPATIAL AUDIO 7.1 // <em>0.02MS LATENCY</em> // H.266 ENCODING 8K //
            </span>
          ))}
        </div>
      </MarqueeSection>

      <TechSection>
        <TechContainer>
          <VisualFrame>
            <div className="scan-line" />
            <div style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
              {[...Array(24)].map((_, i) => (
                <SpectrumBar key={i} delay={`${i * 0.05}s`} />
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontFamily: 'monospace', fontSize: '0.5rem', color: '#333' }}>
              BITRATE_STABILITY: 99.9% // SIGNAL: 4K_HDR_UPLINK
            </div>
          </VisualFrame>

          <ContentBox>
            <span className="label">Discovery_01</span>
            <h2>Immersive<br />Experience</h2>
            <p>
              Access a high-bitrate trailer ecosystem. We utilize H.266 encoding to provide 8K visual fidelity, ensuring your first look at cinema is as the director intended.
            </p>
            <div className="grid-data">
              <div className="item">CODEC<b>RAW 8K</b></div>
              <div className="item">AUDIO<b>7.1 SURROUND</b></div>
              <div className="item">SYNC<b>REAL-TIME</b></div>
            </div>
          </ContentBox>
        </TechContainer>

        <TechContainer reverse>
          <VisualFrame>
            <div className="scan-line" />
            <svg width="200" height="200" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(46, 98, 255, 0.2)" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="2" fill="#2e62ff" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(46, 98, 255, 0.2)" strokeWidth="0.5" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(46, 98, 255, 0.2)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" stroke="#2e62ff" strokeWidth="0.5" fill="none" strokeDasharray="2,2" />
            </svg>
            <div style={{ position: 'absolute', top: '20px', right: '20px', fontFamily: 'monospace', fontSize: '0.5rem', color: '#2e62ff' }}>
              INTEL_NODE: ACTIVE
            </div>
          </VisualFrame>

          <ContentBox>
            <span className="label">Intelligence_02</span>
            <h2>Cast &<br />Analytics</h2>
            <p>
              Our proprietary algorithm cross-references data from IMDb and Rotten Tomatoes to provide a unified "Intelligence Score" for every cast member and production.
            </p>
            <div className="grid-data">
              <div className="item">IMDb<b>8.4/10</b></div>
              <div className="item">METRIC<b>94%</b></div>
              <div className="item">VERIFIED<b>NODES</b></div>
            </div>
          </ContentBox>
        </TechContainer>
      </TechSection>

      <FooterBig>
        <h2>STREAMHUB</h2>
        <p style={{ 
          opacity: 0.2, 
          fontSize: '0.7rem', 
          letterSpacing: '12px', 
          marginTop: '60px',
          textTransform: 'uppercase',
          fontFamily: 'monospace' 
        }}>
          ALL RIGHTS RESERVED // ESTABLISHED 2026
        </p>
      </FooterBig>
    </PageWrapper>
  );
};

export default PublicHome;
import React from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

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

const PageWrapper = styled.div`
  position: relative;
  background: #000;
`;

const Nav = styled.nav`
  display: flex; justify-content: space-between; padding: 30px 6%;
  position: fixed; top: 0; width: 100%; z-index: 100;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  backdrop-filter: blur(10px);
`;

const NavLink = styled(Link)`
  color: #fff; text-decoration: none; font-size: 0.7rem;
  letter-spacing: 4px; font-weight: 800; text-transform: uppercase;
  &:hover { color: #2e62ff; }
`;

// --- HERO ---
const HeroSection = styled.section`
  height: 100vh; display: flex; flex-direction: column;
  justify-content: center; align-items: center; padding: 0 5%;
`;

const MassiveTitle = styled.h1`
  font-size: clamp(5rem, 15vw, 12rem);
  font-weight: 900; line-height: 0.8; letter-spacing: -0.06em;
  margin: 0; text-align: center;
  .top {
    display: block;
    background: linear-gradient(180deg, #fff 30%, rgba(255,255,255,0.1) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .bottom {
    display: block; -webkit-text-stroke: 1px rgba(255,255,255,0.2);
    color: transparent; margin-top: -0.05em;
  }
`;

const ActionButton = styled(Link)`
  padding: 22px 50px; background: #fff; color: #000;
  text-decoration: none; font-weight: 800; font-size: 0.75rem;
  letter-spacing: 4px; text-transform: uppercase;
  margin-top: 60px;
  &:hover { background: #2e62ff; color: #fff; }
`;

const MainContent = styled.section`
  padding: 100px 8%;
  display: flex;
  flex-direction: column;
  gap: 200px;
`;

// ---STYLISH UI ---
const FeatureRow = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 100px;
  align-items: center;
  direction: ${props => props.reverse ? 'rtl' : 'ltr'};
  @media (max-width: 1024px) { grid-template-columns: 1fr; direction: ltr; }
`;

const ModernUIFrame = styled.div`
  background: linear-gradient(145deg, #0f0f0f 0%, #050505 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px;
  border-radius: 12px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  direction: ltr;

  .inner-content {
    background: #000;
    border-radius: 10px;
    padding: 30px;
  }

  .ui-label {
    font-family: monospace; font-size: 0.55rem; color: #444;
    letter-spacing: 3px; margin-bottom: 20px; display: flex; justify-content: space-between;
    span { color: #2e62ff; }
  }
`;

const TrailerCard = styled.div`
  width: 100%; aspect-ratio: 16/9;
  background: url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop') center/cover;
  border-radius: 6px; position: relative;
  border: 1px solid rgba(255,255,255,0.1);

  &::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%);
  }

  .play-icon {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 60px; height: 60px; background: rgba(46, 98, 255, 0.9);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; box-shadow: 0 0 30px rgba(46, 98, 255, 0.4);
  }
`;

const IntelGrid = styled.div`
  display: flex; flex-direction: column; gap: 12px;
  .row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px; background: rgba(255,255,255,0.03); border-radius: 6px;
    border-left: 2px solid transparent;
    &:hover { border-left: 2px solid #2e62ff; background: rgba(255,255,255,0.05); }
    span { font-size: 0.8rem; color: #888; }
    b { color: #2e62ff; font-family: monospace; font-size: 1rem; }
  }
`;

const WatchlistUI = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  .movie-thumb {
    aspect-ratio: 2/3; background: #111; border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.5rem; color: #333;
    &:nth-child(1) { background: #1a1a1a; border-color: #2e62ff; }
  }
`;

const TextBlock = styled.div`
  direction: ltr;
  .tag { 
    color: #2e62ff; font-family: monospace; font-size: 0.7rem; 
    letter-spacing: 6px; text-transform: uppercase; margin-bottom: 25px; display: block;
  }
  h2 { font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 900; letter-spacing: -4px; line-height: 0.85; margin: 0 0 35px 0; }
  p { font-size: 1.1rem; color: #777; line-height: 1.8; margin-bottom: 45px; max-width: 500px; }
  
  .stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
    .stat {
      border-left: 1px solid #222; padding-left: 20px;
      label { display: block; font-family: monospace; font-size: 0.6rem; color: #444; text-transform: uppercase; }
      b { display: block; color: #fff; font-size: 1.1rem; margin-top: 8px; }
    }
  }
`;

// --- FOOTER ---
const FooterBig = styled.footer`
  padding: 180px 6% 100px; text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  background: radial-gradient(circle at 50% 100%, rgba(46, 98, 255, 0.05) 0%, transparent 70%);
  h2 {
    font-size: clamp(4rem, 15vw, 12rem); font-weight: 950; margin: 0; line-height: 0.75;
    letter-spacing: -0.09em; background: linear-gradient(180deg, #fff 10%, rgba(255,255,255,0.1) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
`;

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

      <MainContent>
        {/* RECENT RELEASES */}
        <FeatureRow>
          <ModernUIFrame>
            <div className="inner-content">
              <div className="ui-label">NETWORK_STATUS: <span>ENCRYPTED</span> // ID: 8829-X</div>
              <TrailerCard>
                <div className="play-icon">▶</div>
              </TrailerCard>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#2e62ff', fontWeight: 'bold' }}>NEW RELEASE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>GLADIATOR II</div>
                </div>
                <div style={{ fontSize: '0.6rem', color: '#444', textAlign: 'right' }}>8K RAW / 124GBps</div>
              </div>
            </div>
          </ModernUIFrame>
          
          <TextBlock>
            <span className="tag">01 // Archive</span>
            <h2>Recently<br />Released.</h2>
            <p>
              The most advanced cinematic feed on the web. Access newly dropped trailers and high-bitrate clips in native 8K resolution, exactly as the studio mastered them.
            </p>
            <div className="stats">
              <div className="stat"><label>Video Node</label><b>8K UHD</b></div>
              <div className="stat"><label>Daily Sync</label><b>+24 Assets</b></div>
            </div>
          </TextBlock>
        </FeatureRow>

        {/* CAST & RATINGS */}
        <FeatureRow reverse>
          <ModernUIFrame>
            <div className="inner-content">
              <div className="ui-label">DATABASE_ACCESS: <span>VERIFIED</span> // ANALYTICS</div>
              <IntelGrid>
                <div className="row"><span>IMDb Rating</span><b>8.9 / 10</b></div>
                <div className="row"><span>Rotten Tomatoes</span><b>94%</b></div>
                <div className="row"><span>Metascore</span><b>88</b></div>
              </IntelGrid>
              <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed #222', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.5rem', color: '#2e62ff', marginBottom: '5px' }}>TOP_CAST_BIOMETRICS</div>
                <div style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.4' }}>Pedro Pascal, Paul Mescal, Denzel Washington, Connie Nielsen...</div>
              </div>
            </div>
          </ModernUIFrame>

          <TextBlock>
            <span className="tag">02 // Intelligence</span>
            <h2>Cast &<br />Ratings.</h2>
            <p>
              Integrated data intelligence. We cross-reference every title against global databases to provide unified scores and verified cast hierarchies instantly.
            </p>
            <div className="stats">
              <div className="stat"><label>Data Integrity</label><b>99.9%</b></div>
              <div className="stat"><label>Nodes Connected</label><b>IMDb / RT</b></div>
            </div>
          </TextBlock>
        </FeatureRow>

        {/* WATCHLIST */}
        <FeatureRow>
          <ModernUIFrame>
            <div className="inner-content">
              <div className="ui-label">USER_VAULT: <span>ACTIVE</span> // 12_ITEMS</div>
              <WatchlistUI>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="movie-thumb">{i === 0 ? 'SAVED' : ''}</div>
                ))}
              </WatchlistUI>
              <button style={{ 
                width: '100%', marginTop: '20px', padding: '12px', background: '#2e62ff', 
                border: 'none', color: '#fff', fontSize: '0.6rem', fontWeight: '800', 
                letterSpacing: '2px', borderRadius: '4px' 
              }}>MANAGE WATCHLIST</button>
            </div>
          </ModernUIFrame>

          <TextBlock>
            <span className="tag">03 // Library</span>
            <h2>Private<br />Watchlist.</h2>
            <p>
              Personalize your discovery. Add trailers to your vault for later viewing or remove them with a single action. Your library is encrypted and synced across all nodes.
            </p>
            <div className="stats">
              <div className="stat"><label>Sync Protocol</label><b>Cloud_Native</b></div>
              <div className="stat"><label>Storage</label><b>Encrypted</b></div>
            </div>
          </TextBlock>
        </FeatureRow>
      </MainContent>

      <FooterBig>
        <h2>STREAMHUB</h2>
        <p style={{ opacity: 0.2, fontSize: '0.7rem', letterSpacing: '12px', marginTop: '60px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          ALL RIGHTS RESERVED // ESTABLISHED 2026
        </p>
      </FooterBig>
    </PageWrapper>
  );
};

export default PublicHome;
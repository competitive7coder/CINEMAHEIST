import React, { useState, useEffect } from "react";
import useSEO from "../hooks/useSEO";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const styles = `
  body {
    margin: 0;
    background: #000;
    color: #fff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  ::selection { background: #2e62ff; color: white; }
  html { scroll-behavior: smooth; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes marqueeScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  /* ── Page ── */
  .ph-page {
    position: relative;
    background: #000;
    width: 100%;
    animation: fadeIn 0.8s ease-out;
  }

  /* ── Ticker ── */
  .ph-ticker-container {
    position: fixed;
    top: 64px; left: 0;
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    padding: 0 20px;
    box-sizing: border-box;
    pointer-events: none;
  }
  .ph-ticker-bar {
    width: 100%;
    max-width: 1400px;
    background: rgba(4,4,4,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(229,9,20,0.15);
    padding: 7px 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 16px;
    pointer-events: all;
  }
  .ph-ticker-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #e50914;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ph-ticker-track {
    display: flex;
    overflow: hidden;
    flex: 1;
  }
  .ph-ticker-inner {
    display: flex;
    gap: 0;
    animation: marqueeScroll 30s linear infinite;
    white-space: nowrap;
  }
  .ph-ticker-item {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.5px;
    padding: 0 20px;
    white-space: nowrap;
  }
  .ph-ticker-item::after {
    content: '·';
    margin-left: 20px;
    color: #e50914;
    font-size: 0.8rem;
  }
  .ph-live-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(229,9,20,0.08);
    border: 1px solid rgba(229,9,20,0.2);
    border-radius: 50px;
    padding: 5px 12px;
    cursor: default;
    flex-shrink: 0;
  }
  .ph-live-dot {
    width: 5px; height: 5px;
    background: #e50914;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
  .ph-live-text {
    font-family: monospace;
    font-size: 0.48rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #e50914;
    white-space: nowrap;
  }

  /* ── Hero ── */
  .ph-hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 96px 5% 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ph-massive-title {
    font-size: clamp(3.5rem, 12vw, 11rem);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.06em;
    margin: 0;
    text-align: center;
    width: 100%;
  }
  .ph-title-top {
    display: block;
    background: linear-gradient(180deg, #fff 30%, rgba(255,255,255,0.1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 5px;
  }
  .ph-title-bottom {
    display: block;
    -webkit-text-stroke: 1px rgba(255,255,255,0.2);
    color: transparent;
  }
  .ph-hero-subtitle {
    margin: 22px 0 0;
    font-size: clamp(0.95rem, 2vw, 1.2rem);
    font-weight: 400;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.02em;
    line-height: 1.5;
  }
  .ph-social-proof {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ph-proof-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    padding: 5px 14px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50px;
  }
  .ph-proof-divider {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
  }
  .ph-action-btn {
    display: inline-block;
    padding: 22px 50px;
    background: #fff;
    color: #000;
    text-decoration: none;
    font-weight: 800;
    font-size: 0.75rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-top: 60px;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  .ph-action-btn:hover {
    background: #2e62ff;
    color: #fff;
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(46,98,255,0.4);
  }

  /* ── Main content ── */
  .ph-main {
    padding: 100px 8%;
    display: flex;
    flex-direction: column;
    gap: 200px;
  }
  @media (max-width: 768px) { .ph-main { gap: 100px; } }

  /* ── Feature row ── */
  .ph-feature-row {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 100px;
    align-items: center;
  }
  .ph-feature-row.reverse { direction: rtl; }
  @media (max-width: 1024px) {
    .ph-feature-row { grid-template-columns: 1fr; direction: ltr; gap: 50px; }
    .ph-feature-row.reverse { direction: ltr; }
  }

  /* ── UI Frame ── */
  .ph-ui-frame {
    background: linear-gradient(145deg, #0f0f0f 0%, #050505 100%);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 2px;
    border-radius: 12px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
    direction: ltr;
  }
  .ph-ui-frame .inner-content {
    background: #000;
    border-radius: 10px;
    padding: 30px;
  }
  .ph-ui-frame .ui-label {
    font-family: 'SF Mono', monospace;
    font-size: 0.55rem;
    color: #444;
    letter-spacing: 3px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .ph-ui-frame .ui-label span { color: #2e62ff; }
  @media (max-width: 480px) { .ph-ui-frame .inner-content { padding: 20px; } }

  /* ── Trailer card ── */
  .ph-trailer-card {
    width: 100%;
    aspect-ratio: 16/9;
    background: url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop') center/cover;
    border-radius: 6px;
    position: relative;
    border: 1px solid rgba(255,255,255,0.1);
    overflow: hidden;
  }
  .ph-trailer-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%);
  }
  .ph-trailer-card .play-icon {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60px; height: 60px;
    background: rgba(46,98,255,0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 0 30px rgba(46,98,255,0.4);
    z-index: 2;
  }

  /* ── Intel grid ── */
  .ph-intel-grid { display: flex; flex-direction: column; gap: 12px; }
  .ph-intel-grid .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(255,255,255,0.03);
    border-radius: 6px;
    border-left: 2px solid transparent;
    transition: 0.3s;
  }
  .ph-intel-grid .row:hover {
    border-left: 2px solid #2e62ff;
    background: rgba(255,255,255,0.05);
  }
  .ph-intel-grid .row span { font-size: 0.8rem; color: #888; }
  .ph-intel-grid .row b { color: #2e62ff; font-family: monospace; font-size: 1rem; }

  /* ── Watchlist UI ── */
  .ph-watchlist-ui {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .ph-watchlist-ui .movie-thumb {
    aspect-ratio: 2/3;
    background: #111;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.5rem;
    color: #333;
  }
  .ph-watchlist-ui .movie-thumb:first-child {
    background: #1a1a1a;
    border-color: #2e62ff;
    color: #2e62ff;
  }

  /* ── Text block ── */
  .ph-text-block { direction: ltr; }
  .ph-text-block .tag {
    color: #2e62ff;
    font-family: monospace;
    font-size: 0.7rem;
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-bottom: 25px;
    display: block;
  }
  .ph-text-block h2 {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 900;
    letter-spacing: -3px;
    line-height: 1;
    margin: 0 0 35px 0;
  }
  .ph-text-block p {
    font-size: 1.1rem;
    color: #777;
    line-height: 1.8;
    margin-bottom: 45px;
    max-width: 500px;
  }
  .ph-text-block .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .ph-text-block .stat {
    border-left: 1px solid #222;
    padding-left: 20px;
  }
  .ph-text-block .stat label {
    display: block;
    font-family: monospace;
    font-size: 0.6rem;
    color: #444;
    text-transform: uppercase;
  }
  .ph-text-block .stat b {
    display: block;
    color: #fff;
    font-size: 1.1rem;
    margin-top: 8px;
  }

  /* ── Footer ── */
  .ph-footer {
    padding: 180px 6% 100px;
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.04);
    background: radial-gradient(circle at 50% 100%, rgba(46,98,255,0.05) 0%, transparent 70%);
  }
  .ph-footer h2 {
    font-size: clamp(3rem, 15vw, 12rem);
    font-weight: 950;
    margin: 0;
    line-height: 0.75;
    letter-spacing: -0.09em;
    background: linear-gradient(180deg, #fff 10%, rgba(255,255,255,0.1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 480px) {
    .ph-action-btn { padding: 18px 35px; margin-top: 40px; }
  }
`;

const TICKER_TITLES = [
  "Dune: Part Two","Gladiator II","Oppenheimer","Poor Things","The Substance",
  "Alien: Romulus","Deadpool & Wolverine","Inside Out 2","Twisters","Kingdom of the Planet of the Apes",
  "Dune: Part Two","Gladiator II","Oppenheimer","Poor Things","The Substance",
  "Alien: Romulus","Deadpool & Wolverine","Inside Out 2","Twisters","Kingdom of the Planet of the Apes",
];

const PublicHome = ({ setIsLoggedIn }) => {
  useSEO({
    title: "Watch Movies Online Free — Stream Latest Films",
    description: "StreamHub lets you discover and watch movies online free. AI-powered recommendations, trending films, and the latest releases. No subscription needed.",
    url: "/",
  });

  
  const [liveCount, setLiveCount] = useState(11840);
  useEffect(() => {
    const liveTimer = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 5000);
    return () => clearInterval(liveTimer);
  }, []);

  return (
    <div className="ph-page">
      <style>{styles}</style>

      <Navbar isLoggedIn={false} setIsLoggedIn={setIsLoggedIn} />

      {/* Ticker */}
      <div className="ph-ticker-container">
        <div className="ph-ticker-bar">
          <span className="ph-ticker-label">⚡ Trending</span>
          <div className="ph-ticker-track">
            <div className="ph-ticker-inner">
              {TICKER_TITLES.map((title, i) => (
                <span key={i} className="ph-ticker-item">{title}</span>
              ))}
            </div>
          </div>
          <div className="ph-live-badge" title="Live viewers right now">
            <div className="ph-live-dot" />
            <span className="ph-live-text">{liveCount.toLocaleString()} watching</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="ph-hero">
        <h1 className="ph-massive-title">
          <span className="ph-title-top">CINEMA</span>
          <span className="ph-title-bottom">DISCOVERY</span>
        </h1>
        <p className="ph-hero-subtitle">Watch movies free. No subscription.</p>
        <div className="ph-social-proof">
          <span className="ph-proof-pill">Free</span>
          <span className="ph-proof-divider" />
          <span className="ph-proof-pill">Secure</span>
          <span className="ph-proof-divider" />
          <span className="ph-proof-pill">10,000+ titles</span>
        </div>
        <Link className="ph-action-btn" to="/home">Watch Now</Link>
      </section>

      {/* Feature sections */}
      <main className="ph-main">

        <section className="ph-feature-row" aria-labelledby="section-archive">
          <div className="ph-ui-frame">
            <div className="inner-content">
              <div className="ui-label">NETWORK_STATUS: <span>ENCRYPTED</span> ID: 8829-X</div>
              <div className="ph-trailer-card">
                <div className="play-icon" aria-hidden="true">▶</div>
              </div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.6rem", color: "#2e62ff", fontWeight: "bold" }}>NEW RELEASE</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900 }}>GLADIATOR II</div>
                </div>
                <div style={{ fontSize: "0.6rem", color: "#444", textAlign: "right" }}>8K RAW / 124GBps</div>
              </div>
            </div>
          </div>
          <div className="ph-text-block" id="section-archive">
            <span className="tag">01 // Archive</span>
            <h2>Recently<br />Released.</h2>
            <p>The most advanced cinematic feed on the web. Access newly dropped trailers and high-bitrate clips in native 8K resolution.</p>
            <div className="stats">
              <div className="stat"><label>Video Node</label><b>8K UHD</b></div>
              <div className="stat"><label>Daily Sync</label><b>+24 Assets</b></div>
            </div>
          </div>
        </section>

        <section className="ph-feature-row reverse" aria-labelledby="section-intelligence">
          <div className="ph-ui-frame">
            <div className="inner-content">
              <div className="ui-label">DATABASE_ACCESS: <span>VERIFIED</span> <span>ANALYTICS</span></div>
              <div className="ph-intel-grid">
                <div className="row"><span>IMDb Rating</span><b>8.9 / 10</b></div>
                <div className="row"><span>Rotten Tomatoes</span><b>94%</b></div>
                <div className="row"><span>Metascore</span><b>88</b></div>
              </div>
              <div style={{ marginTop: 20, padding: 15, border: "1px dashed #222", borderRadius: 4 }}>
                <div style={{ fontSize: "0.5rem", color: "#2e62ff", marginBottom: 5 }}>TOP_CAST_BIOMETRICS</div>
                <div style={{ fontSize: "0.7rem", color: "#666", lineHeight: 1.4 }}>Pedro Pascal, Paul Mescal, Denzel Washington, Connie Nielsen...</div>
              </div>
            </div>
          </div>
          <div className="ph-text-block" id="section-intelligence">
            <span className="tag">02 // Intelligence</span>
            <h2>Cast &<br />Ratings.</h2>
            <p>Integrated data intelligence. We cross-reference every title against global databases instantly.</p>
            <div className="stats">
              <div className="stat"><label>Data Integrity</label><b>99.9%</b></div>
              <div className="stat"><label>Nodes Connected</label><b>IMDb / RT</b></div>
            </div>
          </div>
        </section>

        <section className="ph-feature-row" aria-labelledby="section-library">
          <div className="ph-ui-frame">
            <div className="inner-content">
              <div className="ui-label">USER_VAULT: <span>ACTIVE</span> <span>12_ITEMS</span></div>
              <div className="ph-watchlist-ui">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="movie-thumb" aria-label="Watchlist item">{i === 0 ? "SAVED" : ""}</div>
                ))}
              </div>
              <button
                type="button"
                style={{ width: "100%", marginTop: 20, padding: 12, background: "#2e62ff", border: "none", color: "#fff", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "2px", borderRadius: 4, cursor: "pointer" }}
              >
                MANAGE WATCHLIST
              </button>
            </div>
          </div>
          <div className="ph-text-block" id="section-library">
            <span className="tag">03 // Library</span>
            <h2>Private<br />Watchlist.</h2>
            <p>Personalize your discovery. Your library is encrypted and synced across all nodes.</p>
            <div className="stats">
              <div className="stat"><label>Sync Protocol</label><b>Cloud_Native</b></div>
              <div className="stat"><label>Storage</label><b>Encrypted</b></div>
            </div>
          </div>
        </section>

      </main>

      <footer className="ph-footer">
        <h2>STREAMHUB</h2>
        <p style={{ opacity: 0.2, fontSize: "0.7rem", letterSpacing: "12px", marginTop: 60, textTransform: "uppercase", fontFamily: "monospace" }}>
          ALL RIGHTS RESERVED // ESTABLISHED 2026
        </p>
      </footer>
    </div>
  );
};

export default PublicHome;
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

const PROVIDERS = [
  { name: "Server 1", label: "HD",          fn: (id) => `https://vidsrc.to/embed/movie/${id}`           },
  { name: "Server 2", label: "Multi-Lang",  fn: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`      },
  { name: "Server 3", label: "Multi-Lang",  fn: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  { name: "Server 4", label: "Multi-Lang",  fn: (id) => `https://embed.su/embed/movie/${id}`            },
];

const modalStyles = `
.watch-modal .modal-dialog {
  max-width: 960px;
  width: 96vw;
  margin: 1.75rem auto;
  transition: all 0.3s ease;
}
.watch-modal.minimized .modal-dialog {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 340px;
  width: 340px;
  margin: 0;
  z-index: 9999;
}
.watch-modal.fullscreen-mode .modal-dialog {
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.watch-modal.fullscreen-mode .modal-content {
  height: 100vh;
  border-radius: 0 !important;
}
.watch-modal.fullscreen-mode .watch-frame {
  height: calc(100vh - 88px) !important;
}
.watch-modal .modal-content {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
}
.watch-modal .modal-body {
  padding: 0;
  background: #000;
}

/* ── Header ── */
.wm-header {
  background: #111;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.wm-title {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  flex-shrink: 0;
}
.watch-modal.minimized .wm-title {
  max-width: 120px;
}

/* ── Servers ── */
.wm-servers {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
}
.watch-modal.minimized .wm-servers {
  display: none;
}
.wm-server-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 4px 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px;
  color: rgba(255,255,255,0.55);
  font-family: 'Poppins', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  line-height: 1.3;
}
.wm-server-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border-color: rgba(255,255,255,0.2);
}
.wm-server-btn.active {
  background: #e50914;
  border-color: #e50914;
  color: #fff;
}
.wm-server-label {
  font-size: 0.58rem;
  font-weight: 400;
  color: rgba(255,255,255,0.35);
  line-height: 1;
}
.wm-server-btn.active .wm-server-label {
  color: rgba(255,255,255,0.75);
}

/* ── Controls ── */
.wm-controls {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-shrink: 0;
}
.wm-ctrl-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px;
  color: rgba(255,255,255,0.7);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}
.wm-ctrl-btn:hover           { background: rgba(255,255,255,0.12); color:#fff; border-color:rgba(255,255,255,0.2); }
.wm-ctrl-btn.new-tab:hover   { background: rgba(26,115,232,0.2);   border-color:rgba(26,115,232,0.4);  color:#4dabf7; }
.wm-ctrl-btn.minimize:hover  { background: rgba(255,200,0,0.15);   border-color:rgba(255,200,0,0.3);   color:#ffd43b; }
.wm-ctrl-btn.fs-btn:hover    { background: rgba(0,200,80,0.15);    border-color:rgba(0,200,80,0.3);    color:#51cf66; }
.wm-ctrl-btn.close-btn:hover { background: rgba(255,0,0,0.2);      border-color:rgba(255,0,0,0.3);     color:#ff4444; }

/* ── Notice ── */
.wm-notice {
  background: rgba(255,255,255,0.025);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 6px 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.28);
  text-align: center;
}
.wm-notice span { color: rgba(255,210,0,0.65); margin-right: 4px; }
.watch-modal.minimized .wm-notice { display: none; }

/* ── Overlay blocker — sits on top of iframe edges to catch redirect clicks ── */
.iframe-wrapper {
  position: relative;
  width: 100%;
  background: #000;
}
.iframe-edge-blocker {
  position: absolute;
  z-index: 10;
  background: transparent;
  pointer-events: all;
}
.iframe-edge-blocker.top    { top: 0;    left: 0; right: 0; height: 60px; }
.iframe-edge-blocker.bottom { bottom: 0; left: 0; right: 0; height: 60px; }
.iframe-edge-blocker.left   { top: 0; bottom: 0; left: 0;  width: 40px;  }
.iframe-edge-blocker.right  { top: 0; bottom: 0; right: 0; width: 40px;  }

/* ── Frame ── */
.watch-frame {
  width: 100%;
  height: 520px;
  border: none;
  display: block;
  background: #000;
  transition: height 0.3s ease;
}
.watch-modal.minimized .watch-frame    { height: 191px !important; }
.watch-modal.minimized .iframe-edge-blocker { display: none; }

/* ── Minimized restore bar ── */
.minimized-bar {
  display: none;
  background: #111;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 6px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.35);
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}
.minimized-bar:hover { background: #1a1a1a; color: rgba(255,255,255,0.6); }
.watch-modal.minimized .minimized-bar { display: block; }

/* ── Ad overlay — full dark screen shown briefly to block initial ad flash ── */
.ad-shield {
  position: absolute;
  inset: 0;
  background: #000;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: opacity 0.5s ease;
}
.ad-shield.hidden {
  opacity: 0;
  pointer-events: none;
}
.ad-shield-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.ad-shield-text {
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.4);
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .watch-frame { height: 240px; }
  .wm-title    { max-width: 100px; }
  .wm-servers  { display: none; }
  .watch-modal.minimized .modal-dialog {
    bottom: 10px;
    right: 10px;
    max-width: 280px;
    width: 280px;
  }
}
`;

const WatchMovieModal = ({ show, handleClose, tmdbId, movieTitle }) => {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [minimized, setMinimized]       = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shielded, setShielded]         = useState(true);

  // Reset on every new movie / open
  useEffect(() => {
    if (show) {
      setActiveIndex(0);
      setMinimized(false);
      setIsFullscreen(false);
      setShielded(true);
      // Show loading shield for 3s to let embed settle before user sees it
      const t = setTimeout(() => setShielded(false), 3000);
      return () => clearTimeout(t);
    }
  }, [show, tmdbId]);

  // Re-shield briefly whenever server changes
  useEffect(() => {
    setShielded(true);
    const t = setTimeout(() => setShielded(false), 2500);
    return () => clearTimeout(t);
  }, [activeIndex]);

  // ESC exits fullscreen
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Block any navigation attempts from iframe
  useEffect(() => {
    if (!show) return;
    const handler = (e) => {
      if (e.target && e.target.tagName === "IFRAME") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [show]);

  const handleOpenNewTab = () => {
    window.open(
      PROVIDERS[activeIndex].fn(tmdbId),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleMinimize = () => {
    setMinimized((v) => !v);
    setIsFullscreen(false);
  };

  const handleFullscreen = () => {
    setIsFullscreen((v) => !v);
    setMinimized(false);
  };

  const handleServerChange = (i) => {
    setActiveIndex(i);
  };

  const modalClass = [
    "watch-modal",
    minimized    ? "minimized"       : "",
    isFullscreen ? "fullscreen-mode" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{modalStyles}</style>
      <Modal
        show={show}
        onHide={handleClose}
        centered={!minimized && !isFullscreen}
        className={modalClass}
        backdrop={minimized ? false : true}
        keyboard={false}
      >
        {/* ── Header ── */}
        <div className="wm-header">
          <p className="wm-title">🎬 {movieTitle || "Now Playing"}</p>

          <div className="wm-servers">
            {PROVIDERS.map((p, i) => (
              <button
                key={i}
                className={`wm-server-btn ${activeIndex === i ? "active" : ""}`}
                onClick={() => handleServerChange(i)}
              >
                {p.name}
                <span className="wm-server-label">{p.label}</span>
              </button>
            ))}
          </div>

          <div className="wm-controls">
            <button
              className="wm-ctrl-btn new-tab"
              onClick={handleOpenNewTab}
              title="Open in new tab"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </button>
            <button
              className="wm-ctrl-btn minimize"
              onClick={handleMinimize}
              title={minimized ? "Restore" : "Minimize"}
            >
              {minimized
                ? <i className="bi bi-chevron-up"></i>
                : <i className="bi bi-dash-lg"></i>
              }
            </button>
            <button
              className="wm-ctrl-btn fs-btn"
              onClick={handleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen
                ? <i className="bi bi-fullscreen-exit"></i>
                : <i className="bi bi-fullscreen"></i>
              }
            </button>
            <button
              className="wm-ctrl-btn close-btn"
              onClick={handleClose}
              title="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        {/* ── Tip ── */}
        <div className="wm-notice">
          <span>💡</span>
          Wrong language or not loading? Switch servers above.
        </div>

        {/* ── Player ── */}
        <Modal.Body>
          <div className="iframe-wrapper">

            {/* Loading shield — hides initial ad flash */}
            <div className={`ad-shield ${shielded ? "" : "hidden"}`}>
              <div className="ad-shield-spinner"></div>
              <p className="ad-shield-text">Loading player...</p>
            </div>

            {/* Edge blockers — prevent clicks on iframe borders that trigger redirects */}
            <div className="iframe-edge-blocker top"    onClick={(e) => e.preventDefault()} />
            <div className="iframe-edge-blocker bottom" onClick={(e) => e.preventDefault()} />
            <div className="iframe-edge-blocker left"   onClick={(e) => e.preventDefault()} />
            <div className="iframe-edge-blocker right"  onClick={(e) => e.preventDefault()} />

            {tmdbId && (
              <iframe
                key={`${tmdbId}-${activeIndex}`}
                src={PROVIDERS[activeIndex].fn(tmdbId)}
                className="watch-frame"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                title={movieTitle}
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
              />
            )}
          </div>

          {/* Minimized restore hint */}
          <div className="minimized-bar" onClick={handleMinimize}>
            ↑ Click to restore player
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WatchMovieModal;
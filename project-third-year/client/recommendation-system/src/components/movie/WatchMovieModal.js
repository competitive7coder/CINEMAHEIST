import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
import api from "../../services/api";
import {
  BsBoxArrowUpRight,
  BsXLg,
  BsFullscreenExit,
} from "react-icons/bs";

const modalStyles = `
/* ── Base Modal ── */
.watch-modal .modal-dialog { max-width: 1160px; width: 98vw; margin: 10px auto; }
.watch-modal .modal-content {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.85);
}
.watch-modal .modal-body { padding: 0; background: #000; }

/* Theater mode */
.watch-modal.theater-mode .modal-dialog { max-width: 100vw; width: 100vw; margin: 0; }
.watch-modal.theater-mode .modal-content { border-radius: 0; border: none; min-height: 100vh; }

/* ── Top Bar ── */
.wm-topbar {
  background: linear-gradient(180deg,#111 0%,#0d0d0d 100%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 10px 14px;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.wm-title {
  color: #fff; font-family: 'Poppins',sans-serif; font-size: 0.82rem; font-weight: 700;
  margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 180px; flex-shrink: 0; display: flex; align-items: center; gap: 6px;
}
.wm-title-dot {
  width: 7px; height: 7px; background: #e50914; border-radius: 50%; flex-shrink: 0;
  animation: wm-pulse 1.5s ease-in-out infinite;
}
@keyframes wm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
.wm-controls { display: flex; gap: 8px; align-items: center; flex: 1; flex-wrap: wrap; justify-content: center; }

/* Server tabs */
.wm-tab-group {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; overflow: hidden; padding: 3px; gap: 2px;
}
.wm-tab {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 5px 12px; background: none; border: none; border-radius: 7px;
  color: rgba(255,255,255,0.45); font-family: 'Poppins',sans-serif;
  font-size: 0.65rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
  white-space: nowrap; line-height: 1.2; position: relative;
}
.wm-tab:hover { background: rgba(255,255,255,0.07); color: #fff; }
.wm-tab.active { background: #e50914; color: #fff; box-shadow: 0 2px 10px rgba(229,9,20,0.3); }
.wm-tab.hindi-tab.active { background: #f97316; box-shadow: 0 2px 10px rgba(249,115,22,0.35); }
.wm-tab-sub { font-size: 0.52rem; font-weight: 400; opacity: 0.75; }
.wm-tab.active .wm-tab-sub { opacity: 0.9; }
.wm-tab-verified { position: absolute; top: 3px; right: 3px; width: 5px; height: 5px; background: #4ade80; border-radius: 50%; }

/* Action buttons */
.wm-action-btn {
  display: flex; align-items: center; gap: 5px; padding: 5px 11px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 8px; color: rgba(255,255,255,0.6); font-family: 'Poppins',sans-serif;
  font-size: 0.65rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  white-space: nowrap; position: relative;
}
.wm-action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
.wm-action-btn.active { background: rgba(229,9,20,0.15); border-color: rgba(229,9,20,0.35); color: #ff6060; }
.wm-action-btn.theater-active { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.35); color: #f59e0b; }

/* Close */
.wm-close {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; color: rgba(255,255,255,0.6); width: 32px; height: 32px; min-width: 32px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  font-size: 0.85rem; transition: all 0.2s; flex-shrink: 0; margin-left: auto;
}
.wm-close:hover { background: rgba(229,9,20,0.25); border-color: rgba(229,9,20,0.4); color: #ff4444; transform: scale(1.05); }

/* ── Notice Bar ── */
.wm-notice {
  background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 5px 16px; font-family: 'Poppins',sans-serif; font-size: 0.65rem;
  color: rgba(255,255,255,0.25); display: flex; align-items: center; gap: 6px; justify-content: space-between;
}
.wm-notice-left { display: flex; align-items: center; gap: 6px; }
.wm-notice-badges { display: flex; align-items: center; gap: 6px; }
.wm-quality-badge {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px; padding: 2px 8px; font-size: 0.6rem; font-weight: 700;
  color: rgba(255,255,255,0.5); letter-spacing: 0.5px; font-family: 'Poppins',sans-serif;
}
.wm-quality-badge.hd  { color: #60a5fa; border-color: rgba(96,165,250,0.3);  background: rgba(96,165,250,0.08); }
.wm-quality-badge.fhd { color: #4ade80; border-color: rgba(74,222,128,0.3);  background: rgba(74,222,128,0.08); }
.wm-quality-badge.uhd { color: #f59e0b; border-color: rgba(245,158,11,0.3);  background: rgba(245,158,11,0.08); }

/* ── Player ── */
.wm-player-wrapper { 
  position: relative; 
  width: 100%; 
  background: #000; 
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
  transition: box-shadow 0.4s ease;
}
.wm-player-wrapper:hover {
  box-shadow: 0 0 50px rgba(229, 9, 20, 0.18);
}
.wm-player-wrapper.fullscreen-active { position: fixed; inset: 0; z-index: 99999; border-radius: 0; }
.watch-frame { width: 100%; height: 560px; border: none; display: block; background: #000; }
.watch-modal.theater-mode .watch-frame { height: calc(100vh - 110px) !important; }
.wm-player-wrapper.fullscreen-active .watch-frame { height: 100vh !important; }

/* Overlay controls */
.wm-fs-controls {
  position: absolute; top: 14px; right: 14px; display: flex; gap: 8px;
  pointer-events: all; opacity: 0; transition: opacity 0.25s ease;
}
.wm-player-wrapper:hover .wm-fs-controls,
.wm-player-wrapper.fullscreen-active .wm-fs-controls { opacity: 1; }
.wm-fs-btn {
  background: rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
  color: #fff; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 0.9rem; transition: all 0.2s; backdrop-filter: blur(10px);
}
.wm-fs-btn:hover { background: rgba(229,9,20,0.45); border-color: rgba(229,9,20,0.55); transform: scale(1.08); }

/* Fullscreen bottom bar */
.wm-fs-bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 16px 20px 14px;
  background: linear-gradient(0deg,rgba(0,0,0,0.9) 0%,transparent 100%);
  display: flex; align-items: center; gap: 12px;
  pointer-events: all; opacity: 0; transition: opacity 0.25s ease;
}
.wm-player-wrapper.fullscreen-active:hover .wm-fs-bottom { opacity: 1; }
.wm-fs-bottom-title { font-family: 'Poppins',sans-serif; font-size: 0.85rem; font-weight: 700; color: #fff; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wm-fs-mini-btn {
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); border-radius: 7px;
  color: #fff; padding: 6px 12px; font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.2s; backdrop-filter: blur(8px);
}
.wm-fs-mini-btn:hover { background: rgba(229,9,20,0.35); border-color: rgba(229,9,20,0.4); }

/* ── Loading ── */
.wm-loading {
  width: 100%; height: 560px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; background: #000; gap: 16px;
}
.wm-spinner-ring {
  width: 48px; height: 48px; border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.06); border-top-color: #e50914;
  animation: wm-spin 0.85s linear infinite;
}
@keyframes wm-spin { to { transform: rotate(360deg); } }
.wm-loading p { font-family: 'Poppins',sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.3); margin: 0; }

/* ── Error ── */
.wm-error { width: 100%; height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: #000; }
.wm-error-icon { font-size: 2.5rem; opacity: 0.5; }
.wm-error p { font-family: 'Poppins',sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.3); margin: 0; }
.wm-retry-btn {
  margin-top: 6px; padding: 9px 24px; background: #e50914; border: none; border-radius: 9px;
  color: #fff; font-family: 'Poppins',sans-serif; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(229,9,20,0.3);
}
.wm-retry-btn:hover { background: #ff1a1a; transform: translateY(-1px); }

/* ── Not Available ── */
.wm-not-available {
  width: 100%; height: 420px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; background: #000; gap: 12px; padding: 2rem; text-align: center;
}
.wm-na-icon { font-size: 3.2rem; margin-bottom: 8px; }
.wm-na-title { font-family: 'Poppins',sans-serif; font-size: 1.25rem; font-weight: 700; color: #fff; margin: 0; }
.wm-na-sub { font-family: 'Poppins',sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin: 0; max-width: 420px; }
.wm-na-hint { font-family: 'Poppins',sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.25); margin: 0; max-width: 400px; line-height: 1.7; }
.wm-na-actions { display: flex; gap: 10px; margin-top: 8px; }
.wm-na-btn-try { padding: 10px 24px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; color: rgba(255,255,255,0.7); font-family: 'Poppins',sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.wm-na-btn-try:hover { background: rgba(255,255,255,0.12); color: #fff; }
.wm-na-btn-close { padding: 10px 24px; background: #e50914; border: none; border-radius: 9px; color: #fff; font-family: 'Poppins',sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.wm-na-btn-close:hover { background: #ff1a1a; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .watch-modal .modal-dialog { width: 100vw; margin: 0; }
  .watch-modal .modal-content { border-radius: 0; }
  .watch-frame { height: 240px !important; }
  .wm-loading { height: 240px; }
  .wm-title { max-width: 100px; }
  .wm-controls { gap: 4px; }
  .wm-tab { padding: 4px 8px; font-size: 0.6rem; }
  .wm-action-btn { padding: 4px 8px; font-size: 0.6rem; }
}
`;

const getQualityBadgeClass = (q) => {
  if (!q) return "";
  if (q === "4K") return "uhd";
  if (q === "1080p") return "fhd";
  if (q === "720p") return "hd";
  return "";
};

const WatchMovieModal = ({ show, handleClose, tmdbId, movieTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const playerRef = useRef(null);

  // ── Fetch sources from backend ──
  const fetchSources = useCallback(
    async () => {
      if (!tmdbId) return;
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/stream/sources/${tmdbId}`);
        setSources(res.data);
        setActiveIndex(0);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [tmdbId],
  );

  // Reset + fetch on open
  useEffect(() => {
    if (show) {
      setActiveIndex(0);
      setSources(null);
      setError(false);
      setIsFullscreen(false);
      setIsTheater(false);
      fetchSources();
    }
  }, [show, tmdbId]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!show) return;
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      switch (e.key.toLowerCase()) {
        case "f":
          setIsFullscreen((v) => !v);
          break;
        case "t":
          setIsTheater((v) => !v);
          setIsFullscreen(false);
          break;
        case "escape":
          if (isFullscreen) setIsFullscreen(false);
          break;
        case "arrowleft":
          setActiveIndex((v) => Math.max(0, v - 1));
          break;
        case "arrowright":
          setActiveIndex((v) => Math.min((allServers.length || 1) - 1, v + 1));
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [show, isFullscreen]);

  // Combine embed + direct streams into one server list
  const allServers = sources
    ? [
        ...(sources.embed_sources || []),
        ...(sources.direct_streams || []).slice(0, 3).map((s, i) => ({
          name: `Direct ${i + 1}`,
          label: s.quality || "HD",
          type: "direct",
          url: s.url,
          verified: true,
          isDirect: true,
          quality: s.quality,
        })),
      ]
    : [];

  const currentSource = allServers[activeIndex];

  const handleFullscreen = () => {
    setIsFullscreen((v) => !v);
    setIsTheater(false);
  };
  
  const handleTheater = () => {
    setIsTheater((v) => !v);
    setIsFullscreen(false);
  };
  
  const handleOpenNewTab = () => {
    if (currentSource?.url)
      window.open(currentSource.url, "_blank", "noopener,noreferrer");
  };

  const modalClass = [
    "watch-modal",
    isTheater ? "theater-mode" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{modalStyles}</style>
      <Modal
        show={show}
        onHide={handleClose}
        centered={!isTheater}
        className={modalClass}
        backdrop={true}
        keyboard={false}
      >
        {/* ── Top Bar ── */}
        <div className="wm-topbar">
          <p className="wm-title">
            <span className="wm-title-dot" />
            {movieTitle || "Now Playing"}
          </p>

          <div className="wm-controls">
            {/* Server tabs */}
            {!loading && allServers.length > 0 && (
              <div className="wm-tab-group">
                {allServers.map((s, i) => (
                  <button
                    key={i}
                    className={`wm-tab ${s.label?.includes("Dubbed") ? "hindi-tab" : ""} ${activeIndex === i ? "active" : ""}`}
                    onClick={() => setActiveIndex(i)}
                  >
                    {s.verified && <span className="wm-tab-verified" />}
                    {s.name}
                    <span className="wm-tab-sub">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <span
                style={{
                  fontFamily: "Poppins",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Finding sources...
              </span>
            )}

            {/* Theater */}
            {!loading && (
              <button
                className={`wm-action-btn ${isTheater ? "theater-active" : ""}`}
                onClick={handleTheater}
              >
                <i
                  className={`bi ${isTheater ? "bi-layout-sidebar" : "bi-easel"}`}
                />
                {isTheater ? "Exit" : "Theater"}
              </button>
            )}

            {/* New tab */}
            <button className="wm-action-btn" onClick={handleOpenNewTab}>
              <BsBoxArrowUpRight />
              <span>Open in new tab</span>
            </button>
          </div>

          <button className="wm-close" onClick={handleClose}>
            <BsXLg />
          </button>
        </div>

        {/* ── Notice Bar ── */}
        {!loading && currentSource && (
          <div className="wm-notice">
            <div className="wm-notice-left">
              <span>💡</span>
              {currentSource.isDirect
                ? "Direct stream — guaranteed correct movie."
                : "Wrong movie or buffering? Switch server above. Click the CC icon inside the player for subtitles."}
            </div>
            <div className="wm-notice-badges">
              {currentSource.quality && (
                <span
                  className={`wm-quality-badge ${getQualityBadgeClass(currentSource.quality)}`}
                >
                  {currentSource.quality}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Player Body ── */}
        <Modal.Body>
          {loading ? (
            <div className="wm-loading">
              <div className="wm-spinner-ring" />
              <p>Finding best sources...</p>
            </div>
          ) : error ? (
            <div className="wm-error">
              <div className="wm-error-icon">⚠️</div>
              <p>Could not load sources for this movie.</p>
              <button
                className="wm-retry-btn"
                onClick={fetchSources}
              >
                Try Again
              </button>
            </div>
          ) : sources?.not_available ? (
            <div className="wm-not-available">
              <div className="wm-na-icon">🎬</div>
              <h4 className="wm-na-title">Not Available Yet</h4>
              <p className="wm-na-sub">
                <strong style={{ color: "#fff" }}>{movieTitle}</strong> hasn't
                been released on streaming servers yet.
              </p>
              <p className="wm-na-hint">
                Usually means the movie is still in theatres. Check back a few
                weeks after official release.
              </p>
              <div className="wm-na-actions">
                <button
                  className="wm-na-btn-try"
                  onClick={() =>
                    setSources((p) => ({ ...p, not_available: false }))
                  }
                >
                  Try Anyway
                </button>
                <button className="wm-na-btn-close" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          ) : currentSource ? (
            <>
              {/* ── Video Player ── */}
              <div
                className={`wm-player-wrapper ${isFullscreen ? "fullscreen-active" : ""}`}
                ref={playerRef}
              >
                <div className="wm-fs-controls">
                  {!isFullscreen && (
                    <button
                      className="wm-fs-btn"
                      onClick={handleTheater}
                      title="Theater (T)"
                    >
                      <i
                        className={`bi ${isTheater ? "bi-layout-sidebar" : "bi-easel"}`}
                      />
                    </button>
                  )}
                  <button
                    className="wm-fs-btn"
                    onClick={handleFullscreen}
                    title="Fullscreen (F)"
                  >
                    <i
                      className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"}`}
                    />
                  </button>
                </div>

                {isFullscreen && (
                  <div className="wm-fs-bottom">
                    <span className="wm-fs-bottom-title">🎬 {movieTitle}</span>
                    <button
                      className="wm-fs-mini-btn"
                      onClick={handleFullscreen}
                    >
                      <BsFullscreenExit />
                      Exit
                    </button>
                  </div>
                )}

                {currentSource.type === "direct" ? (
                  <video
                    key={`${tmdbId}-${activeIndex}`}
                    src={currentSource.url}
                    className="watch-frame"
                    controls
                    autoPlay
                    style={{ background: "#000" }}
                  />
                ) : (
                  <iframe
                    key={`${tmdbId}-${activeIndex}`}
                    src={currentSource.url}
                    className="watch-frame"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={movieTitle}
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </>
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WatchMovieModal;

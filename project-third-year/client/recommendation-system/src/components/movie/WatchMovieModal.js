import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
import api from "../../services/api";

const modalStyles = `
/* ── Base Modal ── */
.watch-modal .modal-dialog {
  max-width: 1100px;
  width: 98vw;
  margin: 10px auto;
}
.watch-modal .modal-content {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
}
.watch-modal .modal-body { padding: 0; background: #000; }

/* ── Top Bar ── */
.wm-topbar {
  background: #0f0f0f;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.wm-title {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  flex-shrink: 0;
}
.wm-controls {
  display: flex;
  gap: 6px;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  justify-content: center;
}

/* ── Server Tabs ── */
.wm-tab-group {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  overflow: hidden;
  padding: 2px;
  gap: 2px;
}
.wm-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 5px 11px;
  background: none;
  border: none;
  border-radius: 6px;
  color: rgba(255,255,255,0.45);
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  line-height: 1.2;
}
.wm-tab:hover { background: rgba(255,255,255,0.06); color: #fff; }
.wm-tab.active {
  background: #e50914;
  color: #fff;
}
.wm-tab.direct-tab.active { background: #1a73e8; }
.wm-tab-sub {
  font-size: 0.52rem;
  font-weight: 400;
  opacity: 0.7;
}
.wm-tab.active .wm-tab-sub { opacity: 0.85; }
.wm-sep {
  width: 1px; height: 20px;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
  margin: 0 2px;
}

/* ── Language Selector ── */
.wm-lang-select {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px;
  padding: 5px 10px;
  color: rgba(255,255,255,0.7);
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 22px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}
.wm-lang-select:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
.wm-lang-select option { background: #1a1a1a; color: #fff; }

/* ── Action Buttons ── */
.wm-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px;
  color: rgba(255,255,255,0.6);
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.wm-action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
.wm-action-btn.active { background: rgba(229,9,20,0.15); border-color: rgba(229,9,20,0.3); color: #ff6060; }
.wm-action-btn i { font-size: 0.75rem; }

/* ── Close Button ── */
.wm-close {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: rgba(255,255,255,0.6);
  width: 30px; height: 30px;
  min-width: 30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-left: auto;
}
.wm-close:hover { background: rgba(255,0,0,0.2); border-color: rgba(255,0,0,0.3); color: #ff4444; }

/* ── Notice Bar ── */
.wm-notice {
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 5px 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.25);
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
}
.wm-notice-left { display: flex; align-items: center; gap: 5px; }
.wm-notice span { color: rgba(255,200,0,0.6); }
.wm-quality-badge {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  padding: 1px 7px;
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.5px;
}
.wm-quality-badge.hd { color: #60a5fa; border-color: rgba(96,165,250,0.25); background: rgba(96,165,250,0.08); }
.wm-quality-badge.fhd { color: #4ade80; border-color: rgba(74,222,128,0.25); background: rgba(74,222,128,0.08); }
.wm-quality-badge.uhd { color: #f59e0b; border-color: rgba(245,158,11,0.25); background: rgba(245,158,11,0.08); }

/* ── Player Wrapper ── */
.wm-player-wrapper {
  position: relative;
  width: 100%;
  background: #000;
}
.wm-player-wrapper.fullscreen-active {
  position: fixed;
  inset: 0;
  z-index: 99999;
  border-radius: 0;
}
.watch-frame {
  width: 100%;
  height: 540px;
  border: none;
  display: block;
  background: #000;
}
.wm-player-wrapper.fullscreen-active .watch-frame {
  height: 100vh !important;
}

/* ── Fullscreen Controls Overlay ── */
.wm-fs-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.wm-player-wrapper:hover .wm-fs-controls,
.wm-player-wrapper.fullscreen-active .wm-fs-controls {
  opacity: 1;
}
.wm-fs-btn {
  background: rgba(0,0,0,0.7);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}
.wm-fs-btn:hover {
  background: rgba(229,9,20,0.4);
  border-color: rgba(229,9,20,0.5);
}

/* ── Caption Panel ── */
.wm-caption-panel {
  background: #0f0f0f;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 12px 16px;
  animation: slideDown 0.2s ease;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.wm-caption-title {
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 10px;
}
.wm-caption-langs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.wm-caption-btn {
  padding: 5px 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  color: rgba(255,255,255,0.5);
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.wm-caption-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
.wm-caption-btn.active {
  background: rgba(96,165,250,0.15);
  border-color: rgba(96,165,250,0.3);
  color: #60a5fa;
}
.wm-caption-note {
  margin-top: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.62rem;
  color: rgba(255,255,255,0.2);
}

/* ── Loading ── */
.wm-loading {
  width: 100%;
  height: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  gap: 14px;
}
.wm-spinner {
  width: 36px; height: 36px;
  border: 3px solid rgba(255,255,255,0.06);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: wm-spin 0.8s linear infinite;
}
@keyframes wm-spin { to { transform: rotate(360deg); } }
.wm-loading p {
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.28);
  margin: 0;
}
.wm-loading small {
  font-family: 'Poppins', sans-serif;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.15);
}

/* ── Error ── */
.wm-error {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #000;
}
.wm-error p {
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.3);
  margin: 0;
}
.wm-retry-btn {
  margin-top: 8px;
  padding: 8px 20px;
  background: #e50914;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.wm-retry-btn:hover { background: #ff1a1a; }

/* ── Minimize / PiP ── */
.watch-modal.minimized .modal-dialog {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 360px;
  width: 360px;
  margin: 0;
  z-index: 9999;
}
.watch-modal.minimized .watch-frame { height: 202px !important; }
.watch-modal.minimized .wm-caption-panel { display: none; }
.watch-modal.minimized .wm-controls { display: none; }
.watch-modal.minimized .wm-notice { display: none; }

.wm-not-available {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  gap: 12px;
  padding: 2rem;
  text-align: center;
}
.wm-na-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}
.wm-na-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.wm-na-sub {
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  margin: 0;
  max-width: 400px;
}
.wm-na-hint {
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.28);
  margin: 0;
  max-width: 400px;
  line-height: 1.6;
}
.wm-na-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.wm-na-btn-try {
  padding: 9px 22px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.wm-na-btn-try:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.wm-na-btn-close {
  padding: 9px 22px;
  background: #e50914;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.wm-na-btn-close:hover { background: #ff1a1a; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .watch-modal .modal-dialog { width: 100vw; margin: 0; }
  .watch-modal .modal-content { border-radius: 0; }
  .watch-frame { height: 240px !important; }
  .wm-loading  { height: 240px; }
  .wm-title    { max-width: 110px; }
  .wm-controls { gap: 4px; }
  .wm-tab      { padding: 4px 8px; font-size: 0.6rem; }
  .wm-action-btn { padding: 4px 8px; font-size: 0.6rem; }
  .wm-lang-select { font-size: 0.6rem; padding: 4px 20px 4px 8px; }
}
`;

// Language options for servers that support it
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
  { code: "it", label: "Italian" },
  { code: "ru", label: "Russian" },
  { code: "tr", label: "Turkish" },
  { code: "bn", label: "Bengali" },
];

// Caption languages
const CAPTION_LANGS = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Japanese",
  "Korean",
  "Portuguese",
  "Chinese",
  "Italian",
  "Russian",
];

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [activeCaption, setActiveCaption] = useState(null);
  const [language, setLanguage] = useState("en");
  const playerRef = useRef(null);

  const fetchSources = useCallback(async () => {
    if (!tmdbId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/stream/sources/${tmdbId}`);
      setSources(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [tmdbId]);

  // Reset on open
  useEffect(() => {
    if (show) {
      setActiveIndex(0);
      setSources(null);
      setError(false);
      setIsFullscreen(false);
      setIsMinimized(false);
      setShowCaptions(false);
      setActiveCaption(null);
      setLanguage("en");
      fetchSources();
    }
  }, [show, tmdbId, fetchSources]);

  // Re-fetch when language changes (for servers that support lang param)
  useEffect(() => {
    if (show && sources) {
      setActiveIndex(0);
    }
  }, [language, show, sources]);

  // ESC to exit fullscreen
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Build server URL with language param for supported servers
  const getServerUrl = (source) => {
    if (!source) return null;
    if (source.type === "direct") return source.url;

    // vidsrc.me supports language
    if (source.url?.includes("vidsrc.me")) {
      return `${source.url}&lang=${language}`;
    }
    // videasy supports language
    if (source.url?.includes("videasy.net")) {
      return `${source.url}?lang=${language}`;
    }
    return source.url;
  };

  // Combine all servers
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
  const currentUrl = getServerUrl(currentSource);

  const handleFullscreen = () => {
    setIsFullscreen((v) => !v);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized((v) => !v);
    setIsFullscreen(false);
  };

  const handleOpenNewTab = () => {
    if (currentUrl) window.open(currentUrl, "_blank", "noopener,noreferrer");
  };

  const modalClass = ["watch-modal", isMinimized ? "minimized" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{modalStyles}</style>
      <Modal
        show={show}
        onHide={handleClose}
        centered={!isMinimized}
        className={modalClass}
        backdrop={isMinimized ? false : true}
        keyboard={false}
      >
        {/* ── Top Bar ── */}
        <div className="wm-topbar">
          <p className="wm-title">🎬 {movieTitle || "Now Playing"}</p>

          <div className="wm-controls">
            {/* Server tabs */}
            {!loading && allServers.length > 0 && (
              <div className="wm-tab-group">
                {sources?.embed_sources?.map((s, i) => (
                  <button
                    key={i}
                    className={`wm-tab ${activeIndex === i ? "active" : ""}`}
                    onClick={() => setActiveIndex(i)}
                    title={s.verified ? "Verified source" : ""}
                  >
                    {s.name}
                    <span className="wm-tab-sub">{s.label}</span>
                  </button>
                ))}

                {sources?.has_direct && (
                  <>
                    <div className="wm-sep" />
                    {sources.direct_streams.slice(0, 3).map((s, i) => {
                      const idx = (sources.embed_sources?.length || 0) + i;
                      return (
                        <button
                          key={idx}
                          className={`wm-tab direct-tab ${activeIndex === idx ? "active" : ""}`}
                          onClick={() => setActiveIndex(idx)}
                        >
                          Direct {i + 1}
                          <span className="wm-tab-sub">{s.quality}</span>
                        </button>
                      );
                    })}
                  </>
                )}
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

            {/* Language selector */}
            {!loading && allServers.length > 0 && (
              <select
                className="wm-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                title="Preferred language (supported on some servers)"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            )}

            {/* Caption toggle */}
            {!loading && (
              <button
                className={`wm-action-btn ${showCaptions ? "active" : ""}`}
                onClick={() => setShowCaptions((v) => !v)}
                title="Subtitles / Captions"
              >
                <i className="bi bi-badge-cc"></i>
                CC
              </button>
            )}

            {/* New tab */}
            <button
              className="wm-action-btn"
              onClick={handleOpenNewTab}
              title="Open in new tab"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </button>

            {/* Minimize / PiP */}
            <button
              className="wm-action-btn"
              onClick={handleMinimize}
              title={isMinimized ? "Restore" : "Mini player"}
            >
              <i
                className={`bi ${isMinimized ? "bi-fullscreen" : "bi-pip"}`}
              ></i>
            </button>
          </div>

          {/* Close */}
          <button className="wm-close" onClick={handleClose} title="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* ── Notice Bar ── */}
        {!loading && currentSource && (
          <div className="wm-notice">
            <div className="wm-notice-left">
              <span>💡</span>
              {sources?.has_direct && currentSource.isDirect
                ? "Direct stream — exact movie guaranteed."
                : "Wrong movie or buffering? Switch server above."}
            </div>
            {currentSource.quality && (
              <span
                className={`wm-quality-badge ${getQualityBadgeClass(currentSource.quality)}`}
              >
                {currentSource.quality}
              </span>
            )}
          </div>
        )}

        {/* ── Player ── */}

        <Modal.Body>
          {loading ? (
            <div className="wm-loading">
              <div className="wm-spinner" />
              <p>Finding best sources...</p>
            </div>
          ) : error ? (
            <div className="wm-error">
              <p>⚠️ Could not load sources.</p>
              <button className="wm-retry-btn" onClick={fetchSources}>
                Try Again
              </button>
            </div>
          ) : sources?.not_available ? (
            // ── Movie not available yet ──
            <div className="wm-not-available">
              <div className="wm-na-icon">🎬</div>
              <h4 className="wm-na-title">Not Available Yet</h4>
              <p className="wm-na-sub">
                <strong style={{ color: "#fff" }}>{movieTitle}</strong> is not
                available on streaming servers yet.
              </p>
              <p className="wm-na-hint">
                This usually means the movie is too new or hasn't been released
                yet. Check back in a few weeks after the official release.
              </p>
              <div className="wm-na-actions">
                <button
                  className="wm-na-btn-try"
                  onClick={() => {
                    // Try anyway — user can decide
                    setSources((prev) => ({ ...prev, not_available: false }));
                  }}
                >
                  Try Anyway
                </button>
                <button className="wm-na-btn-close" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          ) : currentSource ? (
            <div
              className={`wm-player-wrapper ${isFullscreen ? "fullscreen-active" : ""}`}
              ref={playerRef}
            >
              <div className="wm-fs-controls">
                <button className="wm-fs-btn" onClick={handleFullscreen}>
                  <i
                    className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"}`}
                  ></i>
                </button>
              </div>
              {currentSource.type === "direct" ? (
                <video
                  key={`${tmdbId}-${activeIndex}-${language}`}
                  src={currentUrl}
                  className="watch-frame"
                  controls
                  autoPlay
                  style={{ background: "#000" }}
                />
              ) : (
                <iframe
                  key={`${tmdbId}-${activeIndex}-${language}`}
                  src={currentUrl}
                  className="watch-frame"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={movieTitle}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          ) : null}

          {showCaptions && !loading && !sources?.not_available && (
            <div className="wm-caption-panel">
              <p className="wm-caption-title">Subtitles / Captions</p>
              <div className="wm-caption-langs">
                <button
                  className={`wm-caption-btn ${activeCaption === null ? "active" : ""}`}
                  onClick={() => setActiveCaption(null)}
                >
                  Off
                </button>
                {CAPTION_LANGS.map((lang) => (
                  <button
                    key={lang}
                    className={`wm-caption-btn ${activeCaption === lang ? "active" : ""}`}
                    onClick={() => setActiveCaption(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <p className="wm-caption-note">
                💡 Captions are provided by the embed player.
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WatchMovieModal;
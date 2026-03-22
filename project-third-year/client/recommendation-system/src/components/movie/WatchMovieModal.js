import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
import api from "../../services/api";

const modalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

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

/* Mini player */
.watch-modal.minimized .modal-dialog {
  position: fixed; bottom: 20px; right: 20px;
  max-width: 370px; width: 370px; margin: 0; z-index: 9999;
}
.watch-modal.minimized .modal-content { border-radius: 12px; box-shadow: 0 16px 50px rgba(0,0,0,0.8); }
.watch-modal.minimized .watch-frame { height: 208px !important; }
.watch-modal.minimized .wm-caption-panel,
.watch-modal.minimized .wm-shortcuts-panel,
.watch-modal.minimized .wm-hindi-na,
.watch-modal.minimized .wm-controls,
.watch-modal.minimized .wm-notice { display: none; }

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
.wm-controls { display: flex; gap: 6px; align-items: center; flex: 1; flex-wrap: wrap; justify-content: center; }

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
.wm-sep { width: 1px; height: 22px; background: rgba(255,255,255,0.08); flex-shrink: 0; margin: 0 2px; }

/* Language selector */
.wm-lang-wrap { position: relative; display: flex; align-items: center; }
.wm-lang-icon { position: absolute; left: 8px; font-size: 0.72rem; color: rgba(255,255,255,0.4); pointer-events: none; z-index: 1; }
.wm-lang-select {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 5px 26px 5px 26px; color: rgba(255,255,255,0.75);
  font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 600;
  cursor: pointer; outline: none; transition: all 0.2s; appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center;
}
.wm-lang-select:hover { border-color: rgba(255,255,255,0.22); color: #fff; background-color: rgba(255,255,255,0.08); }
.wm-lang-select option { background: #1a1a1a; color: #fff; }

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
.wm-action-btn i { font-size: 0.8rem; }
.wm-action-btn .wm-tooltip {
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
  padding: 4px 8px; font-size: 0.6rem; color: #fff; white-space: nowrap;
  pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 100;
}
.wm-action-btn:hover .wm-tooltip { opacity: 1; }
.wm-shortcut-badge {
  display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 3px; padding: 1px 4px; font-size: 0.5rem; color: rgba(255,255,255,0.4); margin-left: 2px;
}

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
.wm-lang-badge {
  background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.25);
  border-radius: 4px; padding: 2px 8px; font-size: 0.6rem; font-weight: 600;
  color: #fb923c; letter-spacing: 0.3px; font-family: 'Poppins',sans-serif;
}

/* ── Player ── */
.wm-player-wrapper { position: relative; width: 100%; background: #000; }
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

/* ── Hindi Not Available ── */
.wm-hindi-na {
  width: 100%; padding: 40px 20px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; text-align: center; background: #000;
  border-top: 1px solid rgba(255,255,255,0.05);
  animation: slideDown 0.2s ease;
}
@keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
.wm-hindi-na-icon { font-size: 3rem; }
.wm-hindi-na-title { font-family: 'Poppins',sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0; }
.wm-hindi-na-sub { font-family: 'Poppins',sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.4); margin: 0; max-width: 400px; line-height: 1.7; }
.wm-hindi-na-hint { font-family: 'Poppins',sans-serif; font-size: 0.7rem; color: rgba(255,255,255,0.2); margin: 0; }
.wm-hindi-na-actions { display: flex; gap: 10px; margin-top: 6px; }
.wm-hindi-na-eng-btn {
  padding: 9px 22px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; color: rgba(255,255,255,0.7); font-family: 'Poppins',sans-serif;
  font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.wm-hindi-na-eng-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }

/* ── Subtitles Panel ── */
.wm-caption-panel {
  background: #0f0f0f; border-top: 1px solid rgba(255,255,255,0.06);
  padding: 12px 16px; animation: slideDown 0.2s ease;
}
.wm-caption-title {
  font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 10px;
}
.wm-caption-langs { display: flex; gap: 6px; flex-wrap: wrap; }
.wm-caption-btn {
  padding: 5px 13px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; color: rgba(255,255,255,0.5); font-family: 'Poppins',sans-serif;
  font-size: 0.65rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
}
.wm-caption-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
.wm-caption-btn.active { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.35); color: #60a5fa; }
.wm-caption-note { margin-top: 10px; font-family: 'Poppins',sans-serif; font-size: 0.62rem; color: rgba(255,255,255,0.2); }

/* ── Shortcuts Panel ── */
.wm-shortcuts-panel {
  background: #0f0f0f; border-top: 1px solid rgba(255,255,255,0.06);
  padding: 14px 18px; animation: slideDown 0.2s ease;
}
.wm-shortcuts-title {
  font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 10px;
}
.wm-shortcuts-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); gap: 6px; }
.wm-shortcut-item { display: flex; align-items: center; gap: 8px; padding: 5px 8px; background: rgba(255,255,255,0.03); border-radius: 6px; }
.wm-shortcut-key { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 2px 7px; font-family: monospace; font-size: 0.65rem; color: rgba(255,255,255,0.6); min-width: 28px; text-align: center; flex-shrink: 0; }
.wm-shortcut-label { font-family: 'Poppins',sans-serif; font-size: 0.62rem; color: rgba(255,255,255,0.35); }

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
.wm-loading small { font-family: 'Poppins',sans-serif; font-size: 0.65rem; color: rgba(255,255,255,0.14); }

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
  .wm-lang-select { font-size: 0.6rem; }
  .wm-shortcuts-grid { grid-template-columns: repeat(2,1fr); }
}
`;

const LANGUAGES = [
  { code: "en", label: "🇺🇸 English" },
  { code: "hi", label: "🇮🇳 Hindi"   },
];

const CAPTION_LANGS = [
  "English","Hindi","Spanish","French","German",
  "Arabic","Japanese","Korean","Portuguese","Chinese","Italian","Russian",
];

const KEYBOARD_SHORTCUTS = [
  { key: "F",   label: "Fullscreen"    },
  { key: "T",   label: "Theater mode"  },
  { key: "M",   label: "Mini player"   },
  { key: "C",   label: "Subtitles"     },
  { key: "K",   label: "Shortcuts"     },
  { key: "Esc", label: "Exit fullscreen"},
  { key: "← →", label: "Switch server" },
];

const getQualityBadgeClass = (q) => {
  if (!q) return "";
  if (q === "4K")    return "uhd";
  if (q === "1080p") return "fhd";
  if (q === "720p")  return "hd";
  return "";
};

const WatchMovieModal = ({ show, handleClose, tmdbId, movieTitle }) => {
  const [activeIndex,   setActiveIndex]   = useState(0);
  const [sources,       setSources]       = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(false);
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const [isMinimized,   setIsMinimized]   = useState(false);
  const [isTheater,     setIsTheater]     = useState(false);
  const [showCaptions,  setShowCaptions]  = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeCaption, setActiveCaption] = useState(null);
  const [language,      setLanguage]      = useState("en");
  const playerRef = useRef(null);

  // ── Fetch sources from backend ──
  const fetchSources = useCallback(async (lang) => {
    if (!tmdbId) return;
    const selectedLang = lang || language;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/stream/sources/${tmdbId}?language=${selectedLang}`);
      setSources(res.data);
      setActiveIndex(0);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [tmdbId, language]);

  // Reset + fetch on open
  useEffect(() => {
    if (show) {
      setActiveIndex(0);
      setSources(null);
      setError(false);
      setIsFullscreen(false);
      setIsMinimized(false);
      setIsTheater(false);
      setShowCaptions(false);
      setShowShortcuts(false);
      setActiveCaption(null);
      setLanguage("en");
      fetchSources("en");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, tmdbId]);

  // Re-fetch when language changes
  useEffect(() => {
    if (show && sources) fetchSources(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, language]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!show) return;
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      switch (e.key.toLowerCase()) {
        case "f":       setIsFullscreen(v => !v); setIsMinimized(false); break;
        case "t":       setIsTheater(v => !v);    setIsMinimized(false); setIsFullscreen(false); break;
        case "m":       setIsMinimized(v => !v);  setIsFullscreen(false); setIsTheater(false);   break;
        case "c":       setShowCaptions(v => !v); break;
        case "k":       setShowShortcuts(v => !v); break;
        case "escape":  if (isFullscreen) setIsFullscreen(false); break;
        case "arrowleft":  setActiveIndex(v => Math.max(0, v - 1)); break;
        case "arrowright": setActiveIndex(v => Math.min((allServers.length || 1) - 1, v + 1)); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, isFullscreen]);

  // Combine embed + direct streams into one server list
  const allServers = sources
    ? [
        ...(sources.embed_sources  || []),
        ...(sources.direct_streams || []).slice(0, 3).map((s, i) => ({
          name:     `Direct ${i + 1}`,
          label:    s.quality || "HD",
          type:     "direct",
          url:      s.url,
          verified: true,
          isDirect: true,
          quality:  s.quality,
        })),
      ]
    : [];

  const currentSource = allServers[activeIndex];

  const handleFullscreen = () => { setIsFullscreen(v => !v); setIsMinimized(false); setIsTheater(false);  };
  const handleTheater    = () => { setIsTheater(v => !v);    setIsMinimized(false); setIsFullscreen(false); };
  const handleMinimize   = () => { setIsMinimized(v => !v);  setIsFullscreen(false); setIsTheater(false);  };
  const handleOpenNewTab = () => { if (currentSource?.url) window.open(currentSource.url, "_blank", "noopener,noreferrer"); };

  const modalClass = [
    "watch-modal",
    isMinimized ? "minimized" : "",
    isTheater && !isMinimized ? "theater-mode" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{modalStyles}</style>
      <Modal
        show={show}
        onHide={handleClose}
        centered={!isMinimized && !isTheater}
        className={modalClass}
        backdrop={isMinimized ? false : true}
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
              <span style={{fontFamily:"Poppins", fontSize:"0.7rem", color:"rgba(255,255,255,0.3)"}}>
                Finding sources...
              </span>
            )}

            {/* Language selector */}
            {!loading && allServers.length > 0 && (
              <div className="wm-lang-wrap">
                <i className="bi bi-translate wm-lang-icon" />
                <select
                  className="wm-lang-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Subtitles */}
            {!loading && (
              <button className={`wm-action-btn ${showCaptions ? "active" : ""}`} onClick={() => setShowCaptions(v => !v)}>
                <i className="bi bi-badge-cc" /> CC
                <span className="wm-tooltip">Subtitles <span className="wm-shortcut-badge">C</span></span>
              </button>
            )}

            {/* Theater */}
            {!loading && !isMinimized && (
              <button className={`wm-action-btn ${isTheater ? "theater-active" : ""}`} onClick={handleTheater}>
                <i className={`bi ${isTheater ? "bi-layout-sidebar" : "bi-easel"}`} />
                {isTheater ? "Exit" : "Theater"}
                <span className="wm-tooltip">Theater <span className="wm-shortcut-badge">T</span></span>
              </button>
            )}

            {/* New tab */}
            <button className="wm-action-btn" onClick={handleOpenNewTab}>
              <i className="bi bi-box-arrow-up-right" />
              <span className="wm-tooltip">Open in new tab</span>
            </button>

            {/* Mini player */}
            <button className="wm-action-btn" onClick={handleMinimize}>
              <i className={`bi ${isMinimized ? "bi-pip-fill" : "bi-pip"}`} />
              <span className="wm-tooltip">Mini player <span className="wm-shortcut-badge">M</span></span>
            </button>

            {/* Shortcuts */}
            {!loading && (
              <button className={`wm-action-btn ${showShortcuts ? "active" : ""}`} onClick={() => setShowShortcuts(v => !v)}>
                <i className="bi bi-keyboard" />
                <span className="wm-tooltip">Shortcuts <span className="wm-shortcut-badge">K</span></span>
              </button>
            )}
          </div>

          <button className="wm-close" onClick={handleClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* ── Notice Bar ── */}
        {!loading && currentSource && (
          <div className="wm-notice">
            <div className="wm-notice-left">
              <span>💡</span>
              {currentSource.isDirect
                ? "Direct stream — guaranteed correct movie."
                : currentSource.name === "AutoEmbed"
                  ? "🇮🇳 Dual audio — select Hindi track inside the player."
                  : currentSource.name === "LetsEmbed"
                  ? "🇮🇳 Hindi dubbed server — availability varies by movie."
                  : "Wrong movie or buffering? Switch server above."}
            </div>
            <div className="wm-notice-badges">
              {language === "hi" && (
                <span className="wm-lang-badge">🇮🇳 Hindi</span>
              )}
              {currentSource.quality && (
                <span className={`wm-quality-badge ${getQualityBadgeClass(currentSource.quality)}`}>
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
              <small>
                {language === "hi" ? "Searching Hindi dubbed servers..." : "Loading servers..."}
              </small>
            </div>

          ) : error ? (
            <div className="wm-error">
              <div className="wm-error-icon">⚠️</div>
              <p>Could not load sources for this movie.</p>
              <button className="wm-retry-btn" onClick={() => fetchSources(language)}>Try Again</button>
            </div>

          ) : sources?.not_available ? (
            <div className="wm-not-available">
              <div className="wm-na-icon">🎬</div>
              <h4 className="wm-na-title">Not Available Yet</h4>
              <p className="wm-na-sub">
                <strong style={{color:"#fff"}}>{movieTitle}</strong> hasn't been released on streaming servers yet.
              </p>
              <p className="wm-na-hint">
                Usually means the movie is still in theatres. Check back a few weeks after official release.
              </p>
              <div className="wm-na-actions">
                <button className="wm-na-btn-try" onClick={() => setSources(p => ({...p, not_available: false}))}>
                  Try Anyway
                </button>
                <button className="wm-na-btn-close" onClick={handleClose}>Close</button>
              </div>
            </div>

          ) : currentSource ? (
            <>
              {/* ── Hindi dubbed not available banner ── */}
              {language === "hi" && sources?.hindi_not_available && (
                <div className="wm-hindi-na">
                  <div className="wm-hindi-na-icon">🇮🇳</div>
                  <h4 className="wm-hindi-na-title">Hindi Dubbed Not Available</h4>
                  <p className="wm-hindi-na-sub">
                    <strong style={{color:"#fff"}}>{movieTitle}</strong> does not have a Hindi dubbed
                    version available right now. Servers above may play the English version only.
                  </p>
                  <p className="wm-hindi-na-hint">Try switching to English for the best experience.</p>
                  <div className="wm-hindi-na-actions">
                    <button className="wm-hindi-na-eng-btn" onClick={() => setLanguage("en")}>
                      Switch to English
                    </button>
                  </div>
                </div>
              )}

              {/* ── Video Player ── */}
              <div
                className={`wm-player-wrapper ${isFullscreen ? "fullscreen-active" : ""}`}
                ref={playerRef}
              >
                <div className="wm-fs-controls">
                  {!isFullscreen && (
                    <button className="wm-fs-btn" onClick={handleTheater} title="Theater (T)">
                      <i className={`bi ${isTheater ? "bi-layout-sidebar" : "bi-easel"}`} />
                    </button>
                  )}
                  <button className="wm-fs-btn" onClick={handleFullscreen} title="Fullscreen (F)">
                    <i className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-fullscreen"}`} />
                  </button>
                </div>

                {isFullscreen && (
                  <div className="wm-fs-bottom">
                    <span className="wm-fs-bottom-title">🎬 {movieTitle}</span>
                    <button className="wm-fs-mini-btn" onClick={() => setShowCaptions(v => !v)}>
                      <i className="bi bi-badge-cc" /> CC
                    </button>
                    <button className="wm-fs-mini-btn" onClick={handleFullscreen}>
                      <i className="bi bi-fullscreen-exit" /> Exit
                    </button>
                  </div>
                )}

                {currentSource.type === "direct" ? (
                  <video
                    key={`${tmdbId}-${activeIndex}-${language}`}
                    src={currentSource.url}
                    className="watch-frame"
                    controls autoPlay
                    style={{background:"#000"}}
                  />
                ) : (
                  <iframe
                    key={`${tmdbId}-${activeIndex}-${language}`}
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

          {/* ── Subtitles Panel ── */}
          {showCaptions && !loading && !sources?.not_available && (
            <div className="wm-caption-panel">
              <p className="wm-caption-title">Subtitles / Captions</p>
              <div className="wm-caption-langs">
                <button className={`wm-caption-btn ${activeCaption === null ? "active" : ""}`} onClick={() => setActiveCaption(null)}>Off</button>
                {CAPTION_LANGS.map((lang) => (
                  <button
                    key={lang}
                    className={`wm-caption-btn ${activeCaption === lang ? "active" : ""}`}
                    onClick={() => setActiveCaption(lang)}
                  >{lang}</button>
                ))}
              </div>
              <p className="wm-caption-note">💡 Subtitles are provided by the embed player.</p>
            </div>
          )}

          {/* ── Keyboard Shortcuts Panel ── */}
          {showShortcuts && !loading && (
            <div className="wm-shortcuts-panel">
              <p className="wm-shortcuts-title">Keyboard Shortcuts</p>
              <div className="wm-shortcuts-grid">
                {KEYBOARD_SHORTCUTS.map(({key, label}) => (
                  <div key={key} className="wm-shortcut-item">
                    <span className="wm-shortcut-key">{key}</span>
                    <span className="wm-shortcut-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WatchMovieModal;
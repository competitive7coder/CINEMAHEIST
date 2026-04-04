import React, { useEffect, useCallback } from "react";

const VideoModal = ({ show, handleClose, videoKey }) => {
  const close = useCallback(() => handleClose(), [handleClose]);

  useEffect(() => {
    if (!show) return;
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [show, close]);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes vmSpin { to { transform: rotate(360deg); } }

        @keyframes vmBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes vmSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        @keyframes vmDotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(229,9,20,0.7); }
          50%       { box-shadow: 0 0 0 6px rgba(229,9,20,0); }
        }

        .vm-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0,0,0,0.80);
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
          animation: vmBackdropIn 0.22s ease both;
        }

        .vm-box {
          position: relative;
          width: 100%;
          max-width: 900px;
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(160deg, #1c1c1e 0%, #111 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 40px 120px rgba(0,0,0,0.95),
            0 0 60px rgba(229,9,20,0.06);
          animation: vmSlideUp 0.32s cubic-bezier(0.16,1,0.3,1) both;
        }

        .vm-accent-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            #e50914 25%,
            #ff4d4d 50%,
            #e50914 75%,
            transparent 100%
          );
          z-index: 3;
        }

        .vm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 15px;
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,0.025);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .vm-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vm-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e50914;
          animation: vmDotPulse 2s ease infinite;
          flex-shrink: 0;
        }

        .vm-title {
          color: rgba(255,255,255,0.9);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-family: 'DM Sans', -apple-system, sans-serif;
          margin: 0;
        }

        .vm-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vm-pill {
          background: rgba(229,9,20,0.12);
          border: 1px solid rgba(229,9,20,0.25);
          color: #ff6b6b;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 20px;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }

        .vm-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.55);
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        .vm-close:hover {
          background: rgba(229,9,20,0.2);
          border-color: rgba(229,9,20,0.4);
          color: #fff;
          transform: rotate(90deg) scale(1.1);
        }

        .vm-body {
          background: #000;
          position: relative;
        }

        .vm-ratio {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
        }

        .vm-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }

        .vm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 20px;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .vm-footer-text {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          font-family: 'DM Sans', -apple-system, sans-serif;
          margin: 0;
        }

        .vm-footer-esc {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vm-kbd {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.3);
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'DM Sans', -apple-system, sans-serif;
          letter-spacing: 0.5px;
        }

        .vm-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          gap: 16px;
          background: radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%);
        }

        .vm-spinner-track {
          position: relative;
          width: 48px;
          height: 48px;
        }

        .vm-spinner-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(255,255,255,0.06);
          border-top-color: #e50914;
          border-radius: 50%;
          animation: vmSpin 0.8s linear infinite;
        }

        .vm-spinner-ring-inner {
          position: absolute;
          inset: 8px;
          border: 2px solid rgba(255,255,255,0.04);
          border-bottom-color: rgba(229,9,20,0.4);
          border-radius: 50%;
          animation: vmSpin 1.2s linear infinite reverse;
        }

        .vm-spinner-text {
          color: rgba(255,255,255,0.2);
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }

        /* ── Mobile: bottom sheet ── */
       /* REPLACE WITH */
.vm-handle { display: none; }

@media (max-width: 580px) {
  .vm-backdrop {
    padding: 12px;
    align-items: center;   /* centered, not bottom sheet */
  }
  .vm-box {
    max-width: 100%;
    border-radius: 16px;
  }
  .vm-footer { display: none; }
}

        /* ── Tablet ── */
        @media (min-width: 581px) and (max-width: 1024px) {
          .vm-box { max-width: 720px; }
        }
      `}</style>

      <div
        className="vm-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Movie Trailer"
      >
        <div className="vm-box">
          <div className="vm-accent-bar" />
          <div className="vm-handle" />

          <div className="vm-header">
            <div className="vm-header-left">
              <div className="vm-live-dot" />
              <span className="vm-title">Movie Trailer</span>
            </div>
            <div className="vm-header-right">
              <span className="vm-pill">HD</span>
              <button className="vm-close" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="vm-body">
            {videoKey ? (
              <div className="vm-ratio">
                <iframe
                  className="vm-iframe"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&color=red`}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="vm-spinner">
                <div className="vm-spinner-track">
                  <div className="vm-spinner-ring" />
                  <div className="vm-spinner-ring-inner" />
                </div>
                <p className="vm-spinner-text">Loading trailer…</p>
              </div>
            )}
          </div>

          <div className="vm-footer">
            <span className="vm-footer-text">StreamHub</span>
            <div className="vm-footer-esc">
              <span className="vm-kbd">ESC</span>
              <span className="vm-footer-text">to close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoModal;

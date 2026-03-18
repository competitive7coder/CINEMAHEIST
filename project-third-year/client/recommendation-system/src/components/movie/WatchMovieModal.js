import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

const PROVIDERS = [
  { name: "Server 1",   label: "Multi-Lang",  fn: (id) => `https://vidsrc.to/embed/movie/${id}`          },
  { name: "Server 2",   label: "Multi-Lang",  fn: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`     },
  { name: "Server 3",   label: "EN/HI",       fn: (id) => `https://2embed.cc/embed/${id}`                },
  { name: "Server 4",   label: "Multi-Lang",  fn: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`},
  { name: "Server 5",   label: "Multi-Lang",  fn: (id) => `https://embed.su/embed/movie/${id}`           },
];

const modalStyles = `
.watch-modal .modal-dialog {
  max-width: 960px;
  width: 96vw;
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
.wm-header {
  background: #111;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.wm-title {
  color: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}
.wm-servers {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
}
.wm-server-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 5px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: rgba(255,255,255,0.55);
  font-family: 'Poppins', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
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
  font-size: 0.6rem;
  font-weight: 400;
  color: rgba(255,255,255,0.35);
}
.wm-server-btn.active .wm-server-label {
  color: rgba(255,255,255,0.7);
}
.wm-close {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #fff;
  width: 32px;
  height: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  flex-shrink: 0;
}
.wm-close:hover {
  background: rgba(255,0,0,0.2);
  border-color: rgba(255,0,0,0.3);
  color: #ff0000;
}
.wm-notice {
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 7px 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.3);
  text-align: center;
}
.wm-notice span {
  color: rgba(255,200,0,0.7);
  margin-right: 4px;
}
.watch-frame {
  width: 100%;
  height: 520px;
  border: none;
  display: block;
  background: #000;
}
@media (max-width: 768px) {
  .watch-frame { height: 240px; }
  .wm-title { max-width: 120px; }
}
`;

const WatchMovieModal = ({ show, handleClose, tmdbId, movieTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (show) setActiveIndex(0);
  }, [show, tmdbId]);

  return (
    <>
      <style>{modalStyles}</style>
      <Modal show={show} onHide={handleClose} centered className="watch-modal">

        {/* Header */}
        <div className="wm-header">
          <p className="wm-title">🎬 {movieTitle || "Now Playing"}</p>

          {/* Server selector */}
          <div className="wm-servers">
            {PROVIDERS.map((p, i) => (
              <button
                key={i}
                className={`wm-server-btn ${activeIndex === i ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              >
                {p.name}
                <span className="wm-server-label">{p.label}</span>
              </button>
            ))}
          </div>

          <button className="wm-close" onClick={handleClose}>✕</button>
        </div>

        {/* Tip notice */}
        <div className="wm-notice">
          <span>💡</span>
          If the video is in the wrong language, try a different server above — each server may have different language versions.
        </div>

        {/* Player */}
        <Modal.Body>
          {tmdbId && (
            <iframe
              key={`${tmdbId}-${activeIndex}`}
              src={PROVIDERS[activeIndex].fn(tmdbId)}
              className="watch-frame"
              allowFullScreen
              allow="autoplay; fullscreen"
              title={movieTitle}
            />
          )}
        </Modal.Body>

      </Modal>
    </>
  );
};

export default WatchMovieModal;
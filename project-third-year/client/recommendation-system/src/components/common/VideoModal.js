import React from 'react';
import { Modal } from 'react-bootstrap';

const VideoModal = ({ show, handleClose, videoKey }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton closeVariant="white" className="bg-dark border-0">
        <Modal.Title className="text-light">Movie Trailer</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark p-0">
        {videoKey ? (
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          // ── Loading state ────────────────────────────────────────────────
          // videoKey is null while the fetch is in flight — show spinner.
          // "No trailer" only shows if fetch completes and key is still null,
          // which is handled by HomePage setting videoKey = null on error.
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid #fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.85rem' }}>
              Loading trailer...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default VideoModal;
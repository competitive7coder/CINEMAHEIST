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
                        ></iframe>
                    </div>
                ) : (
                    <p className="text-light p-4">No trailer available for this movie.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default VideoModal;
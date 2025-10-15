import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        // UPDATED: Using bg-black for a deeper black and text-muted for a softer gray.
        <footer className="py-5 bg-black text-muted">
            <div className="container">
                {/* NEW: Brand name and social icons at the top */}
                <div className="row mb-4 pb-4 border-bottom border-secondary-subtle">
                    <div className="col-md-6">
                        <Link className="fs-3 fw-bold text-light text-decoration-none" to="/">MovieSite</Link>
                    </div>
                    <div className="col-md-6 text-md-end">
                        {/* UPDATED: Interactive, circular button style for social icons */}
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary rounded-circle me-2">
                            <i className="bi bi-twitter"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary rounded-circle me-2">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary rounded-circle me-2">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary rounded-circle">
                            <i className="bi bi-youtube"></i>
                        </a>
                    </div>
                </div>

                <div className="row">
                    {/* Column 1: Navigation */}
                    <div className="col-6 col-lg-2 mb-3">
                        <h5 className="text-light fw-bold mb-3">Company</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none text-white-50">About Us</Link></li>
                            <li className="mb-2"><Link to="/careers" className="text-muted text-decoration-none text-white-50">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Help */}
                    <div className="col-6 col-lg-2 mb-3">
                        <h5 className="text-light fw-bold mb-3">Help</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/faq" className="text-muted text-decoration-none text-white-50">FAQ</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-muted text-decoration-none text-white-50">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div className="col-6 col-lg-2 mb-3">
                        <h5 className="text-light fw-bold mb-3">Legal</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/terms" className="text-muted text-decoration-none text-white-50">Terms of Service</Link></li>
                            <li className="mb-2"><Link to="/privacy" className="text-muted text-decoration-none text-white-50">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* NEW: Column 4 for App Store buttons */}
                    <div className="col-lg-5 offset-lg-1 mb-3">
                        <h5 className="text-light fw-bold mb-3">Get the App</h5>
                        <a href="#" className="btn btn-dark d-inline-flex align-items-center mb-2 me-2" style={{ backgroundColor: '#222' }}>
                            <i className="bi bi-apple fs-3 me-2"></i>
                            <div>
                                <small className="d-block">Download on the</small>
                                <span className="fs-6 fw-bold">App Store</span>
                            </div>
                        </a>
                        <a href="#" className="btn btn-dark d-inline-flex align-items-center mb-2" style={{ backgroundColor: '#222' }}>
                            <i className="bi bi-google-play fs-3 me-2"></i>
                            <div>
                                <small className="d-block">GET IT ON</small>
                                <span className="fs-6 fw-bold">Google Play</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="row pt-4 mt-4 border-top border-secondary-subtle">
                    <div className="col text-center text-white-50">
                        <p>&copy; {new Date().getFullYear()} MovieSite. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
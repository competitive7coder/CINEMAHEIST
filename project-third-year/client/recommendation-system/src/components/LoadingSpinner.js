import React from 'react';

const LoadingSpinner = () => {
    // CSS for the loader container and SVG animations
    const componentStyles = `
        .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #141414; /* Match your app's background */
        }
        .loader {
            display: flex;
            align-items: center;
            position: relative;
        }
        /* Adjusted width/height slightly if needed */
        .loader svg.letter {
            margin: 0 2px; /* Slightly reduce margin for more letters */
            width: 48px;   /* Slightly smaller letters */
            height: 48px;
        }
        .absolute {
            position: absolute;
        }
        .dash {
            animation:
                dashArray 2s ease-in-out infinite,
                dashOffset 2s linear infinite;
        }
        @keyframes dashArray {
            0% { stroke-dasharray: 0 1 359 0; }
            50% { stroke-dasharray: 0 359 1 0; }
            100% { stroke-dasharray: 359 1 0 0; }
        }
        @keyframes dashOffset {
            0% { stroke-dashoffset: 365; }
            100% { stroke-dashoffset: 5; }
        }
        .gradient-b { stroke: url(#b); }
        .gradient-c { stroke: url(#c); }
        .gradient-d { stroke: url(#d); }
    `;

    return (
        <div className="loader-container">
            <style>{componentStyles}</style>
            <div className="loader">
                {/* SVG Definitions (Gradients) - These remain the same */}
                <svg className="absolute" width="0" height="0">
                    <defs>
                        <linearGradient id="b" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#973BED"></stop> <stop offset="1" stopColor="#007CFF"></stop>
                        </linearGradient>
                        <linearGradient id="c" x1="0" y1="64" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FFC800"></stop> <stop offset="1" stopColor="#F0F"></stop>
                            <animateTransform attributeName="gradientTransform" type="rotate" values="0 32 32;-270 32 32;-540 32 32;-810 32 32;-1080 32 32" dur="8s" keyTimes="0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1" repeatCount="indefinite"></animateTransform>
                        </linearGradient>
                        <linearGradient id="d" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#00E0ED"></stop> <stop offset="1" stopColor="#00DA72"></stop>
                        </linearGradient>
                    </defs>
                </svg>

                {/* --- NEW SVG Letters for "LOADING" --- */}
                {/* L */}
                <svg className="letter" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path pathLength="360" d="M5 5 V49 H39" className="dash gradient-b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {/* O */}
                 <svg className="letter" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path pathLength="360" d="M22,5 C10,5 5,15 5,27 S10,49 22,49 S39,39 39,27 S34,5 22,5 Z" className="dash gradient-c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                 {/* A */}
                 <svg className="letter" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path pathLength="360" d="M5 49 L22 5 L39 49 M12 35 H32" className="dash gradient-d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                 {/* D */}
                 <svg className="letter" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path pathLength="360" d="M5 5 V49 H25 C35,49 39,39 39,27 S35,5 25,5 H5 Z" className="dash gradient-b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                 {/* I */}
                 <svg className="letter" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path pathLength="360" d="M22 5 V49" className="dash gradient-c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                 {/* N */}
                 <svg className="letter" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path pathLength="360" d="M5 49 V5 L39 49 V5" className="dash gradient-d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                 {/* G */}
                 <svg className="letter" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path pathLength="360" d="M39 27 C39,15 34,5 22,5 S5,15 5,27 S10,49 22,49 H30 V35 H22" className="dash gradient-b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {/* --- End of SVG Letters --- */}
            </div>
        </div>
    );
};

export default LoadingSpinner;
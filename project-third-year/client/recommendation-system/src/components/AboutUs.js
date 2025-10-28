import React, { useState, useEffect } from 'react';

const AboutUs = () => {
  // All CSS for this component is self-contained here
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

    .about-us-page {
      font-family: 'Poppins', sans-serif;
      position: relative; 
      color: #f0f0f0;
      overflow-x: hidden;
      z-index: 1;
      background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://upload.wikimedia.org/wikipedia/commons/2/2c/Interno_di_un_sala_da_cinema.JPG') no-repeat center center fixed;
      background-size: cover;
      overflow-y: hidden;
    }

    /* Animation */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fade-in-up {
      opacity: 0; 
      animation: fadeInUp 1s ease-out forwards;
    }

    .stagger-delay-1 { animation-delay: 0.2s; }
    .stagger-delay-2 { animation-delay: 0.4s; }
    .stagger-delay-3 { animation-delay: 0.6s; }

    /* Hero Section */
    .about-hero {
      position: relative;
      height: 70vh;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 2rem;
    }
    
    .hero-content h1 {
      font-size: 5rem;
      font-weight: 800;
      color: #fff;
      text-shadow: 0 5px 25px rgba(0,0,0,0.6);
      letter-spacing: 1px;
    }

    .hero-content .subtitle {
      font-size: 1.5rem;
      max-width: 700px;
      margin: 1.5rem auto 0;
      color: #e5e7eb;
      font-weight: 300;
    }

    /* Main Content Wrapper */
    .main-content {
      padding: 4rem 2rem;
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-section {
        margin-bottom: 8rem;
    }

    .section-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 4rem;
      color: #fff;
      text-align: center;
      position: relative;
    }

    .section-title span {
      color: #9CA3AF; 
    }
    
    .section-title::after {
        content: '';
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 4px;
        background: #9CA3AF;
        border-radius: 2px;
    }
    
    /* NEW Story & Mission Section */
    .story-mission-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 5rem;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      padding: 3rem;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .story-mission-image {
      width: 100%;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .text-block {
      margin-bottom: 3rem;
    }
    .text-block:last-child {
      margin-bottom: 0;
    }
    .section-subtitle {
      font-size: 2.5rem;
      font-weight: 600;
      color: #E5E7EB; 
      margin-bottom: 1.5rem;
      position: relative;
      padding-bottom: 1rem;
    }
    .section-subtitle::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: #9CA3AF;
    }
    .section-subtitle span { color: #9CA3AF; }
    .text-block p {
      font-size: 1.1rem;
      line-height: 1.9;
      color: #d1d5db;
    }


    /* Features Section */
    .features-grid { 
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
    }
    .feature-card { 
      padding: 2.5rem;
      background: rgba(31, 41, 55, 0.3);
      backdrop-filter: blur(15px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(156, 163, 175, 0.2);
    }
    .feature-icon { font-size: 3rem; color: #9CA3AF; margin-bottom: 1.5rem; }
    .feature-card h3 { font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; color: #fff; }
    .feature-card p { color: #9ca3af; line-height: 1.7; font-size: 1rem; }

    /* Team Carousel */
    .team-section {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      perspective: 1200px;
      overflow: hidden;
    }
    .team-container {
      position: relative;
      width: 220px;
      height: 290px;
      transform-style: preserve-3d;
      margin-top: 4rem;
    }
    .carousel-card-wrapper {
      position: absolute; width: 100%; height: 100%;
      opacity: 0; transform: rotateY(90deg) scale(0.8);
      transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .carousel-card-wrapper.active { opacity: 1; transform: rotateY(0deg) scale(1); z-index: 5; }
    .carousel-card-wrapper.next { opacity: 0.8; transform: translateX(220px) translateZ(-200px) rotateY(-35deg) scale(0.9); z-index: 4; }
    .carousel-card-wrapper.prev { opacity: 0.8; transform: translateX(-220px) translateZ(-200px) rotateY(35deg) scale(0.9); z-index: 4; }
    .carousel-card-wrapper.next2 { opacity: 0.5; transform: translateX(440px) translateZ(-400px) rotateY(-45deg) scale(0.8); z-index: 3; }
    .carousel-card-wrapper.prev2 { opacity: 0.5; transform: translateX(-440px) translateZ(-400px) rotateY(45deg) scale(0.8); z-index: 3; }
    .inner-team-card {
      overflow: visible; position: relative; width: 100%; height: 100%;
      background: #111827; box-shadow: 0 2px 10px rgba(0, 0, 0, .2);
    }
    .inner-team-card:before, .inner-team-card:after {
      content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      border-radius: 4px; background: #111827; transition: 0.5s; z-index: -1;
    }
    .inner-team-card .details {
      position: absolute; left: 10px; right: 10px; bottom: 5px; height: 60px;
      text-align: center; text-transform: uppercase;
    }
    .inner-team-card .imgbox {
      position: absolute; top: 10px; left: 10px; bottom: 10px; right: 10px;
      background: #000; transition: 0.5s; z-index: 1;
    }
    .inner-team-card .img {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover; background-position: center;
    }
    .inner-team-card .title { font-weight: 600; font-size: 1.1rem; color: #e5e7eb; }
    .inner-team-card .caption {
      font-weight: 500; font-size: 0.8rem; color: #9CA3AF; display: block; margin-top: 5px;
    }
    .carousel-card-wrapper:hover .imgbox { bottom: 80px; }
    .carousel-card-wrapper:hover .inner-team-card:before { transform: rotate(20deg); box-shadow: 0 2px 20px rgba(0, 0, 0, .2); }
    .carousel-card-wrapper:hover .inner-team-card:after { transform: rotate(10deg); box-shadow: 0 2px 20px rgba(0, 0, 0, .2); }

    /* CTA Section */
    .cta-section { text-align: center; }
    .cta-button {
        display: inline-block; padding: 1rem 2.5rem; background: #fff;
        color: #000; font-weight: 600; font-size: 1.1rem;
        border-radius: 50px; text-decoration: none;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .cta-button:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .story-mission-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
        .hero-content h1 { font-size: 3.5rem; }
        .section-title { font-size: 2.5rem; }
        .main-content { padding: 4rem 1.5rem; }
        .carousel-card-wrapper.next { transform: translateX(120px) translateZ(-100px) rotateY(-25deg) scale(0.85); }
        .carousel-card-wrapper.prev { transform: translateX(-120px) translateZ(-100px) rotateY(25deg) scale(0.85); }
        .carousel-card-wrapper.next2, .carousel-card-wrapper.prev2 { opacity: 0; transform: scale(0.7); }
    }
  `;
  
  const [activeIndex, setActiveIndex] = useState(0);

  const teamMembers = [
    { name: 'Protyush', role: 'Fullstack Developer', img: 'https://i.postimg.cc/xTt4m6Qt/Whats-App-Image-2024-07-22-at-10-34-36-ef70f6fe.jpg' },
    // { name: 'Ayush', role: 'UI/UX Designer', img: 'https://i.postimg.cc/g2KNCK3r/ayush.jpg' },
    // { name: 'Rofikul', role: 'Frontend Developer', img: 'https://i.postimg.cc/52mnhm8t/rofikul.jpg' },
    // { name: 'Bishnu', role: 'QA Engineer', img: 'https://i.postimg.cc/k4fp8Pnz/bishnu.jpg' },
    // { name: 'Ayan', role: 'Backend Developer', img: 'https://i.postimg.cc/m2p5kjt0/ayan.jpg' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [teamMembers.length]);


  return (
    <>
      <style>{styles}</style>
      <div className="about-us-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content fade-in-up">
            <h1>The Art of Cinema, Redefined.</h1>
            <p className="subtitle">StreamHub is more than a database; it's a curated experience for the true film lover.</p>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="main-content">
          <section className="story-mission-section page-section fade-in-up">
            <div className="story-mission-grid">
              <div className="story-mission-text-container stagger-delay-1">
                <div className="text-block">
                  <h3 className="section-subtitle">Our <span>Story</span></h3>
                  <p>Born from a simple, powerful passion for movies, StreamHub was created to cut through the noise. In an age of endless content, we believe in the magic of finding the *right* film. We're a team of cinephiles and developers dedicated to building the ultimate companion for your cinematic journey.</p>
                </div>
                <div className="text-block">
                  <h3 className="section-subtitle">Our <span>Mission</span></h3>
                  <p>Our mission is to reconnect viewers with the art of cinema. We aim to provide a beautifully designed, intuitive platform that not only helps you track what you've seen but also intelligently recommends what to watch next, enriching your viewing experience.</p>
                </div>
              </div>
              <div className="story-mission-image-container stagger-delay-2">
                <img src="https://static01.nyt.com/athletic/uploads/wp/2022/08/26063816/GettyImages-148946041-scaled.jpg" alt="Vintage film camera" className="story-mission-image" />
              </div>
            </div>
          </section>
        
          <section className="features-section page-section fade-in-up stagger-delay-3">
             <h2 className="section-title">What We <span>Offer</span></h2>
             <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon"><i className="bi bi-compass-fill"></i></div>
                  <h3>Intelligent Discovery</h3>
                  <p>Our smart recommendation engine learns your taste to suggest films you'll genuinely love, making "what to watch" a joy, not a chore.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><i className="bi bi-journal-richtext"></i></div>
                  <h3>Personal Film Diary</h3>
                  <p>Build your ultimate watchlist, track viewing history, and create a personal movie journal that evolves with you.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon"><i className="bi bi-people-fill"></i></div>
                  <h3>Community Focused</h3>
                  <p>Connect with fellow film lovers, share reviews, and discover new perspectives in a community that shares your passion.</p>
                </div>
            </div>
          </section>
        
          <section className="team-section page-section">
            <h2 className="section-title fade-in-up">Meet The <span>Team</span></h2>
            <div className="team-container">
              {teamMembers.map((member, index) => {
                const isActive = index === activeIndex;
                const isNext = index === (activeIndex + 1) % teamMembers.length;
                const isPrev = index === (activeIndex - 1 + teamMembers.length) % teamMembers.length;
                const isNext2 = index === (activeIndex + 2) % teamMembers.length;
                const isPrev2 = index === (activeIndex - 2 + teamMembers.length) % teamMembers.length;

                return (
                  <div
                    key={index}
                    className={`carousel-card-wrapper ${
                      isActive ? "active" : isNext ? "next" : isPrev ? "prev" : isNext2 ? "next2" : isPrev2 ? "prev2" : ""
                    }`}
                  >
                    <div className="inner-team-card">
                      <div className="imgbox">
                        <div className="img" style={{ backgroundImage: `url(${member.img})` }}></div>
                      </div>
                      <div className="details">
                        <h2 className="title">{member.name}</h2>
                        <span className="caption">{member.role}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        
          <section className="cta-section page-section fade-in-up">
              <h2 className="section-title">Ready to <span>Dive In?</span></h2>
              <p className="story-section" style={{maxWidth: '600px', margin: '0 auto 2.5rem auto'}}>Your next favorite film is waiting. Join the StreamHub community and start your cinematic journey today.</p>
              <a href="/" className="cta-button">Start Exploring</a>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;


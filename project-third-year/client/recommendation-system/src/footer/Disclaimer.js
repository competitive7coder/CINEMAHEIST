import React from "react";

const disclaimers = [
  {
    icon: "©️",
    title: "Copyright and Ownership",
    text: "All movie titles, characters, cover arts, descriptions, and related media references displayed on CinemaHeist are trademarks and copyrights of their respective production studios, distribution networks, and rights holders. CinemaHeist does not claim ownership or affiliation with any of these properties."
  },
  {
    icon: "🤝",
    title: "Non-Commercial Platform",
    text: "CinemaHeist is an independent, non-commercial movie catalog and reference portal. We are not officially associated, endorsed, or affiliated with Netflix, Amazon Prime, Disney+, or any other streaming service or entertainment studio."
  },
  {
    icon: "🌐",
    title: "Service Availability",
    text: "CinemaHeist does not guarantee uninterrupted operation, 100% uptime, or the permanent availability of specific pages, details, or library items. The catalog may be updated, modified, or restricted at any time without prior notice."
  },
  {
    icon: "📧",
    title: "Copyright Complaints",
    text: "CinemaHeist respects intellectual property rights. If you are a rights holder and have any inquiries or copyright complaints regarding media references displayed on the platform, please contact us at dmca.CinemaHeist@proton.me."
  },
];

const Disclaimer = () => (
  <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Poppins', sans-serif" }}>
    <style>{`
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .legal-hero {
        background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        padding: 80px 20px 60px; text-align: center;
        position: relative; overflow: hidden;
      }
      .legal-hero::before {
        content: ''; position: absolute; top: -80px; left: 50%;
        transform: translateX(-50%); width: 500px; height: 250px;
        background: radial-gradient(ellipse, rgba(229,9,20,0.07) 0%, transparent 70%);
        pointer-events: none;
      }
      .legal-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(229,9,20,0.1); border: 1px solid rgba(229,9,20,0.2); border-radius: 20px; padding: 6px 16px; font-size: 0.7rem; font-weight: 600; color: #e50914; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
      .legal-hero h1 { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 700; color: #fff; margin-bottom: 12px; }
      .legal-hero h1 span { color: #e50914; }
      .legal-hero p { font-size: 0.88rem; color: rgba(255,255,255,0.38); max-width: 480px; margin: 0 auto; line-height: 1.7; font-weight: 300; }
      .legal-updated { display: inline-block; margin-top: 16px; font-size: 0.72rem; color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 4px 12px; }
      .legal-container { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
      .disc-grid { display: flex; flex-direction: column; gap: 14px; }
      .disc-card { display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; transition: border-color 0.2s; }
      .disc-card:hover { border-color: rgba(229,9,20,0.15); }
      .disc-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
      .disc-content {}
      .disc-title { font-size: 0.88rem; font-weight: 700; color: rgba(255,255,255,0.8); margin-bottom: 6px; }
      .disc-text { font-size: 0.8rem; color: rgba(255,255,255,0.35); line-height: 1.75; font-weight: 300; }
      .legal-footer-note { margin-top: 48px; padding: 20px 24px; background: rgba(229,9,20,0.05); border: 1px solid rgba(229,9,20,0.1); border-radius: 10px; }
      .legal-footer-note p { font-size: 0.78rem; color: rgba(255,255,255,0.3); line-height: 1.75; font-weight: 300; text-align: center; }
      .legal-footer-note strong { color: rgba(255,255,255,0.55); font-weight: 600; }
    `}</style>

    <div className="legal-hero">
      <div className="legal-badge">⚠️ Disclaimer</div>
      <h1>Site <span>Disclaimer</span></h1>
      <p>Important information about CinemaHeist's nature, limitations, and policy regarding content ownership.</p>
      <div className="legal-updated">Last updated: March 2026</div>
    </div>

    <div className="legal-container">
      <div className="disc-grid">
        {disclaimers.map((d, i) => (
          <div key={i} className="disc-card">
            <div className="disc-icon">{d.icon}</div>
            <div className="disc-content">
              <div className="disc-title">{d.title}</div>
              <div className="disc-text">{d.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="legal-footer-note">
        <p>
          <strong>CinemaHeist is a free, non-commercial catalog.</strong> This disclaimer is provided in good faith to establish content copyright and protect intellectual property rights.
        </p>
      </div>
    </div>
  </div>
);

export default Disclaimer;
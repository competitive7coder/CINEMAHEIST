import React from "react";

const terms = [
  {
    num: "1", title: "Acceptance of Terms",
    text: "By accessing or using CinemaHeist, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use CinemaHeist. We reserve the right to update these terms at any time without prior notice."
  },
  {
    num: "2", title: "Nature of the Service",
    text: "CinemaHeist is a movie discovery and recommendation platform. We reference movie metadata and provide discovery features. CinemaHeist does not host, upload, store, or distribute any video or media content. All content references originate from independent third-party platforms."
  },
  {
    num: "3", title: "User Accounts",
    text: "You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to update it as necessary. CinemaHeist reserves the right to suspend or terminate accounts that violate these terms."
  },
  {
    num: "4", title: "Acceptable Use",
    text: "You agree not to: (a) use CinemaHeist for any unlawful purpose, (b) attempt to gain unauthorized access to any part of the service, (c) reverse engineer or copy any part of CinemaHeist, (d) use automated bots or scrapers on the platform, (e) harass, abuse, or harm other users, (f) upload malicious code or content."
  },
  {
    num: "5", title: "Third-Party Content",
    text: "CinemaHeist references external media resources. We are not responsible for the availability, compliance, or quality of third-party hosts. If you encounter content you believe violates policies, please report it via our DMCA page. The appearance of external links does not constitute an endorsement."
  },
  {
    num: "6", title: "Intellectual Property",
    text: "All CinemaHeist branding, code, design, and original content is the intellectual property of CinemaHeist. You may not copy, reproduce, or distribute CinemaHeist's work without written permission."
  },
  {
    num: "7", title: "Disclaimer of Warranties",
    text: 'CinemaHeist is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that external assets will be available at all times. CinemaHeist is not responsible for content served by third-party hosts.'
  },
  {
    num: "8", title: "Limitation of Liability",
    text: "CinemaHeist shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability for any claims arising from these terms shall not exceed the amount you paid to use CinemaHeist (which is zero, as CinemaHeist is free)."
  },
  {
    num: "9", title: "DMCA & Copyright",
    text: "CinemaHeist respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA) and India's IT Act 2000, Section 79. Copyright owners may submit takedown notices to dmca.CinemaHeist@proton.me. We will respond within 48 hours and process requests in good faith."
  },
  {
    num: "10", title: "Governing Law",
    text: "These terms are governed by the laws of India. Any disputes arising from use of CinemaHeist shall be subject to the jurisdiction of courts in West Bengal, India."
  },
  {
    num: "11", title: "Contact",
    text: "For any questions about these Terms of Use, contact us at: dmca.CinemaHeist@proton.me"
  },
];

const TermsOfUse = () => (
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
      .legal-section { margin-bottom: 32px; padding: 20px 22px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; }
      .legal-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
      .legal-num { width: 28px; height: 28px; background: #e50914; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 700; flex-shrink: 0; }
      .legal-section-title { font-size: 0.92rem; font-weight: 700; color: #fff; }
      .legal-section-text { font-size: 0.82rem; color: rgba(255,255,255,0.38); line-height: 1.8; font-weight: 300; padding-left: 40px; }
      .legal-footer-note { margin-top: 48px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; text-align: center; }
      .legal-footer-note p { font-size: 0.75rem; color: rgba(255,255,255,0.2); line-height: 1.7; font-weight: 300; }
    `}</style>

    <div className="legal-hero">
      <div className="legal-badge"> Legal</div>
      <h1>Terms of <span>Use</span></h1>
      <p>Please read these terms carefully before using CinemaHeist. By using our service, you agree to these terms.</p>
      <div className="legal-updated">Last updated: March 2026</div>
    </div>

    <div className="legal-container">
      {terms.map((s) => (
        <div key={s.num} className="legal-section">
          <div className="legal-section-header">
            <div className="legal-num">{s.num}</div>
            <div className="legal-section-title">{s.title}</div>
          </div>
          <div className="legal-section-text">{s.text}</div>
        </div>
      ))}
      <div className="legal-footer-note">
        <p>These Terms of Use constitute the entire agreement between you and CinemaHeist. If any provision is found unenforceable, the remaining provisions remain in full effect.</p>
      </div>
    </div>
  </div>
);

export default TermsOfUse;
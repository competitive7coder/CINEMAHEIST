import{j as e}from"./chunk-ui-Z2Pwl_H2.js";import"./chunk-react-B2a0IqF-.js";const i=[{num:"1",title:"Information We Collect",content:[{heading:"Account Information",text:"When you register, we collect your name, email address, and password (stored encrypted). We do not collect your phone number, payment information, or government ID."},{heading:"Usage Data",text:"We collect data about how you use StreamHub — movies you view, search queries, watchlist items, and interaction patterns. This data is used solely to power our ML recommendation engine."},{heading:"Technical Data",text:"We automatically collect your IP address, browser type, device type, and session timestamps for security and performance purposes."}]},{num:"2",title:"How We Use Your Information",content:[{heading:"Personalized Recommendations",text:"Your watchlist and viewing patterns feed our hybrid ML recommendation engine (TF-IDF, SVD, temporal decay) to suggest relevant movies."},{heading:"Account Management",text:"Your email is used for account verification, password resets, and important service updates. We do not send marketing emails without your explicit consent."},{heading:"Security",text:"IP addresses and session data help us detect unauthorized access and protect your account."}]},{num:"3",title:"What We Do NOT Do",content:[{heading:"We do not sell your data",text:"Your personal information is never sold, rented, or traded to third parties for marketing purposes."},{heading:"We do not host video content",text:"StreamHub does not store, upload, or serve any video files. All streaming is handled by independent third-party embed providers."},{heading:"We do not track across sites",text:"We do not use cross-site tracking cookies or third-party advertising trackers."}]},{num:"4",title:"Third-Party Services",content:[{heading:"TMDB API",text:"We use The Movie Database (TMDB) API for all movie metadata — titles, posters, descriptions, and ratings. TMDB has its own privacy policy available at themoviedb.org."},{heading:"Embed Providers",text:"Video content is served by third-party embed providers (vidsrc, 2embed, etc.). These providers have their own privacy policies and data practices we do not control."},{heading:"Cloudinary",text:"User avatars are stored and served via Cloudinary. Cloudinary's privacy policy applies to avatar data."}]},{num:"5",title:"Data Storage & Security",content:[{heading:"Storage",text:"Your data is stored in MongoDB Atlas with encryption at rest. Passwords are hashed using bcrypt and never stored in plain text."},{heading:"JWT Authentication",text:"We use JSON Web Tokens (JWT) for session management. Tokens expire automatically and are never stored on our servers."},{heading:"Retention",text:"We retain your account data as long as your account is active. You may request deletion at any time by contacting us."}]},{num:"6",title:"Your Rights",content:[{heading:"Access",text:"You can view all data we hold about you by visiting your profile page."},{heading:"Deletion",text:"You can delete your account and all associated data at any time from Settings → Delete Account."},{heading:"Correction",text:"You can update your profile information at any time from your profile settings."}]},{num:"7",title:"Contact Us",content:[{heading:"Privacy concerns",text:"For any privacy-related questions or data requests, email us at: dmca.streamhub@proton.me"}]}],s=()=>e.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:"'Poppins', sans-serif"},children:[e.jsx("style",{children:`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .legal-hero {
        background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        padding: 80px 20px 60px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .legal-hero::before {
        content: '';
        position: absolute;
        top: -80px; left: 50%;
        transform: translateX(-50%);
        width: 500px; height: 250px;
        background: radial-gradient(ellipse, rgba(229,9,20,0.07) 0%, transparent 70%);
        pointer-events: none;
      }
      .legal-badge {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(229,9,20,0.1); border: 1px solid rgba(229,9,20,0.2);
        border-radius: 20px; padding: 6px 16px;
        font-size: 0.7rem; font-weight: 600; color: #e50914;
        letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;
      }
      .legal-hero h1 { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 700; color: #fff; margin-bottom: 12px; }
      .legal-hero h1 span { color: #e50914; }
      .legal-hero p { font-size: 0.88rem; color: rgba(255,255,255,0.38); max-width: 480px; margin: 0 auto; line-height: 1.7; font-weight: 300; }
      .legal-updated { display: inline-block; margin-top: 16px; font-size: 0.72rem; color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 4px 12px; }
      .legal-container { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
      .legal-section { margin-bottom: 44px; }
      .legal-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
      .legal-num { width: 30px; height: 30px; background: #e50914; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; }
      .legal-section-title { font-size: 0.95rem; font-weight: 700; color: #fff; }
      .legal-item { padding: 14px 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px; }
      .legal-item-heading { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.7); margin-bottom: 5px; }
      .legal-item-text { font-size: 0.8rem; color: rgba(255,255,255,0.38); line-height: 1.7; font-weight: 300; }
      .legal-footer-note { margin-top: 48px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; text-align: center; }
      .legal-footer-note p { font-size: 0.75rem; color: rgba(255,255,255,0.2); line-height: 1.7; font-weight: 300; }
    `}),e.jsxs("div",{className:"legal-hero",children:[e.jsx("div",{className:"legal-badge",children:"🔒 Privacy"}),e.jsxs("h1",{children:["Privacy ",e.jsx("span",{children:"Policy"})]}),e.jsx("p",{children:"We believe in transparency. Here's exactly what data we collect, why we collect it, and how it's used."}),e.jsx("div",{className:"legal-updated",children:"Last updated: March 2026"})]}),e.jsxs("div",{className:"legal-container",children:[i.map(t=>e.jsxs("div",{className:"legal-section",children:[e.jsxs("div",{className:"legal-section-header",children:[e.jsx("div",{className:"legal-num",children:t.num}),e.jsx("div",{className:"legal-section-title",children:t.title})]}),t.content.map((a,o)=>e.jsxs("div",{className:"legal-item",children:[e.jsx("div",{className:"legal-item-heading",children:a.heading}),e.jsx("div",{className:"legal-item-text",children:a.text})]},o))]},t.num)),e.jsx("div",{className:"legal-footer-note",children:e.jsx("p",{children:"This privacy policy applies to StreamHub and all its features. By using StreamHub, you agree to this policy. We may update this policy occasionally — significant changes will be communicated via email."})})]})]});export{s as default};

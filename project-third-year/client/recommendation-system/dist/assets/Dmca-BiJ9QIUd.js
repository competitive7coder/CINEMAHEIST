import{j as e}from"./chunk-ui-Z2Pwl_H2.js";import{r as n}from"./chunk-react-B2a0IqF-.js";const c=()=>{const[a,o]=n.useState(!1),r=()=>{navigator.clipboard.writeText("dmca.streamhub@proton.me"),o(!0),setTimeout(()=>o(!1),2e3)};return e.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:"'Poppins', sans-serif",padding:"0"},children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dmca-hero {
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 80px 20px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .dmca-hero::before {
          content: '';
          position: absolute;
          top: -100px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(229,9,20,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .dmca-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(229,9,20,0.1);
          border: 1px solid rgba(229,9,20,0.2);
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #e50914;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .dmca-hero h1 {
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .dmca-hero h1 span { color: #e50914; }
        .dmca-hero p {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.45);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
        }
        .dmca-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 60px 20px;
        }
        .dmca-notice-box {
          background: rgba(229,9,20,0.06);
          border: 1px solid rgba(229,9,20,0.15);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 48px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .dmca-notice-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
        .dmca-notice-text { font-size: 0.82rem; color: rgba(255,255,255,0.5); line-height: 1.7; }
        .dmca-notice-text strong { color: rgba(255,255,255,0.8); font-weight: 600; }
        .dmca-section { margin-bottom: 48px; }
        .dmca-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dmca-section-num {
          width: 32px; height: 32px;
          background: #e50914;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
        }
        .dmca-section-title { font-size: 1rem; font-weight: 700; color: #fff; }
        .dmca-section p { font-size: 0.85rem; color: rgba(255,255,255,0.45); line-height: 1.8; margin-bottom: 12px; font-weight: 300; }
        .dmca-section p strong { color: rgba(255,255,255,0.75); font-weight: 600; }
        .dmca-steps { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
        .dmca-step {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
        }
        .dmca-step-dot { width: 6px; height: 6px; background: #e50914; border-radius: 50%; flex-shrink: 0; margin-top: 7px; }
        .dmca-step-text { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.6; font-weight: 300; }
        .dmca-step-text strong { color: rgba(255,255,255,0.75); font-weight: 600; }
        .dmca-contact-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 28px;
          margin-top: 16px;
        }
        .dmca-contact-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 10px; }
        .dmca-contact-email { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 16px; }
        .dmca-contact-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .dmca-copy-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 18px;
          background: #e50914; border: none; border-radius: 8px;
          color: #fff; font-family: 'Poppins', sans-serif;
          font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .dmca-copy-btn:hover { background: #ff1a1a; transform: translateY(-1px); }
        .dmca-copy-btn.copied { background: #16a34a; }
        .dmca-response-tag {
          padding: 9px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          font-size: 0.72rem; color: rgba(255,255,255,0.35); font-weight: 500;
        }
        .dmca-timeline { display: flex; flex-direction: column; gap: 0; margin-top: 16px; position: relative; }
        .dmca-timeline::before {
          content: ''; position: absolute;
          left: 15px; top: 20px; bottom: 20px;
          width: 1px; background: rgba(255,255,255,0.06);
        }
        .dmca-timeline-item { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; }
        .dmca-timeline-dot {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.4);
          flex-shrink: 0; position: relative; z-index: 1;
        }
        .dmca-timeline-dot.active { background: rgba(229,9,20,0.15); border-color: rgba(229,9,20,0.3); color: #e50914; }
        .dmca-timeline-content { padding-top: 5px; }
        .dmca-timeline-title { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.75); margin-bottom: 3px; }
        .dmca-timeline-sub { font-size: 0.72rem; color: rgba(255,255,255,0.3); font-weight: 300; line-height: 1.5; }
        .dmca-footer-note {
          margin-top: 60px; padding: 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; text-align: center;
        }
        .dmca-footer-note p { font-size: 0.78rem; color: rgba(255,255,255,0.25); line-height: 1.7; font-weight: 300; }
        .dmca-footer-note p strong { color: rgba(255,255,255,0.45); font-weight: 600; }
        @media (max-width: 600px) {
          .dmca-hero { padding: 60px 16px 40px; }
          .dmca-container { padding: 40px 16px; }
          .dmca-contact-row { flex-direction: column; align-items: flex-start; }
        }
      `}),e.jsxs("div",{className:"dmca-hero",children:[e.jsx("div",{className:"dmca-badge",children:"⚖️ Legal"}),e.jsxs("h1",{children:["DMCA & Copyright ",e.jsx("span",{children:"Policy"})]}),e.jsx("p",{children:"StreamHub respects intellectual property rights. We do not host any video content — all streams are served by third-party embed providers."})]}),e.jsxs("div",{className:"dmca-container",children:[e.jsxs("div",{className:"dmca-notice-box",children:[e.jsx("div",{className:"dmca-notice-icon",children:"📌"}),e.jsxs("div",{className:"dmca-notice-text",children:[e.jsx("strong",{children:"Important:"})," StreamHub is an automated index that embeds publicly available streaming players. We do not upload, store, or host any video, audio, or media files on our servers. All content is hosted by independent third-party providers such as vidsrc, 2embed, and similar services. StreamHub functions solely as a search and discovery platform."]})]}),e.jsxs("div",{className:"dmca-section",children:[e.jsxs("div",{className:"dmca-section-header",children:[e.jsx("div",{className:"dmca-section-num",children:"1"}),e.jsx("div",{className:"dmca-section-title",children:"What StreamHub Does"})]}),e.jsxs("p",{children:["StreamHub uses the ",e.jsx("strong",{children:"TMDB API"})," for movie metadata (titles, posters, descriptions, ratings). We do not store or serve any video content ourselves. All playback is handled by third-party embed players embedded via iframe."]}),e.jsxs("p",{children:["We operate similarly to a ",e.jsx("strong",{children:"search engine"})," — we index and link to content hosted elsewhere. We have no control over what those third-party providers host or serve."]})]}),e.jsxs("div",{className:"dmca-section",children:[e.jsxs("div",{className:"dmca-section-header",children:[e.jsx("div",{className:"dmca-section-num",children:"2"}),e.jsx("div",{className:"dmca-section-title",children:"Reporting Copyright Infringement"})]}),e.jsx("p",{children:"If you are a copyright owner and believe your content is being infringed, please send a DMCA notice to our designated agent. Your notice must include:"}),e.jsx("div",{className:"dmca-steps",children:[{title:"Identification of the copyrighted work",desc:"Title of the movie, series, or content you believe is being infringed."},{title:"URL of the infringing content",desc:"The specific page URL on StreamHub where the content appears."},{title:"Your contact information",desc:"Name, email address, and mailing address of the copyright owner or authorized agent."},{title:"Good faith statement",desc:'"I have a good faith belief that the use of the copyrighted material is not authorized by the copyright owner, its agent, or the law."'},{title:"Accuracy statement",desc:'"The information in this notice is accurate and, under penalty of perjury, I am authorized to act on behalf of the copyright owner."'},{title:"Your electronic signature",desc:"Full legal name of the copyright owner or authorized representative."}].map((t,i)=>e.jsxs("div",{className:"dmca-step",children:[e.jsx("div",{className:"dmca-step-dot"}),e.jsxs("div",{className:"dmca-step-text",children:[e.jsxs("strong",{children:[t.title," —"]})," ",t.desc]})]},i))})]}),e.jsxs("div",{className:"dmca-section",children:[e.jsxs("div",{className:"dmca-section-header",children:[e.jsx("div",{className:"dmca-section-num",children:"3"}),e.jsx("div",{className:"dmca-section-title",children:"Contact Our DMCA Agent"})]}),e.jsx("p",{children:"Send your completed DMCA notice to our designated copyright agent:"}),e.jsxs("div",{className:"dmca-contact-card",children:[e.jsx("div",{className:"dmca-contact-label",children:"DMCA Agent Email"}),e.jsx("div",{className:"dmca-contact-email",children:"dmca.streamhub@proton.me"}),e.jsxs("div",{className:"dmca-contact-row",children:[e.jsx("button",{className:`dmca-copy-btn ${a?"copied":""}`,onClick:r,children:a?"✓ Copied":"📋 Copy Email"}),e.jsx("div",{className:"dmca-response-tag",children:"⏱ Response within 48 hours"})]})]})]}),e.jsxs("div",{className:"dmca-section",children:[e.jsxs("div",{className:"dmca-section-header",children:[e.jsx("div",{className:"dmca-section-num",children:"4"}),e.jsx("div",{className:"dmca-section-title",children:"What Happens After You Report"})]}),e.jsx("div",{className:"dmca-timeline",children:[{step:"01",title:"Notice received",sub:"We receive your DMCA notice at our designated email.",active:!0},{step:"02",title:"Review within 48 hours",sub:"Our team reviews the claim and verifies the reported content.",active:!1},{step:"03",title:"Content removed",sub:"We remove the infringing page from StreamHub within 48–72 hours.",active:!1},{step:"04",title:"Provider notified",sub:"We forward the notice to the relevant embed provider for further action.",active:!1}].map((t,i)=>e.jsxs("div",{className:"dmca-timeline-item",children:[e.jsx("div",{className:`dmca-timeline-dot ${t.active?"active":""}`,children:t.step}),e.jsxs("div",{className:"dmca-timeline-content",children:[e.jsx("div",{className:"dmca-timeline-title",children:t.title}),e.jsx("div",{className:"dmca-timeline-sub",children:t.sub})]})]},i))})]}),e.jsxs("div",{className:"dmca-section",children:[e.jsxs("div",{className:"dmca-section-header",children:[e.jsx("div",{className:"dmca-section-num",children:"5"}),e.jsx("div",{className:"dmca-section-title",children:"Counter Notices"})]}),e.jsxs("p",{children:["If you believe your content was removed incorrectly, you may submit a counter notice. Under ",e.jsx("strong",{children:"DMCA Section 512(g)"}),", we may restore removed content within ",e.jsx("strong",{children:"10–14 business days"})," after receiving a valid counter notice, unless the original claimant files a court action."]}),e.jsx("p",{children:"Counter notices must include your name, address, phone number, identification of the removed content, a good faith statement, and your electronic signature."})]}),e.jsx("div",{className:"dmca-footer-note",children:e.jsxs("p",{children:["StreamHub operates under ",e.jsx("strong",{children:"IT Act 2000, Section 79"})," safe harbour provisions as an intermediary platform. We respond to all valid copyright complaints in good faith. This policy was last updated ",e.jsx("strong",{children:"March 2026"}),"."]})})]})]})};export{c as default};

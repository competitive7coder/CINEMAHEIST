import{j as e,M as L}from"./chunk-ui-Z2Pwl_H2.js";import{r as t,u as W}from"./chunk-react-B2a0IqF-.js";import{a as q}from"./api-DKlbdnFA.js";import{k as K,l as I,m as U,n as G,e as X,o as J}from"./index-CwUIGroc.js";const Q=`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* ── Base Modal ── */
.watch-modal .modal-dialog { max-width: 1160px; width: 98vw; margin: 10px auto; }
.watch-modal .modal-content {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.85);
}
.watch-modal .modal-body { padding: 0; background: #000; }

/* Theater mode */
.watch-modal.theater-mode .modal-dialog { max-width: 100vw; width: 100vw; margin: 0; }
.watch-modal.theater-mode .modal-content { border-radius: 0; border: none; min-height: 100vh; }

/* Mini player */
.watch-modal.minimized .modal-dialog {
  position: fixed; bottom: 20px; right: 20px;
  max-width: 370px; width: 370px; margin: 0; z-index: 9999;
}
.watch-modal.minimized .modal-content { border-radius: 12px; box-shadow: 0 16px 50px rgba(0,0,0,0.8); }
.watch-modal.minimized .watch-frame { height: 208px !important; }
.watch-modal.minimized .wm-caption-panel,
.watch-modal.minimized .wm-shortcuts-panel,
.watch-modal.minimized .wm-hindi-na,
.watch-modal.minimized .wm-controls,
.watch-modal.minimized .wm-notice { display: none; }

/* ── Top Bar ── */
.wm-topbar {
  background: linear-gradient(180deg,#111 0%,#0d0d0d 100%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 10px 14px;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.wm-title {
  color: #fff; font-family: 'Poppins',sans-serif; font-size: 0.82rem; font-weight: 700;
  margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 180px; flex-shrink: 0; display: flex; align-items: center; gap: 6px;
}
.wm-title-dot {
  width: 7px; height: 7px; background: #e50914; border-radius: 50%; flex-shrink: 0;
  animation: wm-pulse 1.5s ease-in-out infinite;
}
@keyframes wm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
.wm-controls { display: flex; gap: 6px; align-items: center; flex: 1; flex-wrap: wrap; justify-content: center; }

/* Server tabs */
.wm-tab-group {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; overflow: hidden; padding: 3px; gap: 2px;
}
.wm-tab {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 5px 12px; background: none; border: none; border-radius: 7px;
  color: rgba(255,255,255,0.45); font-family: 'Poppins',sans-serif;
  font-size: 0.65rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
  white-space: nowrap; line-height: 1.2; position: relative;
}
.wm-tab:hover { background: rgba(255,255,255,0.07); color: #fff; }
.wm-tab.active { background: #e50914; color: #fff; box-shadow: 0 2px 10px rgba(229,9,20,0.3); }
.wm-tab.hindi-tab.active { background: #f97316; box-shadow: 0 2px 10px rgba(249,115,22,0.35); }
.wm-tab-sub { font-size: 0.52rem; font-weight: 400; opacity: 0.75; }
.wm-tab.active .wm-tab-sub { opacity: 0.9; }
.wm-tab-verified { position: absolute; top: 3px; right: 3px; width: 5px; height: 5px; background: #4ade80; border-radius: 50%; }
.wm-sep { width: 1px; height: 22px; background: rgba(255,255,255,0.08); flex-shrink: 0; margin: 0 2px; }

/* Language selector */
.wm-lang-wrap { position: relative; display: flex; align-items: center; }
.wm-lang-icon { position: absolute; left: 8px; font-size: 0.72rem; color: rgba(255,255,255,0.4); pointer-events: none; z-index: 1; }
.wm-lang-select {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 5px 26px 5px 26px; color: rgba(255,255,255,0.75);
  font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 600;
  cursor: pointer; outline: none; transition: all 0.2s; appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center;
}
.wm-lang-select:hover { border-color: rgba(255,255,255,0.22); color: #fff; background-color: rgba(255,255,255,0.08); }
.wm-lang-select option { background: #1a1a1a; color: #fff; }

/* Action buttons */
.wm-action-btn {
  display: flex; align-items: center; gap: 5px; padding: 5px 11px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 8px; color: rgba(255,255,255,0.6); font-family: 'Poppins',sans-serif;
  font-size: 0.65rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  white-space: nowrap; position: relative;
}
.wm-action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
.wm-action-btn.active { background: rgba(229,9,20,0.15); border-color: rgba(229,9,20,0.35); color: #ff6060; }
.wm-action-btn.theater-active { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.35); color: #f59e0b; }
.wm-action-btn i { font-size: 0.8rem; }
.wm-action-btn .wm-tooltip {
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
  padding: 4px 8px; font-size: 0.6rem; color: #fff; white-space: nowrap;
  pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 100;
}
.wm-action-btn:hover .wm-tooltip { opacity: 1; }
.wm-shortcut-badge {
  display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 3px; padding: 1px 4px; font-size: 0.5rem; color: rgba(255,255,255,0.4); margin-left: 2px;
}

/* Close */
.wm-close {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; color: rgba(255,255,255,0.6); width: 32px; height: 32px; min-width: 32px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  font-size: 0.85rem; transition: all 0.2s; flex-shrink: 0; margin-left: auto;
}
.wm-close:hover { background: rgba(229,9,20,0.25); border-color: rgba(229,9,20,0.4); color: #ff4444; transform: scale(1.05); }

/* ── Notice Bar ── */
.wm-notice {
  background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 5px 16px; font-family: 'Poppins',sans-serif; font-size: 0.65rem;
  color: rgba(255,255,255,0.25); display: flex; align-items: center; gap: 6px; justify-content: space-between;
}
.wm-notice-left { display: flex; align-items: center; gap: 6px; }
.wm-notice-badges { display: flex; align-items: center; gap: 6px; }
.wm-quality-badge {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px; padding: 2px 8px; font-size: 0.6rem; font-weight: 700;
  color: rgba(255,255,255,0.5); letter-spacing: 0.5px; font-family: 'Poppins',sans-serif;
}
.wm-quality-badge.hd  { color: #60a5fa; border-color: rgba(96,165,250,0.3);  background: rgba(96,165,250,0.08); }
.wm-quality-badge.fhd { color: #4ade80; border-color: rgba(74,222,128,0.3);  background: rgba(74,222,128,0.08); }
.wm-quality-badge.uhd { color: #f59e0b; border-color: rgba(245,158,11,0.3);  background: rgba(245,158,11,0.08); }
.wm-lang-badge {
  background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.25);
  border-radius: 4px; padding: 2px 8px; font-size: 0.6rem; font-weight: 600;
  color: #fb923c; letter-spacing: 0.3px; font-family: 'Poppins',sans-serif;
}

/* ── Player ── */
.wm-player-wrapper { position: relative; width: 100%; background: #000; }
.wm-player-wrapper.fullscreen-active { position: fixed; inset: 0; z-index: 99999; border-radius: 0; }
.watch-frame { width: 100%; height: 560px; border: none; display: block; background: #000; }
.watch-modal.theater-mode .watch-frame { height: calc(100vh - 110px) !important; }
.wm-player-wrapper.fullscreen-active .watch-frame { height: 100vh !important; }

/* Overlay controls */
.wm-fs-controls {
  position: absolute; top: 14px; right: 14px; display: flex; gap: 8px;
  pointer-events: all; opacity: 0; transition: opacity 0.25s ease;
}
.wm-player-wrapper:hover .wm-fs-controls,
.wm-player-wrapper.fullscreen-active .wm-fs-controls { opacity: 1; }
.wm-fs-btn {
  background: rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
  color: #fff; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 0.9rem; transition: all 0.2s; backdrop-filter: blur(10px);
}
.wm-fs-btn:hover { background: rgba(229,9,20,0.45); border-color: rgba(229,9,20,0.55); transform: scale(1.08); }

/* Fullscreen bottom bar */
.wm-fs-bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 16px 20px 14px;
  background: linear-gradient(0deg,rgba(0,0,0,0.9) 0%,transparent 100%);
  display: flex; align-items: center; gap: 12px;
  pointer-events: all; opacity: 0; transition: opacity 0.25s ease;
}
.wm-player-wrapper.fullscreen-active:hover .wm-fs-bottom { opacity: 1; }
.wm-fs-bottom-title { font-family: 'Poppins',sans-serif; font-size: 0.85rem; font-weight: 700; color: #fff; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wm-fs-mini-btn {
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); border-radius: 7px;
  color: #fff; padding: 6px 12px; font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.2s; backdrop-filter: blur(8px);
}
.wm-fs-mini-btn:hover { background: rgba(229,9,20,0.35); border-color: rgba(229,9,20,0.4); }

/* ── Hindi Not Available ── */
.wm-hindi-na {
  width: 100%; padding: 40px 20px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; text-align: center; background: #000;
  border-top: 1px solid rgba(255,255,255,0.05);
  animation: slideDown 0.2s ease;
}
@keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
.wm-hindi-na-icon { font-size: 3rem; }
.wm-hindi-na-title { font-family: 'Poppins',sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0; }
.wm-hindi-na-sub { font-family: 'Poppins',sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.4); margin: 0; max-width: 400px; line-height: 1.7; }
.wm-hindi-na-hint { font-family: 'Poppins',sans-serif; font-size: 0.7rem; color: rgba(255,255,255,0.2); margin: 0; }
.wm-hindi-na-actions { display: flex; gap: 10px; margin-top: 6px; }
.wm-hindi-na-eng-btn {
  padding: 9px 22px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; color: rgba(255,255,255,0.7); font-family: 'Poppins',sans-serif;
  font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.wm-hindi-na-eng-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }

/* ── Subtitles Panel ── */
.wm-caption-panel {
  background: #0f0f0f; border-top: 1px solid rgba(255,255,255,0.06);
  padding: 12px 16px; animation: slideDown 0.2s ease;
}
.wm-caption-title {
  font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 10px;
}
.wm-caption-langs { display: flex; gap: 6px; flex-wrap: wrap; }
.wm-caption-btn {
  padding: 5px 13px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; color: rgba(255,255,255,0.5); font-family: 'Poppins',sans-serif;
  font-size: 0.65rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
}
.wm-caption-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
.wm-caption-btn.active { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.35); color: #60a5fa; }
.wm-caption-note { margin-top: 10px; font-family: 'Poppins',sans-serif; font-size: 0.62rem; color: rgba(255,255,255,0.2); }

/* ── Shortcuts Panel ── */
.wm-shortcuts-panel {
  background: #0f0f0f; border-top: 1px solid rgba(255,255,255,0.06);
  padding: 14px 18px; animation: slideDown 0.2s ease;
}
.wm-shortcuts-title {
  font-family: 'Poppins',sans-serif; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 10px;
}
.wm-shortcuts-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); gap: 6px; }
.wm-shortcut-item { display: flex; align-items: center; gap: 8px; padding: 5px 8px; background: rgba(255,255,255,0.03); border-radius: 6px; }
.wm-shortcut-key { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 5px; padding: 2px 7px; font-family: monospace; font-size: 0.65rem; color: rgba(255,255,255,0.6); min-width: 28px; text-align: center; flex-shrink: 0; }
.wm-shortcut-label { font-family: 'Poppins',sans-serif; font-size: 0.62rem; color: rgba(255,255,255,0.35); }

/* ── Loading ── */
.wm-loading {
  width: 100%; height: 560px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; background: #000; gap: 16px;
}
.wm-spinner-ring {
  width: 48px; height: 48px; border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.06); border-top-color: #e50914;
  animation: wm-spin 0.85s linear infinite;
}
@keyframes wm-spin { to { transform: rotate(360deg); } }
.wm-loading p { font-family: 'Poppins',sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.3); margin: 0; }
.wm-loading small { font-family: 'Poppins',sans-serif; font-size: 0.65rem; color: rgba(255,255,255,0.14); }

/* ── Error ── */
.wm-error { width: 100%; height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: #000; }
.wm-error-icon { font-size: 2.5rem; opacity: 0.5; }
.wm-error p { font-family: 'Poppins',sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.3); margin: 0; }
.wm-retry-btn {
  margin-top: 6px; padding: 9px 24px; background: #e50914; border: none; border-radius: 9px;
  color: #fff; font-family: 'Poppins',sans-serif; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(229,9,20,0.3);
}
.wm-retry-btn:hover { background: #ff1a1a; transform: translateY(-1px); }

/* ── Not Available ── */
.wm-not-available {
  width: 100%; height: 420px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; background: #000; gap: 12px; padding: 2rem; text-align: center;
}
.wm-na-icon { font-size: 3.2rem; margin-bottom: 8px; }
.wm-na-title { font-family: 'Poppins',sans-serif; font-size: 1.25rem; font-weight: 700; color: #fff; margin: 0; }
.wm-na-sub { font-family: 'Poppins',sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin: 0; max-width: 420px; }
.wm-na-hint { font-family: 'Poppins',sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.25); margin: 0; max-width: 400px; line-height: 1.7; }
.wm-na-actions { display: flex; gap: 10px; margin-top: 8px; }
.wm-na-btn-try { padding: 10px 24px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; color: rgba(255,255,255,0.7); font-family: 'Poppins',sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.wm-na-btn-try:hover { background: rgba(255,255,255,0.12); color: #fff; }
.wm-na-btn-close { padding: 10px 24px; background: #e50914; border: none; border-radius: 9px; color: #fff; font-family: 'Poppins',sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.wm-na-btn-close:hover { background: #ff1a1a; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .watch-modal .modal-dialog { width: 100vw; margin: 0; }
  .watch-modal .modal-content { border-radius: 0; }
  .watch-frame { height: 240px !important; }
  .wm-loading { height: 240px; }
  .wm-title { max-width: 100px; }
  .wm-controls { gap: 4px; }
  .wm-tab { padding: 4px 8px; font-size: 0.6rem; }
  .wm-action-btn { padding: 4px 8px; font-size: 0.6rem; }
  .wm-lang-select { font-size: 0.6rem; }
  .wm-shortcuts-grid { grid-template-columns: repeat(2,1fr); }
}
`,V=[{code:"en",label:"🇺🇸 English"},{code:"hi",label:"🇮🇳 Hindi"}],Z=["English","Hindi","Spanish","French","German","Arabic","Japanese","Korean","Portuguese","Chinese","Italian","Russian"],ee=[{key:"F",label:"Fullscreen"},{key:"T",label:"Theater mode"},{key:"M",label:"Mini player"},{key:"C",label:"Subtitles"},{key:"K",label:"Shortcuts"},{key:"Esc",label:"Exit fullscreen"},{key:"← →",label:"Switch server"}],ae=r=>r?r==="4K"?"uhd":r==="1080p"?"fhd":r==="720p"?"hd":"":"",re=({show:r,handleClose:k,tmdbId:x,movieTitle:h})=>{const[w,y]=t.useState(0),[i,j]=t.useState(null),[o,C]=t.useState(!1),[P,v]=t.useState(!1),[b,p]=t.useState(!1),[f,g]=t.useState(!1),[u,s]=t.useState(!1),[N,S]=t.useState(!1),[M,E]=t.useState(!1),[F,$]=t.useState(null),[c,T]=t.useState("en"),H=t.useRef(null),A=t.useCallback(async a=>{if(!x)return;const d=a||c;C(!0),v(!1);try{const m=await q.get(`/stream/sources/${x}?language=${d}`);j(m.data),y(0)}catch(m){console.error(m),v(!0)}finally{C(!1)}},[x,c]);t.useEffect(()=>{r&&(y(0),j(null),v(!1),p(!1),g(!1),s(!1),S(!1),E(!1),$(null),T("en"),A("en"))},[r,x]),t.useEffect(()=>{r&&i&&A(c)},[r,c]),t.useEffect(()=>{if(!r)return;const a=d=>{var _;const m=(_=document.activeElement)==null?void 0:_.tagName;if(!(m==="INPUT"||m==="SELECT"||m==="TEXTAREA"))switch(d.key.toLowerCase()){case"f":p(l=>!l),g(!1);break;case"t":s(l=>!l),g(!1),p(!1);break;case"m":g(l=>!l),p(!1),s(!1);break;case"c":S(l=>!l);break;case"k":E(l=>!l);break;case"escape":b&&p(!1);break;case"arrowleft":y(l=>Math.max(0,l-1));break;case"arrowright":y(l=>Math.min((z.length||1)-1,l+1));break}};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[r,b]);const z=i?[...i.embed_sources||[],...(i.direct_streams||[]).slice(0,3).map((a,d)=>({name:`Direct ${d+1}`,label:a.quality||"HD",type:"direct",url:a.url,verified:!0,isDirect:!0,quality:a.quality}))]:[],n=z[w],B=()=>{p(a=>!a),g(!1),s(!1)},D=()=>{s(a=>!a),g(!1),p(!1)},Y=()=>{g(a=>!a),p(!1),s(!1)},O=()=>{n!=null&&n.url&&window.open(n.url,"_blank","noopener,noreferrer")},R=["watch-modal",f?"minimized":"",u&&!f?"theater-mode":""].filter(Boolean).join(" ");return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:Q}),e.jsxs(L,{show:r,onHide:k,centered:!f&&!u,className:R,backdrop:!f,keyboard:!1,children:[e.jsxs("div",{className:"wm-topbar",children:[e.jsxs("p",{className:"wm-title",children:[e.jsx("span",{className:"wm-title-dot"}),h||"Now Playing"]}),e.jsxs("div",{className:"wm-controls",children:[!o&&z.length>0&&e.jsx("div",{className:"wm-tab-group",children:z.map((a,d)=>{var m;return e.jsxs("button",{className:`wm-tab ${(m=a.label)!=null&&m.includes("Dubbed")?"hindi-tab":""} ${w===d?"active":""}`,onClick:()=>y(d),children:[a.verified&&e.jsx("span",{className:"wm-tab-verified"}),a.name,e.jsx("span",{className:"wm-tab-sub",children:a.label})]},d)})}),o&&e.jsx("span",{style:{fontFamily:"Poppins",fontSize:"0.7rem",color:"rgba(255,255,255,0.3)"},children:"Finding sources..."}),!o&&z.length>0&&e.jsxs("div",{className:"wm-lang-wrap",children:[e.jsx(K,{className:"wm-lang-icon"}),e.jsx("select",{className:"wm-lang-select",value:c,onChange:a=>T(a.target.value),children:V.map(a=>e.jsx("option",{value:a.code,children:a.label},a.code))})]}),!o&&e.jsxs("button",{className:`wm-action-btn ${N?"active":""}`,onClick:()=>S(a=>!a),children:[e.jsx(I,{}),"CC",e.jsxs("span",{className:"wm-tooltip",children:["Subtitles ",e.jsx("span",{className:"wm-shortcut-badge",children:"C"})]})]}),!o&&!f&&e.jsxs("button",{className:`wm-action-btn ${u?"theater-active":""}`,onClick:D,children:[e.jsx("i",{className:`bi ${u?"bi-layout-sidebar":"bi-easel"}`}),u?"Exit":"Theater",e.jsxs("span",{className:"wm-tooltip",children:["Theater ",e.jsx("span",{className:"wm-shortcut-badge",children:"T"})]})]}),e.jsxs("button",{className:"wm-action-btn",onClick:O,children:[e.jsx(U,{}),e.jsx("span",{className:"wm-tooltip",children:"Open in new tab"})]}),e.jsxs("button",{className:"wm-action-btn",onClick:Y,children:[e.jsx("i",{className:`bi ${f?"bi-pip-fill":"bi-pip"}`}),e.jsxs("span",{className:"wm-tooltip",children:["Mini player ",e.jsx("span",{className:"wm-shortcut-badge",children:"M"})]})]}),!o&&e.jsxs("button",{className:`wm-action-btn ${M?"active":""}`,onClick:()=>E(a=>!a),children:[e.jsx(G,{}),e.jsxs("span",{className:"wm-tooltip",children:["Shortcuts ",e.jsx("span",{className:"wm-shortcut-badge",children:"K"})]})]})]}),e.jsx("button",{className:"wm-close",onClick:k,children:e.jsx(X,{})})]}),!o&&n&&e.jsxs("div",{className:"wm-notice",children:[e.jsxs("div",{className:"wm-notice-left",children:[e.jsx("span",{children:"💡"}),n.isDirect?"Direct stream — guaranteed correct movie.":n.name==="AutoEmbed"?"🇮🇳 Dual audio — select Hindi track inside the player.":n.name==="LetsEmbed"?"🇮🇳 Hindi dubbed server — availability varies by movie.":"Wrong movie or buffering? Switch server above."]}),e.jsxs("div",{className:"wm-notice-badges",children:[c==="hi"&&e.jsx("span",{className:"wm-lang-badge",children:"🇮🇳 Hindi"}),n.quality&&e.jsx("span",{className:`wm-quality-badge ${ae(n.quality)}`,children:n.quality})]})]}),e.jsxs(L.Body,{children:[o?e.jsxs("div",{className:"wm-loading",children:[e.jsx("div",{className:"wm-spinner-ring"}),e.jsx("p",{children:"Finding best sources..."}),e.jsx("small",{children:c==="hi"?"Searching Hindi dubbed servers...":"Loading servers..."})]}):P?e.jsxs("div",{className:"wm-error",children:[e.jsx("div",{className:"wm-error-icon",children:"⚠️"}),e.jsx("p",{children:"Could not load sources for this movie."}),e.jsx("button",{className:"wm-retry-btn",onClick:()=>A(c),children:"Try Again"})]}):i!=null&&i.not_available?e.jsxs("div",{className:"wm-not-available",children:[e.jsx("div",{className:"wm-na-icon",children:"🎬"}),e.jsx("h4",{className:"wm-na-title",children:"Not Available Yet"}),e.jsxs("p",{className:"wm-na-sub",children:[e.jsx("strong",{style:{color:"#fff"},children:h})," hasn't been released on streaming servers yet."]}),e.jsx("p",{className:"wm-na-hint",children:"Usually means the movie is still in theatres. Check back a few weeks after official release."}),e.jsxs("div",{className:"wm-na-actions",children:[e.jsx("button",{className:"wm-na-btn-try",onClick:()=>j(a=>({...a,not_available:!1})),children:"Try Anyway"}),e.jsx("button",{className:"wm-na-btn-close",onClick:k,children:"Close"})]})]}):n?e.jsxs(e.Fragment,{children:[c==="hi"&&(i==null?void 0:i.hindi_not_available)&&e.jsxs("div",{className:"wm-hindi-na",children:[e.jsx("div",{className:"wm-hindi-na-icon",children:"🇮🇳"}),e.jsx("h4",{className:"wm-hindi-na-title",children:"Hindi Dubbed Not Available"}),e.jsxs("p",{className:"wm-hindi-na-sub",children:[e.jsx("strong",{style:{color:"#fff"},children:h})," does not have a Hindi dubbed version available right now. Servers above may play the English version only."]}),e.jsx("p",{className:"wm-hindi-na-hint",children:"Try switching to English for the best experience."}),e.jsx("div",{className:"wm-hindi-na-actions",children:e.jsx("button",{className:"wm-hindi-na-eng-btn",onClick:()=>T("en"),children:"Switch to English"})})]}),e.jsxs("div",{className:`wm-player-wrapper ${b?"fullscreen-active":""}`,ref:H,children:[e.jsxs("div",{className:"wm-fs-controls",children:[!b&&e.jsx("button",{className:"wm-fs-btn",onClick:D,title:"Theater (T)",children:e.jsx("i",{className:`bi ${u?"bi-layout-sidebar":"bi-easel"}`})}),e.jsx("button",{className:"wm-fs-btn",onClick:B,title:"Fullscreen (F)",children:e.jsx("i",{className:`bi ${b?"bi-fullscreen-exit":"bi-fullscreen"}`})})]}),b&&e.jsxs("div",{className:"wm-fs-bottom",children:[e.jsxs("span",{className:"wm-fs-bottom-title",children:["🎬 ",h]}),e.jsxs("button",{className:"wm-fs-mini-btn",onClick:()=>S(a=>!a),children:[e.jsx("i",{className:"bi bi-badge-cc"})," CC"]}),e.jsxs("button",{className:"wm-fs-mini-btn",onClick:B,children:[e.jsx(J,{}),"Exit"]})]}),n.type==="direct"?e.jsx("video",{src:n.url,className:"watch-frame",controls:!0,autoPlay:!0,style:{background:"#000"}},`${x}-${w}-${c}`):e.jsx("iframe",{src:n.url,className:"watch-frame",allowFullScreen:!0,allow:"autoplay; fullscreen; picture-in-picture",title:h,referrerPolicy:"no-referrer"},`${x}-${w}-${c}`)]})]}):null,N&&!o&&!(i!=null&&i.not_available)&&e.jsxs("div",{className:"wm-caption-panel",children:[e.jsx("p",{className:"wm-caption-title",children:"Subtitles / Captions"}),e.jsxs("div",{className:"wm-caption-langs",children:[e.jsx("button",{className:`wm-caption-btn ${F===null?"active":""}`,onClick:()=>$(null),children:"Off"}),Z.map(a=>e.jsx("button",{className:`wm-caption-btn ${F===a?"active":""}`,onClick:()=>$(a),children:a},a))]}),e.jsx("p",{className:"wm-caption-note",children:"💡 Subtitles are provided by the embed player."})]}),M&&!o&&e.jsxs("div",{className:"wm-shortcuts-panel",children:[e.jsx("p",{className:"wm-shortcuts-title",children:"Keyboard Shortcuts"}),e.jsx("div",{className:"wm-shortcuts-grid",children:ee.map(({key:a,label:d})=>e.jsxs("div",{className:"wm-shortcut-item",children:[e.jsx("span",{className:"wm-shortcut-key",children:a}),e.jsx("span",{className:"wm-shortcut-label",children:d})]},a))})]})]})]})]})},oe=({movie:r,watchlist:k=[],onWatchTrailerClick:x,onWatchlistClick:h,isInWatchlist:w=null,isOnWatchlistPage:y=!1})=>{const i=W(),[j,o]=t.useState(!1),C=r.poster_path?`https://image.tmdb.org/t/p/w185${r.poster_path}`:"https://placehold.co/200x300?text=No+Image",P=r.release_date?new Date(r.release_date).getFullYear():"N/A",v=typeof r.vote_average=="number"?r.vote_average.toFixed(1):"N/A",b=w!==null?w:k.includes(r.id),p=()=>i(`/movie/${r.id}`),f=(s,N)=>{s.stopPropagation(),N&&N(r)},g=s=>{s.stopPropagation(),o(!0)};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
  .mc-card {
    position: relative;
    width: 100%; /* Fills the grid column */
    max-width: 160px;
    aspect-ratio: 2 / 3;
    border-radius: 10px;
    overflow: hidden;
    background: #111;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }

  /* Desktop Hover Effects */
  @media (min-width: 992px) {
    .mc-card:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);
      z-index: 50;
    }
    .mc-card:hover .mc-poster { filter: brightness(0.3); transform: scale(1.1); }
    .mc-card:hover .mc-overlay { opacity: 1; transform: translateY(0); }
    .mc-card:hover .mc-rating-badge { opacity: 0; }
  }

  .mc-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease, filter 0.4s ease;
  }

  .mc-rating-badge {
    position: absolute;
    top: 8px; right: 8px;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    border-radius: 5px;
    padding: 2px 6px;
    font-size: 0.7rem;
    font-weight: 700;
    color: #ffd700;
    z-index: 2;
    transition: opacity 0.3s;
  }

  /* Mobile/Tablet Title Bar */
  .mc-mobile-info {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 20px 8px 8px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    z-index: 3;
  }

  .mc-mobile-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Desktop Overlay (Buttons) */
  .mc-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px;
    background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 100%);
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    z-index: 4;
  }

  @media (max-width: 991px) { .mc-overlay { display: none; } }

  .mc-btn-now {
  width: 100%;
  background: rgba(255,255,255,0.92);
  color: #0a0a0a;
  border: none;
  border-radius: 5px;
  padding: 7px;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.mc-btn-now:hover {
  background: #ffffff;
  transform: translateY(-1px);
}

.mc-btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }

.mc-small-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.85);
  font-size: 0.65rem;
  font-weight: 600;
  padding: 5px 4px;
  border-radius: 5px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mc-small-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.6);
  color: #fff;
}

.mc-small-btn.saved {
  background: transparent;
  border-color: #2ecc71;
  color: #2ecc71;
}

.mc-small-btn.saved:hover {
  background: rgba(46, 204, 113, 0.12);
}
  `}),e.jsxs("div",{className:"mc-card",onClick:p,children:[e.jsx("img",{src:C,alt:r.title,className:"mc-poster",loading:"lazy",decoding:"async"}),e.jsxs("div",{className:"mc-rating-badge",children:["⭐ ",v]}),e.jsx("div",{className:"mc-mobile-info d-lg-none",children:e.jsx("p",{className:"mc-mobile-title",children:r.title})}),e.jsxs("div",{className:"mc-overlay",children:[e.jsx("h6",{className:"text-white fw-bold mb-1 text-truncate",style:{fontSize:"0.85rem"},children:r.title}),e.jsxs("div",{className:"d-flex gap-2 mb-2",style:{fontSize:"0.7rem",color:"#aaa"},children:[e.jsx("span",{children:P}),e.jsxs("span",{className:"text-warning",children:["⭐ ",v]})]}),e.jsx("button",{className:"mc-btn-now",onClick:g,children:"▶ Watch Now"}),e.jsxs("div",{className:"mc-btn-row",children:[e.jsx("button",{className:"mc-small-btn",onClick:s=>f(s,x),children:"Trailer"}),e.jsx("button",{className:`mc-small-btn ${b?"saved":""}`,onClick:s=>f(s,h),children:b?"✓ Saved":"+ Save"})]})]})]}),e.jsx(re,{show:j,handleClose:()=>o(!1),tmdbId:r.id,movieTitle:r.title})]})};export{oe as M,re as W};

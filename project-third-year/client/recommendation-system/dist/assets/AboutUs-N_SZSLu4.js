import{j as e}from"./chunk-ui-Z2Pwl_H2.js";import{r as i,L as b}from"./chunk-react-B2a0IqF-.js";import{r as f}from"./index-CwUIGroc.js";const p=`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@300;400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#080808;
  --ink:#F2EDE4;
  --red:#E50914;
  --muted:#5A5550;
  --line:rgba(242,237,228,0.1);
  --ff-d:'Bebas Neue',sans-serif;
  --ff-b:'Libre Baskerville',serif;
  --ff-m:'JetBrains Mono',monospace;
}

.ab{
  background:var(--bg);
  color:var(--ink);
  font-family:var(--ff-b);
  overflow-x:hidden;
  min-height:100vh;
  padding-top:70px;
}

/* TICKER */
.ab-ticker{background:var(--red);overflow:hidden;white-space:nowrap;padding:10px 0;}
.ab-ticker-track{display:inline-flex;animation:tick 22s linear infinite;}
.ab-ticker-item{font-family:var(--ff-m);font-size:0.7rem;letter-spacing:0.15em;color:#fff;padding:0 3rem;}
.ab-ticker-dot{color:rgba(255,255,255,0.4);}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* HERO */
.ab-hero{display:grid;grid-template-columns:1fr 1fr;min-height:92vh;border-bottom:1px solid var(--line);}
.ab-hero-l{border-right:1px solid var(--line);padding:5rem 4rem;display:flex;flex-direction:column;justify-content:space-between;position:relative;}
.ab-hero-l::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--red);}
.ab-issue{font-family:var(--ff-m);font-size:0.65rem;letter-spacing:0.3em;color:var(--muted);text-transform:uppercase;}
.ab-hero-h1{font-family:var(--ff-d);font-size:clamp(5rem,10vw,9rem);line-height:0.92;color:var(--ink);margin:3rem 0;}
.ab-hero-h1 .r{color:var(--red);}
.ab-hero-q{font-size:1rem;line-height:1.8;color:var(--muted);font-style:italic;max-width:420px;border-left:2px solid var(--red);padding-left:1.5rem;}
.ab-hero-r{position:relative;overflow:hidden;}
.ab-hero-img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.15) brightness(0.7);display:block;}
.ab-hero-ov{position:absolute;inset:0;background:linear-gradient(135deg,rgba(8,8,8,0.5) 0%,transparent 60%);}
.ab-hero-cap{position:absolute;bottom:2rem;right:2rem;font-family:var(--ff-m);font-size:0.6rem;letter-spacing:0.2em;color:rgba(242,237,228,0.3);text-transform:uppercase;writing-mode:vertical-rl;}

/* SECTION */
.ab-sec{max-width:1300px;margin:0 auto;padding:7rem 4rem;}
.ab-sec-hdr{display:flex;align-items:baseline;gap:2rem;margin-bottom:5rem;border-bottom:1px solid var(--line);padding-bottom:2rem;}
.ab-sec-num{font-family:var(--ff-m);font-size:0.65rem;color:var(--red);letter-spacing:0.2em;}
.ab-sec-ttl{font-family:var(--ff-d);font-size:clamp(2.5rem,5vw,4.5rem);line-height:1;letter-spacing:0.02em;color:var(--ink);}

/* STORY */
.ab-story-g{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start;}
.ab-story-t p{font-size:1rem;line-height:2;color:rgba(242,237,228,0.7);margin-bottom:1.5rem;}
.ab-story-t p:first-child::first-letter{font-family:var(--ff-d);font-size:4rem;line-height:0.8;float:left;margin:0.1em 0.12em 0 0;color:var(--red);}
.ab-pullq{font-family:var(--ff-d);font-size:clamp(1.8rem,3vw,2.8rem);line-height:1.2;color:var(--ink);border-top:3px solid var(--red);border-bottom:1px solid var(--line);padding:2rem 0;margin:3rem 0;letter-spacing:0.02em;}
.ab-mis-lbl{font-family:var(--ff-m);font-size:0.65rem;color:var(--red);letter-spacing:0.3em;text-transform:uppercase;display:block;margin-bottom:2rem;}
.ab-mis-ttl{font-family:var(--ff-d);font-size:clamp(2rem,4vw,3.2rem);color:var(--ink);line-height:1.1;margin-bottom:2.5rem;}
.ab-mis-p{font-size:0.95rem;line-height:2;color:rgba(242,237,228,0.6);margin-bottom:1.5rem;}

/* STATS */
.ab-stats{background:var(--red);padding:4rem;}
.ab-stats-g{max-width:1300px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
.ab-stat{padding:2rem 3rem;border-right:1px solid rgba(255,255,255,0.2);}
.ab-stat:last-child{border-right:none;}
.ab-stat-n{font-family:var(--ff-d);font-size:4rem;line-height:1;color:#fff;margin-bottom:0.5rem;}
.ab-stat-l{font-family:var(--ff-m);font-size:0.65rem;letter-spacing:0.2em;color:rgba(255,255,255,0.6);text-transform:uppercase;}

/* FEATURES */
.ab-feat-g{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);}
.ab-feat{padding:3.5rem 3rem;border-right:1px solid var(--line);position:relative;transition:background 0.25s;}
.ab-feat:last-child{border-right:none;}
.ab-feat:hover{background:rgba(229,9,20,0.04);}
.ab-feat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform 0.3s ease;}
.ab-feat:hover::before{transform:scaleX(1);}
.ab-feat-idx{font-family:var(--ff-m);font-size:0.6rem;color:var(--red);letter-spacing:0.3em;margin-bottom:2rem;display:block;}
.ab-feat-ttl{font-family:var(--ff-d);font-size:1.8rem;letter-spacing:0.03em;color:var(--ink);margin-bottom:1rem;line-height:1.1;}
.ab-feat-body{font-size:0.9rem;line-height:1.85;color:var(--muted);}

/* TECH STRIP */
.ab-tech{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:0 4rem;display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;}
.ab-tech::-webkit-scrollbar{display:none;}
.ab-tech-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.6rem;padding:2rem 3rem;border-right:1px solid var(--line);flex-shrink:0;transition:background 0.2s;}
.ab-tech-item:last-child{border-right:none;}
.ab-tech-item:hover{background:rgba(229,9,20,0.06);}
.ab-tech-icon{font-size:1.4rem;color:var(--red);}
.ab-tech-name{font-family:var(--ff-m);font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--muted);white-space:nowrap;}

/* TEAM — horizontal card */
.ab-team-card{
  display:grid;
  grid-template-columns:180px 1fr;
  gap:3.5rem;
  align-items:start;
  border:1px solid var(--line);
  padding:3rem;
  position:relative;
  transition:border-color 0.3s;
}
.ab-team-card::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;
  height:2px;
  background:var(--red);
}
.ab-team-img-wrap{position:relative;flex-shrink:0;}
.ab-team-portrait{
  width:180px;
  height:240px;
  object-fit:cover;
  object-position:top center;
  filter:grayscale(100%) contrast(1.1);
  display:block;
  border-radius:2px;
}
.ab-team-frame{
  position:absolute;
  inset:-8px;
  border:1px solid var(--red);
  border-radius:2px;
  opacity:0.2;
  pointer-events:none;
}
.ab-team-bio-idx{font-family:var(--ff-m);font-size:0.6rem;letter-spacing:0.3em;color:var(--red);text-transform:uppercase;display:block;margin-bottom:1.2rem;}
.ab-team-bio-name{font-family:var(--ff-d);font-size:clamp(2.5rem,4vw,3.8rem);letter-spacing:0.03em;color:var(--ink);line-height:0.95;margin-bottom:0;}
.ab-team-divider{width:40px;height:2px;background:var(--red);margin:1.8rem 0;}
.ab-team-bio-text{font-size:0.9rem;line-height:1.9;color:rgba(242,237,228,0.6);margin-bottom:2rem;}
.ab-team-tags{display:flex;flex-wrap:wrap;gap:0.6rem;}
.ab-team-tag{font-family:var(--ff-m);font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink);border:1px solid var(--line);padding:0.4rem 0.9rem;}


/* CTA */
.ab-cta-wrap{border-top:1px solid var(--line);}
.ab-cta{display:grid;grid-template-columns:1fr auto;align-items:center;gap:4rem;padding:6rem 4rem;max-width:1300px;margin:0 auto;}
.ab-cta-ttl{font-family:var(--ff-d);font-size:clamp(3rem,6vw,6rem);line-height:0.95;letter-spacing:0.02em;color:var(--ink);}
.ab-cta-ttl span{color:var(--red);}
.ab-cta-btn{display:inline-flex;align-items:center;gap:1rem;background:var(--red);color:#fff;font-family:var(--ff-m);font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:1.2rem 2.5rem;white-space:nowrap;transition:background 0.2s,transform 0.2s;}
.ab-cta-btn:hover{background:#bf0710;transform:translateY(-2px);color:#fff;}


/* SCROLL REVEAL */
.sr{opacity:0;transform:translateY(32px);transition:opacity 0.8s ease,transform 0.8s ease;}
.sr.in{opacity:1;transform:none;}
.sr-d1{transition-delay:0.1s;}
.sr-d2{transition-delay:0.2s;}
.sr-d3{transition-delay:0.3s;}

/* RESPONSIVE */
@media(max-width:1024px){
  .ab-hero{grid-template-columns:1fr;min-height:auto;}
  .ab-hero-r{height:55vw;}
  .ab-hero-l{padding:4rem 2.5rem;}
  .ab-story-g{grid-template-columns:1fr;gap:3rem;}
  .ab-stats-g{grid-template-columns:repeat(2,1fr);}
  .ab-stat{border-bottom:1px solid rgba(255,255,255,0.15);}
  .ab-feat-g{grid-template-columns:1fr;}
  .ab-feat{border-right:none;border-bottom:1px solid var(--line);}
  .ab-team-card{grid-template-columns:1fr;gap:2.5rem;}
  .ab-team-portrait{width:140px;height:190px;}

  .ab-cta{grid-template-columns:1fr;gap:2.5rem;}
}
@media(max-width:640px){
  .ab-sec{padding:5rem 1.5rem;}
  .ab-hero-l{padding:3rem 1.5rem;}
  .ab-stats{padding:3rem 1.5rem;}
  .ab-stats-g{grid-template-columns:1fr 1fr;}
  .ab-stat{padding:1.5rem;}
  .ab-feat{padding:2.5rem 1.5rem;}
  .ab-tech{padding:0 1.5rem;}
  .ab-cta{padding:4rem 1.5rem;}
  
}
`,l=["5-STAGE HYBRID ML ENGINE","21M INTERACTION LOGS","38,695 MOVIES","ZERO SUBSCRIPTION","UNLOCK CINEMA'S HIDDEN GEMS","STREAM FREE","AI-POWERED DISCOVERY"];function v(){const o=i.useRef({}),[m,d]=i.useState({}),s=r=>a=>{o.current[r]=a};i.useEffect(()=>{const r=new IntersectionObserver(a=>a.forEach(n=>{n.isIntersecting&&d(c=>({...c,[n.target.dataset.sr]:!0}))}),{threshold:.12});return Object.values(o.current).forEach(a=>{a&&r.observe(a)}),()=>r.disconnect()},[]);const t=(r,a="")=>`sr${a?` sr-d${a}`:""}${m[r]?" in":""}`;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:p}),e.jsxs("div",{className:"ab",children:[e.jsx("div",{className:"ab-ticker","aria-hidden":"true",children:e.jsx("div",{className:"ab-ticker-track",children:[...l,...l].map((r,a)=>e.jsxs("span",{className:"ab-ticker-item",children:[r,e.jsx("span",{className:"ab-ticker-dot",children:" ◆ "})]},a))})}),e.jsxs("section",{className:"ab-hero",children:[e.jsxs("div",{className:"ab-hero-l",children:[e.jsx("span",{className:"ab-issue",children:"EST. 2026· STREAMHUB · VOL. I"}),e.jsxs("h1",{className:"ab-hero-h1",children:["CINEMA",e.jsx("br",{}),e.jsx("span",{className:"r",children:"RE"}),"DEFINED"]}),e.jsx("p",{className:"ab-hero-q",children:'"We built StreamHub for people who believe watching a film is never just watching a film."'})]}),e.jsxs("div",{className:"ab-hero-r",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop",alt:"Cinema",className:"ab-hero-img"}),e.jsx("div",{className:"ab-hero-ov"}),e.jsx("span",{className:"ab-hero-cap",children:"The Art of Cinema"})]})]}),e.jsxs("div",{className:"ab-sec",ref:s("story"),"data-sr":"story",children:[e.jsxs("div",{className:`ab-sec-hdr ${t("story")}`,children:[e.jsx("span",{className:"ab-sec-num",children:"001"}),e.jsx("h2",{className:"ab-sec-ttl",children:"OUR STORY"})]}),e.jsxs("div",{className:"ab-story-g",children:[e.jsxs("div",{className:`ab-story-t ${t("story",1)}`,children:[e.jsx("p",{children:"StreamHub was born from a simple, genuine frustration. Finding the right film to watch shouldn't require four subscriptions, five browser tabs, and twenty minutes of indecision."}),e.jsx("p",{children:"So we built the alternative. A platform where a research-grade ML engine — trained on 21 million real interaction logs — does the work of understanding your taste, so you don't have to."}),e.jsx("blockquote",{className:"ab-pullq",children:`"NOT WHAT'S POPULAR. WHAT'S RIGHT FOR YOU, RIGHT NOW."`}),e.jsx("p",{children:"The engine combines content-based filtering, collaborative signals, and temporal decay — a novel approach submitted to IEEE Access — to surface films that match not just your genre preference, but the recency and weight of your taste signals."})]}),e.jsxs("div",{className:t("story",2),children:[e.jsx("span",{className:"ab-mis-lbl",children:"Our Mission"}),e.jsx("h3",{className:"ab-mis-ttl",children:"RECONNECT VIEWERS WITH THE ART OF CINEMA"}),e.jsx("p",{className:"ab-mis-p",children:"We believe the best films are still undiscovered by most people. Not because they don't exist — but because the tools for finding them are broken."}),e.jsx("p",{className:"ab-mis-p",children:"StreamHub is the fix. Free to watch. Intelligent to browse. Honest about what it is and isn't."})]})]})]}),e.jsx("div",{className:"ab-stats",ref:s("stats"),"data-sr":"stats",children:e.jsx("div",{className:"ab-stats-g",children:[{n:"21M+",l:"Interaction Logs"},{n:"38,695",l:"Movie Catalog"},{n:"162K+",l:"Training Users"},{n:"5",l:"ML Stages"}].map((r,a)=>e.jsxs("div",{className:`ab-stat ${t("stats",Math.min(a+1,3))}`,children:[e.jsx("div",{className:"ab-stat-n",children:r.n}),e.jsx("div",{className:"ab-stat-l",children:r.l})]},a))})}),e.jsxs("div",{className:"ab-sec",ref:s("feat"),"data-sr":"feat",children:[e.jsxs("div",{className:`ab-sec-hdr ${t("feat")}`,children:[e.jsx("span",{className:"ab-sec-num",children:"002"}),e.jsx("h2",{className:"ab-sec-ttl",children:"WHAT WE OFFER"})]}),e.jsx("div",{className:"ab-feat-g",children:[{idx:"01",ttl:"INTELLIGENT DISCOVERY",body:"A 5-stage hybrid ML engine blending TF-IDF content filtering, SVD collaborative signals, temporal decay weighting, and genre diversity — trained on 21 million interactions."},{idx:"02",ttl:"PERSONAL LIBRARY",body:"Your watchlist feeds the engine. Every addition, trailer watch, and removal is a signal. The more you use it, the sharper it gets."},{idx:"03",ttl:"STREAM INSTANTLY",body:"Six embed servers per title. Automatic fallback. No subscription, no sign-up wall. Press play."}].map((r,a)=>e.jsxs("div",{className:`ab-feat ${t("feat",a+1)}`,children:[e.jsx("span",{className:"ab-feat-idx",children:r.idx}),e.jsx("h3",{className:"ab-feat-ttl",children:r.ttl}),e.jsx("p",{className:"ab-feat-body",children:r.body})]},a))})]}),e.jsxs("div",{className:"ab-sec",ref:s("team"),"data-sr":"team",children:[e.jsxs("div",{className:`ab-sec-hdr ${t("team")}`,children:[e.jsx("span",{className:"ab-sec-num",children:"003"}),e.jsx("h2",{className:"ab-sec-ttl",children:"THE TEAM"})]}),e.jsxs("div",{className:`ab-team-card ${t("team",1)}`,children:[e.jsxs("div",{className:"ab-team-img-wrap",children:[e.jsx("img",{src:"https://i.postimg.cc/xTt4m6Qt/Whats-App-Image-2024-07-22-at-10-34-36-ef70f6fe.jpg",alt:"Protyush Ghorui",className:"ab-team-portrait"}),e.jsx("div",{className:"ab-team-frame"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"ab-team-bio-idx",children:"Founder & Engineer"}),e.jsxs("h3",{className:"ab-team-bio-name",children:["PROTYUSH",e.jsx("br",{}),"GHORUI"]}),e.jsx("div",{className:"ab-team-divider"}),e.jsx("p",{className:"ab-team-bio-text",children:"I'm a 3rd year B.Tech IT student at MCKV Institute of Engineering. I built StreamHub completely on my own the FastAPI backend, MongoDB data layer, React frontend, and the hybrid ML recommendation engine."}),e.jsxs("div",{className:"ab-team-tags",children:[e.jsx("span",{className:"ab-team-tag",children:"Full Stack Developer"}),e.jsx("span",{className:"ab-team-tag",children:"B.Tech IT · 2027"})]})]})]})]}),e.jsx("div",{className:"ab-cta-wrap",ref:s("cta"),"data-sr":"cta",children:e.jsxs("div",{className:`ab-cta ${t("cta")}`,children:[e.jsxs("h2",{className:"ab-cta-ttl",children:["YOUR NEXT",e.jsx("br",{}),"FAVOURITE FILM",e.jsx("br",{}),e.jsx("span",{children:"IS WAITING."})]}),e.jsxs(b,{to:"/home",className:"ab-cta-btn",children:["Start Exploring ",e.jsx(f,{})]})]})})]})]})}export{v as default};

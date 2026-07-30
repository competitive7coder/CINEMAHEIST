import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const CSS = `

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
`;

const TICKER = [
  "5-STAGE HYBRID ML ENGINE",
  "21M INTERACTION LOGS",
  "38,695 MOVIES",
  "ZERO SUBSCRIPTION",
  "UNLOCK CINEMA'S HIDDEN GEMS",
  "STREAM FREE",
  "AI-POWERED DISCOVERY",
];

export default function AboutUs() {
  const refs = useRef({});
  const [seen, setSeen] = useState({});

  const setRef = (id) => (el) => {
    refs.current[id] = el;
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setSeen((p) => ({ ...p, [e.target.dataset.sr]: true }));
        }),
      { threshold: 0.12 },
    );
    Object.values(refs.current).forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const sr = (id, d = "") =>
    `sr${d ? ` sr-d${d}` : ""}${seen[id] ? " in" : ""}`;

  return (
    <>
      <style>{CSS}</style>
      <div className="ab">
        {/* TICKER */}
        <div className="ab-ticker" aria-hidden="true">
          <div className="ab-ticker-track">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="ab-ticker-item">
                {t}
                <span className="ab-ticker-dot"> ◆ </span>
              </span>
            ))}
          </div>
        </div>

        {/* HERO */}
        <section className="ab-hero">
          <div className="ab-hero-l">
            <span className="ab-issue">EST. 2026· CinemaHeist · VOL. I</span>
            <h1 className="ab-hero-h1">
              CINEMA
              <br />
              <span className="r">RE</span>DEFINED
            </h1>
            <p className="ab-hero-q">
              "We built CinemaHeist for people who believe watching a film is
              never just watching a film."
            </p>
          </div>
          <div className="ab-hero-r">
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop"
              alt="Cinema"
              className="ab-hero-img"
            />
            <div className="ab-hero-ov" />
            <span className="ab-hero-cap">The Art of Cinema</span>
          </div>
        </section>

        {/* STORY */}
        <div className="ab-sec" ref={setRef("story")} data-sr="story">
          <div className={`ab-sec-hdr ${sr("story")}`}>
            <span className="ab-sec-num">001</span>
            <h2 className="ab-sec-ttl">OUR STORY</h2>
          </div>
          <div className="ab-story-g">
            <div className={`ab-story-t ${sr("story", 1)}`}>
              <p>
                CinemaHeist was born from a simple, genuine frustration. Finding
                the right film to watch shouldn't require four subscriptions,
                five browser tabs, and twenty minutes of indecision.
              </p>
              <p>
                So we built the alternative. A platform where a research-grade
                ML engine — trained on 21 million real interaction logs — does
                the work of understanding your taste, so you don't have to.
              </p>
              <blockquote className="ab-pullq">
                "NOT WHAT'S POPULAR. WHAT'S RIGHT FOR YOU, RIGHT NOW."
              </blockquote>
              <p>
                The engine combines content-based filtering, collaborative
                signals, and temporal decay — a novel approach submitted to IEEE
                Access — to surface films that match not just your genre
                preference, but the recency and weight of your taste signals.
              </p>
            </div>
            <div className={sr("story", 2)}>
              <span className="ab-mis-lbl">Our Mission</span>
              <h3 className="ab-mis-ttl">
                RECONNECT VIEWERS WITH THE ART OF CINEMA
              </h3>
              <p className="ab-mis-p">
                We believe the best films are still undiscovered by most people.
                Not because they don't exist — but because the tools for finding
                them are broken.
              </p>
              <p className="ab-mis-p">
                CinemaHeist is the fix. Free to watch. Intelligent to browse.
                Honest about what it is and isn't.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="ab-stats" ref={setRef("stats")} data-sr="stats">
          <div className="ab-stats-g">
            {[
              { n: "21M+", l: "Interaction Logs" },
              { n: "38,695", l: "Movie Catalog" },
              { n: "162K+", l: "Training Users" },
              { n: "5", l: "ML Stages" },
            ].map((s, i) => (
              <div
                key={i}
                className={`ab-stat ${sr("stats", Math.min(i + 1, 3))}`}
              >
                <div className="ab-stat-n">{s.n}</div>
                <div className="ab-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="ab-sec" ref={setRef("feat")} data-sr="feat">
          <div className={`ab-sec-hdr ${sr("feat")}`}>
            <span className="ab-sec-num">002</span>
            <h2 className="ab-sec-ttl">WHAT WE OFFER</h2>
          </div>
          <div className="ab-feat-g">
            {[
              {
                idx: "01",
                ttl: "INTELLIGENT DISCOVERY",
                body: "A 5-stage hybrid ML engine blending TF-IDF content filtering, SVD collaborative signals, temporal decay weighting, and genre diversity — trained on 21 million interactions.",
              },
              {
                idx: "02",
                ttl: "PERSONAL LIBRARY",
                body: "Your watchlist feeds the engine. Every addition, trailer watch, and removal is a signal. The more you use it, the sharper it gets.",
              },
              {
                idx: "03",
                ttl: "STREAM INSTANTLY",
                body: "Six embed servers per title. Automatic fallback. No subscription, no sign-up wall. Press play.",
              },
            ].map((f, i) => (
              <div key={i} className={`ab-feat ${sr("feat", i + 1)}`}>
                <span className="ab-feat-idx">{f.idx}</span>
                <h3 className="ab-feat-ttl">{f.ttl}</h3>
                <p className="ab-feat-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM */}
        <div className="ab-sec" ref={setRef("team")} data-sr="team">
          <div className={`ab-sec-hdr ${sr("team")}`}>
            <span className="ab-sec-num">003</span>
            <h2 className="ab-sec-ttl">THE TEAM</h2>
          </div>
          <div className={`ab-team-card ${sr("team", 1)}`}>
            <div className="ab-team-img-wrap">
              <img
                src="https://i.postimg.cc/xTt4m6Qt/Whats-App-Image-2024-07-22-at-10-34-36-ef70f6fe.jpg"
                alt="Protyush Ghorui"
                className="ab-team-portrait"
              />
              <div className="ab-team-frame" />
            </div>
            <div>
              <span className="ab-team-bio-idx">Founder & Engineer</span>
              <h3 className="ab-team-bio-name">
                PROTYUSH
                <br />
                GHORUI
              </h3>
              <div className="ab-team-divider" />
              <p className="ab-team-bio-text">
                I'm a 3rd year B.Tech IT student at MCKV Institute of
                Engineering. I built CinemaHeist completely on my own the FastAPI
                backend, MongoDB data layer, React frontend, and the hybrid ML
                recommendation engine.
              </p>
              <div className="ab-team-tags">
                <span className="ab-team-tag">Full Stack Developer</span>
                {/* <span className="ab-team-tag">IEEE Researcher</span> */}
                <span className="ab-team-tag">B.Tech IT · 2027</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="ab-cta-wrap" ref={setRef("cta")} data-sr="cta">
          <div className={`ab-cta ${sr("cta")}`}>
            <h2 className="ab-cta-ttl">
              YOUR NEXT
              <br />
              FAVOURITE FILM
              <br />
              <span>IS WAITING.</span>
            </h2>
            <Link to="/home" className="ab-cta-btn">
              Start Exploring <BsArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

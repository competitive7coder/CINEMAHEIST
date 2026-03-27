import{j as e}from"./chunk-ui-Z2Pwl_H2.js";import{e as ae,r as o}from"./chunk-react-B2a0IqF-.js";import{a as s}from"./api-DKlbdnFA.js";import{y as n}from"./index-DipoDFDE.js";import{L as re}from"./LoadingSpinner-CSk5ck2Z.js";import ie from"./VideoModal-D9YnvmLQ.js";import{M as oe,W as se}from"./MovieCard-CRLkexGR.js";import{u as ne}from"./useSEO-BNvtMqTs.js";import{B as de,a as le,b as pe,c as ce}from"./index-CwUIGroc.js";import"./chunk-vendors-3DY9Nbxc.js";const ye=()=>{var W,M,R,F,B,P,V,D,E,L;const{movieId:c}=ae(),[t,k]=o.useState(null),[g,U]=o.useState([]),[Y,y]=o.useState(!0),[H,h]=o.useState(!1),[K,f]=o.useState(null),[q,j]=o.useState(!1),[N,O]=o.useState(20),[_,x]=o.useState(!1),[G,b]=o.useState([]);ne({title:t?`${t.title} (${((W=t.release_date)==null?void 0:W.split("-")[0])||""})`:"Watch Movie",description:t?`Watch ${t.title} online free on StreamHub. ${(M=t.overview)==null?void 0:M.slice(0,120)}...`:"Watch movies online free on StreamHub.",image:t!=null&&t.backdrop_path?`https://image.tmdb.org/t/p/w1280${t.backdrop_path}`:t!=null&&t.poster_path?`https://image.tmdb.org/t/p/w780${t.poster_path}`:null,url:t?`/movie/${t.id}`:null,type:"video.movie",structuredData:t?{name:t.title,description:t.overview,datePublished:t.release_date,image:t.poster_path?`https://image.tmdb.org/t/p/w780${t.poster_path}`:null,aggregateRating:t.vote_average?{ratingValue:t.vote_average.toFixed(1),ratingCount:t.vote_count}:void 0,genre:(R=t.genres)==null?void 0:R.map(a=>a.name),url:`https://streamhub-research.vercel.app/movie/${t.id}`}:null});const u=async(a,r)=>{if(localStorage.getItem("token"))try{await s.post("/activity/log",{movie_id:a.id,action_type:r,movie_title:a.title||"Unknown",movie_poster_path:a.poster_path||""})}catch(i){console.error("Failed to log activity:",i)}};o.useEffect(()=>{(async()=>{y(!0),window.scrollTo(0,0);try{const[r,l]=await Promise.all([s.get(`/movies/details/${c}`),s.get(`/movies/recommendations/${c}`)]),i=r.data;if(k(i),localStorage.getItem("token")){try{const p=await s.get(`/users/watchlist/check/${c}`);x(p.data.isInWatchlist);const m=await s.get("/users/watchlist");b(Array.isArray(m.data)?m.data:[])}catch(p){console.error("Watchlist check failed:",p)}try{await s.post("/activity/log",{movie_id:i.id,action_type:"search_click",movie_title:i.title||"Unknown",movie_poster_path:i.poster_path||""})}catch{}}U(l.data.filter((p,m,ee)=>m===ee.findIndex(te=>te.id===p.id)))}catch{n.error("Failed to load movie details."),k(null)}finally{y(!1)}})()},[c]),o.useEffect(()=>{if(t&&window.location.hash==="#watch"){const a=document.getElementById("watch-section");a&&a.scrollIntoView({behavior:"smooth",block:"start"})}},[t]);const J=async()=>{var a;try{t&&u(t,"trailer_watch");const r=await s.get(`/movies/${c}/videos`);(a=r.data)!=null&&a.key?(f(r.data.key),h(!0)):n.info("No trailer available.")}catch{n.error("Could not load trailer.")}},Q=async a=>{var l;const r=(a==null?void 0:a.id)??a;if(r)try{const i=await s.get(`/movies/${r}/videos`);(l=i.data)!=null&&l.key?(f(i.data.key),h(!0)):n.info("No trailer available.")}catch{n.error("Could not load trailer.")}},z=async a=>{if(!localStorage.getItem("token")){n.error("Please log in first.");return}try{(await s.get(`/users/watchlist/check/${a.id}`)).data.isInWatchlist?(await s.delete(`/users/watchlist/${a.id}`),u(a,"removed_from_watchlist"),n.success("Removed from watchlist"),x(!1),b(i=>i.filter(A=>A!==a.id))):(await s.post(`/users/watchlist/${a.id}`),u(a,"added_to_watchlist"),n.success("Added to watchlist"),x(!0),b(i=>[...i,a.id]))}catch{n.error("Could not update watchlist.")}},X=()=>{O(r=>r+6)},Z=a=>a?`${Math.floor(a/60)}h ${a%60}m`:null,T=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    .mdp { background: #0c0c0f; color: #fff; font-family: 'Inter', sans-serif; min-height: 100vh; }

    /* ── Full backdrop ── */
    .mdp-backdrop {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 640px;
      background-size: cover;
      background-position: center center;
    }
    .mdp-backdrop-overlay {
      position: absolute; inset: 0;
      background:
        linear-gradient(to right, #0c0c0f 25%, rgba(12,12,15,0.55) 65%, rgba(12,12,15,0.15) 100%),
        linear-gradient(to top, #0c0c0f 0%, rgba(12,12,15,0.5) 30%, transparent 60%);
    }

    /* ── Hero sits inside the backdrop ── */
    .mdp-hero-wrap {
      position: absolute; inset: 0;
      display: flex; align-items: flex-end;
      padding-bottom: 3.5rem;
    }
    .mdp-hero {
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
      padding: 0 3rem;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2.5rem;
      align-items: flex-end;
    }
    .mdp-poster {
      width: 200px;
      border-radius: 12px;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.8);
      display: block;
      flex-shrink: 0;
    }

    /* ── Info ── */
    .mdp-title {
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.08;
      margin: 0 0 0.4rem;
    }
    .mdp-tagline {
      font-size: 0.88rem;
      color: #666;
      font-style: italic;
      margin-bottom: 0.75rem;
    }
    .mdp-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 0.75rem;
      font-size: 0.82rem;
      color: #777;
    }
    .mdp-meta-sep { color: #2a2a2a; }
    .mdp-rating {
      display: inline-flex; align-items: center; gap: 4px;
      background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2);
      border-radius: 5px; padding: 2px 8px;
      font-size: 0.78rem; font-weight: 700; color: #f59e0b;
    }
    .mdp-genres {
      display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 0.85rem;
    }
    .mdp-genre {
      font-size: 0.68rem; font-weight: 600; padding: 3px 10px;
      border-radius: 20px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1); color: #999;
    }
    .mdp-crew {
      display: flex; gap: 16px; margin-bottom: 0.85rem; flex-wrap: wrap;
    }
    .mdp-crew-item { font-size: 0.78rem; color: #666; }
    .mdp-crew-item b { color: #bbb; font-weight: 500; margin-left: 4px; }
    .mdp-overview {
      font-size: 0.88rem; line-height: 1.75; color: #888;
      max-width: 600px; margin-bottom: 1.5rem;
      display: -webkit-box; -webkit-line-clamp: 3;
      -webkit-box-orient: vertical; overflow: hidden;
    }

    /* ── Buttons ── */
    .mdp-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .mdp-actions-top-row { display: contents; }

    .mdp-btn-watch {
      display: inline-flex; align-items: center; gap: 9px;
      height: 46px; padding: 0 26px;
      background: #fff; color: #000;
      border: none; border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
      letter-spacing: 0.1px;
    }
    .mdp-btn-watch:hover { background: #e0e0e0; transform: translateY(-1px); }

    .mdp-btn-trailer {
      display: inline-flex; align-items: center; gap: 9px;
      height: 46px; padding: 0 22px;
      background: rgba(109,109,110,0.7); color: #fff;
      border: none; border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .mdp-btn-trailer:hover { background: rgba(109,109,110,0.9); transform: translateY(-1px); }

    .mdp-btn-wl {
      display: inline-flex; align-items: center; gap: 9px;
      height: 46px; padding: 0 22px;
      background: transparent; color: #fff;
      border: 2px solid rgba(255,255,255,0.5); border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 600;
      cursor: pointer; transition: all 0.15s;
    }
    .mdp-btn-wl:hover { border-color: #fff; background: rgba(255,255,255,0.08); }
    .mdp-btn-wl.on {
      color: #4ade80; border-color: rgba(74,222,128,0.6);
      background: rgba(74,222,128,0.08);
    }

    /* ── Body below hero ── */
    .mdp-body {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2.5rem 5rem 0;
    }

    /* ── Cast section ── */
    .mdp-sec-title {
      font-size: 1.5rem; font-weight: 700; letter-spacing: 3px;
      text-transform: uppercase; color: #e50914;
      display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem;
    }
    .mdp-sec-title::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.05); }

    .mdp-cast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 10px;
    }
    .mdp-cast-item {
      border-radius: 15px; overflow: hidden;
      background: #111116;
      transition: transform 0.18s; cursor: default;
      position: relative;
    }
    .mdp-cast-item:hover { transform: translateY(-4px); }
    .mdp-cast-item:hover .mdp-cast-photo { filter: brightness(1.1); }
    .mdp-cast-photo {
      width: 100%; aspect-ratio: 2/3; object-fit: cover;
      display: block; background: #1c1c25;
      transition: filter 0.2s;
    }
    .mdp-cast-info {
      padding: 8px 10px 10px;
      background: linear-gradient(to bottom, #111116, #0d0d12);
    }
    .mdp-cast-name {
      font-size: 0.75rem; font-weight: 600; color: #e8e8e8;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;
    }
    .mdp-cast-char {
      font-size: 0.63rem; color: #555; font-style: italic;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    /* ── Related ── */
    .mdp-related {
      max-width: 1240px; margin: 0 auto;
      padding: 2rem 5rem 5rem;
      border-top: 1px solid rgb(0, 0, 0);
    }
    .mdp-related-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
    }
    .mdp-load-more-wrap { display: flex; justify-content: center; margin-top: 2rem; }
    .mdp-load-more {
      padding: 10px 32px; background: transparent;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
      color: #666; font-family: 'Inter', sans-serif;
      font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .mdp-load-more:hover { border-color: rgba(255,255,255,0.2); color: #bbb; }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .mdp-related-grid { grid-template-columns: repeat(4, 1fr); }
      .mdp-hero { padding: 0 2rem; }
      .mdp-body { padding: 2rem 2rem 0; }
      .mdp-related { padding: 2rem 2rem 4rem; }
    }

    /* ── Mobile ── */
    @media (max-width: 768px) {
      .mdp-backdrop {
        height: 100svh;
        min-height: 600px;
        background-position: center top;
      }
      .mdp-backdrop-overlay {
        background: linear-gradient(
          to top,
          #0c0c0f 0%,
          rgba(12,12,15,0.97) 28%,
          rgba(12,12,15,0.55) 58%,
          rgba(12,12,15,0.0) 85%
        );
      }
      /* Push content down enough to clear the navbar (~60px) */
      .mdp-hero-wrap { padding-bottom: 2rem; padding-top: 60px; align-items: flex-end; }
      .mdp-hero { grid-template-columns: 1fr; gap: 0; padding: 0 1.2rem; align-items: flex-end; }
      .mdp-poster { display: none; }

      .mdp-title { font-size: 1.55rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 0.25rem; }
      .mdp-tagline { font-size: 0.72rem; color: #555; font-style: italic; margin-bottom: 0.55rem; }
      .mdp-meta { font-size: 0.76rem; gap: 5px; margin-bottom: 0.55rem; }
      .mdp-genres { gap: 5px; margin-bottom: 0.6rem; }
      .mdp-genre { font-size: 0.65rem; padding: 3px 9px; }
      .mdp-crew { flex-direction: column; gap: 2px; margin-bottom: 0.6rem; }
      .mdp-crew-item { font-size: 0.72rem; color: #555; line-height: 1.45; }
      .mdp-crew-item b { color: #bbb; font-weight: 500; margin-left: 5px; }
      .mdp-overview { font-size: 0.8rem; line-height: 1.65; -webkit-line-clamp: 3; margin-bottom: 1.25rem; color: #888; }

      /* ── Buttons ── */
      .mdp-actions { display: flex; flex-direction: column; gap: 9px; }
      .mdp-actions-top-row { display: flex; gap: 9px; width: 100%; }
      .mdp-btn-watch {
        flex: 1; height: 50px; padding: 0; font-size: 0.9rem; font-weight: 700;
        border-radius: 8px; justify-content: center;
        background: #fff; color: #000;
      }
      .mdp-btn-watch:hover { background: #e0e0e0; }
      .mdp-btn-trailer {
        flex: 1; height: 50px; padding: 0; font-size: 0.9rem;
        border-radius: 8px; justify-content: center;
        background: rgba(109,109,110,0.7); border: none;
      }
      .mdp-btn-wl {
        width: 100%; height: 46px; padding: 0; font-size: 0.86rem;
        border-radius: 8px; justify-content: center;
        border: 2px solid rgba(255,255,255,0.4); color: #fff; background: transparent;
      }

      /* Body */
      .mdp-body { padding: 1.5rem 1.2rem 0; }
      .mdp-sec-title { font-size: 1.2rem; letter-spacing: 2.5px; margin-bottom: 0.9rem;  }
      .mdp-cast-grid { grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .mdp-cast-info { padding: 5px 6px 7px; }
      .mdp-cast-name { font-size: 0.67rem; }
      .mdp-cast-char { font-size: 0.58rem; }
      .mdp-related { padding: 1.5rem 1.2rem 3rem; }
      .mdp-related-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .mdp-load-more { padding: 10px 28px; font-size: 0.8rem; border-radius: 10px; }
    }
    @media (max-width: 400px) {
      .mdp-cast-grid { grid-template-columns: repeat(5, 1fr); }
      .mdp-related-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `;if(Y)return e.jsx(re,{});if(!t)return e.jsxs("div",{className:"container text-light pt-5 mt-5 text-center",children:[e.jsx("h2",{children:"Movie Not Found"}),e.jsx("p",{children:"The requested movie details could not be loaded."})]});const $=t.backdrop_path?`https://image.tmdb.org/t/p/w1280${t.backdrop_path}`:null,w=t.poster_path?`https://image.tmdb.org/t/p/w500${t.poster_path}`:"https://placehold.co/200x300?text=No+Poster",I=t.release_date?new Date(t.release_date).getFullYear():null,C=typeof t.vote_average=="number"&&t.vote_average>0?t.vote_average.toFixed(1):null,v=(B=(F=t.credits)==null?void 0:F.crew)==null?void 0:B.find(a=>a.job==="Director"),d=(V=(P=t.credits)==null?void 0:P.crew)==null?void 0:V.filter(a=>["Writer","Screenplay","Story"].includes(a.job)).slice(0,2),S=((E=(D=t.credits)==null?void 0:D.cast)==null?void 0:E.slice(0,10))||[];return e.jsxs("div",{className:"mdp",children:[e.jsx("style",{children:T}),e.jsxs("div",{className:"mdp-backdrop",style:{backgroundImage:$?`url(${$})`:"none",backgroundColor:"#0c0c0f"},"data-poster":w,children:[e.jsx("style",{children:`@media (max-width: 768px) { .mdp-backdrop { background-image: url('${w}') !important; background-position: center top !important; } }`}),e.jsx("div",{className:"mdp-backdrop-overlay"}),e.jsx("div",{className:"mdp-hero-wrap",children:e.jsxs("div",{className:"mdp-hero",children:[e.jsx("img",{src:w,alt:t.title,className:"mdp-poster"}),e.jsxs("div",{children:[e.jsx("h1",{className:"mdp-title",children:t.title}),t.tagline&&e.jsxs("p",{className:"mdp-tagline",children:['"',t.tagline,'"']}),e.jsxs("div",{className:"mdp-meta",children:[I&&e.jsx("span",{children:I}),t.runtime>0&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"mdp-meta-sep",children:"·"}),e.jsx("span",{children:Z(t.runtime)})]}),C&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"mdp-meta-sep",children:"·"}),e.jsxs("span",{className:"mdp-rating",children:[e.jsx("i",{className:"bi bi-star-fill",style:{fontSize:"0.6rem"}})," ",C]})]})]}),e.jsx("div",{className:"mdp-genres",children:(L=t.genres)==null?void 0:L.map(a=>e.jsx("span",{className:"mdp-genre",children:a.name},a.id))}),(v||(d==null?void 0:d.length)>0)&&e.jsxs("div",{className:"mdp-crew",children:[v&&e.jsxs("span",{className:"mdp-crew-item",children:["DIR",e.jsx("b",{children:v.name})]}),(d==null?void 0:d.length)>0&&e.jsxs("span",{className:"mdp-crew-item",children:["WRT",e.jsx("b",{children:d.map(a=>a.name).join(", ")})]})]}),e.jsx("p",{className:"mdp-overview",children:t.overview||"No overview available."}),e.jsxs("div",{className:"mdp-actions",children:[e.jsxs("div",{className:"mdp-actions-top-row",children:[e.jsxs("button",{className:"mdp-btn-watch",onClick:()=>j(!0),children:[e.jsx(de,{})," Watch Now"]}),e.jsxs("button",{className:"mdp-btn-trailer",onClick:J,children:[e.jsx(le,{})," Trailer"]})]}),e.jsx("button",{className:`mdp-btn-wl${_?" on":""}`,onClick:()=>z(t),children:_?e.jsxs(e.Fragment,{children:[e.jsx(pe,{})," Saved"]}):e.jsxs(e.Fragment,{children:[e.jsx(ce,{})," Watchlist"]})})]})]})]})})]}),e.jsx("div",{className:"mdp-body",children:S.length>0&&e.jsxs("div",{style:{marginBottom:"2.5rem"},children:[e.jsx("p",{className:"mdp-sec-title",children:"Cast"}),e.jsx("div",{className:"mdp-cast-grid",children:S.map(a=>e.jsxs("div",{className:"mdp-cast-item",children:[e.jsx("img",{src:a.profile_path?`https://image.tmdb.org/t/p/w185${a.profile_path}`:"https://placehold.co/110x165/13131a/333?text=?",alt:a.name,className:"mdp-cast-photo"}),e.jsxs("div",{className:"mdp-cast-info",children:[e.jsx("p",{className:"mdp-cast-name",children:a.name}),e.jsx("p",{className:"mdp-cast-char",children:a.character||a.job})]})]},a.cast_id||a.id))})]})}),g.length>0&&e.jsxs("div",{className:"mdp-related",children:[e.jsx("p",{className:"mdp-sec-title",children:"More Like This"}),e.jsx("div",{className:"mdp-related-grid",children:g.slice(0,N).map(a=>e.jsx(oe,{movie:a,watchlist:G,onWatchlistClick:z,onWatchTrailerClick:Q},a.id))}),N<g.length&&e.jsx("div",{className:"mdp-load-more-wrap",children:e.jsx("button",{className:"mdp-load-more",onClick:X,children:"Load More"})})]}),e.jsx(ie,{show:H,handleClose:()=>{h(!1),f(null)},videoKey:K}),e.jsx(se,{show:q,handleClose:()=>j(!1),tmdbId:t==null?void 0:t.id,movieTitle:t==null?void 0:t.title})]})};export{ye as default};

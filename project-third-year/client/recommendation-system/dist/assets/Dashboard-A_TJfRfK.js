import{j as e,F as x,S as le,B as P}from"./chunk-ui-Z2Pwl_H2.js";import{r,u as ce}from"./chunk-react-B2a0IqF-.js";import{a as g}from"./api-DKlbdnFA.js";import{y as o}from"./index-DipoDFDE.js";import{M as re}from"./MovieCard-CRLkexGR.js";import{M as me}from"./MovieRow-DVmYT0pf.js";import pe from"./VideoModal-D9YnvmLQ.js";import{L as oe}from"./LoadingSpinner-CSk5ck2Z.js";import{d as ge,e as he,f as fe,g as be,a as xe,h as ue,i as ve,j as ye}from"./index-CwUIGroc.js";import{l as we}from"./chunk-vendors-3DY9Nbxc.js";const je=({history:b,loading:w,onClearHistory:h})=>{const j=c=>{if(!c||!c.movie_title)return null;const z=new Date(c.timestamp).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),k=c.movie_poster_path?`https://image.tmdb.org/t/p/w92${c.movie_poster_path}`:"https://via.placeholder.com/50x75";let u="",m="";switch(c.action_type){case"added_to_watchlist":u=`Added "${c.movie_title}" to watchlist`,m="bi-bookmark-plus-fill text-success";break;case"removed_from_watchlist":u=`Removed "${c.movie_title}" from watchlist`,m="bi-bookmark-dash-fill text-danger";break;case"trailer_watch":u=`Watched trailer for "${c.movie_title}"`,m="bi-play-circle-fill text-primary";break;case"search_click":u=`Viewed "${c.movie_title}"`,m="bi-eye-fill text-info";break;default:u=`Activity on "${c.movie_title}"`,m="bi-activity text-secondary"}return e.jsxs("li",{className:"list-group-item bg-dark text-light d-flex align-items-center border-secondary",children:[e.jsx("img",{src:k,alt:c.movie_title,className:"rounded me-3",style:{width:"50px",height:"75px",objectFit:"cover"}}),e.jsxs("div",{className:"flex-grow-1",children:[e.jsxs("p",{className:"mb-0",children:[e.jsx("i",{className:`bi ${m} me-2`}),u]}),e.jsx("div",{style:{marginTop:"4px"},children:e.jsx("small",{style:{color:"#9ca3af",fontSize:"12px"},children:z})})]})]},c._id)};return w?e.jsx(oe,{}):e.jsxs("div",{children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-4",children:[e.jsx("h3",{className:"mb-0",children:"Viewing History"}),b.length>0&&e.jsxs("button",{className:"btn btn-outline-danger btn-sm",onClick:h,children:[e.jsx(ge,{className:"me-2"}),"Clear History"]})]}),b.length>0?e.jsx("ul",{className:"list-group",children:b.map(j)}):e.jsx("p",{className:"text-secondary",children:"Your viewing history is empty. Actions like watching trailers or adding movies to your watchlist will appear here."})]})},ke=({userName:b,userBio:w,userProfilePicture:h,onNameUpdate:j,onBioUpdate:c,onPictureUpdate:z,triggerDelete:k,activeSubTab:u="profile"})=>{const[m,I]=r.useState({name:b||""}),[O,M]=r.useState({bio:w||""}),[y,N]=r.useState({currentPassword:"",newPassword:""}),[D,F]=r.useState(""),[V,B]=r.useState(!1),[H,U]=r.useState(!1),[T,S]=r.useState(0),[q,E]=r.useState(null),[Z,Y]=r.useState(!1);r.useEffect(()=>{I({name:b||""})},[b]),r.useEffect(()=>{M({bio:w||""})},[w]),r.useEffect(()=>{k&&S(1)},[k]);const Q=a=>I({...m,[a.target.name]:a.target.value}),ee=a=>M({...O,[a.target.name]:a.target.value}),A=a=>N({...y,[a.target.name]:a.target.value}),te=async a=>{var d,W;const n=a.target.files[0];if(!n)return;if(!n.type.startsWith("image/")){o.error("Please select an image file");return}if(n.size>5*1024*1024){o.error("Image must be under 5MB");return}const p=URL.createObjectURL(n);E(p);const f=new FormData;f.append("profile_picture",n);try{B(!0);const C=await g.put("/profile/update-avatar",f);o.success("Profile picture updated"),E(null),z&&z(C.data.profile_picture)}catch(C){console.error(C),E(null),o.error(((W=(d=C.response)==null?void 0:d.data)==null?void 0:W.detail)||"Failed to upload image")}finally{B(!1),a.target.value=null}},R=async a=>{var p,f;if(a.preventDefault(),!m.name.trim()){o.error("Name cannot be empty");return}const n=new FormData;n.append("name",m.name.trim());try{const d=await g.put("/profile/update-name",n);o.success("Name updated"),j&&j(d.data.username)}catch(d){console.error(d),o.error(((f=(p=d.response)==null?void 0:p.data)==null?void 0:f.detail)||"Failed to update name")}},K=async a=>{var p,f;a.preventDefault();const n=new FormData;n.append("bio",O.bio);try{const d=await g.put("/profile/bio",n);o.success("Bio updated"),c&&c(d.data.bio)}catch(d){console.error(d),o.error(((f=(p=d.response)==null?void 0:p.data)==null?void 0:f.detail)||"Failed to update bio")}},X=async a=>{var p,f;a.preventDefault();const n=new FormData;n.append("current_password",y.currentPassword),n.append("new_password",y.newPassword);try{const d=await g.put("/profile/update-password",n);o.success(d.data.msg),N({currentPassword:"",newPassword:""})}catch(d){console.error(d),o.error(((f=(p=d.response)==null?void 0:p.data)==null?void 0:f.detail)||"Password update failed")}},L=async()=>{var a,n;if(!D){o.error("Enter password to delete account");return}try{U(!0),await g.post("/profile/verify-password",new URLSearchParams({password:D}),{headers:{"Content-Type":"application/x-www-form-urlencoded"}}),S(0),Y(!0),await new Promise(p=>setTimeout(p,5e3)),await g.delete("/profile/delete-account",{data:new URLSearchParams({password:D}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}),o.success("Account deleted. Goodbye forever 💀"),localStorage.removeItem("token"),window.location.href="/"}catch(p){Y(!1),S(2),o.error(((n=(a=p.response)==null?void 0:a.data)==null?void 0:n.detail)||"Wrong password. Nice try 😏")}finally{U(!1),F("")}},G={background:"#1e1e1e",borderRadius:"16px",padding:"2rem",marginBottom:"2rem",color:"#fff"},_={backgroundColor:"#121212",border:"1px solid #333",color:"#fff"};return e.jsxs("div",{children:[u==="profile"&&e.jsxs("div",{style:G,children:[e.jsx("h4",{children:"Public Profile"}),e.jsx("img",{src:q||h||"https://placehold.co/100",alt:"profile",className:"rounded-circle mb-3",style:{width:100,height:100,objectFit:"cover",opacity:V?.6:1}}),e.jsx(x.Control,{type:"file",accept:"image/*",onChange:te,style:_}),V&&e.jsx(le,{size:"sm",className:"mt-2"}),e.jsxs(x,{onSubmit:R,className:"mt-4",children:[e.jsx(x.Label,{children:"Name"}),e.jsx(x.Control,{name:"name",value:m.name,onChange:Q,style:_}),e.jsx(P,{type:"submit",className:"mt-3",children:"Update Name"})]}),e.jsxs(x,{onSubmit:K,className:"mt-4",children:[e.jsx(x.Label,{children:"Bio"}),e.jsx(x.Control,{as:"textarea",rows:3,name:"bio",value:O.bio,onChange:ee,style:_}),e.jsx(P,{type:"submit",className:"mt-3",children:"Update Bio"})]})]}),u==="security"&&e.jsxs("div",{style:G,children:[e.jsx("h4",{children:"Password"}),e.jsxs(x,{onSubmit:X,children:[e.jsx(x.Label,{children:"Current Password"}),e.jsx(x.Control,{type:"password",name:"currentPassword",value:y.currentPassword,onChange:A,style:_}),e.jsx(x.Label,{className:"mt-3",children:"New Password"}),e.jsx(x.Control,{type:"password",name:"newPassword",value:y.newPassword,onChange:A,style:_}),e.jsx(P,{type:"submit",className:"mt-3",children:"Update Password"})]})]}),T===1&&e.jsx("div",{style:ae,children:e.jsxs("div",{style:ie,children:[e.jsx("h4",{children:"Delete Account"}),e.jsx("p",{style:{color:"#aaa",marginBottom:"1.5rem"},children:"Once deleted, all your data is lost forever."}),e.jsxs("div",{className:"d-flex gap-2 justify-content-center",children:[e.jsx(P,{variant:"secondary",onClick:()=>S(0),children:"Cancel"}),e.jsx(P,{variant:"danger",onClick:()=>S(2),children:"Yes, continue"})]})]})}),T===2&&e.jsx("div",{style:ae,children:e.jsxs("div",{style:ie,children:[e.jsx("h4",{children:"Confirm Password"}),e.jsx("p",{style:{color:"#aaa",marginBottom:"0.25rem"},children:"Enter your password to permanently delete your account."}),e.jsx("p",{style:{color:"#ef4444",fontWeight:600,marginBottom:"1rem",fontSize:"0.9rem"},children:"Bro really thought we'd miss him 💀"}),e.jsx(x.Control,{type:"password",placeholder:"Enter password",value:D,onChange:a=>F(a.target.value),className:"mb-3"}),e.jsxs("div",{className:"d-flex gap-2 justify-content-center",children:[e.jsx(P,{variant:"secondary",onClick:()=>{S(0),F("")},children:"Cancel"}),e.jsx(P,{variant:"danger",onClick:L,disabled:H,children:H?"Deleting...":"Delete Forever"})]})]})}),Z&&e.jsx("div",{style:Ne,children:e.jsxs("div",{style:Se,children:[e.jsx("div",{style:{fontSize:"4rem",marginBottom:"0.5rem"},children:"💀"}),e.jsx("p",{style:{fontSize:"1.4rem",fontWeight:800,color:"#fff",margin:0},children:"Bro really thought we'd miss him"}),e.jsx("p",{style:{fontSize:"2.5rem",margin:"0.5rem 0 0"},children:"💀"}),e.jsx("div",{style:Ce,children:e.jsx("div",{style:ze})}),e.jsx("p",{style:{fontSize:"0.75rem",color:"#555",marginTop:"0.75rem"},children:"deleting in 5 seconds..."})]})})]})},ae={position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center"},ie={background:"#1e1e1e",padding:"30px",borderRadius:"12px",width:"350px",textAlign:"center",color:"#fff"},Ne={position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:99999,animation:"fadeIn 0.3s ease",pointerEvents:"none"},Se={textAlign:"center",padding:"2rem",animation:"popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)"},Ce={width:"260px",height:"6px",background:"#222",borderRadius:"10px",margin:"1.25rem auto 0",overflow:"hidden"},ze={height:"100%",width:"100%",background:"linear-gradient(90deg, #ef4444, #f97316)",borderRadius:"10px",animation:"drain 5s linear forwards"};if(typeof document<"u"&&!document.getElementById("meme-keyframes")){const b=document.createElement("style");b.id="meme-keyframes",b.textContent=`
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes popIn  { from { transform: scale(0.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
    @keyframes drain  { from { width: 100% } to { width: 0% } }
  `,document.head.appendChild(b)}const J={ADDED:"added_to_watchlist",REMOVED:"removed_from_watchlist",TRAILER:"trailer_watch"},Oe=({setIsLoggedIn:b})=>{const w=ce(),[h,j]=r.useState("watchlist"),[c,z]=r.useState("profile"),[k,u]=r.useState(""),[m,I]=r.useState(""),[O,M]=r.useState(""),[y,N]=r.useState([]),[D,F]=r.useState([]),[V,B]=r.useState([]),[H,U]=r.useState(!0),[T,S]=r.useState(!0),[q,E]=r.useState(!1),[Z,Y]=r.useState(null),[Q,ee]=r.useState(!1),[A,te]=r.useState(!1),[R,K]=r.useState(!1),[X,L]=r.useState(!1),[G,_]=r.useState(!1),a=r.useCallback(async()=>{try{const t=await g.get("/users/watchlist/full");N(t.data||[])}catch(t){console.error("Watchlist fetch failed:",t)}},[]),n=r.useCallback(async()=>{try{U(!0);const t=await g.get("/activity/history");B(t.data)}catch(t){console.error("History fetch failed:",t)}finally{U(!1)}},[]),p=r.useCallback(async()=>{if(!(A||R)){K(!0);try{const i=(await g.get("/movies/recommendations/user")).data.filter((s,l,v)=>l===v.findIndex($=>$.id===s.id));F(i),te(!0)}catch(t){console.error("Recommendations fetch failed:",t)}finally{K(!1)}}},[A,R]);r.useEffect(()=>{if(T)return;const t=localStorage.getItem("token");if(!t)return;let i;try{i=JSON.parse(atob(t.split(".")[1])).sub}catch{console.error("❌ Could not decode token for socket room");return}const l=we("http://localhost:8000",{path:"/socket.io",transports:["polling","websocket"],upgrade:!0,reconnection:!0,reconnectionAttempts:1/0,reconnectionDelay:1e3,reconnectionDelayMax:1e4,randomizationFactor:.3,timeout:2e4,forceNew:!1});return l.on("connect",()=>{l.emit("join_room",{userId:i})}),l.on("activity_update",v=>{B($=>[v,...$].slice(0,20)),v.action_type===J.ADDED?(a(),o.success(`✅ Added "${v.movie_title}" to watchlist`)):v.action_type===J.REMOVED&&(N($=>$.filter(de=>de.id!==v.movie_id)),o.info(`Removed "${v.movie_title}"`))}),l.on("connect_error",v=>{}),l.on("disconnect",v=>{v==="io server disconnect"&&l.connect()}),l.on("reconnect_attempt",v=>{}),l.on("reconnect",()=>{l.emit("join_room",{userId:i})}),()=>{l.off("activity_update"),l.disconnect()}},[T,a]),r.useEffect(()=>{(async()=>{if(!localStorage.getItem("token")){w("/login");return}try{const[s,l]=await Promise.all([g.get("/users/me"),g.get("/users/watchlist/full")]);u(s.data.name||s.data.username||""),I(s.data.profilePicture||s.data.profile_picture||""),M(s.data.bio||""),N(l.data||[]),n()}catch(s){console.error(s),o.error("Failed loading dashboard")}finally{S(!1)}})()},[w,n]);const f=r.useCallback(async(t,i)=>{if(!(!localStorage.getItem("token")||!t))try{await g.post("/activity/log",{movie_id:t.id,action_type:i,movie_title:t.title||"Unknown",movie_poster_path:t.poster_path||""})}catch(l){console.error("Failed to log activity:",l)}},[]),d=async t=>{try{const s=(await g.get(`/movies/${t.id}/videos`)).data;if(!(s!=null&&s.key)){o.error("Trailer not available");return}Y(s.key),E(!0)}catch(i){console.error(i)}},W=async t=>{try{const i=await g.post(`/users/watchlist/${t.id}`);o.success(i.data.msg),N(s=>s.some(l=>l.id===t.id)?s:[t,...s]),f(t,J.ADDED)}catch(i){console.error(i),o.error("Could not add movie")}},C=async t=>{try{const i=await g.delete(`/users/watchlist/${t.id}`);o.info(i.data.msg),N(s=>s.filter(l=>l.id!==t.id)),f(t,J.REMOVED)}catch(i){console.error(i),o.error("Could not remove movie")}},se=async()=>{try{await g.delete("/activity/history"),B([]),o.success("History cleared")}catch(t){console.error(t),o.error("Failed to clear history")}},ne=()=>{localStorage.removeItem("token"),b(!1),w("/login")};return T?e.jsx(oe,{}):e.jsxs("div",{className:"modern-dashboard",children:[e.jsx("div",{className:"bg-glow"}),e.jsx("div",{className:"bg-glow-alt"}),e.jsxs("div",{className:"dashboard-layout",children:[X&&e.jsx("div",{className:"sidebar-overlay",onClick:()=>L(!1)}),e.jsxs("aside",{className:`sidebar-glass${X?" sidebar-open":""}`,children:[e.jsx("div",{className:"brand-zone",children:e.jsx("button",{className:"sidebar-close-btn",onClick:()=>L(!1),children:e.jsx(he,{})})}),e.jsxs("nav",{className:"main-nav",children:[e.jsx("div",{className:"nav-label",children:"Main Menu"}),[{id:"watchlist",label:"My Library",icon:"bi-collection-play"},{id:"recommendations",label:"Discovery",icon:"bi-compass"},{id:"history",label:"Activity",icon:"bi-clock-history"},{id:"settings",label:"Settings",icon:"bi-sliders"}].map(t=>e.jsxs("button",{onClick:()=>{j(t.id),L(!1),t.id==="recommendations"&&p()},className:`nav-btn ${h===t.id?"active":""}`,children:[e.jsx("div",{className:"active-indicator"}),e.jsx("i",{className:`bi ${t.icon}`}),e.jsx("span",{children:t.label})]},t.id))]}),e.jsxs("div",{className:"profile-footer-card",children:[e.jsxs("div",{className:"profile-top",children:[e.jsx("img",{src:m||"https://placehold.co/40",alt:"user"}),e.jsxs("div",{className:"profile-info",children:[e.jsx("span",{className:"user-name",children:k}),e.jsx("span",{className:"user-status",children:"Online"})]})]}),e.jsxs("button",{onClick:ne,className:"logout-btn-refined",children:[e.jsx(fe,{}),e.jsx("span",{children:"Sign Out"})]})]})]}),e.jsxs("div",{className:"mobile-topbar",children:[e.jsx("button",{className:"hamburger-btn",onClick:()=>L(!0),children:e.jsx(be,{})}),e.jsxs("h2",{className:"brand-text",style:{margin:0},children:["STREAM",e.jsx("span",{children:"HUB"})]}),e.jsx("img",{src:m||"https://placehold.co/36",alt:"user",className:"mobile-avatar"})]}),e.jsxs("main",{className:"content-hub custom-scrollbar py-5",style:{paddingTop:"4rem"},children:[e.jsx("header",{className:"content-header-refined",children:e.jsxs("div",{className:"header-left",children:[e.jsxs("span",{className:"breadcrumb-mini",children:["Pages / ",h]}),e.jsx("h1",{children:h==="watchlist"?"Your Collection":h.charAt(0).toUpperCase()+h.slice(1)})]})}),e.jsxs("div",{className:"scroll-content",children:[h==="watchlist"&&e.jsx("div",{className:"grid-reveal",children:y.length>0?e.jsx("div",{className:"movie-grid-refined",children:y.map(t=>e.jsx("div",{className:"grid-item-refined",children:e.jsx(re,{movie:t,onWatchTrailerClick:()=>d(t),onWatchlistClick:()=>C(t),isInWatchlist:!0})},t.id))}):e.jsxs("div",{className:"empty-state-refined",children:[e.jsx("div",{className:"empty-icon",children:e.jsx(xe,{})}),e.jsx("h3",{children:"Your library is empty"}),e.jsx("p",{children:"Start adding movies you want to watch later."}),e.jsx("button",{onClick:()=>j("recommendations"),className:"btn-action-refined",children:"Explore Movies"})]})}),h==="recommendations"&&e.jsxs("div",{className:"fade-in-section",children:[R&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"5rem 0",gap:16},children:[e.jsx("div",{style:{width:42,height:42,border:"3px solid rgba(255,255,255,0.06)",borderTopColor:"#e50914",borderRadius:"50%",animation:"rec-spin 0.8s linear infinite"}}),e.jsx("p",{style:{color:"rgba(255,255,255,0.3)",fontFamily:"Poppins",fontSize:"0.82rem",margin:0},children:"Finding your perfect movies..."}),e.jsx("style",{children:"@keyframes rec-spin { to { transform: rotate(360deg); } }"})]}),A&&!R&&(Q?e.jsx("div",{className:"movie-grid-refined",children:D.map(t=>e.jsx("div",{className:"grid-item-refined",children:e.jsx(re,{movie:t,onWatchTrailerClick:()=>d(t),onWatchlistClick:()=>y.some(i=>i.id===t.id)?C(t):W(t),isInWatchlist:y.some(i=>i.id===t.id)})},t.id))}):e.jsx(me,{title:"Tailored Discovery",movies:D,onWatchTrailerClick:d,onSeeAllClick:()=>ee(!0),onWatchlistClick:t=>y.some(i=>i.id===t.id)?C(t):W(t)}))]}),h==="history"&&e.jsx("div",{className:"bento-container fade-in-section",children:e.jsx(je,{history:V,loading:H,onClearHistory:se})}),h==="settings"&&e.jsxs("div",{className:"settings-bento-grid fade-in-section",children:[e.jsxs("div",{className:"settings-sidebar-card",children:[e.jsxs("div",{className:"profile-edit-header",children:[e.jsxs("div",{className:"avatar-upload-wrapper",children:[e.jsx("img",{src:m||"https://placehold.co/120",alt:"User",className:"settings-avatar"}),e.jsx("button",{className:"avatar-edit-btn",children:e.jsx(ue,{})})]}),e.jsx("h3",{className:"settings-username",children:k}),e.jsx("p",{className:"settings-status-pill",children:"Member Since 2026"})]}),e.jsxs("div",{className:"settings-mini-nav",children:[e.jsxs("div",{className:`s-nav-item ${c==="profile"?"active":""}`,onClick:()=>z("profile"),children:[e.jsx(ve,{})," Account Details"]}),e.jsxs("div",{className:`s-nav-item ${c==="security"?"active":""}`,onClick:()=>z("security"),children:[e.jsx(ye,{}),"Security"]})]})]}),e.jsxs("div",{className:"settings-main-form",children:[e.jsx(ke,{userName:k,userBio:O,userProfilePicture:m,onNameUpdate:t=>u(t),onBioUpdate:t=>M(t),onPictureUpdate:t=>I(t),activeSubTab:c,triggerDelete:G}),e.jsxs("div",{className:"danger-zone-wrapper",children:[e.jsx("h5",{className:"danger-title",children:"Danger Zone"}),e.jsxs("div",{className:"danger-card",children:[e.jsxs("div",{className:"danger-text",children:[e.jsx("p",{className:"mb-0 fw-bold",children:"Delete Account"}),e.jsx("small",{children:"Once deleted, all your data is lost forever."})]}),e.jsx("button",{className:"danger-btn",onClick:()=>_(t=>!t),children:"Delete"})]})]})]})]})]})]}),e.jsx("nav",{className:"mobile-bottom-nav",children:[{id:"watchlist",icon:"bi-collection-play"},{id:"recommendations",icon:"bi-compass"},{id:"history",icon:"bi-clock-history"},{id:"settings",icon:"bi-sliders"}].map(t=>e.jsx("button",{onClick:()=>j(t.id),className:`bottom-nav-btn${h===t.id?" active":""}`,children:e.jsx("i",{className:`bi ${t.icon}`})},t.id))})]}),e.jsx(pe,{show:q,handleClose:()=>E(!1),videoKey:Z}),e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --accent:       #3a7bd5;
          --accent-glow:  rgba(58,123,213,0.35);
          --sidebar-bg:   rgba(8,9,13,0.92);
          --card-bg:      rgba(255,255,255,0.03);
          --border:       rgba(255,255,255,0.07);
          --text-muted:   #64748b;
          --danger:       #ef4444;
        }

        *, *::before, *::after { box-sizing: border-box; }

        /* ── SHELL ── */
        .modern-dashboard {
          background: #08090d; color: #e2e8f0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          height: 100dvh; overflow: hidden; position: relative;
        }
        .bg-glow     { position:absolute; top:-10%; right:-5%; width:45%; height:50%; background:radial-gradient(circle,rgba(58,123,213,0.1) 0%,transparent 70%); z-index:0; pointer-events:none; }
        .bg-glow-alt { position:absolute; bottom:-10%; left:-5%; width:40%; height:40%; background:radial-gradient(circle,rgba(91,58,213,0.07) 0%,transparent 70%); z-index:0; pointer-events:none; }
        .dashboard-layout { display:flex; height:100%; position:relative; z-index:1; }

        /* ── SIDEBAR ── */
        .sidebar-glass {
          width: 260px; flex-shrink: 0;
          background: var(--sidebar-bg);
          backdrop-filter: blur(30px);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 2rem 1.25rem;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar-close-btn { display: none; }

        .brand-zone { display:flex; align-items:center; gap:12px; margin-bottom:3rem; padding-left:4px; }
        .brand-logo {
          width:34px; height:34px; background:var(--accent); border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          transform:rotate(-10deg); box-shadow:0 0 20px var(--accent-glow); flex-shrink:0;
        }
        .logo-inner { width:12px; height:12px; border:2.5px solid #fff; border-radius:3px; }
        .brand-text { font-size:1.35rem; font-weight:800; letter-spacing:-1px; margin:0; }
        .brand-text span { color:var(--accent); }

        .main-nav  { display:flex; flex-direction:column; gap:4px; flex-grow:1; }
        .nav-label { font-size:0.65rem; text-transform:uppercase; letter-spacing:1.8px; color:#334155; margin-bottom:0.75rem; padding-left:1rem; font-weight:700; }

        .nav-btn {
          background: transparent; border: none; color: #64748b;
          display: flex; align-items: center; gap: 13px;
          padding: 13px 16px; border-radius: 12px;
          transition: all 0.2s ease; text-align: left;
          position: relative; cursor: pointer; font-size: 0.9rem; font-weight: 600;
          width: 100%;
        }
        .nav-btn:hover { color: #cbd5e1; background: rgba(255,255,255,0.04); }
        .nav-btn.active {
          color: #fff;
          background: linear-gradient(90deg, rgba(58,123,213,0.18) 0%, rgba(58,123,213,0.04) 100%);
        }
        .active-indicator {
          position:absolute; left:0; top:22%; bottom:22%;
          width:3px; background:var(--accent); border-radius:0 4px 4px 0; display:none;
        }
        .nav-btn.active .active-indicator { display:block; }
        .nav-btn i { font-size:1rem; width:18px; text-align:center; flex-shrink:0; }

        /* ── PROFILE FOOTER ── */
        .profile-footer-card {
          background: rgba(255,255,255,0.025); border:1px solid var(--border);
          border-radius:18px; padding:1rem; margin-top:1.5rem;
        }
        .profile-top { display:flex; align-items:center; gap:10px; margin-bottom:1rem; }
        .profile-top img { width:40px; height:40px; border-radius:11px; object-fit:cover; border:1.5px solid var(--border); flex-shrink:0; }
        .user-name   { font-weight:700; font-size:0.83rem; color:#f1f5f9; display:block; }
        .user-status { font-size:0.62rem; color:#10b981; font-weight:600; display:flex; align-items:center; gap:4px; }
        .user-status::before { content:''; width:5px; height:5px; background:#10b981; border-radius:50%; display:inline-block; }
        .logout-btn-refined {
          width:100%; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.18);
          color:#ef4444; padding:9px; border-radius:10px; font-size:0.82rem; font-weight:700;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:all 0.2s; cursor:pointer;
        }
        .logout-btn-refined:hover { background:#ef4444; color:#fff; box-shadow:0 4px 15px rgba(239,68,68,0.3); }

        /* ── MOBILE TOP BAR ── */
        .mobile-topbar { display:none; }
        .hamburger-btn { background:none; border:none; color:#e2e8f0; font-size:1.55rem; cursor:pointer; padding:4px 6px; line-height:1; flex-shrink:0; }
        .mobile-avatar { width:34px; height:34px; border-radius:10px; object-fit:cover; border:1.5px solid var(--border); flex-shrink:0; }

        /* ── OVERLAY ── */
        .sidebar-overlay {
          display:none; position:fixed; inset:0;
          background:rgba(0,0,0,0.65); backdrop-filter:blur(3px); z-index:99;
        }

        /* ── BOTTOM NAV ── */
        .mobile-bottom-nav { display:none; }
        .bottom-nav-btn {
          flex:1; background:none; border:none; color:#475569;
          font-size:1.25rem; padding:8px 0; cursor:pointer;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:3px; transition:all 0.2s; position:relative;
        }
        .bottom-nav-btn .bnav-label { font-size:0.55rem; font-weight:600; letter-spacing:0.3px; }
        .bottom-nav-btn.active { color:var(--accent); }
        .bottom-nav-btn.active::before {
          content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
          width:28px; height:2px; background:var(--accent); border-radius:0 0 4px 4px;
        }

        /* ── CONTENT HUB ── */
        .content-hub { flex-grow:1; overflow-y:auto; padding:2.25rem 3rem; min-width:0; }
        .content-header-refined { margin-bottom:2.5rem; }
        .breadcrumb-mini { font-size:0.72rem; color:var(--text-muted); margin-bottom:4px; display:block; font-weight:500; }
        .header-left h1 { font-size:2.2rem; font-weight:800; letter-spacing:-1.5px; margin:0; }

        /* ── MOVIE GRID ── */
        .movie-grid-refined {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          /* visible so hover shadows aren't clipped */
          overflow: visible;
        }

        /* grid-item-refined CONSTRAINS the fixed-width card to the cell.
           overflow:hidden clips the card at cell boundary so it can never
           overlap neighbours, while the negative margin trick gives the
           hover shadow a little breathing room. */
        .grid-item-refined {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          box-shadow: 0 0 0 0 transparent;
          transition: box-shadow 0.35s ease;
          /* enable container queries so buttons can respond to cell width */
          container-type: inline-size;
        }

        /* Forward the card's hover shadow onto the wrapper instead */
        .grid-item-refined:has(.card:hover) {
          box-shadow: 0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(229,9,20,0.35);
          overflow: visible;
          z-index: 2;
        }

        /* Make the card fill the wrapper cell completely */
        .grid-item-refined .card {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: 270 / 380;
          position: relative;
        }

        /* On hover scale, keep within cell by clamping transform origin */
        .grid-item-refined .card:hover {
          transform: translateY(-8px) scale(1.04);
        }

        /* ── BUTTON FIX for grid cards ──
           Shrink buttons to fit 3 across any card width. */
        .grid-item-refined .btn-watch,
        .grid-item-refined .btn-trailer,
        .grid-item-refined .btn-add,
        .grid-item-refined .btn-remove {
          font-size: 0.6rem;
          padding: 5px 2px;
          gap: 2px;
          min-width: 0;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          letter-spacing: -0.2px;
        }

        .grid-item-refined .btn-watch i,
        .grid-item-refined .btn-trailer i,
        .grid-item-refined .btn-add i,
        .grid-item-refined .btn-remove i {
          font-size: 0.7rem;
          flex-shrink: 0;
        }

        /* ── EMPTY STATE ── */
        .empty-state-refined {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; text-align:center;
          padding:5rem 2rem;
          background:rgba(255,255,255,0.015);
          border:2px dashed rgba(255,255,255,0.05);
          border-radius:32px; margin-top:1rem;
        }
        .empty-icon {
          width:90px; height:90px;
          background:linear-gradient(135deg,rgba(58,123,213,0.12) 0%,transparent 100%);
          border-radius:26px; display:flex; align-items:center; justify-content:center;
          margin-bottom:1.5rem; animation:float 4s ease-in-out infinite;
        }
        .empty-icon i { font-size:2.6rem; color:var(--accent); filter:drop-shadow(0 0 12px var(--accent-glow)); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .empty-state-refined h3 { font-size:1.6rem; font-weight:800; margin-bottom:6px; color:#fff; }
        .empty-state-refined p  { color:#64748b; margin-bottom:2rem; max-width:280px; line-height:1.6; font-size:0.9rem; }

        .btn-action-refined {
          background:var(--accent); color:#fff; border:none;
          padding:13px 28px; border-radius:14px; font-weight:700; font-size:0.9rem;
          cursor:pointer; box-shadow:0 8px 20px var(--accent-glow);
          transition:all 0.25s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        .btn-action-refined:hover  { transform:translateY(-2px) scale(1.04); box-shadow:0 12px 28px var(--accent-glow); }
        .btn-action-refined:active { transform:scale(0.97); }

        /* ── BENTO ── */
        .bento-container { background:var(--card-bg); border:1px solid var(--border); border-radius:24px; padding:2rem; }

        /* ── SETTINGS ── */
        .settings-bento-grid   { display:grid; grid-template-columns:300px 1fr; gap:1.75rem; max-width:1050px; }
        .settings-sidebar-card { background:var(--card-bg); border:1px solid var(--border); border-radius:22px; padding:2rem 1.25rem; height:fit-content; text-align:center; }
        .avatar-upload-wrapper { position:relative; width:110px; margin:0 auto 1.25rem; }
        .settings-avatar       { width:110px; height:110px; border-radius:28px; object-fit:cover; border:3px solid rgba(58,123,213,0.2); }
        .avatar-edit-btn       { position:absolute; bottom:-5px; right:-5px; background:var(--accent); border:none; color:#fff; width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .settings-mini-nav     { text-align:left; margin-top:1.25rem; }
        .s-nav-item            { padding:11px 14px; border-radius:10px; color:#64748b; font-size:0.875rem; font-weight:600; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:10px; margin-bottom:4px; }
        .s-nav-item:hover      { background:rgba(255,255,255,0.04); color:#cbd5e1; }
        .s-nav-item.active     { background:rgba(58,123,213,0.1); color:var(--accent); }
        .settings-main-form    { background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:28px; padding:2.5rem; }
        .premium-input { background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:11px; padding:11px 14px; color:#fff; width:100%; outline:none; transition:0.25s; margin-top:5px; font-family:inherit; font-size:0.9rem; }
        .premium-input:focus { border-color:var(--accent); background:rgba(58,123,213,0.07); }
        .custom-form-group       { margin-bottom:1.25rem; }
        .custom-form-group label { font-size:0.82rem; font-weight:600; color:#94a3b8; }
        .danger-zone-wrapper   { margin-top:3rem; padding-top:1.75rem; border-top:1px solid var(--border); }
        .danger-title          { font-size:0.8rem; text-transform:uppercase; letter-spacing:1.5px; color:#64748b; margin-bottom:1rem; font-weight:700; }
        .danger-card           { background:rgba(239,68,68,0.04); border:1px solid rgba(239,68,68,0.12); padding:1.25rem; border-radius:14px; display:flex; justify-content:space-between; align-items:center; gap:1rem; }
        .danger-btn            { background:transparent; border:1px solid var(--danger); color:var(--danger); padding:8px 18px; border-radius:9px; font-weight:700; font-size:0.85rem; cursor:pointer; flex-shrink:0; transition:0.2s; }
        .danger-btn:hover      { background:var(--danger); color:#fff; }
        .btn-save-settings     { background:var(--accent); color:#fff; border:none; padding:11px 22px; border-radius:11px; font-weight:700; font-size:0.9rem; transition:0.2s; cursor:pointer; }
        .btn-save-settings:hover { background:#4a8be6; }

        /* ── SCROLLBAR ── */
        .custom-scrollbar::-webkit-scrollbar       { width:5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:10px; }

        /* ════════ TABLET ≤ 1024px ════════ */
        @media (max-width:1024px) {
          .sidebar-glass        { width:230px; padding:1.75rem 1rem; }
          .content-hub          { padding:2rem 1.75rem; }
          .settings-bento-grid  { grid-template-columns:250px 1fr; }
          .header-left h1       { font-size:1.9rem; }
          .movie-grid-refined   { grid-template-columns:repeat(auto-fill, minmax(160px,1fr)); gap:1rem; }
        }

        /* ════════ MOBILE ≤ 768px ════════ */
        @media (max-width:768px) {
          .modern-dashboard  { height:100dvh; }
          .dashboard-layout  { flex-direction:column; height:100dvh; overflow:hidden; }

          /* Sidebar → slide-in drawer */
          .sidebar-glass {
  position:fixed; top:20; left:0; height:100dvh; width:270px;
  z-index:200; transform:translateX(-100%); padding:1.5rem 1.25rem;
}
          .sidebar-glass.sidebar-open { transform:translateX(0); }
.sidebar-overlay { display:block; z-index:199; }

          /* Close btn */
          .sidebar-close-btn {
            display:flex; align-items:center; justify-content:center;
            background:rgba(255,255,255,0.06); border:1px solid var(--border);
            color:#94a3b8; width:32px; height:32px; border-radius:9px;
            cursor:pointer; font-size:0.9rem; flex-shrink:0;
            margin-right:auto; order:-1;
          }

          /* Mobile top bar */
       .mobile-topbar { display: none; }

          /* Main content area */
          .content-hub {
            flex:1; height:0; overflow-y:auto;
            padding:1rem 0.875rem calc(64px + 1rem);
          }
          .content-header-refined { margin-bottom:1.25rem; }
          .header-left h1  { font-size:1.5rem; letter-spacing:-0.8px; }
          .breadcrumb-mini { display:none; }

          /* Bottom nav */
          .mobile-bottom-nav {
            display:flex; position:fixed; bottom:0; left:0; right:0;
            background:rgba(8,9,13,0.96); backdrop-filter:blur(24px);
            border-top:1px solid var(--border); height:58px; z-index:50;
            padding:0 0.5rem;
          }
            .brand-zone { display: none; }

          /* Grid — 2 columns, tight */
          .movie-grid-refined { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .grid-item-refined { overflow: hidden; border-radius: 14px; }

          /* Settings */
          .settings-bento-grid { grid-template-columns:1fr; }
          .settings-main-form  { padding:1.25rem; border-radius:18px; }
          .danger-card         { flex-direction:column; align-items:flex-start; }

          /* Bento */
          .bento-container { padding:1rem; border-radius:18px; }

          /* Empty state */
          .empty-state-refined { padding:3rem 1.25rem; border-radius:22px; }
          .empty-state-refined h3 { font-size:1.35rem; }
        }

        /* ════════ SMALL ≤ 400px ════════ */
        @media (max-width:400px) {
          .content-hub          { padding:0.75rem 0.65rem calc(64px + 0.75rem); }
          .movie-grid-refined   { gap:0.45rem; }
          .header-left h1       { font-size:1.3rem; }
          .settings-main-form   { padding:1rem; }
        }
      `})]})};export{Oe as default};

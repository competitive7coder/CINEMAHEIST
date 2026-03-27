import{j as t,D as m,F as H,B as q,S as J}from"./chunk-ui-Z2Pwl_H2.js";import{e as O,r as a}from"./chunk-react-B2a0IqF-.js";import{a as h}from"./api-DKlbdnFA.js";import{y as R}from"./index-DipoDFDE.js";import{M as Q}from"./MovieCard-CRLkexGR.js";import U from"./VideoModal-D9YnvmLQ.js";import{L as X}from"./LoadingSpinner-CSk5ck2Z.js";import"./chunk-vendors-3DY9Nbxc.js";import"./index-CwUIGroc.js";const Z={popular:"Trending Now","new-releases":"New Releases",28:"Action Packed",35:"Comedy Movies",27:"Horror Flicks",10749:"Romantic Movies",878:"Science Fiction",53:"Thriller Tales",12:"Adventure",16:"Animation",80:"Crime",18:"Drama",14:"Fantasy"},de=()=>{const{genreId:d}=O(),I=Z[d]||"Movies",[j,v]=a.useState([]),[S,N]=a.useState(!0),[F,y]=a.useState(!1),[Y,M]=a.useState(null),[u,B]=a.useState("popularity.desc"),[g,L]=a.useState(""),[f,C]=a.useState(1),[W,D]=a.useState(1),[P,T]=a.useState(!1),[A,w]=a.useState([]),k=a.useCallback(async(e=1,s=!1)=>{var i,l,o;s?T(!0):(N(!0),e===1&&v([]));try{let n;const c={page:e};d==="popular"?n="/movies/popular":d==="new-releases"?n="/movies/now-playing":(n=`/movies/genre/${d}`,c.sort_by=u,g&&(c.year=g));const r=await h.get(n,{params:c}),p=Array.isArray(r.data)?r.data:Array.isArray((i=r.data)==null?void 0:i.results)?r.data.results:[];v(x=>s?[...x,...p]:p),D(((l=r.data)==null?void 0:l.total_pages)||((o=r.data)==null?void 0:o.totalPages)||1)}catch{R.error("Could not load movies.")}finally{N(!1),T(!1)}},[d,u,g]);a.useEffect(()=>{localStorage.getItem("token")&&h.get("/users/watchlist").then(s=>w(Array.isArray(s.data)?s.data:[])).catch(()=>{})},[]),a.useEffect(()=>{window.scrollTo(0,0),C(1),k(1,!1)},[d,u,g,k]);const E=()=>{const e=f+1;C(e),k(e,!0)},_=e=>e&&B(e),$=e=>L(e.target.value),z=async e=>{var i,l,o,n,c;const s=(e==null?void 0:e.id)??e;try{const r=await h.get(`/movies/${s}/videos`),p=(l=(i=r.data)==null?void 0:i.results)==null?void 0:l.find(b=>b.type==="Trailer"&&b.site==="YouTube"),x=(n=(o=r.data)==null?void 0:o.results)==null?void 0:n.find(b=>b.site==="YouTube");M((p==null?void 0:p.key)||(x==null?void 0:x.key)||((c=r.data)==null?void 0:c.key)||null),y(!0)}catch{M(null),y(!0)}},K=async e=>{if(!localStorage.getItem("token")){R.error("Please log in.");return}const i=A.includes(e.id);w(l=>i?l.filter(o=>o!==e.id):[...l,e.id]);try{i?await h.delete(`/users/watchlist/${e.id}`):await h.post(`/users/watchlist/${e.id}`,{})}catch{w(o=>i?[...o,e.id]:o.filter(n=>n!==e.id))}};if(S&&f===1)return t.jsx(X,{});const G=new Date().getFullYear(),V=Array.from({length:50},(e,s)=>G-s);return t.jsxs("div",{className:"container-fluid py-4 px-1 px-md-3",style:{color:"white",paddingTop:"100px"},children:[t.jsx("style",{children:`
        /* Force 7-column desktop grid */
        @media (min-width: 992px) {
          .sh-grid {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 12px !important;
          }
          .sh-grid > .col {
            width: 100% !important;
            max-width: none !important;
            flex: 0 0 auto !important;
          }
        }

        /* Professional Glass Header */
        .sh-genre-header {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        /* Stylish Dropdown Styling */
        .sh-custom-select {
          background-color: rgba(20, 20, 20, 0.8) !important;
          color: #efefef !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          padding: 8px 35px 8px 15px !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 16px 12px !important;
        }
        .sh-custom-select:hover { border-color: rgba(255, 255, 255, 0.5) !important; background-color: rgba(40, 40, 40, 0.9) !important; }

        /* Stylish Load More Button */
        .sh-load-more-btn {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 12px 45px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 0.75rem;
          transition: all 0.3s ease;
          color: #fff;
        }
        .sh-load-more-btn:hover {
          background: #fff !important;
          color: #000 !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
      `}),t.jsxs("div",{className:"sh-genre-header d-flex flex-wrap justify-content-between align-items-center mx-auto",style:{maxWidth:"1450px",marginTop:"40px",marginBottom:"35px",padding:"18px 25px",background:"rgba(255, 255, 255, 0.03)",backdropFilter:"blur(12px)",borderRadius:"15px",border:"1px solid rgba(255, 255, 255, 0.08)",boxShadow:"0 8px 32px 0 rgba(0, 0, 0, 0.3)",position:"relative",zIndex:10},children:[t.jsxs("div",{className:"d-flex align-items-center gap-2",children:[t.jsx("div",{style:{width:"4px",height:"26px",background:"#e50914",borderRadius:"2px"}}),t.jsx("h3",{className:"fw-bold mb-0 text-truncate",style:{letterSpacing:"0.5px"},children:I})]}),d!=="popular"&&d!=="new-releases"&&t.jsxs("div",{className:"d-flex align-items-center gap-3 mt-3 mt-sm-0",children:[t.jsxs(m,{onSelect:_,children:[t.jsxs(m.Toggle,{variant:"dark",id:"dropdown-sort",className:"sh-custom-select",style:{width:"auto"},children:["Sort:"," ",u.includes("pop")?"Popular":u.includes("release")?"Recent":"Rating"]}),t.jsxs(m.Menu,{variant:"dark",children:[t.jsx(m.Item,{eventKey:"popularity.desc",children:"Popularity"}),t.jsx(m.Item,{eventKey:"release_date.desc",children:"Release Date"}),t.jsx(m.Item,{eventKey:"vote_average.desc",children:"Rating"})]})]}),t.jsxs(H.Select,{value:g,onChange:$,className:"sh-custom-select",style:{width:"135px"},children:[t.jsx("option",{value:"",children:"Year"}),V.map(e=>t.jsx("option",{value:e,children:e},e))]})]})]}),t.jsx("div",{className:"d-flex justify-content-center",children:t.jsx("div",{className:"row row-cols-3 sh-grid w-100 justify-content-center",style:{maxWidth:"1450px"},children:j.length>0?j.map(e=>t.jsx("div",{className:"col d-flex justify-content-center mb-3",children:t.jsx(Q,{movie:e,watchlist:A,onWatchTrailerClick:z,onWatchlistClick:K})},`${e.id}-${f}`)):!S&&t.jsx("div",{className:"col-12 text-center py-5 text-muted",children:"No movies found in this genre."})})}),t.jsxs("div",{className:"text-center mt-5 mb-5",children:[f<W&&!P&&t.jsx(q,{variant:"outline-light",className:"sh-load-more-btn",onClick:E,children:"Load More"}),P&&t.jsx(J,{animation:"border",variant:"danger",size:"sm"})]}),t.jsx(U,{show:F,handleClose:()=>y(!1),videoKey:Y})]})};export{de as default};

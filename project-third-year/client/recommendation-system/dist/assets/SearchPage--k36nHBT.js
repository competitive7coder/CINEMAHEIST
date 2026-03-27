import{j as t,F as I,B as V,S as q}from"./chunk-ui-Z2Pwl_H2.js";import{f as z,u as B,r}from"./chunk-react-B2a0IqF-.js";import{a as l}from"./api-DKlbdnFA.js";import K from"./VideoModal-D9YnvmLQ.js";import{L as U}from"./LoadingSpinner-CSk5ck2Z.js";import{M as _}from"./MovieCard-CRLkexGR.js";import{y as c}from"./index-DipoDFDE.js";import"./chunk-vendors-3DY9Nbxc.js";import"./index-CwUIGroc.js";const te=()=>{const[h]=z(),n=h.get("q"),C=h.get("year")||"",u=B(),[g,x]=r.useState([]),[N,y]=r.useState(!0),[P,w]=r.useState(!1),[Y,j]=r.useState(null),[i,M]=r.useState(C),[d,S]=r.useState(1),[L,R]=r.useState(1),[b,k]=r.useState(!1),[v,m]=r.useState([]),f=r.useCallback(async(e=1,a=!1)=>{if(n){a?k(!0):(y(!0),e===1&&x([]));try{const s={query:n,page:e};i&&(s.year=i);const o=await l.get("/movies/search",{params:s});x(p=>a?[...p,...o.data.results]:o.data.results),R(o.data.total_pages||1)}catch{c.error("Could not fetch search results.")}finally{y(!1),k(!1)}}},[n,i]);r.useEffect(()=>{localStorage.getItem("token")&&l.get("/users/watchlist").then(a=>m(Array.isArray(a.data)?a.data:[])).catch(()=>{})},[]),r.useEffect(()=>{if(!n){u("/");return}window.scrollTo(0,0),S(1),f(1,!1)},[n,i,u,f]);const W=()=>{const e=d+1;S(e),f(e,!0)},$=e=>{const a=e.target.value;M(a);const s=new URLSearchParams(h);a?s.set("year",a):s.delete("year"),u({search:s.toString()},{replace:!0})},A=async e=>{var a;try{const s=await l.get(`/movies/${e.id}/videos`);j(((a=s.data)==null?void 0:a.key)||null)}catch{j(null)}finally{w(!0)}},T=async e=>{if(!localStorage.getItem("token")){c.error("Please log in to manage your watchlist.");return}const s=v.includes(e.id);try{s?(await l.delete(`/users/watchlist/${e.id}`),m(o=>o.filter(p=>p!==e.id)),c.info(`Removed "${e.title}" from watchlist`)):(await l.post(`/users/watchlist/${e.id}`,{}),m(o=>[...o,e.id]),c.success(`Added "${e.title}" to watchlist`))}catch{c.error("Update failed. Please try again.")}};if(N&&d===1)return t.jsx(U,{});const E=new Date().getFullYear(),F=Array.from({length:50},(e,a)=>E-a);return t.jsxs("div",{className:"container-fluid py-6",style:{color:"white",paddingTop:"100px"},children:[t.jsx("style",{children:`
        @media (min-width: 992px) {
          .sh-grid {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 10px !important;
          }
          .sh-grid > .col {
            width: 100% !important;
            max-width: none !important;
            flex: 0 0 auto !important;
          }
        }
        
        .sh-load-more-btn {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 12px 40px;
          font-weight: 600;
          color: #fff;
          transition: 0.3s;
        }
        .sh-load-more-btn:hover {
          background: #fff !important;
          color: #000 !important;
          transform: translateY(-3px);
        }
      `}),t.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-4 mx-auto px-2",style:{maxWidth:"1500px"},children:[t.jsxs("h4",{className:"fw-bold mb-0",children:['Results for "',n,'"']}),t.jsxs(I.Select,{value:i,onChange:$,className:"bg-dark text-light border-secondary",style:{width:"100px"},size:"sm",children:[t.jsx("option",{value:"",children:"Year"}),F.map(e=>t.jsx("option",{value:e,children:e},e))]})]}),t.jsx("div",{className:"d-flex justify-content-center",children:t.jsx("div",{className:"row row-cols-3 sh-grid w-100 justify-content-center",style:{maxWidth:"1500px"},children:g.length>0?g.map(e=>t.jsx("div",{className:"col d-flex justify-content-center mb-3",children:t.jsx(_,{movie:e,watchlist:v,onWatchTrailerClick:A,onWatchlistClick:T})},`${e.id}-${d}`)):t.jsx("div",{className:"col-12 text-center py-5 text-muted",children:"No movies found."})})}),t.jsxs("div",{className:"text-center mt-5 mb-5",children:[d<L&&!b&&t.jsx(V,{variant:"outline-light",onClick:W,className:"sh-load-more-btn",children:"Load More"}),b&&t.jsx(q,{animation:"border",variant:"danger",size:"sm"})]}),t.jsx(K,{show:P,handleClose:()=>w(!1),videoKey:Y})]})};export{te as default};

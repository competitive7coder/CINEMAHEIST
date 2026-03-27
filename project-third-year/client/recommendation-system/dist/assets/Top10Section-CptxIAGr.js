import{j as e}from"./chunk-ui-Z2Pwl_H2.js";import"./chunk-react-B2a0IqF-.js";import{S as n,N as p,a as l}from"./MovieRow-DVmYT0pf.js";import{M as m}from"./MovieCard-CRLkexGR.js";import"./chunk-vendors-3DY9Nbxc.js";import"./api-DKlbdnFA.js";import"./index-CwUIGroc.js";const d=({movie:r,rank:s,watchlist:i=[],onWatchTrailerClick:a,onWatchlistClick:t})=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
.top-10-wrapper{
display:flex;
align-items:center;
position:relative;
}

.rank-number{
font-size:8rem;
font-weight:900;
color:transparent;
-webkit-text-stroke:3px #ffffff;
text-shadow:
0 10px 40px rgba(0,0,0,.9),
0 0 25px rgba(255,255,255,.25);
transform:translateX(20px);
z-index:1;
pointer-events:none;
}

.top-10-wrapper .card{
margin-left:-40px;
}
`}),e.jsxs("div",{className:"top-10-wrapper",children:[e.jsx("div",{className:"rank-number",children:s}),e.jsx(m,{movie:r,watchlist:i,onWatchTrailerClick:a,onWatchlistClick:t})]})]}),u=({movies:r,watchlist:s,onWatchTrailerClick:i,onWatchlistClick:a})=>e.jsxs("div",{className:"movie-row-container",children:[e.jsx("h3",{className:"h4 mb-5 text-white",children:"Top 10 Movies in India Today"}),e.jsx(n,{modules:[p],spaceBetween:40,slidesPerView:"auto",navigation:!0,children:r.map((t,o)=>e.jsx(l,{style:{width:"auto"},children:e.jsx(d,{movie:t,rank:o+1,watchlist:s,onWatchTrailerClick:i,onWatchlistClick:a})},t.id))})]});export{u as default};

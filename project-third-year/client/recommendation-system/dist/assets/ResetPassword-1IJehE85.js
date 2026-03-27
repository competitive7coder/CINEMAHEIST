import{j as e,c as t,p as l}from"./chunk-ui-Z2Pwl_H2.js";import{e as C,u as $,r as s,L as N}from"./chunk-react-B2a0IqF-.js";import{y as i}from"./index-DipoDFDE.js";import{a as B}from"./api-DKlbdnFA.js";import"./chunk-vendors-3DY9Nbxc.js";const I=l`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`,L=l`
  from { opacity: 0; transform: translateX(-30px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
`,A=l`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`,E=l`
  0%, 100% { box-shadow: 0 40px 100px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.05); }
  50% { box-shadow: 0 40px 100px rgba(255,0,0,0.05); border-color: rgba(255,0,0,0.15); }
`,M=t.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #050505;
  font-family: "Poppins", sans-serif;
  overflow: hidden;
`,R=t.div`
  flex: 1.3;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 80px;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.9)),
      url("https://i.pinimg.com/736x/58/cf/5f/58cf5f7a5606689e3190f9debc5f1912.jpg") no-repeat center center/cover;
    animation: ${I} 25s ease-in-out infinite;
    z-index: 0;
  }

  @media (max-width: 992px) { display: none; }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent, #050505);
    z-index: 1;
  }
`,Y=t.div`
  position: relative;
  z-index: 2;
  animation: ${L} 1.2s cubic-bezier(0.16, 1, 0.3, 1);

  h1 { font-size: 5rem; font-weight: 900; color: #fff; margin: 0; letter-spacing: -4px; }
  span { color: #ff0000; text-shadow: 0 0 20px rgba(255,0,0,0.4); }
  p { color: rgba(255,255,255,0.6); font-size: 1.2rem; max-width: 480px; margin-top: 20px; line-height: 1.6; }
`,q=t.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0f0f0f 0%, #050505 100%);
  border-left: 1px solid rgba(255,255,255,0.05);
  position: relative;
`,F=t.div`
  width: 100%;
  max-width: 440px;
  padding: 60px 45px;
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 32px;
  animation:
    ${A} 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    ${E} 6s infinite ease-in-out;

  h2 { color: #fff; font-size: 2.4rem; font-weight: 800; margin-bottom: 8px; }
  .subtitle {
    color: #555;
    margin-bottom: 45px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`,b=t.div`
  margin-bottom: 25px;
  position: relative;

  label {
    display: block;
    color: #888;
    font-size: 0.7rem;
    margin-bottom: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    background: #000 !important;
    border: 1px solid #1a1a1a;
    padding: 18px 22px;
    padding-right: ${r=>r.$hasIcon?"60px":"22px"};
    border-radius: 16px;
    color: #fff !important;
    font-size: 1rem;
    transition: all 0.4s;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #fff;
      -webkit-box-shadow: 0 0 0px 1000px #000 inset;
      transition: background-color 5000s ease-in-out 0s;
    }

    &::placeholder { color: #333; }

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #080808 !important;
      box-shadow: 0 0 0 4px rgba(255,0,0,0.05);
      transform: translateY(-2px);
    }
  }
`,w=t.div`
  position: absolute;
  right: 20px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 10;
  opacity: 0.6;
  transition: 0.3s;

  &:hover { color: #ff0000; opacity: 1; transform: scale(1.1); }
  svg { width: 22px; height: 22px; }
`,G=t.button`
  width: 100%;
  padding: 20px;
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover { background: #fff; color: #000; transform: translateY(-4px); }
  &:disabled { background: #222; color: #555; cursor: not-allowed; }
`,W=t.div`
  margin-top: 40px;
  text-align: center;
  font-size: 0.9rem;
  color: #777;

  a {
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    margin-left: 5px;
    &:hover { color: #ff0000; }
  }
`,j=({open:r})=>r?e.jsxs("svg",{fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"}),e.jsx("line",{x1:"1",y1:"1",x2:"23",y2:"23"})]}):e.jsxs("svg",{fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),U=()=>{const{token:r}=C(),v=$(),[a,y]=s.useState(""),[p,k]=s.useState(""),[c,P]=s.useState(!1),[d,z]=s.useState(!1),[f,x]=s.useState(!1),S=async o=>{var u,h,m,g;if(o.preventDefault(),a.length<8){i.error("Password must be at least 8 characters.");return}if(a!==p){i.error("Passwords do not match.");return}x(!0);try{const n=await B.post(`/auth/reset-password/${r}`,{password:a});i.success(n.data.message||"Password reset successful!"),v("/login")}catch(n){i.error(((h=(u=n.response)==null?void 0:u.data)==null?void 0:h.detail)||((g=(m=n.response)==null?void 0:m.data)==null?void 0:g.msg)||"Failed to reset password.")}finally{x(!1)}};return e.jsxs(M,{children:[e.jsx(R,{children:e.jsxs(Y,{children:[e.jsxs("h1",{children:["Stream",e.jsx("span",{children:"Hub"})]}),e.jsx("p",{children:"Set a new password and get back to your personalized 4K library."})]})}),e.jsx(q,{children:e.jsxs(F,{children:[e.jsx("h2",{children:"New Password"}),e.jsx("p",{className:"subtitle",children:"Secure Reset Portal"}),e.jsxs("form",{onSubmit:S,children:[e.jsxs(b,{$hasIcon:!0,children:[e.jsx("label",{children:"New Password"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:c?"text":"password",placeholder:"Min. 8 characters",value:a,onChange:o=>y(o.target.value),required:!0}),e.jsx(w,{onClick:()=>P(!c),children:e.jsx(j,{open:c})})]})]}),e.jsxs(b,{$hasIcon:!0,children:[e.jsx("label",{children:"Confirm Password"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:d?"text":"password",placeholder:"••••••••",value:p,onChange:o=>k(o.target.value),required:!0}),e.jsx(w,{onClick:()=>z(!d),children:e.jsx(j,{open:d})})]})]}),e.jsx(G,{type:"submit",disabled:f,children:f?"Saving...":"Set New Password"})]}),e.jsxs(W,{children:["Remembered it?",e.jsx(N,{to:"/login",children:"Back to Login"})]})]})})]})};export{U as default};

import{j as e,c as t,p}from"./chunk-ui-Z2Pwl_H2.js";import{r as c,u as A,L as E}from"./chunk-react-B2a0IqF-.js";import{y as d}from"./index-DipoDFDE.js";import{a as v}from"./api-DKlbdnFA.js";import"./chunk-vendors-3DY9Nbxc.js";const B=p`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`,P=p`
  from { opacity: 0; transform: translateX(-30px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
`,$=p`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`,W=p`
  0%, 100% { box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4); border-color: rgba(255, 255, 255, 0.05); }
  50% { box-shadow: 0 40px 100px rgba(255, 0, 0, 0.05); border-color: rgba(255, 0, 0, 0.15); }
`,D=t.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #050505;
  font-family: "Poppins", sans-serif;
  overflow: hidden;
`,T=t.div`
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
      linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.9)),
      url("https://i.postimg.cc/dt7BF6gc/download-33.jpg") no-repeat center
        center/cover;
    animation: ${B} 25s ease-in-out infinite;
    z-index: 0;
  }

  @media (max-width: 992px) {
    display: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent, #050505);
    z-index: 1;
  }
`,V=t.div`
  position: relative;
  z-index: 2;
  animation: ${P} 1.2s cubic-bezier(0.16, 1, 0.3, 1);

  h1 {
    font-size: 5rem;
    font-weight: 900;
    color: #fff;
    margin: 0;
    letter-spacing: -4px;
  }
  span {
    color: #ff0000;
    text-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
  }
  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.2rem;
    max-width: 480px;
    margin-top: 20px;
    line-height: 1.6;
  }
`,X=t.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0f0f0f 0%, #050505 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
`,y=t.div`
  width: 100%;
  max-width: 440px;
  padding: 60px 45px;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  animation:
    ${$} 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    ${W} 6s infinite ease-in-out;

  h2 {
    color: #fff;
    font-size: 2.4rem;
    font-weight: 800;
    margin-bottom: 8px;
  }
  .subtitle {
    color: #555;
    margin-bottom: 45px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`,m=t.div`
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
    background: #000 !important; /* Force black */
    border: 1px solid #1a1a1a;
    padding: 18px 22px;
    padding-right: ${f=>f.$hasIcon?"60px":"22px"};
    border-radius: 16px;
    color: #fff !important; /* Force white text */
    font-size: 1rem;
    transition: all 0.4s;

    /* --- FIX WHITE AUTOFILL BOX --- */
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #fff;
      -webkit-box-shadow: 0 0 0px 1000px #000 inset; /* Covers the white with black */
      transition: background-color 5000s ease-in-out 0s;
    }

    &::placeholder {
      color: #333;
    }

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #080808 !important;
      box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.05);
      transform: translateY(-2px);
    }
  }
`,Y=t.div`
  position: absolute;
  right: 20px;
  color: #fff; /* Changed from #444 to #fff for visibility */
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 10; /* Ensure it stays above the autofill layer */
  opacity: 0.6;
  transition: 0.3s;

  &:hover {
    color: #ff0000;
    opacity: 1;
    transform: scale(1.1);
  }

  svg {
    width: 22px;
    height: 22px;
  }
`,k=t.button`
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

  &:hover {
    background: #fff;
    color: #000;
    transform: translateY(-4px);
  }
  &:disabled {
    background: #222;
    color: #555;
    cursor: not-allowed;
  }
`,S=t.div`
  margin-top: 40px;
  text-align: center;
  font-size: 0.9rem;

  .signup-text {
    color: #777;
    a {
      color: #fff;
      text-decoration: none;
      font-weight: 700;
      margin-left: 5px;
      &:hover {
        color: #ff0000;
      }
    }
  }

  .forgot-block {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.03);

    .forgot-trigger {
      color: #555;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: inline-flex;
      align-items: center;
      gap: 10px;

      span {
        width: 6px;
        height: 6px;
        background: #ff0000;
        border-radius: 50%;
        box-shadow: 0 0 8px #ff0000;
      }
      &:hover {
        color: #fff;
      }
    }
  }
`,O=({setIsLoggedIn:f})=>{const[u,z]=c.useState({email:"",password:""}),[x,L]=c.useState(!1),[N,g]=c.useState(!1),[s,n]=c.useState(!1),F=A(),{email:l,password:b}=u,h=o=>z({...u,[o.target.name]:o.target.value}),I=async o=>{var i,a;o.preventDefault(),n(!0);try{const r=await v.post("/auth/login",{email:l,password:b});r.data&&r.data.access_token&&(localStorage.setItem("token",r.data.access_token),f(!0),d.success("Identity verified. Welcome back!"),F("/dashboard"))}catch(r){d.error(((a=(i=r.response)==null?void 0:i.data)==null?void 0:a.detail)||"Login failed")}finally{n(!1)}},C=async o=>{var i,a,r,w;o.preventDefault(),n(!0);try{await v.post("/auth/forgot-password",{email:l}),d.success("Security link dispatched to your Gmail."),g(!1)}catch(j){d.error(((a=(i=j.response)==null?void 0:i.data)==null?void 0:a.detail)||((w=(r=j.response)==null?void 0:r.data)==null?void 0:w.msg)||"Email recovery failed.")}finally{n(!1)}};return e.jsxs(D,{children:[e.jsx(T,{children:e.jsxs(V,{children:[e.jsxs("h1",{children:["Stream",e.jsx("span",{children:"Hub"})]}),e.jsx("p",{children:"The next evolution of digital entertainment. Login to access your personalized 4K library."})]})}),e.jsx(X,{children:N?e.jsxs(y,{children:[e.jsx("h2",{children:"Recover Access"}),e.jsx("p",{className:"subtitle",children:"Enter your email to receive a reset link"}),e.jsxs("form",{onSubmit:C,children:[e.jsxs(m,{children:[e.jsx("label",{children:"Email Address"}),e.jsx("div",{className:"input-wrapper",children:e.jsx("input",{type:"email",name:"email",placeholder:"name@company.com",value:l||"",onChange:h,required:!0})})]}),e.jsx(k,{type:"submit",disabled:s,children:s?"Sending...":"Send Reset Link"})]}),e.jsx(S,{children:e.jsx("div",{className:"forgot-block",children:e.jsxs("span",{className:"forgot-trigger",onClick:()=>g(!1),children:[e.jsx("span",{})," Back to Login"]})})})]}):e.jsxs(y,{children:[e.jsx("h2",{children:"Welcome back"}),e.jsx("p",{className:"subtitle",children:"Secure Authentication Portal"}),e.jsxs("form",{onSubmit:I,children:[e.jsxs(m,{children:[e.jsx("label",{children:"Email Address"}),e.jsx("div",{className:"input-wrapper",children:e.jsx("input",{type:"email",name:"email",placeholder:"name@company.com",value:l||"",onChange:h,required:!0})})]}),e.jsxs(m,{$hasIcon:!0,children:[e.jsx("label",{children:"Password"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:x?"text":"password",name:"password",placeholder:"••••••••",value:b||"",onChange:h,required:!0}),e.jsx(Y,{onClick:()=>L(!x),children:x?e.jsxs("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"}),e.jsx("line",{x1:"1",y1:"1",x2:"23",y2:"23"})]}):e.jsxs("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})})]})]}),e.jsx(k,{type:"submit",disabled:s,children:s?"Verifying...":"Sign In"})]}),e.jsxs(S,{children:[e.jsxs("span",{className:"signup-text",children:["Need an account? ",e.jsx(E,{to:"/signup",children:"Sign up now"})]}),e.jsx("div",{className:"forgot-block",children:e.jsxs("span",{className:"forgot-trigger",onClick:()=>g(!0),children:[e.jsx("span",{})," Forgot Password?"]})})]})]})})]})};export{O as default};

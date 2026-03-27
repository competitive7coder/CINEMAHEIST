import{j as e,c as t,p}from"./chunk-ui-Z2Pwl_H2.js";import{r as a,u as A,L as P}from"./chunk-react-B2a0IqF-.js";import{a as E}from"./api-DKlbdnFA.js";import{y as d}from"./index-DipoDFDE.js";import"./chunk-vendors-3DY9Nbxc.js";const N=p`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`,R=p`
  from { opacity: 0; transform: translateX(30px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
`,B=p`
  from { opacity: 0; transform: translateY(40px); filter: blur(5px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
`,L=t.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: #050505;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
`,M=t.div`
  flex: 1.3;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 80px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.9)), 
                url('https://i.pinimg.com/1200x/f0/73/8c/f0738c341ce5a66f6aeb8bc871fab013.jpg') no-repeat center center/cover;
    animation: ${N} 25s ease-in-out infinite;
    z-index: 0;
  }
  
  @media (max-width: 992px) { display: none; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent, #050505);
    z-index: 1;
  }
`,T=t.div`
  position: relative;
  z-index: 2;
  animation: ${R} 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  
  h1 { 
    font-size: 5rem; 
    font-weight: 900; 
    color: #fff; 
    margin: 0; 
    letter-spacing: -4px;
  }
  span { color: #ff0000; text-shadow: 0 0 20px rgba(255, 0, 0, 0.4); }
  p { color: rgba(255,255,255,0.6); font-size: 1.2rem; max-width: 480px; margin-top: 20px; line-height: 1.6; }
`,q=t.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0f0f0f 0%, #050505 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
`,F=t.div`
  width: 100%;
  max-width: 440px;
  padding: 50px 45px;
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  animation: ${B} 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);

  h2 { color: #fff; font-size: 2.2rem; font-weight: 800; margin-bottom: 8px; }
  .subtitle { 
    color: #555; 
    margin-bottom: 35px; 
    font-size: 0.75rem; 
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`,n=t.div`
  margin-bottom: 20px;
  position: relative;

  label {
    display: block;
    color: #888;
    font-size: 0.65rem;
    margin-bottom: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-left: 4px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  input {
    width: 100%;
    background: #000 !important; /* Force black background */
    border: 1px solid #1a1a1a;
    padding: 14px 20px;
    padding-right: 50px;
    border-radius: 12px;
    color: #fff !important; /* Force white text */
    font-size: 0.95rem;
    transition: all 0.4s;

    &:-webkit-autofill,
    &:-webkit-autofill:hover, 
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #fff;
      -webkit-box-shadow: 0 0 0px 1000px #000 inset;
      transition: background-color 5000s ease-in-out 0s;
    }

    &::placeholder {
      color: #333;
      opacity: 1; /* Ensure placeholder doesn't affect background */
    }

    &:focus {
      outline: none;
      border-color: #ff0000;
      background: #080808 !important;
    }
  }
`,v=t.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffff; /* Clearly visible on dark bg */
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 10;
  opacity: 0.6;
  transition: 0.3s;

  &:hover {
    color: #ff0000;
    opacity: 1;
  }
`,D=t.button`
  width: 100%;
  padding: 18px;
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 10px;

  &:hover {
    background: #fff;
    color: #000;
    transform: translateY(-4px);
  }
  &:disabled { background: #222; color: #555; }
`,W=t.p`
  margin-top: 35px;
  text-align: center;
  color: #555;
  font-size: 0.9rem;
  
  a {
    color: #eee;
    text-decoration: none;
    font-weight: 700;
    margin-left: 5px;
    &:hover { color: #ff0000; }
  }
`,X=()=>{const[x,k]=a.useState({name:"",email:"",password:"",retypePassword:""}),[s,z]=a.useState(!1),[l,S]=a.useState(!1),[f,u]=a.useState(!1),C=A(),{name:h,email:m,password:c,retypePassword:g}=x,r=i=>k({...x,[i.target.name]:i.target.value}),I=async i=>{var b,w,y,j;if(i.preventDefault(),c!==g){d.error("Passwords do not match");return}u(!0);try{const o=await E.post("/auth/register",{name:h,email:m,password:c});d.success(o.data.msg||"Identity Created!"),setTimeout(()=>C("/login"),2e3)}catch(o){d.error(((w=(b=o.response)==null?void 0:b.data)==null?void 0:w.detail)||((j=(y=o.response)==null?void 0:y.data)==null?void 0:j.msg)||"Registration failed")}finally{u(!1)}};return e.jsxs(L,{children:[e.jsx(q,{children:e.jsxs(F,{children:[e.jsx("h2",{children:"Initialize Identity"}),e.jsx("p",{className:"subtitle",children:"Secure Registration Portal"}),e.jsxs("form",{onSubmit:I,children:[e.jsxs(n,{children:[e.jsx("label",{children:"Designation (Full Name)"}),e.jsx("input",{type:"text",name:"name",value:h||"",onChange:r,placeholder:"e.g., Alex Carter",required:!0})]}),e.jsxs(n,{children:[e.jsx("label",{children:"Neural Link (Email)"}),e.jsx("input",{type:"email",name:"email",value:m||"",onChange:r,placeholder:"name@company.com",required:!0})]}),e.jsxs(n,{children:[e.jsx("label",{children:"Access Key (Password)"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:s?"text":"password",name:"password",value:c||"",onChange:r,placeholder:"••••••••",required:!0}),e.jsx(v,{onClick:()=>z(!s),children:s?e.jsxs("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"}),e.jsx("line",{x1:"1",y1:"1",x2:"23",y2:"23"})]}):e.jsxs("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})})]})]}),e.jsxs(n,{children:[e.jsx("label",{children:"Verify Access Key"}),e.jsxs("div",{className:"input-wrapper",children:[e.jsx("input",{type:l?"text":"password",name:"retypePassword",value:g||"",onChange:r,placeholder:"••••••••",required:!0}),e.jsx(v,{onClick:()=>S(!l),children:l?e.jsxs("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"}),e.jsx("line",{x1:"1",y1:"1",x2:"23",y2:"23"})]}):e.jsxs("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2",viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})})]})]}),e.jsx(D,{type:"submit",disabled:f,children:f?"INITIALIZING...":"REGISTER OPERATIVE"})]}),e.jsxs(W,{children:["Already registered operative? ",e.jsx(P,{to:"/login",children:"Sign In"})]})]})}),e.jsx(M,{children:e.jsxs(T,{children:[e.jsxs("h1",{children:["Stream",e.jsx("span",{children:"Hub"})]}),e.jsx("p",{children:"Experience the peak of 4K streaming. Create your account to unlock premium features and cinematic quality."})]})})]})};export{X as default};

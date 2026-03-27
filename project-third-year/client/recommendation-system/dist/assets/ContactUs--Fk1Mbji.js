import{j as e}from"./chunk-ui-Z2Pwl_H2.js";import{r as t}from"./chunk-react-B2a0IqF-.js";import{a as S}from"./api-DKlbdnFA.js";import{y as v}from"./index-DipoDFDE.js";import{p as C,q as F}from"./index-CwUIGroc.js";import"./chunk-vendors-3DY9Nbxc.js";const D=()=>{const[c,m]=t.useState({name:"",email:"",message:""}),[p,f]=t.useState(!1),[y,l]=t.useState(!1),[w,j]=t.useState(""),[d,n]=t.useState(null),x=t.useRef(null);t.useEffect(()=>{const r=setInterval(()=>{j(new Date().toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0}))},1e3);return()=>clearInterval(r)},[]),t.useEffect(()=>{const r=x.current;if(!r)return;const i=r.getContext("2d");let s,o;const g=new ResizeObserver(a=>{clearTimeout(o),o=setTimeout(()=>{const b=a[0];r.width=b.contentRect.width,r.height=b.contentRect.height},100)});g.observe(r),r.width=window.innerWidth,r.height=window.innerHeight;const z=Array.from({length:40},()=>({x:Math.random()*r.width,y:Math.random()*r.height,r:Math.random()*1.5+.3,dx:(Math.random()-.5)*.3,dy:(Math.random()-.5)*.3,o:Math.random()*.4+.1})),h=()=>{i.clearRect(0,0,r.width,r.height),z.forEach(a=>{a.x+=a.dx,a.y+=a.dy,(a.x<0||a.x>r.width)&&(a.dx*=-1),(a.y<0||a.y>r.height)&&(a.dy*=-1),i.beginPath(),i.arc(a.x,a.y,a.r,0,Math.PI*2),i.fillStyle=`rgba(229,9,20,${a.o})`,i.fill()}),s=requestAnimationFrame(h)};return h(),()=>{cancelAnimationFrame(s),clearTimeout(o),g.disconnect()}},[]);const u=r=>{const{name:i,value:s}=r.target;m(o=>({...o,[i]:s}))},k=async r=>{r.preventDefault(),f(!0);try{const i=await S.post("/feedback/send",c);v.success(i.data.msg||"Message sent successfully!"),l(!0),m({name:"",email:"",message:""}),setTimeout(()=>l(!1),6e3)}catch{v.error("Something went wrong. Please try again.")}finally{f(!1)}},N=[{icon:"bi-envelope-at",label:"General Enquiries",value:"hello.streamhub@proton.me",href:"mailto:hello.streamhub@proton.me"},{icon:"bi-shield-check",label:"DMCA / Copyright",value:"dmca.streamhub@proton.me",href:"mailto:dmca.streamhub@proton.me"},{icon:"bi-bug",label:"Bug Reports",value:"bugs.streamhub@proton.me",href:"mailto:bugs.streamhub@proton.me"}];return e.jsxs("div",{style:{minHeight:"100vh",background:"#000",fontFamily:"'Poppins', sans-serif",color:"#fff",position:"relative",overflow:"hidden"},children:[e.jsx("style",{children:`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cu-page {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 60px 20px; position: relative; z-index: 1;
        }
        .cu-header { text-align: center; margin-bottom: 52px; }
        .cu-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(229,9,20,0.08); border: 1px solid rgba(229,9,20,0.18);
          border-radius: 30px; padding: 6px 18px;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #e50914; margin-bottom: 18px;
        }
        .cu-header h1 {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900; letter-spacing: -2px;
          color: #fff; line-height: 1.05; margin-bottom: 14px;
        }
        .cu-header h1 em {
          font-style: normal;
          background: linear-gradient(90deg, #e50914, #ff6b6b);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .cu-header p { font-size: 0.9rem; color: rgba(255,255,255,0.35); max-width: 400px; margin: 0 auto; line-height: 1.7; font-weight: 300; }

        .cu-grid {
          display: grid; grid-template-columns: 360px 1fr;
          gap: 20px; width: 100%; max-width: 1040px;
        }
        @media (max-width: 900px) { .cu-grid { grid-template-columns: 1fr; max-width: 560px; } }

        .cu-info {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 32px 28px;
          display: flex; flex-direction: column;
        }
        .cu-info-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.18); margin-bottom: 20px; }
        .cu-info-items { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .cu-info-item {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 14px; border-radius: 12px;
          text-decoration: none; color: inherit;
          transition: all 0.2s; border: 1px solid transparent;
        }
        a.cu-info-item:hover { background: rgba(229,9,20,0.06); border-color: rgba(229,9,20,0.15); transform: translateX(4px); }
        .cu-info-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          background: rgba(229,9,20,0.08); border: 1px solid rgba(229,9,20,0.15);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          color: #e50914; font-size: 0.95rem;
        }
        .cu-info-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 2px; }
        .cu-info-val { font-size: 0.78rem; font-weight: 500; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cu-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 18px 0; }
        .cu-clock { display: flex; align-items: center; gap: 10px; font-size: 0.7rem; color: rgba(255,255,255,0.18); }
        .cu-clock-dot { width: 6px; height: 6px; background: #e50914; border-radius: 50%; animation: cu-blink 1.2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes cu-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .cu-form-panel {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 34px 32px;
        }
        .cu-form-heading { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 5px; letter-spacing: -0.5px; }
        .cu-form-sub { font-size: 0.76rem; color: rgba(255,255,255,0.25); margin-bottom: 26px; font-weight: 300; }
        .cu-field { margin-bottom: 18px; }
        .cu-field-label {
          display: block; font-size: 0.62rem; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 7px; transition: color 0.2s;
        }
        .cu-field-label.active { color: #e50914; }
        .cu-field-required { color: #e50914; }
        .cu-input, .cu-textarea {
          width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 11px 15px; color: #fff;
          font-family: 'Poppins', sans-serif; font-size: 0.86rem; outline: none; transition: all 0.2s;
        }
        .cu-input:focus, .cu-textarea:focus {
          border-color: rgba(229,9,20,0.4); background: rgba(229,9,20,0.03);
          box-shadow: 0 0 0 3px rgba(229,9,20,0.06);
        }
        .cu-input::placeholder, .cu-textarea::placeholder { color: rgba(255,255,255,0.16); }
        .cu-textarea { resize: vertical; min-height: 128px; line-height: 1.65; }
        .cu-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 500px) { .cu-field-row { grid-template-columns: 1fr; } }

        .cu-btn {
          width: 100%; margin-top: 6px; padding: 13px 20px;
          background: #e50914; border: none; border-radius: 10px;
          color: #fff; font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          cursor: pointer; transition: all 0.22s;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          position: relative; overflow: hidden;
        }
        .cu-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          transform: translateX(-100%); transition: transform 0.5s;
        }
        .cu-btn:hover::before { transform: translateX(100%); }
        .cu-btn:hover:not(:disabled) { background: #ff1a1a; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(229,9,20,0.3); }
        .cu-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .cu-btn-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: cu-spin 0.75s linear infinite; }
        @keyframes cu-spin { to { transform: rotate(360deg); } }

        .cu-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; padding: 50px 20px; gap: 14px;
          animation: cu-fadeIn 0.4s ease;
        }
        @keyframes cu-fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .cu-success-icon { width: 62px; height: 62px; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.7rem; }
        .cu-success h3 { font-size: 1.05rem; font-weight: 800; color: #fff; }
        .cu-success p { font-size: 0.8rem; color: rgba(255,255,255,0.32); font-weight: 300; line-height: 1.65; max-width: 260px; }
        .cu-success-back { margin-top: 6px; padding: 8px 20px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.45); font-family: 'Poppins', sans-serif; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .cu-success-back:hover { border-color: rgba(255,255,255,0.22); color: #fff; }

        @media (max-width: 600px) { .cu-page { padding: 36px 14px; } .cu-form-panel, .cu-info { padding: 22px 18px; } }
      `}),e.jsx("canvas",{ref:x,style:{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}),e.jsx("div",{style:{position:"fixed",top:"-10%",right:"-5%",width:400,height:400,background:"radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 70%)",pointerEvents:"none",zIndex:0}}),e.jsx("div",{style:{position:"fixed",bottom:"-10%",left:"-5%",width:350,height:350,background:"radial-gradient(circle, rgba(229,9,20,0.04) 0%, transparent 70%)",pointerEvents:"none",zIndex:0}}),e.jsxs("div",{className:"cu-page",children:[e.jsxs("div",{className:"cu-header",children:[e.jsxs("div",{className:"cu-eyebrow",children:[e.jsx(C,{}),"Get in Touch"]}),e.jsxs("h1",{children:["Contact ",e.jsx("em",{children:"StreamHub"})]}),e.jsx("p",{children:"Questions, bug reports, or copyright concerns — we read every message personally."})]}),e.jsxs("div",{className:"cu-grid",children:[e.jsxs("div",{className:"cu-info",children:[e.jsx("div",{className:"cu-info-title",children:"Reach us directly"}),e.jsx("div",{className:"cu-info-items",children:N.map((r,i)=>{const s=r.href?"a":"div";return e.jsxs(s,{className:"cu-info-item",...r.href?{href:r.href}:{},children:[e.jsx("div",{className:"cu-info-icon",children:e.jsx("i",{className:`bi ${r.icon}`})}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx("div",{className:"cu-info-label",children:r.label}),e.jsx("div",{className:"cu-info-val",children:r.value})]})]},i)})}),e.jsx("div",{className:"cu-divider"}),e.jsxs("div",{className:"cu-clock",children:[e.jsx("div",{className:"cu-clock-dot"}),e.jsxs("span",{children:["IST ",w," — We're online"]})]})]}),e.jsx("div",{className:"cu-form-panel",children:y?e.jsxs("div",{className:"cu-success",children:[e.jsx("div",{className:"cu-success-icon",children:"✅"}),e.jsx("h3",{children:"Message Received!"}),e.jsx("p",{children:"Thanks for reaching out. We'll reply within 24–48 hours."}),e.jsx("button",{className:"cu-success-back",onClick:()=>l(!1),children:"Send another"})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"cu-form-heading",children:"Send us a message"}),e.jsx("div",{className:"cu-form-sub",children:"We typically respond within 24–48 hours."}),e.jsxs("form",{onSubmit:k,children:[e.jsxs("div",{className:"cu-field-row",children:[e.jsxs("div",{className:"cu-field",children:[e.jsxs("label",{className:`cu-field-label ${d==="name"?"active":""}`,children:["Name ",e.jsx("span",{className:"cu-field-required",children:"*"})]}),e.jsx("input",{className:"cu-input",type:"text",name:"name",placeholder:"Your name",value:c.name,onChange:u,onFocus:()=>n("name"),onBlur:()=>n(null),required:!0})]}),e.jsxs("div",{className:"cu-field",children:[e.jsxs("label",{className:`cu-field-label ${d==="email"?"active":""}`,children:["Email ",e.jsx("span",{className:"cu-field-required",children:"*"})]}),e.jsx("input",{className:"cu-input",type:"email",name:"email",placeholder:"you@example.com",value:c.email,onChange:u,onFocus:()=>n("email"),onBlur:()=>n(null),required:!0})]})]}),e.jsxs("div",{className:"cu-field",children:[e.jsxs("label",{className:`cu-field-label ${d==="message"?"active":""}`,children:["Message ",e.jsx("span",{className:"cu-field-required",children:"*"})]}),e.jsx("textarea",{className:"cu-textarea",name:"message",placeholder:"Describe your question or issue...",value:c.message,onChange:u,onFocus:()=>n("message"),onBlur:()=>n(null),required:!0})]}),e.jsx("button",{className:"cu-btn",type:"submit",disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"cu-btn-spinner"})," Sending..."]}):e.jsxs(e.Fragment,{children:[e.jsx(F,{}),"Send Message"]})})]})]})})]})]})]})};export{D as default};

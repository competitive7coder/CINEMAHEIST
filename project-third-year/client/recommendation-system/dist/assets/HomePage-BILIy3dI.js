const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/VideoModal-D9YnvmLQ.js","assets/chunk-ui-Z2Pwl_H2.js","assets/chunk-react-B2a0IqF-.js","assets/Top10Section-CptxIAGr.js","assets/MovieRow-DVmYT0pf.js","assets/MovieCard-CRLkexGR.js","assets/api-DKlbdnFA.js","assets/chunk-vendors-3DY9Nbxc.js","assets/index-CwUIGroc.js","assets/MovieRow-B0gYqcdL.css"])))=>i.map(i=>d[i]);
import{y as P,_ as V}from"./index-DipoDFDE.js";import{j as n}from"./chunk-ui-Z2Pwl_H2.js";import{u as Y,r as p}from"./chunk-react-B2a0IqF-.js";import{a as I}from"./api-DKlbdnFA.js";import{c as U,S as K,A as X,a as J,M as O}from"./MovieRow-DVmYT0pf.js";import{m as N,e as Q,s as R,a as Z,b as F,g as q,c as ee}from"./chunk-vendors-3DY9Nbxc.js";import{W as te}from"./MovieCard-CRLkexGR.js";import"./index-CwUIGroc.js";function _(e=""){return`.${e.trim().replace(/([\.:!+\/()[\]])/g,"\\$1").replace(/ /g,".")}`}function ae({swiper:e,extendParams:f,on:r,emit:k}){const m="swiper-pagination";f({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:t=>t,formatFractionTotal:t=>t,bulletClass:`${m}-bullet`,bulletActiveClass:`${m}-bullet-active`,modifierClass:`${m}-`,currentClass:`${m}-current`,totalClass:`${m}-total`,hiddenClass:`${m}-hidden`,progressbarFillClass:`${m}-progressbar-fill`,progressbarOppositeClass:`${m}-progressbar-opposite`,clickableClass:`${m}-clickable`,lockClass:`${m}-lock`,horizontalClass:`${m}-horizontal`,verticalClass:`${m}-vertical`,paginationDisabledClass:`${m}-disabled`}}),e.pagination={el:null,bullets:[]};let C,u=0;function y(){return!e.params.pagination.el||!e.pagination.el||Array.isArray(e.pagination.el)&&e.pagination.el.length===0}function g(t,a){const{bulletActiveClass:s}=e.params.pagination;t&&(t=t[`${a==="prev"?"previous":"next"}ElementSibling`],t&&(t.classList.add(`${s}-${a}`),t=t[`${a==="prev"?"previous":"next"}ElementSibling`],t&&t.classList.add(`${s}-${a}-${a}`)))}function z(t,a,s){if(t=t%s,a=a%s,a===t+1)return"next";if(a===t-1)return"previous"}function M(t){const a=t.target.closest(_(e.params.pagination.bulletClass));if(!a)return;t.preventDefault();const s=F(a)*e.params.slidesPerGroup;if(e.params.loop){if(e.realIndex===s)return;const d=z(e.realIndex,s,e.slides.length);d==="next"?e.slideNext():d==="previous"?e.slidePrev():e.slideToLoop(s)}else e.slideTo(s)}function S(){const t=e.rtl,a=e.params.pagination;if(y())return;let s=e.pagination.el;s=N(s);let d,v;const T=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,A=e.params.loop?Math.ceil(T/e.params.slidesPerGroup):e.snapGrid.length;if(e.params.loop?(v=e.previousRealIndex||0,d=e.params.slidesPerGroup>1?Math.floor(e.realIndex/e.params.slidesPerGroup):e.realIndex):typeof e.snapIndex<"u"?(d=e.snapIndex,v=e.previousSnapIndex):(v=e.previousIndex||0,d=e.activeIndex||0),a.type==="bullets"&&e.pagination.bullets&&e.pagination.bullets.length>0){const b=e.pagination.bullets;let i,c,x;if(a.dynamicBullets&&(C=Z(b[0],e.isHorizontal()?"width":"height"),s.forEach(l=>{l.style[e.isHorizontal()?"width":"height"]=`${C*(a.dynamicMainBullets+4)}px`}),a.dynamicMainBullets>1&&v!==void 0&&(u+=d-(v||0),u>a.dynamicMainBullets-1?u=a.dynamicMainBullets-1:u<0&&(u=0)),i=Math.max(d-u,0),c=i+(Math.min(b.length,a.dynamicMainBullets)-1),x=(c+i)/2),b.forEach(l=>{const h=[...["","-next","-next-next","-prev","-prev-prev","-main"].map(j=>`${a.bulletActiveClass}${j}`)].map(j=>typeof j=="string"&&j.includes(" ")?j.split(" "):j).flat();l.classList.remove(...h)}),s.length>1)b.forEach(l=>{const h=F(l);h===d?l.classList.add(...a.bulletActiveClass.split(" ")):e.isElement&&l.setAttribute("part","bullet"),a.dynamicBullets&&(h>=i&&h<=c&&l.classList.add(...`${a.bulletActiveClass}-main`.split(" ")),h===i&&g(l,"prev"),h===c&&g(l,"next"))});else{const l=b[d];if(l&&l.classList.add(...a.bulletActiveClass.split(" ")),e.isElement&&b.forEach((h,j)=>{h.setAttribute("part",j===d?"bullet-active":"bullet")}),a.dynamicBullets){const h=b[i],j=b[c];for(let E=i;E<=c;E+=1)b[E]&&b[E].classList.add(...`${a.bulletActiveClass}-main`.split(" "));g(h,"prev"),g(j,"next")}}if(a.dynamicBullets){const l=Math.min(b.length,a.dynamicMainBullets+4),h=(C*l-C)/2-x*C,j=t?"right":"left";b.forEach(E=>{E.style[e.isHorizontal()?j:"top"]=`${h}px`})}}s.forEach((b,i)=>{if(a.type==="fraction"&&(b.querySelectorAll(_(a.currentClass)).forEach(c=>{c.textContent=a.formatFractionCurrent(d+1)}),b.querySelectorAll(_(a.totalClass)).forEach(c=>{c.textContent=a.formatFractionTotal(A)})),a.type==="progressbar"){let c;a.progressbarOpposite?c=e.isHorizontal()?"vertical":"horizontal":c=e.isHorizontal()?"horizontal":"vertical";const x=(d+1)/A;let l=1,h=1;c==="horizontal"?l=x:h=x,b.querySelectorAll(_(a.progressbarFillClass)).forEach(j=>{j.style.transform=`translate3d(0,0,0) scaleX(${l}) scaleY(${h})`,j.style.transitionDuration=`${e.params.speed}ms`})}a.type==="custom"&&a.renderCustom?(R(b,a.renderCustom(e,d+1,A)),i===0&&k("paginationRender",b)):(i===0&&k("paginationRender",b),k("paginationUpdate",b)),e.params.watchOverflow&&e.enabled&&b.classList[e.isLocked?"add":"remove"](a.lockClass)})}function o(){const t=e.params.pagination;if(y())return;const a=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.grid&&e.params.grid.rows>1?e.slides.length/Math.ceil(e.params.grid.rows):e.slides.length;let s=e.pagination.el;s=N(s);let d="";if(t.type==="bullets"){let v=e.params.loop?Math.ceil(a/e.params.slidesPerGroup):e.snapGrid.length;e.params.freeMode&&e.params.freeMode.enabled&&v>a&&(v=a);for(let T=0;T<v;T+=1)t.renderBullet?d+=t.renderBullet.call(e,T,t.bulletClass):d+=`<${t.bulletElement} ${e.isElement?'part="bullet"':""} class="${t.bulletClass}"></${t.bulletElement}>`}t.type==="fraction"&&(t.renderFraction?d=t.renderFraction.call(e,t.currentClass,t.totalClass):d=`<span class="${t.currentClass}"></span> / <span class="${t.totalClass}"></span>`),t.type==="progressbar"&&(t.renderProgressbar?d=t.renderProgressbar.call(e,t.progressbarFillClass):d=`<span class="${t.progressbarFillClass}"></span>`),e.pagination.bullets=[],s.forEach(v=>{t.type!=="custom"&&R(v,d||""),t.type==="bullets"&&e.pagination.bullets.push(...v.querySelectorAll(_(t.bulletClass)))}),t.type!=="custom"&&k("paginationRender",s[0])}function $(){e.params.pagination=U(e,e.originalParams.pagination,e.params.pagination,{el:"swiper-pagination"});const t=e.params.pagination;if(!t.el)return;let a;typeof t.el=="string"&&e.isElement&&(a=e.el.querySelector(t.el)),!a&&typeof t.el=="string"&&(a=[...document.querySelectorAll(t.el)]),a||(a=t.el),!(!a||a.length===0)&&(e.params.uniqueNavElements&&typeof t.el=="string"&&Array.isArray(a)&&a.length>1&&(a=[...e.el.querySelectorAll(t.el)],a.length>1&&(a=a.find(s=>Q(s,".swiper")[0]===e.el))),Array.isArray(a)&&a.length===1&&(a=a[0]),Object.assign(e.pagination,{el:a}),a=N(a),a.forEach(s=>{t.type==="bullets"&&t.clickable&&s.classList.add(...(t.clickableClass||"").split(" ")),s.classList.add(t.modifierClass+t.type),s.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass),t.type==="bullets"&&t.dynamicBullets&&(s.classList.add(`${t.modifierClass}${t.type}-dynamic`),u=0,t.dynamicMainBullets<1&&(t.dynamicMainBullets=1)),t.type==="progressbar"&&t.progressbarOpposite&&s.classList.add(t.progressbarOppositeClass),t.clickable&&s.addEventListener("click",M),e.enabled||s.classList.add(t.lockClass)}))}function L(){const t=e.params.pagination;if(y())return;let a=e.pagination.el;a&&(a=N(a),a.forEach(s=>{s.classList.remove(t.hiddenClass),s.classList.remove(t.modifierClass+t.type),s.classList.remove(e.isHorizontal()?t.horizontalClass:t.verticalClass),t.clickable&&(s.classList.remove(...(t.clickableClass||"").split(" ")),s.removeEventListener("click",M))})),e.pagination.bullets&&e.pagination.bullets.forEach(s=>s.classList.remove(...t.bulletActiveClass.split(" ")))}r("changeDirection",()=>{if(!e.pagination||!e.pagination.el)return;const t=e.params.pagination;let{el:a}=e.pagination;a=N(a),a.forEach(s=>{s.classList.remove(t.horizontalClass,t.verticalClass),s.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass)})}),r("init",()=>{e.params.pagination.enabled===!1?B():($(),o(),S())}),r("activeIndexChange",()=>{typeof e.snapIndex>"u"&&S()}),r("snapIndexChange",()=>{S()}),r("snapGridLengthChange",()=>{o(),S()}),r("destroy",()=>{L()}),r("enable disable",()=>{let{el:t}=e.pagination;t&&(t=N(t),t.forEach(a=>a.classList[e.enabled?"remove":"add"](e.params.pagination.lockClass)))}),r("lock unlock",()=>{S()}),r("click",(t,a)=>{const s=a.target,d=N(e.pagination.el);if(e.params.pagination.el&&e.params.pagination.hideOnClick&&d&&d.length>0&&!s.classList.contains(e.params.pagination.bulletClass)){if(e.navigation&&(e.navigation.nextEl&&s===e.navigation.nextEl||e.navigation.prevEl&&s===e.navigation.prevEl))return;const v=d[0].classList.contains(e.params.pagination.hiddenClass);k(v===!0?"paginationShow":"paginationHide"),d.forEach(T=>T.classList.toggle(e.params.pagination.hiddenClass))}});const w=()=>{e.el.classList.remove(e.params.pagination.paginationDisabledClass);let{el:t}=e.pagination;t&&(t=N(t),t.forEach(a=>a.classList.remove(e.params.pagination.paginationDisabledClass))),$(),o(),S()},B=()=>{e.el.classList.add(e.params.pagination.paginationDisabledClass);let{el:t}=e.pagination;t&&(t=N(t),t.forEach(a=>a.classList.add(e.params.pagination.paginationDisabledClass))),L()};Object.assign(e.pagination,{enable:w,disable:B,render:o,update:S,init:$,destroy:L})}function ne(e){const{effect:f,swiper:r,on:k,setTranslate:m,setTransition:C,overwriteParams:u,perspective:y,recreateShadows:g,getEffectParams:z}=e;k("beforeInit",()=>{if(r.params.effect!==f)return;r.classNames.push(`${r.params.containerModifierClass}${f}`),y&&y()&&r.classNames.push(`${r.params.containerModifierClass}3d`);const S=u?u():{};Object.assign(r.params,S),Object.assign(r.originalParams,S)}),k("setTranslate _virtualUpdated",()=>{r.params.effect===f&&m()}),k("setTransition",(S,o)=>{r.params.effect===f&&C(o)}),k("transitionEnd",()=>{if(r.params.effect===f&&g){if(!z||!z().slideShadows)return;r.slides.forEach(S=>{S.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach(o=>o.remove())}),g()}});let M;k("virtualUpdate",()=>{r.params.effect===f&&(r.slides.length||(M=!0),requestAnimationFrame(()=>{M&&r.slides&&r.slides.length&&(m(),M=!1)}))})}function ie(e,f){const r=q(f);return r!==f&&(r.style.backfaceVisibility="hidden",r.style["-webkit-backface-visibility"]="hidden"),r}function se({swiper:e,duration:f,transformElements:r,allSlides:k}){const{activeIndex:m}=e;if(e.params.virtualTranslate&&f!==0){let C=!1,u;u=r,u.forEach(y=>{ee(y,()=>{if(C||!e||e.destroyed)return;C=!0,e.animating=!1;const g=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0});e.wrapperEl.dispatchEvent(g)})})}}function re({swiper:e,extendParams:f,on:r}){f({fadeEffect:{crossFade:!1}}),ne({effect:"fade",swiper:e,on:r,setTranslate:()=>{const{slides:C}=e,u=e.params.fadeEffect;for(let y=0;y<C.length;y+=1){const g=e.slides[y];let M=-g.swiperSlideOffset;e.params.virtualTranslate||(M-=e.translate);let S=0;e.isHorizontal()||(S=M,M=0);const o=e.params.fadeEffect.crossFade?Math.max(1-Math.abs(g.progress),0):1+Math.min(Math.max(g.progress,-1),0),$=ie(u,g);$.style.opacity=o,$.style.transform=`translate3d(${M}px, ${S}px, 0px)`}},setTransition:C=>{const u=e.slides.map(y=>q(y));u.forEach(y=>{y.style.transitionDuration=`${C}ms`}),se({swiper:e,duration:C,transformElements:u,allSlides:!0})},overwriteParams:()=>({slidesPerView:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!e.params.cssMode})})}const oe=({movies:e,watchlist:f=[],onWatchTrailerClick:r,onAddToWatchlist:k})=>{const m=Y(),[C,u]=p.useState(0),[y,g]=p.useState({show:!1,tmdbId:null,title:""}),z=e.slice(0,10);p.useEffect(()=>{if(document.getElementById("hero-gfonts"))return;const o=document.createElement("link");o.id="hero-gfonts",o.rel="stylesheet",o.href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap",document.head.appendChild(o)},[]);const M=p.useCallback(o=>{u(o.realIndex)},[]);return n.jsxs("div",{className:"hero-slider",children:[n.jsx("style",{children:`
    /* ── Base ── */
    .hero-slider {
      height: 100vh;
      min-height: 520px;
      width: 100%;
      position: relative;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
    }

    .hero-slider .swiper,
    .hero-slider .swiper-wrapper,
    .hero-slider .swiper-slide {
      height: 100% !important;
      width: 100% !important;
    }

    /* ── Slide inner — full bleed image ── */
    .hero-slide-inner {
      position: absolute;
      inset: 0;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    }

    /* ── LCP image fills the slide ── */
    .hero-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      z-index: 0;
    }

    /* Ken Burns desktop only — applied to the img */
    @media (min-width: 769px) {
      .hero-bg-img {
        animation: heroKenBurns 20s ease-in-out infinite alternate;
      }
    }

    @keyframes heroKenBurns {
      from { transform: scale(1.05) translateY(-2%); }
      to   { transform: scale(1.15) translateY(-4%); }
    }

    /* ── Overlays ── */
    .hero-overlay-main {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top,
          rgba(4,4,4,1)    0%,
          rgba(4,4,4,0.92) 20%,
          rgba(4,4,4,0.5)  45%,
          rgba(4,4,4,0.15) 70%,
          rgba(4,4,4,0.02) 100%
        ),
        linear-gradient(to bottom,
          rgba(4,4,4,0.65) 0%,
          rgba(4,4,4,0.0)  28%
        ),
        linear-gradient(to right,
          rgba(4,4,4,0.7)  0%,
          rgba(4,4,4,0.25) 40%,
          transparent      70%
        );
      z-index: 1;
    }

    .hero-overlay-accent {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 80% 60% at 10% 100%,
        rgba(200,0,0,0.07) 0%,
        transparent 60%
      );
      z-index: 2;
      pointer-events: none;
    }

    /* ── Content ── */
    .hero-content {
      position: relative;
      z-index: 10;
      padding: 0 5rem 5rem;
      max-width: 680px;
      width: 100%;
      align-self: flex-end;
      animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Meta ── */
    .hero-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .hero-badge-new    { background: #ff0000; color: #fff; }
    .hero-badge-rating { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #facc15; }
    .hero-badge-year   { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }

    /* ── Title ── */
    .hero-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2.8rem, 7vw, 6.5rem);
      font-weight: 400;
      letter-spacing: 2px;
      line-height: 0.95;
      color: #fff;
      text-shadow: 0 2px 40px rgba(0,0,0,0.8);
      margin: 0 0 10px;
    }

    .hero-title-accent {
      display: block;
      width: 50px;
      height: 3px;
      background: linear-gradient(to right, #ff0000, transparent);
      border-radius: 2px;
      margin: 10px 0 14px;
    }

    /* ── Overview ── */
    .hero-overview {
      font-size: clamp(0.85rem, 1.8vw, 1rem);
      line-height: 1.65;
      color: rgba(220,220,220,0.82);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 22px;
      font-weight: 300;
      max-width: 540px;
    }

    /* ════════════════════════════════
       DESKTOP BUTTONS
    ════════════════════════════════ */
    .hero-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .hero-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 28px;
      font-size: 0.9rem;
      font-weight: 700;
      font-family: 'DM Sans', sans-serif;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      letter-spacing: 0.4px;
      white-space: nowrap;
    }

    .hero-btn-watchnow {
      background: #e50914;
      color: #fff;
      box-shadow: 0 4px 24px rgba(229,9,20,0.45);
    }
    .hero-btn-watchnow:hover {
      background: #ff1a1a;
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 14px 40px rgba(229,9,20,0.55);
    }
    .hero-btn-watchnow .play-icon {
      width: 22px; height: 22px;
      background: rgba(255,255,255,0.22);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; padding-left: 2px; flex-shrink: 0;
    }

    /* Secondary actions — frosted pill */
    .hero-secondary-actions {
      display: inline-flex;
      align-items: center;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 50px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      overflow: hidden;
      padding: 5px 4px;
    }

    .hero-action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 8px 20px;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      color: rgba(255,255,255,0.72);
      font-family: 'DM Sans', sans-serif;
      border-radius: 40px;
    }
    .hero-action-btn:hover {
      color: #fff;
      background: rgba(255,255,255,0.1);
    }
    .hero-action-btn.hero-action-saved .hero-action-icon,
    .hero-action-btn.hero-action-saved .hero-action-label {
      color: #4ade80;
    }

    .hero-action-icon {
      font-size: 1rem;
      line-height: 1;
    }
    .hero-action-label {
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .hero-action-divider {
      width: 1px;
      height: 28px;
      background: rgba(255,255,255,0.1);
      flex-shrink: 0;
    }

    /* Desktop info link */
    .hero-btn-info {
      background: transparent;
      color: rgba(255,255,255,0.5);
      border: none;
      padding: 13px 6px;
      font-size: 0.82rem;
      font-family: 'DM Sans', sans-serif;
      text-decoration: underline;
      text-underline-offset: 3px;
      cursor: pointer;
      transition: color 0.2s;
      white-space: nowrap;
    }
    .hero-btn-info:hover { color: #fff; }

    /* ── Counter ── */
    .hero-counter {
      position: absolute;
      bottom: 40px; right: 50px;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      color: rgba(255,255,255,0.35);
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 1px;
    }
    .hero-counter strong {
      color: #fff;
      font-size: 1rem;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
    }

    /* ── Pagination ── */
    .hero-slider .swiper-pagination {
      bottom: 20px !important;
      left: 5rem !important;
      text-align: left !important;
      width: auto !important;
    }
    .hero-slider .swiper-pagination-bullet {
      width: 6px !important; height: 6px !important;
      background: rgba(255,255,255,0.3) !important;
      opacity: 1 !important;
      transition: all 0.3s ease !important;
      border-radius: 3px !important;
    }
    .hero-slider .swiper-pagination-bullet-active {
      background: #ff0000 !important;
      width: 22px !important;
      border-radius: 3px !important;
    }

    .hero-bottom-fade {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 100px;
      background: linear-gradient(to top, #040404, transparent);
      z-index: 5;
      pointer-events: none;
    }

    /* ════════════════════════════════
       TABLET
    ════════════════════════════════ */
    @media (max-width: 768px) {
      .hero-slider { height: 70vh; min-height: 440px; }
      .hero-content { padding: 0 1.5rem 2.5rem; max-width: 100%; }
      .hero-title { font-size: clamp(2.2rem, 8vw, 3.2rem); }
      .hero-overview { -webkit-line-clamp: 2; margin-bottom: 18px; }
      .hero-btn { padding: 11px 22px; font-size: 0.84rem; }
      .hero-counter { bottom: 30px; right: 18px; }
      .hero-slider .swiper-pagination { left: 1.5rem !important; }
    }

    /* ════════════════════════════════
       MOBILE
    ════════════════════════════════ */
    @media (max-width: 480px) {
      .hero-slider {
        height: 100svh;
        min-height: 620px;
      }

      /* Full viewport image */
      .hero-slide-inner {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: top center;
        align-items: flex-end;
      }

      /* Stronger bottom gradient so text pops */
      .hero-overlay-main {
        background:
          linear-gradient(to top,
            rgba(4,4,4,1)    0%,
            rgba(4,4,4,1)    25%,
            rgba(4,4,4,0.82) 48%,
            rgba(4,4,4,0.22) 70%,
            rgba(4,4,4,0.04) 100%
          ),
          linear-gradient(to bottom,
            rgba(4,4,4,0.5)  0%,
            transparent      20%
          );
      }

      .hero-content {
        padding: 0 1.2rem 2.5rem;
        width: 100%;
      }

      .hero-meta {
        gap: 6px;
        margin-bottom: 10px;
        flex-wrap: nowrap;
      }

      .hero-badge {
        font-size: 0.56rem;
        padding: 3px 8px;
        letter-spacing: 0.8px;
      }

      .hero-title {
        font-size: clamp(1.75rem, 9vw, 2.4rem);
        line-height: 1.05;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }

      .hero-title-accent {
        width: 34px; height: 2px;
        margin: 7px 0 14px;
      }

      .hero-overview { display: none; }

      /* ── Mobile buttons — vertical stack ── */
      .hero-buttons {
        flex-direction: column;
        align-items: stretch;
        gap: 9px;
        width: 100%;
      }

      /* Watch Now — full width pill */
      .hero-btn-watchnow {
        width: 100%;
        justify-content: center;
        padding: 16px;
        font-size: 0.95rem;
        border-radius: 50px;
        letter-spacing: 0.5px;
      }
      .hero-btn-watchnow .play-icon {
        display: flex;
        width: 22px; height: 22px;
        font-size: 9px;
      }

      /* Frosted pill — full width on mobile */
      .hero-secondary-actions {
        width: 100%;
        justify-content: space-around;
        border-radius: 50px;
        padding: 5px;
      }

      .hero-action-btn {
        flex: 1;
        padding: 10px 4px;
        gap: 5px;
      }

      .hero-action-icon { font-size: 1.1rem; }
      .hero-action-label { font-size: 0.58rem; letter-spacing: 0.5px; }
      .hero-action-divider { height: 22px; }

      /* Hide separate info button on mobile — it's in the pill */
      .hero-btn-info { display: none; }

      .hero-slider .swiper-pagination {
        left: 1.2rem !important;
        bottom: 12px !important;
      }
      .hero-counter { display: none; }
      .hero-bottom-fade { height: 50px; }
    }

    /* ════════════════════════════════
       VERY SMALL
    ════════════════════════════════ */
    @media (max-width: 360px) {
      .hero-slider { height: 100svh; min-height: 580px; }
      .hero-title { font-size: 1.7rem; }
      .hero-content { padding: 0 1rem 2rem; }
      .hero-action-btn { padding: 9px 2px; }
    }
  `}),n.jsx(K,{style:{height:"100%",width:"100%"},modules:[ae,X,re],spaceBetween:0,slidesPerView:1,pagination:{clickable:!0},loop:!0,effect:"fade",fadeEffect:{crossFade:!0},onSlideChange:M,autoplay:{delay:6e3,disableOnInteraction:!1},children:z.map((o,$)=>{const L=f.includes(o.id),w=o.vote_average?o.vote_average.toFixed(1):null,B=o.release_date?o.release_date.slice(0,4):null,t=window.innerWidth<=768,a=$===0?t?"w780":"w1280":"w500";return n.jsx(J,{style:{height:"100%",position:"relative"},children:n.jsxs("div",{className:"hero-slide-inner",children:[n.jsx("img",{className:"hero-bg-img",src:`https://image.tmdb.org/t/p/${a}${o.backdrop_path}`,alt:o.title,fetchpriority:$===0?"high":"low",loading:$===0?"eager":"lazy",decoding:$===0?"sync":"async"}),n.jsx("div",{className:"hero-overlay-main"}),n.jsx("div",{className:"hero-overlay-accent"}),n.jsxs("div",{className:"hero-content",children:[n.jsxs("div",{className:"hero-meta",children:[n.jsx("span",{className:"hero-badge hero-badge-new",children:"✦ Trending"}),w&&n.jsxs("span",{className:"hero-badge hero-badge-rating",children:["★ ",w]}),B&&n.jsx("span",{className:"hero-badge hero-badge-year",children:B})]}),n.jsx("h1",{className:"hero-title",children:o.title}),n.jsx("div",{className:"hero-title-accent"}),o.overview&&n.jsx("p",{className:"hero-overview",children:o.overview}),n.jsxs("div",{className:"hero-buttons",children:[n.jsxs("button",{className:"hero-btn hero-btn-watchnow",onClick:()=>g({show:!0,tmdbId:o.id,title:o.title}),children:[n.jsx("span",{className:"play-icon",children:"▶"}),"Watch Now"]}),n.jsxs("div",{className:"hero-secondary-actions",children:[n.jsxs("button",{className:"hero-action-btn",onClick:()=>r(o),children:[n.jsx("span",{className:"hero-action-icon",children:"🎬"}),n.jsx("span",{className:"hero-action-label",children:"Trailer"})]}),n.jsx("div",{className:"hero-action-divider"}),n.jsxs("button",{className:`hero-action-btn ${L?"hero-action-saved":""}`,onClick:()=>k(o),children:[n.jsx("span",{className:"hero-action-icon",children:L?"✓":"+"}),n.jsx("span",{className:"hero-action-label",children:L?"Saved":"My List"})]}),n.jsx("div",{className:"hero-action-divider"}),n.jsxs("button",{className:"hero-action-btn",onClick:()=>m(`/movie/${o.id}`),children:[n.jsx("span",{className:"hero-action-icon",children:"ℹ"}),n.jsx("span",{className:"hero-action-label",children:"Info"})]})]}),n.jsx("button",{className:"hero-btn-info",onClick:()=>m(`/movie/${o.id}`),children:"More Info ›"})]})]}),n.jsx("div",{className:"hero-bottom-fade"})]})},o.id)})}),n.jsxs("div",{className:"hero-counter",children:[n.jsx("strong",{children:String(C+1).padStart(2,"0")}),n.jsx("span",{children:"/"}),n.jsx("span",{children:String(z.length).padStart(2,"0")})]}),n.jsx(te,{show:y.show,handleClose:()=>g({show:!1,tmdbId:null,title:""}),tmdbId:y.tmdbId,movieTitle:y.title})]})},le=p.lazy(()=>V(()=>import("./VideoModal-D9YnvmLQ.js"),__vite__mapDeps([0,1,2]))),ce=p.lazy(()=>V(()=>import("./Top10Section-CptxIAGr.js"),__vite__mapDeps([3,1,2,4,5,6,7,8,9]))),H=[{id:28,name:"Action Packed"},{id:878,name:"Science Fiction"},{id:10749,name:"Romantic Movies"},{id:53,name:"Thriller Tales"},{id:12,name:"Adventure"},{id:16,name:"Animation"},{id:35,name:"Comedy Movies"},{id:80,name:"Crime"},{id:18,name:"Drama"},{id:27,name:"Horror Flicks"}],de="http://localhost:8000",W=(e,f)=>({width:e,height:f,borderRadius:6,background:"linear-gradient(90deg,#161616 25%,#242424 50%,#161616 75%)",backgroundSize:"400% 100%",animation:"shimmer 1.5s infinite"}),G=()=>n.jsxs("div",{style:{marginBottom:"2.5rem"},children:[n.jsx("div",{style:{display:"flex",alignItems:"center",marginBottom:14,gap:12},children:n.jsx("div",{style:W(180,20)})}),n.jsx("div",{style:{display:"flex",gap:12,overflow:"hidden"},children:Array.from({length:7}).map((e,f)=>n.jsx("div",{style:{...W(160,240),borderRadius:12,flexShrink:0,animationDelay:`${f*.08}s`}},f))})]}),he=()=>n.jsx("div",{style:{height:"100vh",minHeight:520,background:"linear-gradient(90deg,#0e0e0e 25%,#1a1a1a 50%,#0e0e0e 75%)",backgroundSize:"400% 100%",animation:"shimmer 1.5s infinite"}}),ve=()=>{const[e,f]=p.useState([]),[r,k]=p.useState(!1),[m,C]=p.useState([]),[u,y]=p.useState([]),[g,z]=p.useState([]),[M,S]=p.useState({}),[o,$]=p.useState(!1),[L,w]=p.useState(0),[B,t]=p.useState(!1),[a,s]=p.useState(null),d=p.useRef(null);p.useEffect(()=>{let i=!1;return I.get("/movies/trending").then(c=>{var x,l;i||(f(((l=(x=c.data)==null?void 0:x.results)==null?void 0:l.slice(0,8))||[]),k(!0))}).catch(c=>{i||(console.error("Trending fetch error:",c),k(!0))}),()=>{i=!0}},[]),p.useEffect(()=>{let i=!1;const c=localStorage.getItem("token");return Promise.all([I.get("/movies/top-rated-in"),I.get("/movies/now-playing"),c?I.get("/users/watchlist").catch(()=>({data:[]})):Promise.resolve({data:[]})]).then(([x,l,h])=>{i||(C(x.data.slice(0,10)),y(l.data),z(Array.isArray(h.data)?h.data:[]))}).catch(x=>{i||(console.error("Homepage secondary fetch error:",x),P.error("Failed to load some content."))}),()=>{i=!0}},[]),p.useEffect(()=>{if(!r)return;d.current&&(d.current.close(),d.current=null);const i=new EventSource(`${de}/api/v1/movies/homepage-sections/stream`);return d.current=i,i.onmessage=c=>{try{const x=JSON.parse(c.data);if(x.done){$(!0),i.close();return}S(l=>({...l,[x.name]:x.movies})),w(l=>l+1)}catch{}},i.onerror=()=>{$(!0),i.close()},()=>{i.close(),d.current=null}},[r]);const v=p.useCallback(async(i,c)=>{if(i)try{await I.post("/activity/log",{action_type:c,movie_id:i.id,movie_title:i.title||i.name,movie_poster_path:i.poster_path})}catch{}},[]),T=p.useCallback(async i=>{var l,h;const c=typeof i=="object"?i:null,x=c?c.id:i;if(x){c&&v(c,"trailer_watch");try{const j=await I.get(`/movies/${x}/videos`),E=((h=(l=j.data)==null?void 0:l.results)==null?void 0:h.find(D=>D.type==="Trailer"&&D.site==="YouTube"))||j.data;s((E==null?void 0:E.key)||null)}catch{s(null)}t(!0)}},[v]),A=p.useCallback(async i=>{if(!localStorage.getItem("token")){P.info("Sign in to save movies to your watchlist!",{toastId:"watchlist-auth"});return}const x=g.includes(i.id);z(l=>x?l.filter(h=>h!==i.id):[...l,i.id]);try{x?(await I.delete(`/users/watchlist/${i.id}`),v(i,"removed_from_watchlist"),P.info("Removed from watchlist")):(await I.post(`/users/watchlist/${i.id}`),v(i,"added_to_watchlist"),P.success("Added to watchlist"))}catch{z(l=>x?[...l,i.id]:l.filter(h=>h!==i.id)),P.error("Could not update watchlist.")}},[g,v]),b=o?100:Math.round(L/H.length*100);return n.jsxs("div",{style:{backgroundColor:"#000",minHeight:"100vh"},children:[n.jsx("style",{children:`
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .stream-progress {
          position: fixed; top: 0; left: 0; right: 0; height: 3px;
          background: rgba(255,255,255,0.05); z-index: 9999;
        }
        .stream-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #e50914, #ff6b35);
          transition: width 0.35s ease;
          border-radius: 0 2px 2px 0;
        }
      `}),!o&&n.jsx("div",{className:"stream-progress",children:n.jsx("div",{className:"stream-progress-bar",style:{width:`${b}%`}})}),r?e.length>0?n.jsx(oe,{movies:e,watchlist:g,onWatchTrailerClick:T,onAddToWatchlist:A}):null:n.jsx(he,{}),n.jsxs("div",{className:"container-fluid pt-5",children:[m.length>0&&n.jsx(p.Suspense,{fallback:n.jsx(G,{}),children:n.jsx(ce,{movies:m,watchlist:g,onWatchTrailerClick:T,onWatchlistClick:A})}),u.length>0&&n.jsx(O,{title:"New Releases",movies:u,genreId:"new-releases",watchlist:g,onWatchTrailerClick:T,onWatchlistClick:A}),H.map(i=>{const c=M[i.name];return c?c.length===0?null:n.jsx(O,{title:i.name,movies:c,genreId:i.id,watchlist:g,onWatchTrailerClick:T,onWatchlistClick:A},i.name):n.jsx(G,{},i.name)})]}),B&&n.jsx(p.Suspense,{fallback:null,children:n.jsx(le,{show:B,handleClose:()=>t(!1),videoKey:a})})]})};export{ve as default};

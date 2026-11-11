import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, TrendingUp, Sparkles, ArrowRight, ShieldCheck, Menu, X,
  Package, BarChart3, CheckCircle2, Smartphone, WifiOff, Receipt, Users,
  ChevronDown, ScanBarcode, ArrowUpRight
} from "lucide-react";

const features = [
  [ShoppingBag, "01", "Mauzo ya haraka", "Rekodi mauzo kwa urahisi, tumia njia mbalimbali za malipo na toa risiti bila kupoteza muda.", "POS", "mint"],
  [Package, "02", "Udhibiti wa stoo", "Fuatilia bidhaa zinazoingia na kutoka, tambua bidhaa zinazoisha na dhibiti bidhaa zako.", "Inventory", "blue"],
  [BarChart3, "03", "Takwimu za biashara", "Elewa mwenendo wa mauzo, gharama na faida kwa kutumia ripoti zinazoeleweka.", "Insights", "violet"],
  [Receipt, "04", "Madeni na kumbukumbu", "Weka kumbukumbu za madeni ya wateja na fuatilia malipo kwa uwazi zaidi.", "Customer records", "amber"],
  [Users, "05", "Usimamizi wa wafanyakazi", "Panga majukumu ya timu na fuatilia miamala kulingana na mtumiaji.", "Team", "pink"],
  [WifiOff, "06", "Imezingatia mazingira ya hapa", "Muundo unaolenga mahitaji ya wafanyabiashara wa Tanzania na matumizi ya vifaa tofauti.", "Tanzania-first", "mint"],
];

// Tiny crystal bubbles that float up slowly
const particles = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 61 + 7) % 100}%`,
  delay: `${(i % 9) * -1.7}s`,
  duration: `${12 + (i % 8) * 2}s`,
}));

// Soft white smoke clouds that rise from the bottom of the screen
const smokePuffs = Array.from({ length: 12 }, (_, i) => ({
  left: `${-6 + ((i * 29) % 112)}%`,
  size: `${380 + (i % 5) * 130}px`,
  delay: `${-(i * 3.4)}s`,
  duration: `${26 + (i % 4) * 7}s`,
  opacity: (0.24 + (i % 3) * 0.07).toFixed(2),
  drift: `${(i % 2 ? 1 : -1) * (70 + (i % 4) * 35)}px`,
}));

// Elements that get the moving "light on glass" highlight under the cursor
const GLASS_SELECTOR = [
  ".dp-nav", ".dp-button", ".dp-kicker", ".dp-dashboard", ".dp-metric-card", ".dp-chart-panel",
  ".dp-activity-panel", ".dp-float-chip", ".dp-feature-card", ".dp-how-card", ".dp-security-panel",
  ".dp-cta", ".dp-menu-button",
].join(",");

function SparkleField() {
  return <div className="dp-sparkle-field" aria-hidden="true">
    <svg width="0" height="0" style={{ position: "absolute" }} focusable="false">
      <filter id="dp-smoke-warp" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="140" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
    <i className="dp-orb dp-orb-one" /><i className="dp-orb dp-orb-two" /><i className="dp-orb dp-orb-three" /><i className="dp-grid-glow" />
    {particles.map((p, i) => <i key={i} className="dp-particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }} />)}
    <div className="dp-smoke">
      <i className="dp-fog" />
      {smokePuffs.map((p, i) => <i key={i} className="dp-puff" style={{ "--l": p.left, "--s": p.size, "--delay": p.delay, "--d": p.duration, "--o": p.opacity, "--x": p.drift }} />)}
    </div>
    <i className="dp-vignette" />
  </div>;
}

function Button({ children, onClick, secondary = false }) {
  return <button type="button" onClick={onClick} className={`dp-button ${secondary ? "dp-button-secondary" : "dp-button-primary"}`}>
    <span>{children}</span>{!secondary && <ArrowRight size={16} />}
  </button>;
}

function DashboardPreview() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: (.5 - (e.clientY - r.top) / r.height) * 5, y: ((e.clientX - r.left) / r.width - .5) * 7 });
  };
  return <div className="dp-preview-wrap reveal" id="preview">
    <div className="dp-preview-aura" />
    <div ref={ref} className="dp-dashboard" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
      <div className="dp-dashboard-top">
        <div className="flex items-center gap-2"><i className="dp-window-dot bg-white/25" /><i className="dp-window-dot bg-white/45" /><i className="dp-window-dot bg-white/70" /><span className="ml-3 text-xs text-white/40">Duka Poa / Muhtasari</span></div>
        <span className="dp-preview-label"><i className="dp-live-dot" /> Muonekano wa mfano</span>
      </div>
      <div className="dp-dashboard-heading">
        <div><p className="dp-eyebrow">MUHTASARI WA BIASHARA</p><h3>Habari, Mmiliki wa Duka <span>✦</span></h3><p className="text-sm text-white/45 mt-1">Taarifa za biashara yako, sehemu moja.</p></div>
        <span className="dp-date-pill">Muonekano wa dashboard</span>
      </div>
      <div className="dp-metric-grid">
        <div className="dp-metric-card"><div className="dp-metric-head"><span>Mauzo ya leo</span><ShoppingBag size={16} /></div><strong>TZS 485,000</strong><small><b className="dp-positive">↗ 12.8%</b> mfano wa takwimu</small><div className="dp-mini-bars">{[24,38,30,52,42,66,48,78,58,88,68,96].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></div>
        <div className="dp-metric-card"><div className="dp-metric-head"><span>Bidhaa stoo</span><Package size={16} /></div><strong>1,248</strong><small><b className="dp-blue">Bidhaa</b> zilizoorodheshwa</small><div className="dp-stock-line"><i /></div><small>Mfano wa mwonekano wa stoo</small></div>
        <div className="dp-metric-card"><div className="dp-metric-head"><span>Faida ya jumla</span><TrendingUp size={16} /></div><strong>TZS 126,500</strong><small><b className="dp-positive">Muhtasari</b> wa mfano</small><div className="dp-sparkline"><svg viewBox="0 0 220 52"><path d="M2 43 C25 38 28 45 47 31 S76 35 91 23 S119 30 137 16 S165 25 181 10 S204 14 218 3" /></svg></div></div>
      </div>
      <div className="dp-dashboard-bottom">
        <div className="dp-chart-panel"><div className="flex justify-between items-center gap-3"><div><p className="text-sm font-semibold">Mwenendo wa mauzo</p><p className="text-xs text-white/35 mt-1">Mfano wa chati ya biashara</p></div><span className="dp-chart-period">Wiki hii <ChevronDown size={13} /></span></div>
          <div className="dp-chart"><div className="dp-chart-y"><span>500k</span><span>350k</span><span>200k</span><span>50k</span></div><div className="dp-chart-plot">{[38,58,44,72,54,83,64,94,68,78,57,88].map((h,i)=><div className="dp-chart-bar-wrap" key={i}><i style={{height:`${h}%`,animationDelay:`${i*65}ms`}} /></div>)}</div></div>
          <div className="dp-chart-x"><span>Jumatatu</span><span>Jumatano</span><span>Ijumaa</span><span>Jumapili</span></div>
        </div>
        <div className="dp-activity-panel"><p className="text-sm font-semibold mb-4">Shughuli za hivi karibuni</p>
          {[["Mauzo yamekamilika","Risiti #00124","TZS 45,000","mint"],["Bidhaa imeongezwa","Sukari 1kg","Stoo","blue"],["Malipo yamepokelewa","Rekodi ya mteja","TZS 20,000","amber"]].map(([t,s,v,c])=><div className="dp-activity-row" key={t}><span className={`dp-activity-icon ${c}`}><CheckCircle2 size={14}/></span><div className="min-w-0 flex-1"><p>{t}</p><small>{s}</small></div><b>{v}</b></div>)}
        </div>
      </div><div className="dp-dashboard-reflection" />
    </div>
    <div className="dp-float-chip dp-chip-left"><span className="dp-chip-icon"><ScanBarcode size={17}/></span><span><b>Bidhaa zako</b><small>Rahisi kufuatilia</small></span></div>
    <div className="dp-float-chip dp-chip-right"><span className="dp-chip-icon"><Sparkles size={17}/></span><span><b>Maamuzi bora</b><small>Kwa kutumia takwimu</small></span></div>
  </div>;
}

function FeatureCard({ item, index }) {
  const [Icon, number, title, description, tag, tone] = item;
  return <article className={`dp-feature-card dp-tone-${tone} reveal`} style={{ transitionDelay: `${index * 75}ms` }}>
    <div className="dp-feature-top"><div className="dp-feature-icon"><Icon size={22}/></div><span className="dp-feature-number">{number}</span></div>
    <span className="dp-feature-tag">{tag}</span><h3>{title}</h3><p>{description}</p>
    <div className="dp-feature-arrow"><ArrowUpRight size={17}/></div><div className="dp-feature-shine"/>
  </article>;
}

export default function HomeLanding() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navItems = useMemo(() => [["Vipengele","#features"],["Jinsi inavyosaidia","#how-it-works"],["Usalama","#security"]], []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

    // Light follows the cursor across glass surfaces
    let frame = 0;
    const onPointer = (e) => {
      const el = e.target.closest?.(GLASS_SELECTOR);
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return <div className="dp-home min-h-screen overflow-hidden bg-[#050506] text-white">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
      .dp-home{font-family:'DM Sans',sans-serif;isolation:isolate;--ice:#f1f4f7;--silver:#c9d0d7;--mist:#9aa3ac;--dim:#6f7882;background-image:radial-gradient(1100px 640px at 50% -8%,#1c1e22 0%,#0a0b0d 52%,#040405 100%)}
      .dp-home *{box-sizing:border-box}.dp-home a{color:inherit;text-decoration:none}.dp-home button{font:inherit;cursor:pointer}

      /* ---------- BACKGROUND: black depth, crystal bubbles, rising smoke ---------- */
      .dp-sparkle-field{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:-1}
      .dp-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;box-shadow:0 0 7px 1px #ffffff99;opacity:0;animation:dp-drift 16s linear infinite}
      @keyframes dp-drift{0%{transform:translate3d(0,40px,0) scale(.5);opacity:0}12%{opacity:.7}75%{opacity:.35}100%{transform:translate3d(28px,-210px,0) scale(1.2);opacity:0}}
      .dp-orb{position:absolute;border-radius:50%;background:#fff;filter:blur(110px);opacity:.07;animation:dp-orb-float 18s ease-in-out infinite alternate}.dp-orb-one{width:430px;height:430px;top:-180px;left:18%}.dp-orb-two{width:390px;height:390px;top:30%;right:-220px;background:#c6ced6;animation-delay:-5s}.dp-orb-three{width:440px;height:440px;top:67%;left:-250px;animation-delay:-9s}@keyframes dp-orb-float{to{transform:translate3d(65px,75px,0) scale(1.18)}}
      .dp-grid-glow{position:absolute;inset:0;background-image:linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(to bottom,black,transparent 72%);-webkit-mask-image:linear-gradient(to bottom,black,transparent 72%);opacity:.35}
      .dp-smoke{position:absolute;inset:0;overflow:hidden}
      @media(min-width:681px){.dp-smoke{filter:url(#dp-smoke-warp)}}
      .dp-fog{position:absolute;left:-10%;right:-10%;bottom:-9vh;height:48vh;background:radial-gradient(60% 100% at 18% 100%,#ffffff42,transparent 70%),radial-gradient(55% 90% at 58% 100%,#e6ecf238,transparent 70%),radial-gradient(50% 80% at 96% 100%,#ffffff33,transparent 70%);filter:blur(28px);animation:dp-fog 15s ease-in-out infinite alternate}
      @keyframes dp-fog{from{transform:translateX(-3%) scaleY(.94)}to{transform:translateX(3%) scaleY(1.14)}}
      .dp-puff{position:absolute;bottom:-28vh;left:var(--l);width:var(--s);height:var(--s);margin-left:calc(var(--s) / -2);border-radius:50%;background:radial-gradient(circle at 50% 50%,#ffffff8c,#d6dde53d 38%,transparent 70%);filter:blur(38px);opacity:0;animation:dp-rise var(--d) linear infinite;animation-delay:var(--delay);will-change:transform,opacity}
      @keyframes dp-rise{0%{transform:translate3d(0,0,0) scale(.65);opacity:0}14%{opacity:var(--o)}55%{transform:translate3d(calc(var(--x) * .6),-62vh,0) scale(1.2);opacity:calc(var(--o) * .8)}100%{transform:translate3d(var(--x),-130vh,0) scale(1.9);opacity:0}}
      .dp-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 45%,#000000a8 100%)}

      /* ---------- LIQUID GLASS: clear water in crystal, no colour ---------- */
      .dp-nav,.dp-dashboard,.dp-float-chip,.dp-feature-card,.dp-how-card,.dp-security-panel,.dp-cta,.dp-menu-button,.dp-button-secondary,.dp-kicker,.dp-mobile-menu{background:linear-gradient(145deg,#ffffff21,#ffffff09 46%,#ffffff13);border:1px solid #ffffff2b;box-shadow:0 18px 50px #00000080,inset 0 1px 0 #ffffff80,inset 0 -1px 0 #ffffff12,inset 0 0 26px #ffffff09;-webkit-backdrop-filter:blur(22px) saturate(170%);backdrop-filter:blur(22px) saturate(170%)}
      .dp-metric-card,.dp-chart-panel,.dp-activity-panel,.dp-date-pill,.dp-chart-period{background:linear-gradient(145deg,#ffffff12,#ffffff05);border:1px solid #ffffff1f;box-shadow:inset 0 1px 0 #ffffff40,inset 0 -1px 0 #ffffff0a}
      .dp-nav,.dp-dashboard,.dp-float-chip,.dp-feature-card,.dp-how-card,.dp-security-panel,.dp-cta,.dp-metric-card,.dp-chart-panel,.dp-activity-panel,.dp-button,.dp-menu-button{isolation:isolate}
      .dp-nav,.dp-how-card,.dp-security-panel,.dp-chart-panel,.dp-activity-panel{position:relative}
      /* the light that follows the cursor, sitting under the text */
      .dp-nav:after,.dp-dashboard:after,.dp-float-chip:after,.dp-feature-card:after,.dp-how-card:after,.dp-security-panel:after,.dp-cta:after,.dp-metric-card:after,.dp-chart-panel:after,.dp-activity-panel:after,.dp-button:after,.dp-menu-button:after{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(260px circle at var(--mx,50%) var(--my,-30%),#ffffff2e,transparent 62%);opacity:0;transition:opacity .35s;pointer-events:none;z-index:-1}
      .dp-nav:hover:after,.dp-dashboard:hover:after,.dp-float-chip:hover:after,.dp-feature-card:hover:after,.dp-how-card:hover:after,.dp-security-panel:hover:after,.dp-cta:hover:after,.dp-metric-card:hover:after,.dp-chart-panel:hover:after,.dp-activity-panel:hover:after,.dp-button:hover:after,.dp-menu-button:hover:after{opacity:1}

      .dp-nav-shell{position:sticky;top:0;z-index:50;padding:15px 22px 0;pointer-events:none}.dp-nav{pointer-events:auto;max-width:1160px;margin:auto;min-height:68px;padding:9px 12px 9px 18px;display:flex;align-items:center;justify-content:space-between;border-radius:22px;transition:.35s}.dp-nav.is-scrolled{background:linear-gradient(145deg,#ffffff1c,#0a0b0dc7);border-color:#ffffff38;box-shadow:0 15px 45px #000000a8,inset 0 1px 0 #ffffff70}
      .dp-brand{display:flex;align-items:center;gap:11px;cursor:pointer}.dp-brand-mark{height:40px;width:40px;border-radius:14px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#ffffff40,#ffffff0d);border:1px solid #ffffff4d;box-shadow:0 5px 24px #ffffff1c,inset 0 1px #ffffffa6;transition:transform .35s}.dp-brand:hover .dp-brand-mark{transform:rotate(-8deg) scale(1.07)}.dp-brand-name{font:800 16px Manrope,sans-serif;letter-spacing:-.6px}.dp-brand-sub{display:block;color:var(--dim);font-size:9px;letter-spacing:1.7px;text-transform:uppercase;margin-top:2px}
      .dp-nav-links{display:flex;align-items:center;gap:30px;color:var(--mist);font-size:12px;font-weight:600}.dp-nav-links a{position:relative;padding:9px 0;transition:color .25s}.dp-nav-links a:after{content:'';position:absolute;bottom:2px;left:0;width:0;height:1px;background:#fff;transition:width .3s}.dp-nav-links a:hover{color:#fff}.dp-nav-links a:hover:after{width:100%}.dp-nav-actions{display:flex;align-items:center;gap:7px}
      .dp-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:47px;padding:0 21px;border-radius:14px;font-size:12px;font-weight:800;overflow:hidden;transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s,border-color .3s,background .3s}.dp-button:hover{transform:translateY(-3px)}.dp-button:active{transform:scale(.98)}
      .dp-button-primary{color:#0a0b0d;border:1px solid #ffffffb3;background:linear-gradient(180deg,#ffffff 0%,#e3e8ed 52%,#bfc7cf 100%);box-shadow:0 10px 30px #ffffff24,inset 0 1px #fff,inset 0 -9px 14px #7a86924d}.dp-button-primary:before{content:'';position:absolute;top:-80%;left:-35%;height:260%;width:24%;transform:rotate(24deg);background:#ffffffa6;filter:blur(8px);transition:left .65s}.dp-button-primary:hover{box-shadow:0 14px 40px #ffffff3d,inset 0 1px #fff,inset 0 -9px 14px #7a86924d}.dp-button-primary:hover:before{left:125%}
      .dp-button-secondary{color:var(--ice)}.dp-button-secondary:hover{border-color:#ffffff66;box-shadow:0 10px 28px #00000066,inset 0 1px 0 #ffffff99}.dp-menu-button{display:none;width:43px;height:43px;border-radius:13px;color:#fff;place-items:center}

      .dp-main{max-width:1160px;margin:auto;padding:0 24px;position:relative}.dp-hero{min-height:650px;padding:104px 0 85px;display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:38px}.dp-hero-copy{position:relative;z-index:2}
      .dp-kicker{display:inline-flex;align-items:center;gap:9px;padding:9px 13px;border-radius:999px;color:var(--silver);font-size:10px;font-weight:800;letter-spacing:1.05px;text-transform:uppercase}.dp-kicker-dot{width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 13px #fff;animation:dp-pulse 2s infinite}@keyframes dp-pulse{50%{box-shadow:0 0 3px #fff;opacity:.55}}
      .dp-hero h1{font:800 clamp(43px,5.3vw,70px)/1.08 Manrope,sans-serif;letter-spacing:-3.5px;margin:25px 0 20px;max-width:670px;text-shadow:0 2px 40px #ffffff1f}
      .dp-gradient-text{background:linear-gradient(100deg,#ffffff 0%,#aeb7c0 28%,#ffffff 52%,#8c96a0 78%,#ffffff 100%);background-size:220% auto;background-clip:text;-webkit-background-clip:text;color:transparent;animation:dp-shimmer 8s linear infinite}@keyframes dp-shimmer{to{background-position:220% center}}
      .dp-hero-description{max-width:550px;color:var(--mist);font-size:15px;line-height:1.9}.dp-hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.dp-trust-row{display:flex;flex-wrap:wrap;gap:17px;margin-top:27px;color:var(--mist);font-size:10px;font-weight:600}.dp-trust-row span{display:flex;align-items:center;gap:7px}.dp-trust-row svg{color:#e6ebf0}.dp-hero-note{display:flex;align-items:center;gap:9px;margin-top:30px;color:var(--dim);font-size:10px}.dp-hero-note span{width:27px;height:1px;background:#ffffff80}

      .dp-preview-wrap{position:relative;perspective:1400px;min-width:0;padding:28px 0}.dp-preview-aura{position:absolute;inset:9% -8%;border-radius:50%;background:radial-gradient(ellipse,#ffffff1f,transparent 68%);filter:blur(25px);animation:dp-aura 6s ease-in-out infinite alternate}@keyframes dp-aura{to{transform:scale(1.1);opacity:.6}}
      .dp-dashboard{position:relative;z-index:2;padding:21px;border-radius:25px;box-shadow:0 45px 100px #000000b3,0 0 0 7px #ffffff05,inset 0 1px 0 #ffffff99,inset 0 -1px 0 #ffffff14,inset 0 0 40px #ffffff0a;transform-style:preserve-3d;transition:transform .22s ease-out,border-color .4s;overflow:hidden}.dp-dashboard:hover{border-color:#ffffff4d}.dp-dashboard:before{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(125deg,#ffffff2e 0%,transparent 26%,transparent 70%,#ffffff12)}
      .dp-dashboard-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid #ffffff14}.dp-window-dot{width:7px;height:7px;border-radius:50%}.dp-preview-label{display:flex;align-items:center;gap:7px;color:var(--mist);font-size:9px}.dp-live-dot{width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 10px #fff}.dp-dashboard-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:22px 0 17px}.dp-eyebrow{color:var(--silver);font-size:8px;font-weight:800;letter-spacing:1.7px}.dp-dashboard-heading h3{font:700 17px Manrope,sans-serif;margin-top:6px;letter-spacing:-.5px}.dp-dashboard-heading h3 span{color:#fff}.dp-date-pill,.dp-chart-period{display:flex;align-items:center;gap:5px;border-radius:8px;padding:7px 9px;color:var(--mist);font-size:8px}
      .dp-metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.dp-metric-card{position:relative;min-width:0;min-height:144px;padding:13px;border-radius:13px;overflow:hidden}.dp-metric-head{display:flex;justify-content:space-between;align-items:center;color:var(--mist);font-size:9px}.dp-metric-head svg{color:#e9eef2}.dp-metric-card strong{display:block;margin-top:13px;font:800 clamp(15px,1.8vw,21px) Manrope,sans-serif;letter-spacing:-.7px;white-space:nowrap}.dp-metric-card small{display:block;margin-top:5px;color:var(--dim);font-size:8px}.dp-positive{color:#fff}.dp-blue{color:var(--silver)}.dp-mini-bars{height:24px;display:flex;align-items:flex-end;gap:3px;margin-top:10px}.dp-mini-bars i{flex:1;border-radius:3px 3px 1px 1px;background:linear-gradient(to top,#ffffff1f,#ffffffc7);opacity:.85}.dp-stock-line{height:5px;border-radius:9px;background:#ffffff1a;margin-top:15px;overflow:hidden}.dp-stock-line i{display:block;width:72%;height:100%;border-radius:9px;background:linear-gradient(90deg,#ffffff59,#fff)}.dp-sparkline{height:31px;margin-top:7px}.dp-sparkline svg{width:100%;height:100%;overflow:visible}.dp-sparkline path{fill:none;stroke:#f1f4f7;stroke-width:2.3;stroke-linecap:round;filter:drop-shadow(0 0 5px #ffffffa6)}
      .dp-dashboard-bottom{display:grid;grid-template-columns:1.25fr .75fr;gap:10px;margin-top:10px}.dp-chart-panel,.dp-activity-panel{padding:14px;border-radius:13px;min-width:0}.dp-chart-period{padding:5px 7px}.dp-chart{height:105px;display:flex;gap:9px;margin-top:17px}.dp-chart-y{display:flex;flex-direction:column;justify-content:space-between;color:var(--dim);font-size:7px;padding-bottom:1px}.dp-chart-plot{position:relative;flex:1;display:flex;align-items:flex-end;justify-content:space-around;gap:5px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 25px,#ffffff0f 26px)}.dp-chart-bar-wrap{height:100%;width:6%;display:flex;align-items:flex-end}.dp-chart-bar-wrap i{display:block;width:100%;border-radius:4px 4px 1px 1px;background:linear-gradient(to top,#ffffff1f,#ffffffd9);box-shadow:0 0 12px #ffffff2e;transform-origin:bottom;animation:dp-bar-in .8s cubic-bezier(.2,.8,.2,1) both}@keyframes dp-bar-in{from{transform:scaleY(.08);opacity:.2}to{transform:scaleY(1);opacity:1}}.dp-chart-x{display:flex;justify-content:space-between;color:var(--dim);font-size:7px;margin:7px 0 0 29px}
      .dp-activity-row{display:flex;align-items:center;gap:7px;padding:9px 0;border-top:1px solid #ffffff12}.dp-activity-icon{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;flex:none;background:linear-gradient(145deg,#ffffff2e,#ffffff0d);border:1px solid #ffffff26;color:#eef2f5}.dp-activity-row p{font-size:8px;color:#e4e9ee;white-space:nowrap}.dp-activity-row small{display:block;font-size:7px;color:var(--dim);margin-top:3px}.dp-activity-row b{font-size:8px;color:var(--silver);white-space:nowrap}.dp-dashboard-reflection{position:absolute;top:-80%;left:-50%;width:35%;height:260%;transform:rotate(28deg);background:linear-gradient(90deg,transparent,#ffffff14,transparent);animation:dp-reflect 9s ease-in-out infinite;pointer-events:none}@keyframes dp-reflect{0%,30%{left:-60%}70%,100%{left:140%}}
      .dp-float-chip{position:absolute;z-index:3;display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:13px;animation:dp-float 5s ease-in-out infinite}.dp-chip-left{left:-32px;bottom:4px}.dp-chip-right{right:-25px;top:3px;animation-delay:-2.4s}@keyframes dp-float{50%{transform:translateY(-9px)}}.dp-chip-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#ffffff33,#ffffff0d);border:1px solid #ffffff2e}.dp-float-chip b{display:block;font-size:9px}.dp-float-chip small{display:block;color:var(--mist);font-size:8px;margin-top:3px}

      .dp-section{padding:92px 0;position:relative}.dp-section-heading{text-align:center;max-width:660px;margin:0 auto 42px}.dp-section-kicker{color:var(--silver);font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase}.dp-section-heading h2{font:800 clamp(30px,4vw,46px)/1.15 Manrope,sans-serif;letter-spacing:-1.9px;margin:14px 0}.dp-section-heading p{color:var(--mist);font-size:13px;line-height:1.85}
      .dp-feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.dp-feature-card{position:relative;min-height:245px;padding:24px;border-radius:21px;overflow:hidden;transition:transform .45s cubic-bezier(.2,.8,.2,1),border-color .4s,box-shadow .4s}.dp-feature-card:hover{transform:translateY(-8px) scale(1.012);border-color:#ffffff59;box-shadow:0 26px 60px #000000b3,0 0 40px #ffffff12,inset 0 1px 0 #ffffffa6}.dp-feature-top{display:flex;align-items:center;justify-content:space-between}.dp-feature-icon{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#ffffff38,#ffffff0b);border:1px solid #ffffff38;box-shadow:inset 0 1px #ffffff8c;transition:transform .4s,box-shadow .4s}.dp-feature-card:hover .dp-feature-icon{transform:translateY(-3px) rotate(-7deg) scale(1.08);box-shadow:0 8px 25px #ffffff1f,inset 0 1px #ffffffb3}.dp-feature-number{font:700 11px Manrope,sans-serif;color:var(--dim)}.dp-feature-tag{display:inline-block;margin-top:23px;color:var(--silver);font-size:8px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase}.dp-feature-card h3{font:700 17px Manrope,sans-serif;letter-spacing:-.5px;margin-top:8px}.dp-feature-card p{max-width:300px;color:var(--mist);font-size:11px;line-height:1.8;margin-top:9px}.dp-feature-arrow{position:absolute;right:21px;bottom:21px;width:30px;height:30px;border:1px solid #ffffff24;border-radius:10px;display:grid;place-items:center;color:var(--silver);transition:.3s}.dp-feature-card:hover .dp-feature-arrow{transform:translate(3px,-3px);background:#ffffff1f;color:#fff}.dp-feature-shine{position:absolute;z-index:-1;inset:-80% -30%;background:linear-gradient(110deg,transparent 42%,#ffffff12 50%,transparent 58%);transform:translateX(-60%) rotate(12deg);transition:transform .8s}.dp-feature-card:hover .dp-feature-shine{transform:translateX(55%) rotate(12deg)}
      .dp-how-section{border-top:1px solid #ffffff0f;border-bottom:1px solid #ffffff0f;background:linear-gradient(180deg,#ffffff05,transparent)}.dp-how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.dp-how-card{padding:24px 22px;border-radius:18px;transition:.3s}.dp-how-card:hover{border-color:#ffffff4d;transform:translateY(-5px)}.dp-step{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(145deg,#ffffff33,#ffffff0d);border:1px solid #ffffff2e;color:#fff;font:800 12px Manrope,sans-serif}.dp-how-card h3{font:700 15px Manrope,sans-serif;margin-top:18px}.dp-how-card p{color:var(--mist);font-size:11px;line-height:1.8;margin-top:8px}
      .dp-security-panel{display:grid;grid-template-columns:1fr 1fr;gap:35px;align-items:center;padding:42px;border-radius:27px;box-shadow:0 25px 70px #00000099,inset 0 1px 0 #ffffff80;overflow:hidden}.dp-security-visual{min-height:220px;position:relative;display:grid;place-items:center}.dp-security-ring{position:absolute;width:210px;height:210px;border:1px solid #ffffff3d;border-radius:50%;animation:dp-spin 24s linear infinite}.dp-security-ring:before,.dp-security-ring:after{content:'';position:absolute;width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 18px #fff;top:22px;left:31px}.dp-security-ring:after{top:auto;left:auto;bottom:22px;right:31px}@keyframes dp-spin{to{transform:rotate(360deg)}}.dp-shield{width:110px;height:110px;display:grid;place-items:center;border-radius:32px;color:#fff;background:linear-gradient(145deg,#ffffff2e,#ffffff08);border:1px solid #ffffff59;box-shadow:0 0 65px #ffffff1f,inset 0 1px #ffffff80;transform:rotate(-8deg);animation:dp-shield-float 5s ease-in-out infinite}@keyframes dp-shield-float{50%{transform:rotate(2deg) translateY(-8px)}}.dp-security-copy h2{font:800 clamp(27px,3vw,38px)/1.15 Manrope,sans-serif;letter-spacing:-1.5px;margin:13px 0}.dp-security-copy p{color:var(--mist);font-size:12px;line-height:1.9}.dp-security-points{display:grid;gap:11px;margin-top:20px}.dp-security-points span{display:flex;gap:9px;align-items:center;color:#d4dae0;font-size:11px}.dp-security-points svg{color:#fff}
      .dp-cta{position:relative;text-align:center;padding:65px 25px;border-radius:27px;overflow:hidden;box-shadow:0 25px 75px #000000a6,inset 0 1px 0 #ffffff80}.dp-cta:before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 20%,#ffffff0d 50%,transparent 80%);transform:translateX(-100%);animation:dp-cta-shine 8s ease-in-out infinite}@keyframes dp-cta-shine{50%,100%{transform:translateX(100%)}}.dp-cta-icon{width:52px;height:52px;border-radius:17px;margin:0 auto 20px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#ffffff38,#ffffff0d);border:1px solid #ffffff3d}.dp-cta h2{position:relative;font:800 clamp(29px,4vw,43px)/1.15 Manrope,sans-serif;letter-spacing:-1.7px}.dp-cta p{position:relative;max-width:490px;margin:13px auto 24px;color:var(--mist);font-size:12px;line-height:1.8}.dp-footer{max-width:1160px;margin:0 auto;padding:28px 24px 35px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid #ffffff14;color:var(--dim);font-size:10px}.dp-footer-links{display:flex;gap:20px}.dp-footer-links a:hover{color:#fff}
      .reveal{opacity:0;transform:translateY(24px);transition:opacity .75s ease,transform .75s cubic-bezier(.2,.8,.2,1)}.reveal.is-visible{opacity:1;transform:translateY(0)}

      @media(max-width:900px){.dp-hero{grid-template-columns:1fr;gap:18px;padding-top:75px}.dp-hero-copy{text-align:center}.dp-hero h1,.dp-hero-description{margin-left:auto;margin-right:auto}.dp-hero-actions,.dp-trust-row,.dp-hero-note{justify-content:center}.dp-preview-wrap{max-width:690px;width:100%;margin:0 auto}.dp-feature-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dp-security-panel{padding:30px;gap:20px}}
      @media(max-width:680px){.dp-nav-shell{padding:10px 12px 0}.dp-nav{min-height:60px;padding:8px 9px 8px 12px;border-radius:18px}.dp-brand-mark{width:36px;height:36px;border-radius:12px}.dp-brand-name{font-size:14px}.dp-brand-sub{font-size:8px}.dp-nav-links{display:none}.dp-nav-actions .dp-button-secondary{display:none}.dp-nav-actions .dp-button{min-height:40px;padding:0 13px;font-size:10px}.dp-menu-button{display:grid}.dp-mobile-menu{position:absolute;top:77px;left:12px;right:12px;padding:12px;border-radius:18px;background:linear-gradient(145deg,#ffffff1f,#0b0c0ee6);pointer-events:auto;animation:dp-menu-in .25s ease both}.dp-mobile-menu a{display:block;padding:13px 11px;border-radius:10px;color:#d4dae0;font-size:13px}.dp-mobile-menu a:hover{background:#ffffff0f}.dp-main{padding:0 17px}.dp-hero{min-height:0;padding:75px 0 50px;gap:14px}.dp-hero h1{font-size:clamp(39px,11vw,54px);letter-spacing:-2.5px;margin:20px 0 16px}.dp-hero-description{font-size:13px;line-height:1.8}.dp-hero-actions{flex-direction:column;max-width:360px;margin:24px auto 0}.dp-button{width:100%;min-height:49px}.dp-trust-row{gap:11px 15px;font-size:9px}.dp-hero-note{font-size:9px}.dp-preview-wrap{padding:19px 0 32px}.dp-dashboard{padding:13px;border-radius:19px}.dp-dashboard-top{padding-bottom:12px}.dp-dashboard-heading{padding:17px 0 13px;align-items:flex-start}.dp-dashboard-heading h3{font-size:14px}.dp-dashboard-heading>div:last-child{display:none}.dp-metric-grid{gap:6px}.dp-metric-card{padding:9px;min-height:119px;border-radius:10px}.dp-metric-head{font-size:7px}.dp-metric-head svg{width:13px}.dp-metric-card strong{font-size:clamp(11px,3.3vw,16px);margin-top:12px}.dp-metric-card small{font-size:7px}.dp-dashboard-bottom{grid-template-columns:1fr;gap:7px}.dp-chart-panel{padding:11px}.dp-activity-panel{display:none}.dp-float-chip{padding:7px 9px;gap:6px;border-radius:10px}.dp-chip-left{left:-5px;bottom:0}.dp-chip-right{right:-5px;top:0}.dp-chip-icon{width:24px;height:24px}.dp-chip-icon svg{width:13px}.dp-float-chip b{font-size:8px}.dp-float-chip small{font-size:7px}.dp-section{padding:65px 0}.dp-section-heading{margin-bottom:28px}.dp-section-heading h2{font-size:31px;letter-spacing:-1.2px}.dp-section-heading p{font-size:12px}.dp-feature-grid{grid-template-columns:1fr;gap:10px}.dp-feature-card{min-height:0;padding:21px;border-radius:17px}.dp-feature-card p{max-width:90%}.dp-feature-tag{margin-top:17px}.dp-how-grid{grid-template-columns:1fr;gap:10px}.dp-how-card{padding:20px}.dp-security-panel{grid-template-columns:1fr;padding:24px 19px;gap:8px}.dp-security-visual{min-height:170px;grid-row:1}.dp-security-ring{width:160px;height:160px}.dp-shield{width:88px;height:88px}.dp-security-copy{text-align:center}.dp-security-points{text-align:left;max-width:290px;margin:18px auto 0}.dp-cta{padding:48px 19px;border-radius:20px}.dp-footer{padding:24px 17px 30px;flex-direction:column;text-align:center}.dp-footer-links{gap:15px;flex-wrap:wrap;justify-content:center}}
      @media(max-width:380px){.dp-nav-actions .dp-button-primary{display:none}.dp-hero h1{font-size:37px}.dp-metric-card{padding:7px}.dp-metric-head{font-size:6px}.dp-metric-card strong{font-size:11px}.dp-preview-label{font-size:8px}.dp-float-chip{transform:scale(.9)}}
      @keyframes dp-menu-in{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:translateY(0)}}
      @media(prefers-reduced-motion:reduce){.dp-home *, .dp-home *:before,.dp-home *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none}}
    `}</style>

    <SparkleField />
    <header className="dp-nav-shell"><nav className={`dp-nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Main navigation">
      <button className="dp-brand bg-transparent border-0 text-left" onClick={() => navigate("/")} aria-label="Duka Poa home">
        <span className="dp-brand-mark"><ShoppingBag size={21} strokeWidth={2.4}/></span>
        <span><span className="dp-brand-name block">Duka Poa <span className="text-[#c4cbd2]">POS</span></span><span className="dp-brand-sub">Smart Retail Platform</span></span>
      </button>
      <div className="dp-nav-links">{navItems.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
      <div className="dp-nav-actions">
        <button className="dp-button dp-button-secondary" onClick={()=>navigate("/login")}>Ingia</button>
        <button className="dp-button dp-button-primary" onClick={()=>navigate("/register")}>Anza bure <ArrowRight size={15}/></button>
        <button className="dp-menu-button" onClick={()=>setMenuOpen(v=>!v)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen}>{menuOpen?<X size={19}/>:<Menu size={19}/>}</button>
      </div>
      {menuOpen&&<div className="dp-mobile-menu">{navItems.map(([label,href])=><a key={href} href={href} onClick={closeMenu}>{label}</a>)}<a href="/login" onClick={e=>{e.preventDefault();closeMenu();navigate("/login")}}>Ingia kwenye akaunti</a><a href="/register" onClick={e=>{e.preventDefault();closeMenu();navigate("/register")}}>Fungua akaunti</a></div>}
    </nav></header>

    <main className="dp-main">
      <section className="dp-hero">
        <div className="dp-hero-copy">
          <div className="dp-kicker"><i className="dp-kicker-dot"/> Mfumo wa kisasa wa kusimamia biashara</div>
          <h1>Endesha duka lako <span className="dp-gradient-text">kwa akili zaidi.</span></h1>
          <p className="dp-hero-description">Duka Poa inakusaidia kusimamia mauzo, bidhaa, madeni na takwimu za biashara yako sehemu moja. Rahisisha kazi za kila siku na ufanye maamuzi kwa taarifa zilizo wazi.</p>
          <div className="dp-hero-actions"><Button onClick={()=>navigate("/register")}>Fungua akaunti ya duka</Button><Button secondary onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}>Gundua Duka Poa <ArrowUpRight size={15}/></Button></div>
          <div className="dp-trust-row"><span><CheckCircle2 size={14}/> Rahisi kutumia</span><span><Smartphone size={14}/> Simu na kompyuta</span><span><ShieldCheck size={14}/> Udhibiti wa biashara</span></div>
          <div className="dp-hero-note"><span/> Imejengwa kwa kuzingatia mahitaji ya wafanyabiashara wa Tanzania</div>
        </div>
        <DashboardPreview/>
      </section>

      <section className="dp-section" id="features">
        <div className="dp-section-heading reveal"><span className="dp-section-kicker">Biashara yako, sehemu moja</span><h2>Kila kitu muhimu. <span className="dp-gradient-text">Bila vurugu.</span></h2><p>Kuanzia mauzo ya kaunta hadi kufuatilia bidhaa na kuelewa mwenendo wa biashara, Duka Poa inakupa muonekano mmoja ulio wazi.</p></div>
        <div className="dp-feature-grid">{features.map((item,index)=><FeatureCard key={item[1]} item={item} index={index}/>)}</div>
      </section>

      <section className="dp-section dp-how-section" id="how-it-works">
        <div className="dp-section-heading reveal"><span className="dp-section-kicker">Anza kwa hatua chache</span><h2>Rahisi kuanza. <span className="dp-gradient-text">Rahisi kuendesha.</span></h2><p>Muundo unaoeleweka ili wewe na timu yako muweze kuanza kutumia mfumo bila usumbufu usio wa lazima.</p></div>
        <div className="dp-how-grid">
          <article className="dp-how-card reveal"><div className="dp-step">01</div><h3>Fungua akaunti</h3><p>Weka taarifa za msingi za duka lako na tengeneza mazingira ya biashara yako.</p></article>
          <article className="dp-how-card reveal"><div className="dp-step">02</div><h3>Ongeza bidhaa</h3><p>Andaa orodha ya bidhaa, bei na taarifa za stoo ili kurahisisha mauzo.</p></article>
          <article className="dp-how-card reveal"><div className="dp-step">03</div><h3>Simamia biashara</h3><p>Rekodi miamala na tumia ripoti kuona kinachoendelea kwenye duka lako.</p></article>
        </div>
      </section>

      <section className="dp-section" id="security">
        <div className="dp-security-panel reveal">
          <div className="dp-security-visual"><div className="dp-security-ring"/><div className="dp-shield"><ShieldCheck size={53} strokeWidth={1.25}/></div></div>
          <div className="dp-security-copy"><span className="dp-section-kicker">Udhibiti na uwazi</span><h2>Biashara yako inahitaji <span className="dp-gradient-text">mpangilio.</span></h2><p>Weka taarifa za mauzo, bidhaa na watumiaji katika mfumo mmoja. Duka Poa inalenga kukupa mwonekano ulio wazi wa shughuli za kila siku za biashara yako.</p><div className="dp-security-points"><span><CheckCircle2 size={15}/> Kumbukumbu za miamala</span><span><CheckCircle2 size={15}/> Taarifa za bidhaa na stoo</span><span><CheckCircle2 size={15}/> Muonekano unaofaa vifaa tofauti</span></div></div>
        </div>
      </section>

      <section className="dp-section pt-4"><div className="dp-cta reveal">
        <div className="dp-cta-icon"><Sparkles size={25}/></div><span className="dp-section-kicker">Hatua inayofuata inaanza hapa</span>
        <h2>Biashara yako. <span className="dp-gradient-text">Mpangilio mpya.</span></h2>
        <p>Anza kusimamia duka lako kwa muonekano ulio wazi zaidi. Fungua akaunti ya Duka Poa na ujenge msingi bora wa biashara yako.</p>
        <div className="relative flex justify-center"><Button onClick={()=>navigate("/register")}>Anza na Duka Poa</Button></div>
      </div></section>
    </main>

    <footer className="dp-footer">
      <div className="dp-brand"><span className="dp-brand-mark !w-8 !h-8 !rounded-xl"><ShoppingBag size={16}/></span><span><span className="dp-brand-name block !text-sm">Duka Poa <span className="text-[#c4cbd2]">POS</span></span><span className="dp-brand-sub">Smart Retail Platform</span></span></div>
      <span>© {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.</span>
      <div className="dp-footer-links"><a href="#features">Vipengele</a><a href="#security">Usalama</a><a href="/login" onClick={e=>{e.preventDefault();navigate("/login")}}>Ingia</a></div>
    </footer>
  </div>;
}

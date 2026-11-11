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

const particles = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 61 + 7) % 100}%`,
  delay: `${(i % 9) * -1.7}s`,
  duration: `${12 + (i % 8) * 2}s`,
}));

function SparkleField() {
  return <div className="dp-sparkle-field" aria-hidden="true">
    {particles.map((p, i) => <i key={i} className="dp-particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }} />)}
    <i className="dp-orb dp-orb-one" /><i className="dp-orb dp-orb-two" /><i className="dp-orb dp-orb-three" /><i className="dp-grid-glow" />
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
        <div className="flex items-center gap-2"><i className="dp-window-dot bg-[#ff6b68]" /><i className="dp-window-dot bg-[#f7c65d]" /><i className="dp-window-dot bg-[#54d89a]" /><span className="ml-3 text-xs text-white/40">Duka Poa / Muhtasari</span></div>
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
    <div className="dp-float-chip dp-chip-right"><span className="dp-chip-icon mint"><Sparkles size={17}/></span><span><b>Maamuzi bora</b><small>Kwa kutumia takwimu</small></span></div>
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
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return <div className="dp-home min-h-screen overflow-hidden bg-[#07100e] text-white">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
      .dp-home{font-family:'DM Sans',sans-serif;isolation:isolate;--mint:#66e2b0}.dp-home *{box-sizing:border-box}.dp-home a{color:inherit;text-decoration:none}.dp-home button{font:inherit;cursor:pointer}
      .dp-sparkle-field{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:-1}.dp-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:#b5ffdf;box-shadow:0 0 8px 2px #6de8b477;opacity:0;animation:dp-drift 16s linear infinite}
      @keyframes dp-drift{0%{transform:translate3d(0,35px,0) scale(.5);opacity:0}12%{opacity:.65}75%{opacity:.35}100%{transform:translate3d(28px,-190px,0) scale(1.15);opacity:0}}
      .dp-orb{position:absolute;border-radius:50%;filter:blur(95px);opacity:.2;animation:dp-orb-float 18s ease-in-out infinite alternate}.dp-orb-one{width:430px;height:430px;top:-180px;left:18%;background:#16a875}.dp-orb-two{width:390px;height:390px;top:30%;right:-220px;background:#287d91;animation-delay:-5s}.dp-orb-three{width:440px;height:440px;top:67%;left:-250px;background:#167a5a;animation-delay:-9s}@keyframes dp-orb-float{to{transform:translate3d(65px,75px,0) scale(1.18)}}
      .dp-grid-glow{position:absolute;inset:0;background-image:linear-gradient(#ffffff05 1px,transparent 1px),linear-gradient(90deg,#ffffff05 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(to bottom,black,transparent 72%);opacity:.22}
      .dp-nav-shell{position:sticky;top:0;z-index:50;padding:15px 22px 0;pointer-events:none}.dp-nav{pointer-events:auto;max-width:1160px;margin:auto;min-height:68px;padding:9px 12px 9px 18px;display:flex;align-items:center;justify-content:space-between;border:1px solid #ffffff17;border-radius:22px;background:#0c1915b8;backdrop-filter:blur(24px) saturate(150%);box-shadow:0 12px 50px #0004,inset 0 1px #ffffff12;transition:.35s}.dp-nav.is-scrolled{background:#0b1714ed;border-color:#9af4ce2b;box-shadow:0 15px 45px #0007}
      .dp-brand{display:flex;align-items:center;gap:11px;cursor:pointer}.dp-brand-mark{height:40px;width:40px;border-radius:14px;display:grid;place-items:center;color:#06271b;background:linear-gradient(145deg,#a5f6d2,#28c58b);box-shadow:0 5px 24px #2dc98c35,inset 0 1px #fff9;transition:transform .35s}.dp-brand:hover .dp-brand-mark{transform:rotate(-8deg) scale(1.07)}.dp-brand-name{font:800 16px Manrope,sans-serif;letter-spacing:-.6px}.dp-brand-sub{display:block;color:#8ba99b;font-size:9px;letter-spacing:1.7px;text-transform:uppercase;margin-top:2px}
      .dp-nav-links{display:flex;align-items:center;gap:30px;color:#b3c6bc;font-size:12px;font-weight:600}.dp-nav-links a{position:relative;padding:9px 0;transition:color .25s}.dp-nav-links a:after{content:'';position:absolute;bottom:2px;left:0;width:0;height:1px;background:var(--mint);transition:width .3s}.dp-nav-links a:hover{color:#fff}.dp-nav-links a:hover:after{width:100%}.dp-nav-actions{display:flex;align-items:center;gap:7px}
      .dp-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:47px;padding:0 21px;border-radius:14px;font-size:12px;font-weight:800;overflow:hidden;transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s,border-color .3s,background .3s}.dp-button:hover{transform:translateY(-3px)}.dp-button:active{transform:scale(.98)}.dp-button-primary{color:#05251a;background:linear-gradient(135deg,#a5f4d2,#54d9a7 58%,#27bd88);box-shadow:0 8px 26px #39d69a2a,inset 0 1px #ffffffb0}.dp-button-primary:before{content:'';position:absolute;top:-80%;left:-35%;height:260%;width:24%;transform:rotate(24deg);background:#ffffff65;filter:blur(8px);transition:left .65s}.dp-button-primary:hover{box-shadow:0 13px 35px #39d69a48}.dp-button-primary:hover:before{left:125%}.dp-button-secondary{color:#e1eee7;border:1px solid #ffffff20;background:#ffffff08;backdrop-filter:blur(12px)}.dp-button-secondary:hover{border-color:#8be9c18a;background:#ffffff12;box-shadow:0 10px 28px #0003}.dp-menu-button{display:none;width:43px;height:43px;border:1px solid #ffffff1b;border-radius:13px;background:#ffffff09;color:#fff;place-items:center}
      .dp-main{max-width:1160px;margin:auto;padding:0 24px;position:relative}.dp-hero{min-height:650px;padding:104px 0 85px;display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:38px}.dp-hero-copy{position:relative;z-index:2}.dp-kicker{display:inline-flex;align-items:center;gap:9px;padding:9px 13px;border:1px solid #8cebc12b;border-radius:999px;background:#70e5b20c;color:#a7e8cc;font-size:10px;font-weight:800;letter-spacing:1.05px;text-transform:uppercase}.dp-kicker-dot{width:7px;height:7px;border-radius:50%;background:#68e4ad;box-shadow:0 0 13px #68e4ad;animation:dp-pulse 2s infinite}@keyframes dp-pulse{50%{box-shadow:0 0 3px #68e4ad;opacity:.55}}
      .dp-hero h1{font:800 clamp(43px,5.3vw,70px)/1.08 Manrope,sans-serif;letter-spacing:-3.5px;margin:25px 0 20px;max-width:670px}.dp-gradient-text{background:linear-gradient(100deg,#b8f7dc 5%,#64ddb0 48%,#8bc9d1 100%);background-clip:text;-webkit-background-clip:text;color:transparent}.dp-hero-description{max-width:550px;color:#9eb3a8;font-size:15px;line-height:1.9}.dp-hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.dp-trust-row{display:flex;flex-wrap:wrap;gap:17px;margin-top:27px;color:#8ea99b;font-size:10px;font-weight:600}.dp-trust-row span{display:flex;align-items:center;gap:7px}.dp-trust-row svg{color:#65dba9}.dp-hero-note{display:flex;align-items:center;gap:9px;margin-top:30px;color:#718b7d;font-size:10px}.dp-hero-note span{width:27px;height:1px;background:#5ed6a4}
      .dp-preview-wrap{position:relative;perspective:1400px;min-width:0;padding:28px 0}.dp-preview-aura{position:absolute;inset:9% -8%;border-radius:50%;background:radial-gradient(ellipse,#4bdaa32b,transparent 68%);filter:blur(25px);animation:dp-aura 6s ease-in-out infinite alternate}@keyframes dp-aura{to{transform:scale(1.1);opacity:.6}}
      .dp-dashboard{position:relative;z-index:2;padding:21px;border:1px solid #c6f9df25;border-radius:25px;background:linear-gradient(145deg,#182a24ed,#0d1916f2 68%,#12241d);box-shadow:0 45px 100px #0008,0 0 0 7px #ffffff04,inset 0 1px #ffffff1d;transform-style:preserve-3d;transition:transform .22s ease-out,border-color .4s;overflow:hidden}.dp-dashboard:hover{border-color:#9bf0ce55}.dp-dashboard:before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(125deg,#ffffff0c,transparent 28%,transparent 72%,#79e6b10a)}
      .dp-dashboard-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid #ffffff10}.dp-window-dot{width:7px;height:7px;border-radius:50%}.dp-preview-label{display:flex;align-items:center;gap:7px;color:#91b4a2;font-size:9px}.dp-live-dot{width:6px;height:6px;border-radius:50%;background:#5ce0a5;box-shadow:0 0 10px #5ce0a5}.dp-dashboard-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:22px 0 17px}.dp-eyebrow{color:#6bdca9;font-size:8px;font-weight:800;letter-spacing:1.7px}.dp-dashboard-heading h3{font:700 17px Manrope,sans-serif;margin-top:6px;letter-spacing:-.5px}.dp-dashboard-heading h3 span{color:#72dfb2}.dp-date-pill,.dp-chart-period{display:flex;align-items:center;gap:5px;border:1px solid #ffffff12;border-radius:8px;padding:7px 9px;color:#9ab3a5;font-size:8px;background:#ffffff05}
      .dp-metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.dp-metric-card{position:relative;min-width:0;min-height:144px;padding:13px;border:1px solid #ffffff10;border-radius:13px;background:linear-gradient(145deg,#ffffff0b,#ffffff03);overflow:hidden}.dp-metric-head{display:flex;justify-content:space-between;align-items:center;color:#8da99a;font-size:9px}.dp-metric-head svg{color:#71dcae}.dp-metric-card strong{display:block;margin-top:13px;font:800 clamp(15px,1.8vw,21px) Manrope,sans-serif;letter-spacing:-.7px;white-space:nowrap}.dp-metric-card small{display:block;margin-top:5px;color:#789487;font-size:8px}.dp-positive{color:#67dda9}.dp-blue{color:#82c9f2}.dp-mini-bars{height:24px;display:flex;align-items:flex-end;gap:3px;margin-top:10px}.dp-mini-bars i{flex:1;border-radius:3px 3px 1px 1px;background:linear-gradient(to top,#278e6a,#7ae5b7);opacity:.78}.dp-stock-line{height:5px;border-radius:9px;background:#ffffff12;margin-top:15px;overflow:hidden}.dp-stock-line i{display:block;width:72%;height:100%;border-radius:9px;background:linear-gradient(90deg,#36b987,#9aebc9)}.dp-sparkline{height:31px;margin-top:7px}.dp-sparkline svg{width:100%;height:100%;overflow:visible}.dp-sparkline path{fill:none;stroke:#73dfb2;stroke-width:2.3;stroke-linecap:round;filter:drop-shadow(0 0 4px #60d9a377)}
      .dp-dashboard-bottom{display:grid;grid-template-columns:1.25fr .75fr;gap:10px;margin-top:10px}.dp-chart-panel,.dp-activity-panel{padding:14px;border:1px solid #ffffff10;border-radius:13px;background:#ffffff05;min-width:0}.dp-chart-period{padding:5px 7px}.dp-chart{height:105px;display:flex;gap:9px;margin-top:17px}.dp-chart-y{display:flex;flex-direction:column;justify-content:space-between;color:#627d70;font-size:7px;padding-bottom:1px}.dp-chart-plot{position:relative;flex:1;display:flex;align-items:flex-end;justify-content:space-around;gap:5px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 25px,#ffffff0b 26px)}.dp-chart-bar-wrap{height:100%;width:6%;display:flex;align-items:flex-end}.dp-chart-bar-wrap i{display:block;width:100%;border-radius:4px 4px 1px 1px;background:linear-gradient(to top,#21875f,#78e3b4);box-shadow:0 0 10px #5ad49b22;transform-origin:bottom;animation:dp-bar-in .8s cubic-bezier(.2,.8,.2,1) both}@keyframes dp-bar-in{from{transform:scaleY(.08);opacity:.2}to{transform:scaleY(1);opacity:1}}.dp-chart-x{display:flex;justify-content:space-between;color:#698476;font-size:7px;margin:7px 0 0 29px}
      .dp-activity-row{display:flex;align-items:center;gap:7px;padding:9px 0;border-top:1px solid #ffffff0c}.dp-activity-icon{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;flex:none}.dp-activity-icon.mint{background:#50dba51a;color:#69dfae}.dp-activity-icon.blue{background:#6ebff21a;color:#7bc5f1}.dp-activity-icon.amber{background:#f2c46c1a;color:#efc36e}.dp-activity-row p{font-size:8px;color:#d4e3da;white-space:nowrap}.dp-activity-row small{display:block;font-size:7px;color:#779184;margin-top:3px}.dp-activity-row b{font-size:8px;color:#9bb8a8;white-space:nowrap}.dp-dashboard-reflection{position:absolute;top:-80%;left:-50%;width:35%;height:260%;transform:rotate(28deg);background:linear-gradient(90deg,transparent,#ffffff09,transparent);animation:dp-reflect 9s ease-in-out infinite;pointer-events:none}@keyframes dp-reflect{0%,30%{left:-60%}70%,100%{left:140%}}
      .dp-float-chip{position:absolute;z-index:3;display:flex;align-items:center;gap:9px;padding:10px 13px;border:1px solid #c9f9e02b;border-radius:13px;background:#13271fe8;backdrop-filter:blur(18px);box-shadow:0 15px 35px #0006;animation:dp-float 5s ease-in-out infinite}.dp-chip-left{left:-32px;bottom:4px}.dp-chip-right{right:-25px;top:3px;animation-delay:-2.4s}@keyframes dp-float{50%{transform:translateY(-9px)}}.dp-chip-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#85cafa;background:#69baf31b}.dp-chip-icon.mint{color:#76e7b7;background:#64dfa51b}.dp-float-chip b{display:block;font-size:9px}.dp-float-chip small{display:block;color:#8eaa9b;font-size:8px;margin-top:3px}
      .dp-section{padding:92px 0;position:relative}.dp-section-heading{text-align:center;max-width:660px;margin:0 auto 42px}.dp-section-kicker{color:#72dcb0;font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase}.dp-section-heading h2{font:800 clamp(30px,4vw,46px)/1.15 Manrope,sans-serif;letter-spacing:-1.9px;margin:14px 0}.dp-section-heading p{color:#91a99c;font-size:13px;line-height:1.85}
      .dp-feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.dp-feature-card{position:relative;isolation:isolate;min-height:245px;padding:24px;border:1px solid #ffffff12;border-radius:21px;background:linear-gradient(145deg,#14231dce,#0c1713d9);backdrop-filter:blur(18px);overflow:hidden;transition:transform .45s cubic-bezier(.2,.8,.2,1),border-color .4s,box-shadow .4s}.dp-feature-card:hover{transform:translateY(-8px) scale(1.012);border-color:#91edc64a;box-shadow:0 22px 55px #0005,0 0 35px #4ed69a0c}.dp-feature-top{display:flex;align-items:center;justify-content:space-between}.dp-feature-icon{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:#65dca51a;color:#72e2b4;border:1px solid #8af0c51c;transition:transform .4s,box-shadow .4s}.dp-feature-card:hover .dp-feature-icon{transform:translateY(-3px) rotate(-7deg) scale(1.08);box-shadow:0 8px 25px #4bd69a24}.dp-feature-number{font:700 11px Manrope,sans-serif;color:#638273}.dp-feature-tag{display:inline-block;margin-top:23px;color:#7bdcb2;font-size:8px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase}.dp-feature-card h3{font:700 17px Manrope,sans-serif;letter-spacing:-.5px;margin-top:8px}.dp-feature-card p{max-width:300px;color:#8fa79a;font-size:11px;line-height:1.8;margin-top:9px}.dp-feature-arrow{position:absolute;right:21px;bottom:21px;width:30px;height:30px;border:1px solid #ffffff14;border-radius:10px;display:grid;place-items:center;color:#83bca0;transition:.3s}.dp-feature-card:hover .dp-feature-arrow{transform:translate(3px,-3px);background:#70e1b21c;color:#aaf2d2}.dp-feature-shine{position:absolute;z-index:-1;inset:-80% -30%;background:linear-gradient(110deg,transparent 42%,#ffffff08 50%,transparent 58%);transform:translateX(-60%) rotate(12deg);transition:transform .8s}.dp-feature-card:hover .dp-feature-shine{transform:translateX(55%) rotate(12deg)}.dp-tone-blue .dp-feature-icon{color:#80c8f2;background:#6bbef21a}.dp-tone-blue .dp-feature-tag{color:#80c8f2}.dp-tone-violet .dp-feature-icon{color:#b4a2fa;background:#9b82fa1a}.dp-tone-violet .dp-feature-tag{color:#b4a2fa}.dp-tone-amber .dp-feature-icon{color:#edc477;background:#e9b85c1a}.dp-tone-amber .dp-feature-tag{color:#edc477}.dp-tone-pink .dp-feature-icon{color:#f0a0c8;background:#ed8cbd1a}.dp-tone-pink .dp-feature-tag{color:#f0a0c8}
      .dp-how-section{border-top:1px solid #ffffff0b;border-bottom:1px solid #ffffff0b;background:linear-gradient(180deg,#ffffff03,transparent)}.dp-how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.dp-how-card{padding:24px 22px;border-radius:18px;border:1px solid #ffffff10;background:#ffffff04;transition:.3s}.dp-how-card:hover{background:#ffffff08;border-color:#83e8bc36;transform:translateY(-5px)}.dp-step{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#62dba51a;color:#82e8ba;font:800 12px Manrope,sans-serif}.dp-how-card h3{font:700 15px Manrope,sans-serif;margin-top:18px}.dp-how-card p{color:#8da699;font-size:11px;line-height:1.8;margin-top:8px}
      .dp-security-panel{display:grid;grid-template-columns:1fr 1fr;gap:35px;align-items:center;padding:42px;border:1px solid #8de9bd24;border-radius:27px;background:radial-gradient(ellipse at 15% 10%,#3bba8520,transparent 48%),linear-gradient(135deg,#14261e,#0d1713);box-shadow:0 25px 70px #0003;overflow:hidden}.dp-security-visual{min-height:220px;position:relative;display:grid;place-items:center}.dp-security-ring{position:absolute;width:210px;height:210px;border:1px solid #72e2b433;border-radius:50%;animation:dp-spin 24s linear infinite}.dp-security-ring:before,.dp-security-ring:after{content:'';position:absolute;width:9px;height:9px;border-radius:50%;background:#80e8bc;box-shadow:0 0 18px #80e8bc;top:22px;left:31px}.dp-security-ring:after{top:auto;left:auto;bottom:22px;right:31px}@keyframes dp-spin{to{transform:rotate(360deg)}}.dp-shield{width:110px;height:110px;display:grid;place-items:center;border-radius:32px;color:#a3f3ce;background:linear-gradient(145deg,#ffffff18,#ffffff04);border:1px solid #b1f5d34a;box-shadow:0 0 65px #4cdb9c20,inset 0 1px #ffffff2b;transform:rotate(-8deg);animation:dp-shield-float 5s ease-in-out infinite}@keyframes dp-shield-float{50%{transform:rotate(2deg) translateY(-8px)}}.dp-security-copy h2{font:800 clamp(27px,3vw,38px)/1.15 Manrope,sans-serif;letter-spacing:-1.5px;margin:13px 0}.dp-security-copy p{color:#9bb1a4;font-size:12px;line-height:1.9}.dp-security-points{display:grid;gap:11px;margin-top:20px}.dp-security-points span{display:flex;gap:9px;align-items:center;color:#c0d5c9;font-size:11px}.dp-security-points svg{color:#70dfb0}
      .dp-cta{position:relative;text-align:center;padding:65px 25px;border:1px solid #8cebc12c;border-radius:27px;background:radial-gradient(ellipse at 50% 0%,#48c88a22,transparent 62%),linear-gradient(145deg,#14271f,#0b1712);overflow:hidden;box-shadow:0 25px 75px #0004}.dp-cta:before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 20%,#ffffff05 50%,transparent 80%);transform:translateX(-100%);animation:dp-cta-shine 8s ease-in-out infinite}@keyframes dp-cta-shine{50%,100%{transform:translateX(100%)}}.dp-cta-icon{width:52px;height:52px;border-radius:17px;margin:0 auto 20px;display:grid;place-items:center;color:#8df0c1;background:#6bdfa51c;border:1px solid #91efc52a}.dp-cta h2{position:relative;font:800 clamp(29px,4vw,43px)/1.15 Manrope,sans-serif;letter-spacing:-1.7px}.dp-cta p{position:relative;max-width:490px;margin:13px auto 24px;color:#9bb2a4;font-size:12px;line-height:1.8}.dp-footer{max-width:1160px;margin:0 auto;padding:28px 24px 35px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid #ffffff10;color:#718b7d;font-size:10px}.dp-footer-links{display:flex;gap:20px}.dp-footer-links a:hover{color:#a6ebcb}
      .reveal{opacity:0;transform:translateY(24px);transition:opacity .75s ease,transform .75s cubic-bezier(.2,.8,.2,1)}.reveal.is-visible{opacity:1;transform:translateY(0)}
      @media(max-width:900px){.dp-hero{grid-template-columns:1fr;gap:18px;padding-top:75px}.dp-hero-copy{text-align:center}.dp-hero h1,.dp-hero-description{margin-left:auto;margin-right:auto}.dp-hero-actions,.dp-trust-row,.dp-hero-note{justify-content:center}.dp-preview-wrap{max-width:690px;width:100%;margin:0 auto}.dp-feature-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dp-security-panel{padding:30px;gap:20px}}
      @media(max-width:680px){.dp-nav-shell{padding:10px 12px 0}.dp-nav{min-height:60px;padding:8px 9px 8px 12px;border-radius:18px}.dp-brand-mark{width:36px;height:36px;border-radius:12px}.dp-brand-name{font-size:14px}.dp-brand-sub{font-size:8px}.dp-nav-links{display:none}.dp-nav-actions .dp-button-secondary{display:none}.dp-nav-actions .dp-button{min-height:40px;padding:0 13px;font-size:10px}.dp-menu-button{display:grid}.dp-mobile-menu{position:absolute;top:77px;left:12px;right:12px;padding:12px;border:1px solid #ffffff1a;border-radius:18px;background:#0d1c16f5;backdrop-filter:blur(25px);box-shadow:0 20px 50px #0008;pointer-events:auto;animation:dp-menu-in .25s ease both}.dp-mobile-menu a{display:block;padding:13px 11px;border-radius:10px;color:#c4d7cb;font-size:13px}.dp-mobile-menu a:hover{background:#ffffff0a}.dp-main{padding:0 17px}.dp-hero{min-height:0;padding:75px 0 50px;gap:14px}.dp-hero h1{font-size:clamp(39px,11vw,54px);letter-spacing:-2.5px;margin:20px 0 16px}.dp-hero-description{font-size:13px;line-height:1.8}.dp-hero-actions{flex-direction:column;max-width:360px;margin:24px auto 0}.dp-button{width:100%;min-height:49px}.dp-trust-row{gap:11px 15px;font-size:9px}.dp-hero-note{font-size:9px}.dp-preview-wrap{padding:19px 0 32px}.dp-dashboard{padding:13px;border-radius:19px}.dp-dashboard-top{padding-bottom:12px}.dp-dashboard-heading{padding:17px 0 13px;align-items:flex-start}.dp-dashboard-heading h3{font-size:14px}.dp-dashboard-heading>div:last-child{display:none}.dp-metric-grid{gap:6px}.dp-metric-card{padding:9px;min-height:119px;border-radius:10px}.dp-metric-head{font-size:7px}.dp-metric-head svg{width:13px}.dp-metric-card strong{font-size:clamp(11px,3.3vw,16px);margin-top:12px}.dp-metric-card small{font-size:7px}.dp-dashboard-bottom{grid-template-columns:1fr;gap:7px}.dp-chart-panel{padding:11px}.dp-activity-panel{display:none}.dp-float-chip{padding:7px 9px;gap:6px;border-radius:10px}.dp-chip-left{left:-5px;bottom:0}.dp-chip-right{right:-5px;top:0}.dp-chip-icon{width:24px;height:24px}.dp-chip-icon svg{width:13px}.dp-float-chip b{font-size:8px}.dp-float-chip small{font-size:7px}.dp-section{padding:65px 0}.dp-section-heading{margin-bottom:28px}.dp-section-heading h2{font-size:31px;letter-spacing:-1.2px}.dp-section-heading p{font-size:12px}.dp-feature-grid{grid-template-columns:1fr;gap:10px}.dp-feature-card{min-height:0;padding:21px;border-radius:17px}.dp-feature-card p{max-width:90%}.dp-feature-tag{margin-top:17px}.dp-how-grid{grid-template-columns:1fr;gap:10px}.dp-how-card{padding:20px}.dp-security-panel{grid-template-columns:1fr;padding:24px 19px;gap:8px}.dp-security-visual{min-height:170px;grid-row:1}.dp-security-ring{width:160px;height:160px}.dp-shield{width:88px;height:88px}.dp-security-copy{text-align:center}.dp-security-points{text-align:left;max-width:290px;margin:18px auto 0}.dp-cta{padding:48px 19px;border-radius:20px}.dp-footer{padding:24px 17px 30px;flex-direction:column;text-align:center}.dp-footer-links{gap:15px;flex-wrap:wrap;justify-content:center}}
      @media(max-width:380px){.dp-nav-actions .dp-button-primary{display:none}.dp-hero h1{font-size:37px}.dp-metric-card{padding:7px}.dp-metric-head{font-size:6px}.dp-metric-card strong{font-size:11px}.dp-preview-label{font-size:8px}.dp-float-chip{transform:scale(.9)}}
      @keyframes dp-menu-in{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:translateY(0)}}
      @media(prefers-reduced-motion:reduce){.dp-home *, .dp-home *:before,.dp-home *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none}}
    `}</style>

    <SparkleField />
    <header className="dp-nav-shell"><nav className={`dp-nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Main navigation">
      <button className="dp-brand bg-transparent border-0 text-left" onClick={() => navigate("/")} aria-label="Duka Poa home">
        <span className="dp-brand-mark"><ShoppingBag size={21} strokeWidth={2.4}/></span>
        <span><span className="dp-brand-name block">Duka Poa <span className="text-[#73dfb3]">POS</span></span><span className="dp-brand-sub">Smart Retail Platform</span></span>
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
      <div className="dp-brand"><span className="dp-brand-mark !w-8 !h-8 !rounded-xl"><ShoppingBag size={16}/></span><span><span className="dp-brand-name block !text-sm">Duka Poa <span className="text-[#73dfb3]">POS</span></span><span className="dp-brand-sub">Smart Retail Platform</span></span></div>
      <span>© {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.</span>
      <div className="dp-footer-links"><a href="#features">Vipengele</a><a href="#security">Usalama</a><a href="/login" onClick={e=>{e.preventDefault();navigate("/login")}}>Ingia</a></div>
    </footer>
  </div>;
}

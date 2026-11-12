import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, TrendingUp, Sparkles, ArrowRight, ShieldCheck, Menu, X,
  Package, BarChart3, CheckCircle2, Smartphone, WifiOff, Receipt, Users,
  ChevronDown, ScanBarcode, ArrowUpRight, Sun, Moon, Monitor
} from "lucide-react";

const features = [
  [ShoppingBag, "01", "Mauzo ya haraka", "Rekodi mauzo kwa urahisi, tumia njia mbalimbali za malipo na toa risiti bila kupoteza muda.", "POS", "mint"],
  [Package, "02", "Udhibiti wa stoo", "Fuatilia bidhaa zinazoingia na kutoka, tambua bidhaa zinazoisha na dhibiti bidhaa zako.", "Inventory", "blue"],
  [BarChart3, "03", "Takwimu za biashara", "Elewa mwenendo wa mauzo, gharama na faida kwa kutumia ripoti zinazoeleweka.", "Insights", "violet"],
  [Receipt, "04", "Madeni na kumbukumbu", "Weka kumbukumbu za madeni ya wateja na fuatilia malipo kwa uwazi zaidi.", "Customer records", "amber"],
  [Users, "05", "Usimamizi wa wafanyakazi", "Panga majukumu ya timu na fuatilia miamala kulingana na mtumiaji.", "Team", "pink"],
  [WifiOff, "06", "Imezingatia mazingira ya hapa", "Muundo unaolenga mahitaji ya wafanyabiashara wa Tanzania na matumizi ya vifaa tofauti.", "Tanzania-first", "mint"],
];

// Tiny glowing bubbles that float up slowly
const particles = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 61 + 7) % 100}%`,
  delay: `${(i % 9) * -1.7}s`,
  duration: `${12 + (i % 8) * 2}s`,
}));

// Cobalt, blue, violet and rose smoke clouds rising from the bottom. The whole layer slowly shifts hue.
const SMOKE_COLORS = ["31,91,255", "66,133,244", "31,91,255", "120,110,255", "155,114,203", "66,133,244", "217,101,112", "31,91,255"];
const smokePuffs = Array.from({ length: 12 }, (_, i) => ({
  left: `${-6 + ((i * 29) % 112)}%`,
  size: `${380 + (i % 5) * 130}px`,
  delay: `${-(i * 3.4)}s`,
  duration: `${26 + (i % 4) * 7}s`,
  opacity: (0.34 + (i % 3) * 0.08).toFixed(2),
  drift: `${(i % 2 ? 1 : -1) * (70 + (i % 4) * 35)}px`,
  color: SMOKE_COLORS[i % SMOKE_COLORS.length],
}));

// Thin colour-shifting light lines that sweep across the background
const streaks = [
  { top: "20%", rotate: "-11deg", delay: "0s", duration: "16s" },
  { top: "46%", rotate: "7deg", delay: "-6s", duration: "20s" },
  { top: "73%", rotate: "-5deg", delay: "-11s", duration: "18s" },
];

// Elements that get the moving "light on glass" highlight under the cursor
const GLASS_SELECTOR = [
  ".dp-nav", ".dp-button", ".dp-kicker", ".dp-dashboard", ".dp-metric-card", ".dp-chart-panel",
  ".dp-activity-panel", ".dp-float-chip", ".dp-feature-card", ".dp-how-card", ".dp-security-panel",
  ".dp-cta", ".dp-menu-button",
].join(",");

// The liquid "peanut" capsule from the iPhone-style reference: two lobes joined by a soft neck.
// Absolute points (x 20-580, y 30-190), shifted to a 560 x 160 box below.
const BLOB_SEGMENTS = [
  [190, 30, 215, 80, 300, 80], [385, 80, 410, 30, 480, 30], [545, 30, 580, 62, 580, 110],
  [580, 158, 545, 190, 480, 190], [410, 190, 385, 140, 300, 140], [215, 140, 190, 190, 120, 190],
  [55, 190, 20, 158, 20, 110], [20, 62, 55, 30, 120, 30],
];
const blobPath = (fx, fy) =>
  `M ${fx(120)} ${fy(30)} ` + BLOB_SEGMENTS.map((s) => "C " + s.map((n, i) => (i % 2 ? fy(n) : fx(n))).join(" ")).join(" ") + " Z";
const BLOB_CLIP = blobPath((x) => +((x - 20) / 560).toFixed(5), (y) => +((y - 30) / 160).toFixed(5)); // 0-1 units (scales with the box)
const BLOB_RIM = blobPath((x) => x - 20, (y) => y - 30);
const BLOB_BOTTOM = "M 460 160 C 390 160 365 110 280 110 C 195 110 170 160 100 160";


// =====================================================================
// THEME: white, black, or follow the device
// Reads the choice saved by the Settings page (any of these keys) and keeps the same <html class="dark">
// that the rest of the app uses. Add your own key to THEME_KEYS if Settings saves it under another name.
// =====================================================================
const THEME_KEYS = ["theme", "duka_theme", "duka-theme", "color-theme", "darkMode"];
const THEME_MODES = ["system", "light", "dark"];
const MODE_LABEL = { system: "Kifaa", light: "Nyeupe", dark: "Nyeusi" };
const MODE_ICON = { system: Monitor, light: Sun, dark: Moon };

const readStoredMode = () => {
  try {
    for (const key of THEME_KEYS) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const value = raw.replace(/^"|"$/g, "").toLowerCase();
      if (["dark", "black", "true"].includes(value)) return "dark";
      if (["light", "white", "false"].includes(value)) return "light";
      if (["system", "auto", "device"].includes(value)) return "system";
    }
  } catch { /* storage blocked */ }
  return null;
};

const getInitialMode = () => {
  if (typeof window === "undefined") return "system";
  const stored = readStoredMode();
  if (stored) return stored;
  return document.documentElement.classList.contains("dark") ? "dark" : "system";
};

const getDeviceDark = () =>
  typeof window === "undefined" || !window.matchMedia ? true : window.matchMedia("(prefers-color-scheme: dark)").matches;

function SparkleField() {
  return <div className="dp-sparkle-field" aria-hidden="true">
    <svg width="0" height="0" style={{ position: "absolute" }} focusable="false">
      <defs>
        {/* Lens: bends whatever sits behind the glass, like liquid glass on iOS */}
        <filter id="dp-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.007 0.011" numOctaves="2" seed="4" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <clipPath id="dp-blob-clip" clipPathUnits="objectBoundingBox"><path d={BLOB_CLIP} /></clipPath>
        <linearGradient id="dp-rim-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--rim-1)" }} stopOpacity="1" /><stop offset=".32" style={{ stopColor: "var(--rim-2)" }} stopOpacity=".4" />
          <stop offset=".66" style={{ stopColor: "var(--rim-3)" }} stopOpacity=".3" /><stop offset="1" style={{ stopColor: "var(--rim-4)" }} stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="dp-rim-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4285f4" stopOpacity="0" /><stop offset=".22" stopColor="#4285f4" stopOpacity=".95" />
          <stop offset=".46" stopColor="#9b72cb" stopOpacity=".95" /><stop offset=".7" stopColor="#d96570" stopOpacity=".95" />
          <stop offset=".88" stopColor="#ffb27a" stopOpacity=".85" /><stop offset="1" stopColor="#ffb27a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dp-gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6e9bff" /><stop offset=".5" stopColor="#b79cff" /><stop offset="1" stopColor="#ff8fab" />
        </linearGradient>
      </defs>
    </svg>
    <i className="dp-orb dp-orb-one" /><i className="dp-orb dp-orb-two" /><i className="dp-orb dp-orb-three" /><i className="dp-grid-glow" />
    {streaks.map((s, i) => <i key={i} className="dp-streak" style={{ top: s.top, "--rot": s.rotate, animationDelay: s.delay, animationDuration: s.duration }} />)}
    {particles.map((p, i) => <i key={i} className="dp-particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }} />)}
    <div className="dp-smoke">
      <i className="dp-fog" />
      {smokePuffs.map((p, i) => <i key={i} className="dp-puff" style={{ "--l": p.left, "--s": p.size, "--delay": p.delay, "--d": p.duration, "--o": p.opacity, "--x": p.drift, "--c": p.color }} />)}
    </div>
    <i className="dp-vignette" />
  </div>;
}

function GlassBlob({ className = "", rotate = 0 }) {
  return <div className={`dp-blob ${className}`} style={{ "--r": `${rotate}deg` }} aria-hidden="true">
    <div className="dp-blob-glass" />
    <svg className="dp-blob-rim" viewBox="0 0 560 160" preserveAspectRatio="none">
      <path d={BLOB_RIM} fill="none" stroke="url(#dp-rim-a)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      <path d={BLOB_BOTTOM} fill="none" stroke="url(#dp-rim-b)" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
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
    <GlassBlob className="dp-blob-hero" rotate={-12} />
    <div ref={ref} className="dp-dashboard" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
      <div className="dp-dashboard-top">
        <div className="flex items-center gap-2"><i className="dp-window-dot bg-[#4285f4]" /><i className="dp-window-dot bg-[#9b72cb]" /><i className="dp-window-dot bg-[#d96570]" /><span className="ml-3 text-xs dp-muted">Duka Poa / Muhtasari</span></div>
        <span className="dp-preview-label"><i className="dp-live-dot" /> Muonekano wa mfano</span>
      </div>
      <div className="dp-dashboard-heading">
        <div><p className="dp-eyebrow">MUHTASARI WA BIASHARA</p><h3>Habari, Mmiliki wa Duka <span>✦</span></h3><p className="text-sm dp-muted mt-1">Taarifa za biashara yako, sehemu moja.</p></div>
        <span className="dp-date-pill">Muonekano wa dashboard</span>
      </div>
      <div className="dp-metric-grid">
        <div className="dp-metric-card"><div className="dp-metric-head"><span>Mauzo ya leo</span><ShoppingBag size={16} /></div><strong>TZS 485,000</strong><small><b className="dp-positive">↗ 12.8%</b> mfano wa takwimu</small><div className="dp-mini-bars">{[24,38,30,52,42,66,48,78,58,88,68,96].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></div>
        <div className="dp-metric-card"><div className="dp-metric-head"><span>Bidhaa stoo</span><Package size={16} /></div><strong>1,248</strong><small><b className="dp-blue">Bidhaa</b> zilizoorodheshwa</small><div className="dp-stock-line"><i /></div><small>Mfano wa mwonekano wa stoo</small></div>
        <div className="dp-metric-card"><div className="dp-metric-head"><span>Faida ya jumla</span><TrendingUp size={16} /></div><strong>TZS 126,500</strong><small><b className="dp-positive">Muhtasari</b> wa mfano</small><div className="dp-sparkline"><svg viewBox="0 0 220 52"><path d="M2 43 C25 38 28 45 47 31 S76 35 91 23 S119 30 137 16 S165 25 181 10 S204 14 218 3" /></svg></div></div>
      </div>
      <div className="dp-dashboard-bottom">
        <div className="dp-chart-panel"><div className="flex justify-between items-center gap-3"><div><p className="text-sm font-semibold">Mwenendo wa mauzo</p><p className="text-xs dp-muted mt-1">Mfano wa chati ya biashara</p></div><span className="dp-chart-period">Wiki hii <ChevronDown size={13} /></span></div>
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

  // Theme: "system" follows the device, "light" is white, "dark" is black
  const [mode, setModeState] = useState(getInitialMode);
  const [deviceDark, setDeviceDark] = useState(getDeviceDark);
  const theme = mode === "system" ? (deviceDark ? "dark" : "light") : mode;
  const ModeIcon = MODE_ICON[mode];

  const setMode = (next) => {
    setModeState(next);
    try { window.localStorage.setItem("theme", next); } catch { /* ignore */ }
  };
  const cycleMode = () => setMode(THEME_MODES[(THEME_MODES.indexOf(mode) + 1) % THEME_MODES.length]);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setDeviceDark(e.matches);
    if (query.addEventListener) query.addEventListener("change", onChange); else query.addListener(onChange);
    return () => { if (query.removeEventListener) query.removeEventListener("change", onChange); else query.removeListener(onChange); };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark"); // same switch the rest of the app uses
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const bar = document.querySelector('meta[name="theme-color"]');
    if (bar) bar.setAttribute("content", theme === "dark" ? "#020512" : "#f4f7ff");
  }, [theme]);
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
  return <div className="dp-home min-h-screen overflow-hidden" data-theme={theme}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap');
      @property --dp-angle{syntax:'<angle>';initial-value:0deg;inherits:false}

      /* ============ THEMES: black (default) and white. Same UI, different variables. ============ */
      .dp-nav{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-radius:24px;pointer-events:auto;transition:all .35s cubic-bezier(.16,1,.3,1);box-shadow:var(--glass-shadow)}
      .dp-nav.scrolled{background:var(--glass-bg);box-shadow:var(--nav-scrolled);padding:10px 18px}
      .dp-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.15rem;letter-spacing:-.03em}
      .dp-brand-icon{width:36px;height:36px;border-radius:11px;background:var(--gt);display:grid;place-items:center;color:#fff;box-shadow:0 8px 18px -4px #4285f480}
      .dp-nav-links{display:flex;align-items:center;gap:28px;font-size:.9rem;font-weight:500}
      .dp-nav-links a{color:var(--mist);transition:color .2s}
      .dp-nav-links a:hover{color:var(--text)}
      .dp-nav-actions{display:flex;align-items:center;gap:10px}
      .dp-theme-btn,.dp-menu-button{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:var(--text);cursor:pointer;transition:transform .2s}
      .dp-theme-btn:hover,.dp-menu-button:hover{transform:scale(1.06)}
      .dp-menu-button{display:none}

      /* ============ HERO SECTION ============ */
      .dp-hero{max-width:1200px;margin:0 auto;padding:6vh 20px 8vh;display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}
      @media(max-width:992px){.dp-hero{grid-template-columns:1fr;text-align:center;padding-top:4vh}}
      .dp-hero-content{position:relative;z-index:2}
      .dp-kicker{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:100px;font-size:.8rem;font-weight:700;margin-bottom:22px;background:var(--small-bg);box-shadow:var(--small-shadow)}
      .dp-kicker span{background:var(--kicker-grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
      .dp-hero h1{font-family:'Manrope',sans-serif;font-size:clamp(2.4rem,4.8vw,4.2rem);line-height:1.08;font-weight:800;letter-spacing:-.04em;margin-bottom:20px}
      .dp-hero h1 span{background:var(--gt);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:var(--gt-fx)}
      .dp-hero p{font-size:clamp(1rem,1.4vw,1.15rem);line-height:1.6;color:var(--mist);margin-bottom:32px;max-width:540px}
      @media(max-width:992px){.dp-hero p{margin-left:auto;margin-right:auto}}
      .dp-hero-buttons{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
      @media(max-width:992px){.dp-hero-buttons{justify-content:center}}

      /* Buttons */
      .dp-button{display:inline-flex;align-items:center;gap:10px;padding:14px 26px;border-radius:100px;font-weight:700;font-size:.95rem;transition:all .25s;cursor:pointer;position:relative;overflow:hidden}
      .dp-button-primary{background:var(--gt);color:#fff;box-shadow:0 12px 30px -6px #4285f480}
      .dp-button-primary:hover{transform:translateY(-2px);box-shadow:0 18px 36px -6px #4285f4aa}
      .dp-button-secondary{background:var(--small-bg);color:var(--text);box-shadow:var(--small-shadow)}
      .dp-button-secondary:hover{background:var(--hover-bg);transform:translateY(-2px)}

      /* Stats pill under hero buttons */
      .dp-hero-stats{display:flex;align-items:center;gap:24px;margin-top:40px;padding-top:24px;border-top:1px solid var(--line)}
      @media(max-width:992px){.dp-hero-stats{justify-content:center}}
      .dp-stat-item strong{display:block;font-size:1.35rem;font-weight:800;letter-spacing:-.02em}
      .dp-stat-item span{font-size:.8rem;color:var(--dim)}

      /* ============ DASHBOARD PREVIEW MOCKUP ============ */
      .dp-preview-wrap{position:relative}
      .dp-preview-aura{position:absolute;inset:-20px;background:var(--aura);filter:blur(40px);border-radius:40px;z-index:0}
      .dp-dashboard{position:relative;z-index:2;border-radius:32px;padding:24px;box-shadow:var(--glass-shadow);background:var(--glass-bg);transform-style:preserve-3d;transition:transform .2s ease-out}
      @media(max-width:576px){.dp-dashboard{padding:16px}}
      .dp-dashboard-top{display:flex;align-items:center;justify-content:between;margin-bottom:20px}
      .dp-window-dot{width:10px;height:100px;border-radius:50%;display:inline-block;width:10px;height:10px}
      .dp-preview-label{font-size:.75rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;background:var(--inner-bg)}
      .dp-live-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:pulse 2s infinite}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

      .dp-dashboard-heading{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
      .dp-dashboard-heading h3{font-size:1.25rem;font-weight:800;display:flex;align-items:center;gap:6px}
      .dp-dashboard-heading h3 span{color:var(--accent)}
      .dp-eyebrow{font-size:.7rem;font-weight:700;letter-spacing:.08em;color:var(--dim);margin-bottom:4px}
      .dp-date-pill{font-size:.75rem;padding:6px 12px;border-radius:12px;font-weight:600}

      /* Metric grid inside mockup */
      .dp-metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
      @media(max-width:576px){.dp-metric-grid{grid-template-columns:1fr}}
      .dp-metric-card{padding:14px;border-radius:20px;position:relative;overflow:hidden}
      .dp-metric-head{display:flex;justify-content:space-between;align-items:center;font-size:.75rem;color:var(--dim);margin-bottom:8px}
      .dp-metric-card strong{font-size:1.1rem;font-weight:800;display:block;margin-bottom:4px}
      .dp-metric-card small{font-size:.68rem;color:var(--dim)}
      .dp-positive{color:#22c55e}
      .dp-blue{color:#38b6ff}

      .dp-mini-bars{display:flex;align-items:flex-end;gap:3px;height:24px;margin-top:8px}
      .dp-mini-bars i{flex:1;background:var(--accent);border-radius:2px;opacity:.7}
      .dp-stock-line{height:4px;background:var(--track);border-radius:4px;margin:10px 0 6px;overflow:hidden}
      .dp-stock-line i{display:block;width:68%;height:100%;background:var(--gt);border-radius:4px}
      .dp-sparkline svg{width:100%;height:24px;stroke:var(--accent);stroke-width:2.5;fill:none;margin-top:6px}

      .dp-dashboard-bottom{display:grid;grid-template-columns:1.3fr .9fr;gap:12px}
      @media(max-width:576px){.dp-dashboard-bottom{grid-template-columns:1fr}}
      .dp-chart-panel,.dp-activity-panel{padding:16px;border-radius:20px}
      .dp-chart-period{font-size:.72rem;padding:4px 10px;border-radius:10px;font-weight:600;display:flex;align-items:center;gap:4px}
      .dp-chart{height:90px;display:flex;align-items:flex-end;position:relative;margin:16px 0 8px;padding-left:30px}
      .dp-chart-y{position:absolute;left:0;top:0;bottom:0;display:flex;flex-direction:column;justify-content:space-between;font-size:.6rem;color:var(--dim)}
      .dp-chart-plot{flex:1;height:100%;display:flex;align-items:flex-end;gap:6px;border-bottom:1px solid var(--line);border-left:1px solid var(--line);padding-bottom:2px}
      .dp-chart-bar-wrap{flex:1;height:100%;display:flex;align-items:flex-end}
      .dp-chart-bar-wrap i{width:100%;background:var(--gt);border-radius:3px 3px 0 0;animation:growUp .8s cubic-bezier(.16,1,.3,1) backwards}
      @keyframes growUp{from{transform:scaleY(0)}}
      .dp-chart-x{display:flex;justify-content:space-between;font-size:.6rem;color:var(--dim);padding-left:30px}

      .dp-activity-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:.75rem}
      .dp-activity-icon{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;flex-shrink:0}
      .dp-activity-icon.mint{background:#22c55e1a;color:#22c55e}
      .dp-activity-icon.blue{background:#38b6ff1a;color:#38b6ff}
      .dp-activity-icon.amber{background:#f59e0b1a;color:#f59e0b}
      .dp-activity-row p{font-weight:700;line-height:1.1}
      .dp-activity-row small{font-size:.65rem;color:var(--dim)}
      .dp-activity-row b{font-size:.75rem;margin-left:auto}
      .dp-dashboard-reflection{position:absolute;inset:0;background:linear-gradient(135deg,transparent 60%,rgba(255,255,255,.05));border-radius:32px;pointer-events:none}

      /* Floating Chips */
      .dp-float-chip{position:absolute;display:flex;align-items:center;gap:12px;padding:12px 18px;border-radius:20px;font-size:.8rem;box-shadow:var(--glass-shadow);background:var(--glass-bg);z-index:4;animation:chipFloat 6s ease-in-out infinite}
      .dp-chip-left{left:-24px;bottom:18%;animation-delay:0s}
      .dp-chip-right{right:-24px;top:22%;animation-delay:-3s}
      @keyframes chipFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      .dp-chip-icon{width:36px;height:36px;border-radius:12px;background:var(--gt);display:grid;place-items:center;color:#fff}
      .dp-float-chip b{display:block;font-weight:700}
      .dp-float-chip small{display:block;font-size:.7rem;color:var(--dim)}

      /* ============ FEATURES SECTION ============ */
      .dp-section{max-width:1200px;margin:0 auto;padding:10vh 20px}
      .dp-section-header{text-align:center;max-width:600px;margin:0 auto 60px}
      .dp-section-header h2{font-family:'Manrope',sans-serif;font-size:clamp(2rem,3.5vw,3rem);font-weight:800;letter-spacing:-.03em;margin-bottom:16px}
      .dp-section-header p{color:var(--mist);font-size:1.05rem;line-height:1.6}

      .dp-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
      @media(max-width:992px){.dp-features-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:640px){.dp-features-grid{grid-template-columns:1fr}}

      .dp-feature-card{padding:32px;border-radius:28px;position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s}
      .dp-feature-card:hover{transform:translateY(-6px);box-shadow:var(--small-hover)}
      .dp-feature-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
      .dp-feature-icon{width:48px;height:48px;border-radius:16px;background:var(--gt);display:grid;place-items:center;color:#fff;box-shadow:0 10px 24px -4px #4285f480}
      .dp-feature-number{font-family:'Manrope',sans-serif;font-size:1.5rem;font-weight:800;color:var(--dim);opacity:.4}
      .dp-feature-tag{display:inline-block;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:4px 10px;border-radius:8px;background:var(--inner-bg);margin-bottom:12px;color:var(--accent)}
      .dp-feature-card h3{font-size:1.25rem;font-weight:800;margin-bottom:10px;letter-spacing:-.02em}
      .dp-feature-card p{font-size:.92rem;color:var(--mist);line-height:1.6}
      .dp-feature-arrow{position:absolute;bottom:28px;right:28px;width:36px;height:36px;border-radius:50%;background:var(--inner-bg);display:grid;place-items:center;color:var(--text);opacity:0;transform:translate(-8px,8px);transition:all .3s}
      .dp-feature-card:hover .dp-feature-arrow{opacity:1;transform:translate(0,0)}
      .dp-feature-shine{position:absolute;inset:0;background:radial-gradient(400px circle at var(--mx,50%) var(--my,-20%),rgba(255,255,255,.08),transparent 60%);pointer-events:none}

      /* ============ HOW IT WORKS / STEPS ============ */
      .dp-how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;position:relative}
      @media(max-width:992px){.dp-how-grid{grid-template-columns:1fr}}
      .dp-how-card{padding:36px;border-radius:28px;position:relative;overflow:hidden}
      .dp-how-step{font-size:2.5rem;font-family:'Manrope',sans-serif;font-weight:800;background:var(--gt);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:16px;display:block}
      .dp-how-card h3{font-size:1.35rem;font-weight:800;margin-bottom:12px}
      .dp-how-card p{color:var(--mist);font-size:.95rem;line-height:1.6}

      /* ============ SECURITY & TRUST SECTION ============ */
      .dp-security-panel{padding:60px 40px;border-radius:36px;text-align:center;position:relative;overflow:hidden;max-width:1000px;margin:0 auto}
      .dp-security-icon{width:64px;height:64px;border-radius:20px;background:var(--gt);display:grid;place-items:center;color:#fff;margin:0 auto 24px;box-shadow:0 16px 36px -8px #4285f499}
      .dp-security-panel h2{font-family:'Manrope',sans-serif;font-size:clamp(1.8rem,3vw,2.5rem);font-weight:800;margin-bottom:16px}
      .dp-security-panel p{color:var(--mist);font-size:1.05rem;max-width:600px;margin:0 auto 32px;line-height:1.6}

      /* ============ CTA BANNER ============ */
      .dp-cta-wrap{padding:4vh 20px 12vh}
      .dp-cta{padding:70px 40px;border-radius:40px;text-align:center;position:relative;overflow:hidden;max-width:1100px;margin:0 auto}
      .dp-cta h2{font-family:'Manrope',sans-serif;font-size:clamp(2.2rem,4vw,3.5rem);font-weight:800;letter-spacing:-.03em;margin-bottom:20px}
      .dp-cta h2 span{background:var(--gt);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
      .dp-cta p{color:var(--mist);font-size:1.1rem;max-width:560px;margin:0 auto 36px;line-height:1.6}
      .dp-cta-actions{display:flex;justify-content:center;gap:16px;flex-wrap:wrap}

      /* ============ FOOTER ============ */
      .dp-footer{border-top:1px solid var(--line);padding:40px 20px;text-align:center;color:var(--dim);font-size:.85rem}
      .dp-footer-content{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px}
      @media(max-width:768px){.dp-footer-content{flex-direction:column;text-align:center}}
      .dp-footer-links{display:flex;gap:24px}

      /* Mobile Drawer Menu */
      .dp-mobile-menu{position:fixed;top:80px;left:20px;right:20px;padding:30px;border-radius:28px;z-index:99;display:flex;flex-direction:column;gap:20px;box-shadow:var(--glass-shadow);background:var(--glass-bg);transform:translateY(-20px);opacity:0;pointer-events:none;transition:all .3s cubic-bezier(.16,1,.3,1)}
      .dp-mobile-menu.open{transform:translateY(0);opacity:1;pointer-events:auto}
      .dp-mobile-links{display:flex;flex-direction:column;gap:16px;font-size:1.1rem;font-weight:600}

      @media(max-width:768px){.dp-nav-links,.dp-nav-actions .dp-button{display:none}.dp-menu-button{display:grid}}

      /* Scroll reveal animation base */
      .reveal{opacity:0;transform:translateY(30px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
      .reveal.is-visible{opacity:1;transform:translateY(0)}
    `}</style>

    <SparkleField />

    {/* NAVIGATION BAR */}
    <div className="dp-nav-shell">
      <nav className={`dp-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="dp-brand">
          <div className="dp-brand-icon"><ShoppingBag size={20} /></div>
          <span>Duka Poa</span>
        </div>
        <div className="dp-nav-links">
          {navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </div>
        <div className="dp-nav-actions">
          <button type="button" onClick={cycleMode} className="dp-theme-btn" title={`Mtindo: ${MODE_LABEL[mode]}`}>
            <ModeIcon size={18} />
          </button>
          <Button onClick={() => navigate("/login")}>Ingia Sasa</Button>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="dp-menu-button" aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </div>

    {/* MOBILE DRAWER MENU */}
    <div className={`dp-mobile-menu ${menuOpen ? "open" : ""}`}>
      <div className="dp-mobile-links">
        {navItems.map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}</a>)}
      </div>
      <div className="flex gap-3 pt-2 border-t border-[var(--line)]">
        <Button onClick={() => { closeMenu(); navigate("/login"); }}>Ingia Sasa</Button>
        <button type="button" onClick={cycleMode} className="dp-button dp-button-secondary">
          <ModeIcon size={18} /> <span>{MODE_LABEL[mode]}</span>
        </button>
      </div>
    </div>

    {/* HERO SECTION */}
    <header className="dp-hero">
      <div className="dp-hero-content reveal">
        <div className="dp-kicker"><Sparkles size={14} /><span>Mfumo wa Kisasa wa Biashara</span></div>
        <h1>Simamia Duka Lako kwa Urahisi na <span>Usahihi Kamili</span></h1>
        <p>Duka Poa inakupa uwezo wa kurekodi mauzo, kufuatilia bidhaa stoo, kuangalia takwimu za faida, na kusimamia madeni bila usumbufu wowote.</p>
        <div className="dp-hero-buttons">
          <Button onClick={() => navigate("/login")}>Anza Bure Leo</Button>
          <Button secondary onClick={() => { document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }}>Jifunze Zaidi</Button>
        </div>
        <div className="dp-hero-stats">
          <div className="dp-stat-item"><strong>100%</strong><span>Salama na Imara</span></div>
          <div className="dp-stat-item"><strong>Haraka</strong><span>Inafanya kazi bila kukwama</span></div>
          <div className="dp-stat-item"><strong>Tanzania</strong><span>Imeandaliwa kwa ajili yako</span></div>
        </div>
      </div>
      <DashboardPreview />
    </header>

    {/* FEATURES SECTION */}
    <section className="dp-section" id="features">
      <div className="dp-section-header reveal">
        <span className="dp-kicker"><span>Vipengele Vikuu</span></span>
        <h2>Kila Kitu Unachohitaji Katika Mfumo Mmoja</h2>
        <p>Zana madhubuti zilizoundwa maalum kurahisisha shughuli za kila siku za duka lako.</p>
      </div>
      <div className="dp-features-grid">
        {features.map((item, index) => <FeatureCard key={item[2]} item={item} index={index} />)}
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="dp-section" id="how-it-works">
      <div className="dp-section-header reveal">
        <span className="dp-kicker"><span>Hatua Rahisi</span></span>
        <h2>Jinsi Inavyofanya Kazi</h2>
        <p>Anza kutumia Duka Poa kwa dakika chache tu bila kuhitaji ujuzi mgumu wa kompyuta.</p>
      </div>
      <div className="dp-how-grid">
        {[          ["01", "Jisajili na Weka Taarifa", "Fungua akaunti yako kwa urahisi na uweke maelezo ya msingi ya biashara yako."],
          ["02", "Weka Bidhaa Zako Stoo", "Ingiza bidhaa zako kwa urahisi ukitumia majina, bei, na idadi uliyonayo."],
          ["03", "Anza Kuuza na Kufuatilia", "Rekodi mauzo ya kila siku na uone ripoti za faida na mwenendo wa biashara yako."]
        ].map(([step, title, desc], i) => (
          <article className="dp-how-card reveal" key={step} style={{ transitionDelay: `${i * 100}ms` }}>
            <span className="dp-how-step">{step}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </section>

    {/* SECURITY & TRUST */}
    <section className="dp-section" id="security">
      <div className="dp-security-panel reveal">
        <GlassBlob className="dp-blob-cta" rotate={6} />
        <div className="dp-security-icon"><ShieldCheck size={28} /></div>
        <h2>Usalama wa Taarifa Zako Ni Kipaumbele Chetu</h2>
        <p>Taarifa zote za biashara, mauzo, na wateja wako zinalindwa kwa viwango vya juu vya usalama ili kukupa amani ya moyo wakati wote.</p>
        <Button onClick={() => navigate("/login")}>Fungua Akaunti Yako</Button>
      </div>
    </section>

    {/* CTA BANNER */}
    <div className="dp-cta-wrap">
      <div className="dp-cta reveal">
        <GlassBlob className="dp-blob-cta" rotate={-8} />
        <h2>Badilisha Biashara Yako Leo na <span>Duka Poa</span></h2>
        <p>Jiunge na wafanyabiashara wanaotumia teknolojia kurahisisha na kukuza biashara zao.</p>
        <div className="dp-cta-actions">
          <Button onClick={() => navigate("/login")}>Anza Sasa Bure</Button>
        </div>
      </div>
    </div>

    {/* FOOTER */}
    <footer className="dp-footer">
      <div className="dp-footer-content">
        <div className="dp-brand">
          <div className="dp-brand-icon" style={{ width: 28, height: 28, borderRadius: 8 }}><ShoppingBag size={14} /></div>
          <span>Duka Poa POS</span>
        </div>
        <p>© {new Date().getFullYear()} Duka Poa. Haki zote zimehifadhiwa.</p>
        <div className="dp-footer-links">
          <a href="#features">Vipengele</a>
          <a href="#how-it-works">Jinsi Inavyofanya Kazi</a>
          <a href="#security">Usalama</a>
        </div>
      </div>
    </footer>
  </div>;
}

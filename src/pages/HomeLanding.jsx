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
      .dp-home,.dp-home[data-theme='dark']{
        color-scheme:dark;--g1:#4285f4;--g2:#9b72cb;--g3:#d96570;--g4:#ffb27a;
        --bg-base:#020512;
        --page-bg:radial-gradient(900px 560px at 50% -8%,#18369b 0%,#080e2c 60%,transparent 100%),radial-gradient(720px 520px at 108% 42%,#1a2a86 0%,transparent 70%),radial-gradient(640px 480px at -8% 80%,#12236e 0%,transparent 70%),linear-gradient(#030716,#020410);
        --text:#fff;--mist:rgba(214,226,255,.82);--dim:rgba(176,198,255,.6);--accent:#8fb2ff;--accent-strong:#9bbcff;--pos:#7fe0ff;
        --line:#8fb2ff2e;--track:#8fb2ff2e;--chart-line:#8fb2ff26;--hover-bg:#3c78ff33;--grid-line:#7aa2ff22;
        --orb-a:#2a64ff;--orb-b:#7b5cff;--orb-c:#1747d6;--orb-op:.34;--particle:#cfe0ff;--particle-glow:#5b8cffcc;--streak-glow:#4285f480;--smoke-k:1;
        --fog-a:#2f6bff80;--fog-b:#6a7dff66;--fog-c:#8a6bff66;
        --vignette:radial-gradient(ellipse at 50% 40%,transparent 55%,#00020ed1 100%);
        --glass-bg:linear-gradient(90deg,transparent,#4285f4b3 20%,#9b72cbb0 42%,#d96570a8 64%,#ffb27a8c 82%,transparent) 50% 100% / 78% 2px no-repeat,linear-gradient(118deg,#cfe0ff4d 0%,#ffffff00 30%),linear-gradient(135deg,#3c78ff3d 0%,#1f4fe014 40%,#0f2fa80d 62%,#5b8cff33 100%);
        --glass-shadow:0 36px 64px -24px #000012d9,0 10px 28px #0010486b,0 0 40px -10px #1f5bff59,inset 0 0 0 1px #8fb2ff4d,inset 2px 2px 1.5px -1px #e6efffff,inset -2px -2px 1.5px -1px #9bbcff99,inset 0 0 36px #3c78ff24,inset 0 -18px 28px -18px #6e9bff52;
        --nav-scrolled:0 36px 64px -24px #000012f0,0 10px 28px #00104885,0 0 46px -8px #1f5bff80,inset 0 0 0 1px #8fb2ff66,inset 2px 2px 1.5px -1px #fff,inset -2px -2px 1.5px -1px #9bbcffb3,inset 0 0 36px #3c78ff2e;
        --small-bg:linear-gradient(118deg,#cfe0ff4d 0%,#ffffff00 44%),linear-gradient(135deg,#3c78ff47,#1f4fe01f 50%,#5b8cff38);
        --small-shadow:0 14px 26px -10px #000012b3,inset 0 0 0 1px #8fb2ff59,inset 2px 2px 1px -1px #e6efffff,inset -2px -2px 1px -1px #9bbcff8c,inset 0 0 16px #3c78ff2e;
        --small-hover:0 16px 30px -10px #000012c7,0 0 30px -6px #1f5bff80,inset 0 0 0 1px #a9c4ff80,inset 2px 2px 1px -1px #fff,inset -2px -2px 1px -1px #bcd0ff,inset 0 0 22px #3c78ff40;
        --inner-bg:linear-gradient(135deg,#3c78ff2e,#1f4fe012 55%,#5b8cff24);--inner-shadow:inset 0 0 0 1px #8fb2ff38,inset 1px 1px 1px -.5px #dbe7ffd9,inset 0 0 20px #3c78ff1a;
        --bf:blur(16px) saturate(200%) brightness(1.12);--bf-small:blur(14px) saturate(200%) brightness(1.12);--bf-lens:url(#dp-lens) blur(10px) saturate(200%) brightness(1.12);
        --pglow:#8fb2ff59;--sweep:#8fb2ff2e;--sweep-strong:#8fb2ff33;--h1-shadow:0 4px 60px #3c78ff80;
        --gt:linear-gradient(90deg,#6e9bff,#9d8cff,#ff8fab,#ffb27a,#9d8cff,#6e9bff);--gt-fx:drop-shadow(0 0 22px #4285f46b);
        --kicker-grad:linear-gradient(90deg,#8fb2ff,#b79cff,#ff8fab);
        --aura:radial-gradient(ellipse,#2f6bff59,#7b5cff26 50%,transparent 70%);
        --blob-bg:linear-gradient(135deg,#3c78ff47,#1f4fe014 46%,#5b8cff38);--blob-shadow:drop-shadow(0 26px 34px #000a30b3) drop-shadow(0 0 18px #2f6bff66);
        --ring:#8fb2ff66;--rim-1:#fff;--rim-2:#9bbcff;--rim-3:#5b8cff;--rim-4:#cfe0ff;--shield-shadow:0 30px 60px -16px #000020b3,0 0 70px #1f5bff80;
      }
      .dp-home[data-theme='light']{
        color-scheme:light;
        --bg-base:#f4f7ff;
        --page-bg:radial-gradient(900px 560px at 50% -8%,#cfdcff 0%,#eef3ff 58%,transparent 100%),radial-gradient(720px 520px at 108% 42%,#e4defd 0%,transparent 70%),radial-gradient(640px 480px at -8% 80%,#d4e5ff 0%,transparent 70%),linear-gradient(#ffffff,#eef3ff);
        --text:#0a1133;--mist:rgba(14,26,72,.74);--dim:rgba(14,26,72,.52);--accent:#2352e8;--accent-strong:#1f4fe0;--pos:#0a74a8;
        --line:#1f4fe024;--track:#1f4fe022;--chart-line:#1f4fe01f;--hover-bg:#1f4fe014;--grid-line:#1f4fe01c;
        --orb-a:#5b8cff;--orb-b:#a78bff;--orb-c:#6aa5ff;--orb-op:.3;--particle:#2f6bff;--particle-glow:#6e9bff99;--streak-glow:#4285f459;--smoke-k:.6;
        --fog-a:#5b8cff66;--fog-b:#8a9bff4d;--fog-c:#b79cff4d;
        --vignette:radial-gradient(ellipse at 50% 40%,transparent 62%,#1f4fe01a 100%);
        --glass-bg:linear-gradient(90deg,transparent,#4285f499 20%,#9b72cb99 42%,#d9657099 64%,#ffb27a80 82%,transparent) 50% 100% / 78% 2px no-repeat,linear-gradient(118deg,#ffffffe6 0%,#ffffff00 32%),linear-gradient(135deg,#ffffffa6 0%,#f1f5ffb3 40%,#e6eeffa6 62%,#ffffffb8 100%);
        --glass-shadow:0 30px 60px -24px #1f3a8c47,0 10px 28px #1f3a8c24,0 0 0 1px #1f4fe024,inset 0 0 0 1px #ffffffd9,inset 2px 2px 1.5px -1px #fff,inset -2px -2px 1.5px -1px #ffffffcc,inset 0 0 30px #ffffff80,inset 0 -18px 28px -18px #5b8cff2e;
        --nav-scrolled:0 30px 60px -24px #1f3a8c59,0 10px 28px #1f3a8c33,0 0 0 1px #1f4fe033,inset 0 0 0 1px #fff,inset 2px 2px 1.5px -1px #fff,inset -2px -2px 1.5px -1px #ffffffcc,inset 0 0 30px #ffffff99;
        --small-bg:linear-gradient(118deg,#ffffffe6 0%,#ffffff00 44%),linear-gradient(135deg,#ffffffb3,#e9efffb3 50%,#ffffffa6);
        --small-shadow:0 12px 24px -10px #1f3a8c4d,0 0 0 1px #1f4fe026,inset 0 0 0 1px #ffffffd9,inset 2px 2px 1px -1px #fff,inset -2px -2px 1px -1px #ffffffcc;
        --small-hover:0 16px 30px -10px #1f3a8c66,0 0 26px -6px #4285f480,0 0 0 1px #1f4fe040,inset 0 0 0 1px #fff,inset 2px 2px 1px -1px #fff,inset -2px -2px 1px -1px #ffffffcc;
        --inner-bg:linear-gradient(135deg,#ffffffbf,#eef3ffb3);--inner-shadow:0 6px 16px -8px #1f3a8c40,inset 0 0 0 1px #1f4fe01f,inset 1px 1px 1px -.5px #fff;
        --bf:blur(18px) saturate(175%) brightness(1.04);--bf-small:blur(16px) saturate(175%) brightness(1.04);--bf-lens:url(#dp-lens) blur(10px) saturate(175%) brightness(1.04);
        --pglow:#4285f433;--sweep:#ffffffb3;--sweep-strong:#ffffff99;--h1-shadow:none;
        --gt:linear-gradient(90deg,#2352e8,#6a4bff,#e0457b,#ff8a3d,#6a4bff,#2352e8);--gt-fx:none;
        --kicker-grad:linear-gradient(90deg,#2352e8,#6a4bff,#e0457b);
        --aura:radial-gradient(ellipse,#5b8cff40,#a78bff26 50%,transparent 70%);
        --blob-bg:linear-gradient(135deg,#ffffffb3,#e6eeff59 46%,#ffffff99);--blob-shadow:drop-shadow(0 22px 28px #1f3a8c4d) drop-shadow(0 0 16px #4285f466);
        --ring:#1f4fe040;--rim-1:#4a78ff;--rim-2:#9bbcff;--rim-3:#d3deff;--rim-4:#2352e8;--shield-shadow:0 30px 60px -16px #1f3a8c66,0 0 60px #4285f466;
      }
      .dp-home{font-family:'DM Sans',sans-serif;isolation:isolate;color:var(--text);background-color:var(--bg-base);background-image:var(--page-bg);-webkit-tap-highlight-color:transparent;transition:color .35s ease,background-color .35s ease}
      .dp-home *{box-sizing:border-box}.dp-home a{color:inherit;text-decoration:none}.dp-home button{font:inherit;cursor:pointer}
      .dp-muted{color:var(--dim)}.dp-pos{color:var(--accent)}

      /* ============ BACKGROUND: studio light, colour-shifting lines, bubbles, coloured smoke ============ */
      .dp-sparkle-field{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:-1}
      .dp-grid-glow{position:absolute;inset:0;background-image:linear-gradient(var(--grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--grid-line) 1px,transparent 1px);background-size:min(170px,22vw) min(170px,22vw);background-position:center top;mask-image:radial-gradient(ellipse at 50% 35%,#000 20%,transparent 85%);-webkit-mask-image:radial-gradient(ellipse at 50% 35%,#000 20%,transparent 85%);animation:dp-hue 22s ease-in-out infinite alternate}
      .dp-orb{position:absolute;border-radius:50%;background:var(--orb-a);filter:blur(120px);opacity:var(--orb-op);animation:dp-orb-float 18s ease-in-out infinite alternate}.dp-orb-one{width:520px;height:520px;top:-220px;left:12%}.dp-orb-two{width:440px;height:440px;top:28%;right:-230px;background:var(--orb-b);animation-delay:-5s}.dp-orb-three{width:480px;height:480px;top:64%;left:-260px;background:var(--orb-c);animation-delay:-9s}@keyframes dp-orb-float{to{transform:translate3d(65px,75px,0) scale(1.18)}}
      @keyframes dp-hue{from{filter:hue-rotate(-18deg)}to{filter:hue-rotate(105deg)}}
      .dp-streak{position:absolute;left:-25%;width:150%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent 0%,var(--g1) 22%,var(--g2) 46%,var(--g3) 70%,transparent 100%);box-shadow:0 0 22px 3px var(--streak-glow);opacity:0;transform:rotate(var(--rot)) translateX(-18%);animation:dp-streak 18s ease-in-out infinite,dp-hue 14s ease-in-out infinite alternate}
      @keyframes dp-streak{0%{opacity:0;transform:rotate(var(--rot)) translateX(-18%)}18%{opacity:.85}60%{opacity:.7}100%{opacity:0;transform:rotate(var(--rot)) translateX(18%)}}
      .dp-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:var(--particle);box-shadow:0 0 9px 2px var(--particle-glow);opacity:0;animation:dp-drift 16s linear infinite}
      @keyframes dp-drift{0%{transform:translate3d(0,40px,0) scale(.5);opacity:0}12%{opacity:.9}75%{opacity:.45}100%{transform:translate3d(28px,-210px,0) scale(1.2);opacity:0}}
      .dp-smoke{position:absolute;inset:0;overflow:hidden;animation:dp-hue 30s ease-in-out infinite alternate}
      .dp-fog{position:absolute;left:-10%;right:-10%;bottom:-9vh;height:52vh;background:radial-gradient(60% 100% at 18% 100%,var(--fog-a),transparent 70%),radial-gradient(55% 90% at 58% 100%,var(--fog-b),transparent 70%),radial-gradient(50% 80% at 96% 100%,var(--fog-c),transparent 70%);filter:blur(30px);animation:dp-fog 15s ease-in-out infinite alternate}
      @keyframes dp-fog{from{transform:translateX(-3%) scaleY(.94)}to{transform:translateX(3%) scaleY(1.14)}}
      .dp-puff{position:absolute;bottom:-28vh;left:var(--l);width:var(--s);height:var(--s);margin-left:calc(var(--s) / -2);border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(var(--c),.78),rgba(var(--c),.32) 40%,transparent 70%);filter:blur(42px);opacity:0;animation:dp-rise var(--d) linear infinite;animation-delay:var(--delay);will-change:transform,opacity}
      @keyframes dp-rise{0%{transform:translate3d(0,0,0) scale(.65);opacity:0}14%{opacity:calc(var(--o) * var(--smoke-k))}55%{transform:translate3d(calc(var(--x) * .6),-62vh,0) scale(1.2);opacity:calc(var(--o) * var(--smoke-k) * .8)}100%{transform:translate3d(var(--x),-130vh,0) scale(1.9);opacity:0}}
      .dp-vignette{position:absolute;inset:0;background:var(--vignette)}

      /* ============ LIQUID GLASS: tinted, bright rim, refraction, flowing colour light ============ */
      .dp-nav,.dp-dashboard,.dp-float-chip,.dp-feature-card,.dp-how-card,.dp-security-panel,.dp-cta,.dp-mobile-menu{border:0;background:var(--glass-bg);box-shadow:var(--glass-shadow);-webkit-backdrop-filter:var(--bf);backdrop-filter:var(--bf)}
      .dp-kicker,.dp-button-secondary,.dp-menu-button{border:0;background:var(--small-bg);box-shadow:var(--small-shadow);-webkit-backdrop-filter:var(--bf-small);backdrop-filter:var(--bf-small)}
      .dp-metric-card,.dp-chart-panel,.dp-activity-panel,.dp-date-pill,.dp-chart-period{border:0;background:var(--inner-bg);box-shadow:var(--inner-shadow)}
      /* Real refraction (Chrome / Edge / Android): grid lines bend through the glass. Other browsers keep the blur above. */
      @media (hover:hover) and (min-width:901px){
        .dp-nav,.dp-dashboard,.dp-float-chip,.dp-feature-card,.dp-cta,.dp-security-panel,.dp-blob-glass{-webkit-backdrop-filter:var(--bf-lens);backdrop-filter:var(--bf-lens)}
      }
      .dp-nav,.dp-dashboard,.dp-float-chip,.dp-feature-card,.dp-how-card,.dp-security-panel,.dp-cta,.dp-metric-card,.dp-chart-panel,.dp-activity-panel,.dp-button,.dp-menu-button,.dp-kicker{isolation:isolate}
      .dp-nav,.dp-how-card,.dp-security-panel,.dp-chart-panel,.dp-activity-panel,.dp-kicker,.dp-menu-button{position:relative}
      /* flowing Gemini-style colour light travelling around the glass edge */
      .dp-nav:before,.dp-dashboard:before,.dp-float-chip:before,.dp-feature-card:before,.dp-how-card:before,.dp-security-panel:before,.dp-cta:before,.dp-button-secondary:before,.dp-kicker:before,.dp-menu-button:before,.dp-mobile-menu:before{
        content:'';position:absolute;inset:0;border-radius:inherit;padding:var(--rim-w,1.6px);pointer-events:none;z-index:2;opacity:.95;
        background:conic-gradient(from var(--dp-angle),#0000 0%,var(--g1) 12%,var(--g2) 24%,var(--g3) 36%,#0000 48%,#0000 52%,#38b6ff 62%,var(--g2) 74%,var(--g4) 86%,#0000 100%);
        -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask-composite:exclude;
        animation:dp-orbit 7s linear infinite;animation-play-state:paused}
      .dp-nav:before,.dp-dashboard:before,.dp-float-chip:before,.dp-security-panel:before,.dp-cta:before,.dp-feature-card:hover:before,.dp-how-card:hover:before,.dp-button-secondary:hover:before,.dp-menu-button:hover:before{animation-play-state:running}
      .dp-kicker:before,.dp-float-chip:before,.dp-button-secondary:before,.dp-menu-button:before{--rim-w:1.3px}
      @keyframes dp-orbit{to{--dp-angle:360deg}}
      /* the light that follows the cursor, under the text */
      .dp-nav:after,.dp-dashboard:after,.dp-float-chip:after,.dp-feature-card:after,.dp-how-card:after,.dp-security-panel:after,.dp-cta:after,.dp-metric-card:after,.dp-chart-panel:after,.dp-activity-panel:after,.dp-button:after,.dp-menu-button:after{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(300px circle at var(--mx,50%) var(--my,-30%),var(--pglow),transparent 62%);opacity:0;transition:opacity .35s;pointer-events:none;z-index:-1}
      .dp-nav:hover:after,.dp-dashboard:hover:after,.dp-float-chip:hover:after,.dp-feature-card:hover:after,.dp-how-card:hover:after,.dp-security-panel:hover:after,.dp-cta:hover:after,.dp-metric-card:hover:after,.dp-chart-panel:hover:after,.dp-activity-panel:hover:after,.dp-button:hover:after,.dp-menu-button:hover:after{opacity:1}

      /* liquid glass capsule */
      .dp-blob{position:absolute;pointer-events:none;aspect-ratio:560 / 160;animation:dp-blob-float 9s ease-in-out infinite;transform:rotate(var(--r,0deg))}
      .dp-blob-glass{position:absolute;inset:0;clip-path:url(#dp-blob-clip);-webkit-clip-path:url(#dp-blob-clip);background:var(--blob-bg);-webkit-backdrop-filter:var(--bf);backdrop-filter:var(--bf)}
      .dp-blob-rim{position:absolute;inset:0;width:100%;height:100%;overflow:visible;filter:var(--blob-shadow)}
      @keyframes dp-blob-float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-16px) rotate(var(--r,0deg))}}
      .dp-blob-hero{right:-13%;bottom:-9%;width:min(430px,72%);z-index:3}
      .dp-blob-cta{left:50%;top:-8%;width:min(620px,92%);margin-left:min(-310px,-46%);opacity:.95;z-index:0}

      /* ============ NAV ============ */
      .dp-nav-shell{position:sticky;top:0;z-index:50;padding:max(14px,env(safe-area-inset-top)) 22px 0;pointer-events:none}
      .dp-nav{pointer-events:auto;max-width:1160px;margin:auto;min-height:70px;padding:9px 12px 9px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;border-radius:999px;transition:.35s}
      .dp-nav.is-scrolled{box-shadow:var(--nav-scrolled)}
      .dp-brand{display:flex;align-items:center;gap:11px;cursor:pointer;min-width:0}.dp-brand-mark{flex:none;height:42px;width:42px;border-radius:15px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#5b8cff,#1f4fe0 70%,#173bb8);box-shadow:0 8px 26px #1f5bff80,inset 0 0 0 1px #9bbcff80,inset 1px 1px 1px -.5px #fff;transition:transform .5s cubic-bezier(.34,1.56,.64,1)}.dp-brand:hover .dp-brand-mark{transform:rotate(-8deg) scale(1.1)}.dp-brand-name{font:800 17px Manrope,sans-serif;letter-spacing:-.6px;white-space:nowrap}.dp-brand-sub{display:block;color:var(--dim);font-size:9px;letter-spacing:1.7px;text-transform:uppercase;margin-top:2px;white-space:nowrap}
      .dp-nav-links{display:flex;align-items:center;gap:30px;color:var(--mist);font-size:13px;font-weight:600}.dp-nav-links a{position:relative;padding:9px 0;transition:color .25s}.dp-nav-links a:after{content:'';position:absolute;bottom:2px;left:0;width:0;height:2px;border-radius:2px;background:linear-gradient(90deg,var(--g1),var(--g2),var(--g3));transition:width .3s}.dp-nav-links a:hover{color:var(--text)}.dp-nav-links a:hover:after{width:100%}.dp-nav-actions{display:flex;align-items:center;gap:8px}

      /* ============ BUTTONS (pill, springy) ============ */
      .dp-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:50px;padding:0 26px;border-radius:999px;font-size:13px;font-weight:800;overflow:hidden;transition:transform .5s cubic-bezier(.34,1.56,.64,1),box-shadow .3s,background .3s}.dp-button:hover{transform:translateY(-3px) scale(1.035)}.dp-button:active{transform:scale(.94);transition-duration:.12s}
      .dp-button-primary{color:#fff;border:0;background:linear-gradient(180deg,#6a98ff 0%,#2f61ff 50%,#1b3fd8 100%);box-shadow:0 14px 38px #1f5bff8c,0 4px 12px #00001266,inset 0 1px #cfe0ff,inset 0 -10px 16px #0b1f8c80,inset 0 0 0 1px #a9c4ff99}.dp-button-primary:before{content:'';position:absolute;top:-80%;left:-35%;height:260%;width:24%;transform:rotate(24deg);background:#ffffff80;filter:blur(8px);transition:left .65s;pointer-events:none}.dp-button-primary:hover{box-shadow:0 18px 48px #1f5bffb3,0 4px 12px #00001266,inset 0 1px #e6efff,inset 0 -10px 16px #0b1f8c80,inset 0 0 0 1px #cfe0ff}.dp-button-primary:hover:before{left:125%}
      .dp-button-secondary{color:var(--text)}.dp-button-secondary:hover{box-shadow:var(--small-hover)}.dp-menu-button{display:none;width:46px;height:46px;border-radius:999px;color:var(--text);place-items:center;transition:transform .4s cubic-bezier(.34,1.56,.64,1)}.dp-menu-button:active{transform:scale(.9)}
      .dp-theme-button{display:grid;width:44px;height:44px}

      /* ============ HERO ============ */
      .dp-main{max-width:1160px;margin:auto;padding:0 24px;position:relative}.dp-hero{min-height:min(720px,100svh);padding:96px 0 80px;display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:44px}.dp-hero-copy{position:relative;z-index:2;min-width:0}
      .dp-kicker{display:inline-flex;align-items:center;gap:9px;padding:10px 16px;border-radius:999px;color:var(--text);font-size:11px;font-weight:800;letter-spacing:1.05px;text-transform:uppercase}.dp-kicker-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,var(--g1),var(--g2),var(--g3));box-shadow:0 0 14px #6e9bff;animation:dp-pulse 2s infinite}@keyframes dp-pulse{50%{box-shadow:0 0 3px #6e9bff;opacity:.6}}
      .dp-hero h1{font:800 clamp(42px,6vw,80px)/1.03 Manrope,sans-serif;letter-spacing:-.045em;margin:26px 0 22px;max-width:700px;color:var(--text);text-wrap:balance;text-shadow:var(--h1-shadow)}
      .dp-gradient-text{background:var(--gt);background-size:260% auto;background-clip:text;-webkit-background-clip:text;color:transparent;text-shadow:none;filter:var(--gt-fx);animation:dp-shimmer 8s linear infinite}@keyframes dp-shimmer{to{background-position:260% center}}
      .dp-hero-description{max-width:560px;color:var(--mist);font-size:clamp(15px,1.5vw,17px);line-height:1.8}.dp-hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}.dp-trust-row{display:flex;flex-wrap:wrap;gap:12px 20px;margin-top:28px;color:var(--mist);font-size:12px;font-weight:600}.dp-trust-row span{display:flex;align-items:center;gap:7px}.dp-trust-row svg{color:var(--accent)}.dp-hero-note{display:flex;align-items:center;gap:10px;margin-top:30px;color:var(--dim);font-size:11px}.dp-hero-note span{width:28px;height:2px;border-radius:2px;background:linear-gradient(90deg,var(--g1),var(--g3));flex:none}

      /* ============ DASHBOARD PREVIEW ============ */
      .dp-preview-wrap{position:relative;perspective:1400px;min-width:0;padding:30px 0}.dp-preview-aura{position:absolute;inset:6% -8%;border-radius:50%;background:var(--aura);filter:blur(30px);animation:dp-aura 6s ease-in-out infinite alternate}@keyframes dp-aura{to{transform:scale(1.1);opacity:.65}}
      .dp-dashboard{position:relative;z-index:2;padding:22px;border-radius:32px;transform-style:preserve-3d;transition:transform .22s ease-out;overflow:hidden}
      .dp-dashboard-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:16px;border-bottom:1px solid var(--line)}.dp-window-dot{width:9px;height:9px;border-radius:50%}.dp-preview-label{display:flex;align-items:center;gap:7px;color:var(--mist);font-size:11px;white-space:nowrap}.dp-live-dot{width:7px;height:7px;border-radius:50%;background:#6e9bff;box-shadow:0 0 12px #6e9bff}.dp-dashboard-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:22px 0 18px}.dp-eyebrow{color:var(--accent-strong);font-size:10px;font-weight:800;letter-spacing:1.7px}.dp-dashboard-heading h3{font:800 20px Manrope,sans-serif;margin-top:6px;letter-spacing:-.5px}.dp-dashboard-heading h3 span{color:var(--g2)}.dp-date-pill,.dp-chart-period{display:flex;align-items:center;gap:5px;border-radius:999px;padding:8px 12px;color:var(--mist);font-size:10px;white-space:nowrap}
      .dp-metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.dp-metric-card{position:relative;min-width:0;min-height:158px;padding:15px;border-radius:20px;overflow:hidden}.dp-metric-head{display:flex;justify-content:space-between;align-items:center;gap:6px;color:var(--mist);font-size:11px}.dp-metric-head svg{color:var(--accent);flex:none}.dp-metric-card strong{display:block;margin-top:14px;font:800 clamp(16px,1.9vw,24px) Manrope,sans-serif;letter-spacing:-.04em;white-space:nowrap;color:var(--text)}.dp-metric-card small{display:block;margin-top:6px;color:var(--dim);font-size:10px;line-height:1.35}.dp-positive{color:var(--pos)}.dp-blue{color:var(--accent)}.dp-mini-bars{height:28px;display:flex;align-items:flex-end;gap:3px;margin-top:12px}.dp-mini-bars i{flex:1;border-radius:3px 3px 1px 1px;background:linear-gradient(to top,#1f5bff,#9d8cff 70%,#ff8fab);box-shadow:0 0 10px #4285f470}.dp-stock-line{height:6px;border-radius:9px;background:var(--track);margin-top:16px;overflow:hidden}.dp-stock-line i{display:block;width:72%;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--g1),var(--g2),var(--g3));box-shadow:0 0 12px #6e9bff99}.dp-sparkline{height:34px;margin-top:8px}.dp-sparkline svg{width:100%;height:100%;overflow:visible}.dp-sparkline path{fill:none;stroke:url(#dp-gem);stroke-width:2.6;stroke-linecap:round;filter:drop-shadow(0 0 6px #6e9bffb3)}
      .dp-dashboard-bottom{display:grid;grid-template-columns:1.25fr .75fr;gap:10px;margin-top:10px}.dp-chart-panel,.dp-activity-panel{padding:16px;border-radius:20px;min-width:0}.dp-chart-period{padding:6px 10px}.dp-chart{height:116px;display:flex;gap:10px;margin-top:18px}.dp-chart-y{display:flex;flex-direction:column;justify-content:space-between;color:var(--dim);font-size:9px;padding-bottom:1px}.dp-chart-plot{position:relative;flex:1;display:flex;align-items:flex-end;justify-content:space-around;gap:5px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 28px,var(--chart-line) 29px)}.dp-chart-bar-wrap{height:100%;width:6%;display:flex;align-items:flex-end}.dp-chart-bar-wrap i{display:block;width:100%;border-radius:5px 5px 1px 1px;background:linear-gradient(to top,#1f5bff,#6e9bff 60%,#b79cff);box-shadow:0 0 14px #4285f48c;transform-origin:bottom;animation:dp-bar-in .8s cubic-bezier(.2,.8,.2,1) both}@keyframes dp-bar-in{from{transform:scaleY(.08);opacity:.2}to{transform:scaleY(1);opacity:1}}.dp-chart-x{display:flex;justify-content:space-between;color:var(--dim);font-size:9px;margin:8px 0 0 32px}
      .dp-activity-row{display:flex;align-items:center;gap:8px;padding:10px 0;border-top:1px solid var(--line)}.dp-activity-icon{width:28px;height:28px;border-radius:10px;display:grid;place-items:center;flex:none;background:linear-gradient(145deg,#6a98ff,#2352e8);box-shadow:0 4px 12px -3px #1f5bff80,inset 0 0 0 1px #9bbcff59,inset 1px 1px 1px -.5px #fff;color:#fff}.dp-activity-row p{font-size:10px;color:var(--text);white-space:nowrap;font-weight:600}.dp-activity-row small{display:block;font-size:9px;color:var(--dim);margin-top:3px}.dp-activity-row b{font-size:10px;color:var(--accent-strong);white-space:nowrap}.dp-dashboard-reflection{position:absolute;top:-80%;left:-50%;width:35%;height:260%;transform:rotate(28deg);background:linear-gradient(90deg,transparent,var(--sweep),transparent);animation:dp-reflect 9s ease-in-out infinite;pointer-events:none}@keyframes dp-reflect{0%,30%{left:-60%}70%,100%{left:140%}}
      .dp-float-chip{position:absolute;z-index:4;display:flex;align-items:center;gap:10px;padding:11px 18px 11px 12px;border-radius:999px;animation:dp-float 5s ease-in-out infinite}.dp-chip-left{left:-30px;bottom:6px}.dp-chip-right{right:-22px;top:4px;animation-delay:-2.4s}@keyframes dp-float{50%{transform:translateY(-10px)}}.dp-chip-icon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#5b8cff,#1f4fe0);box-shadow:0 6px 16px #1f5bff80,inset 0 0 0 1px #9bbcff80,inset 1px 1px 1px -.5px #fff}.dp-float-chip b{display:block;font-size:12px}.dp-float-chip small{display:block;color:var(--mist);font-size:10px;margin-top:2px}

      /* ============ SECTIONS ============ */
      .dp-section{padding:96px 0;position:relative}.dp-section-heading{text-align:center;max-width:700px;margin:0 auto 46px}.dp-section-kicker{background:var(--kicker-grad);background-clip:text;-webkit-background-clip:text;color:transparent;font-size:11px;font-weight:800;letter-spacing:2.2px;text-transform:uppercase}.dp-section-heading h2{font:800 clamp(30px,4.4vw,52px)/1.1 Manrope,sans-serif;letter-spacing:-.04em;margin:14px 0;text-wrap:balance}.dp-section-heading p{color:var(--mist);font-size:clamp(14px,1.4vw,16px);line-height:1.8}
      .dp-feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.dp-feature-card{position:relative;min-height:262px;padding:26px;border-radius:30px;overflow:hidden;transition:transform .55s cubic-bezier(.34,1.56,.64,1),box-shadow .4s}.dp-feature-card:hover{transform:translateY(-8px) scale(1.015)}.dp-feature-card:active{transform:scale(.985);transition-duration:.12s}.dp-feature-top{display:flex;align-items:center;justify-content:space-between}.dp-feature-icon{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#6a98ff,#2352e8 70%,#1a3bb8);box-shadow:0 10px 26px -6px #1f5bff99,inset 0 0 0 1px #a9c4ff80,inset 2px 2px 1px -1px #fff,inset -2px -2px 1px -1px #9bbcffa6;transition:transform .5s cubic-bezier(.34,1.56,.64,1)}.dp-feature-card:hover .dp-feature-icon{transform:translateY(-3px) rotate(-8deg) scale(1.1)}.dp-feature-number{font:800 12px Manrope,sans-serif;color:var(--dim)}.dp-feature-tag{display:inline-block;margin-top:24px;color:var(--accent-strong);font-size:10px;font-weight:800;letter-spacing:1.3px;text-transform:uppercase}.dp-feature-card h3{font:800 20px Manrope,sans-serif;letter-spacing:-.03em;margin-top:8px}.dp-feature-card p{max-width:320px;color:var(--mist);font-size:13px;line-height:1.7;margin-top:10px}.dp-feature-arrow{position:absolute;right:22px;bottom:22px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:var(--text);box-shadow:inset 0 0 0 1px var(--ring);transition:.35s}.dp-feature-card:hover .dp-feature-arrow{transform:translate(3px,-3px);background:var(--hover-bg)}.dp-feature-shine{position:absolute;z-index:-1;inset:-80% -30%;background:linear-gradient(110deg,transparent 42%,var(--sweep-strong) 50%,transparent 58%);transform:translateX(-60%) rotate(12deg);transition:transform .8s}.dp-feature-card:hover .dp-feature-shine{transform:translateX(55%) rotate(12deg)}
      .dp-how-section{position:relative}.dp-how-section:before,.dp-how-section:after{content:'';position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g1),var(--g2),var(--g3),var(--g1),transparent);background-size:220% 100%;opacity:.75;animation:dp-line 7s linear infinite}.dp-how-section:before{top:0}.dp-how-section:after{bottom:0;animation-direction:reverse}@keyframes dp-line{to{background-position:220% 0}}
      .dp-how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.dp-how-card{padding:28px 24px;border-radius:28px;transition:transform .5s cubic-bezier(.34,1.56,.64,1)}.dp-how-card:hover{transform:translateY(-6px)}.dp-step{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#6a98ff,#2352e8);box-shadow:0 8px 22px -6px #1f5bff99,inset 0 0 0 1px #a9c4ff80,inset 1px 1px 1px -.5px #fff;font:800 14px Manrope,sans-serif}.dp-how-card h3{font:800 18px Manrope,sans-serif;letter-spacing:-.02em;margin-top:20px}.dp-how-card p{color:var(--mist);font-size:13px;line-height:1.75;margin-top:8px}
      .dp-security-panel{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center;padding:46px;border-radius:40px;overflow:hidden}.dp-security-visual{min-height:230px;position:relative;display:grid;place-items:center}.dp-security-ring{position:absolute;width:220px;height:220px;border-radius:50%;border:1.5px solid var(--ring);animation:dp-spin 24s linear infinite}.dp-security-ring:before,.dp-security-ring:after{content:'';position:absolute;width:10px;height:10px;border-radius:50%;background:var(--g1);box-shadow:0 0 20px #4285f4;top:24px;left:33px}.dp-security-ring:after{top:auto;left:auto;bottom:24px;right:33px;background:var(--g3);box-shadow:0 0 20px #d96570}@keyframes dp-spin{to{transform:rotate(360deg)}}.dp-shield{width:116px;height:116px;display:grid;place-items:center;border-radius:36px;color:#fff;background:linear-gradient(145deg,#6a98ff,#2352e8 65%,#1a3bb8);box-shadow:var(--shield-shadow),inset 0 0 0 1px #a9c4ff80,inset 2px 2px 1.5px -1px #fff,inset -2px -2px 1.5px -1px #9bbcffa6;transform:rotate(-8deg);animation:dp-shield-float 5s ease-in-out infinite}@keyframes dp-shield-float{50%{transform:rotate(2deg) translateY(-9px)}}.dp-security-copy h2{font:800 clamp(27px,3.2vw,42px)/1.1 Manrope,sans-serif;letter-spacing:-.04em;margin:13px 0}.dp-security-copy p{color:var(--mist);font-size:14px;line-height:1.8}.dp-security-points{display:grid;gap:12px;margin-top:22px}.dp-security-points span{display:flex;gap:10px;align-items:center;color:var(--text);font-size:13px;font-weight:500}.dp-security-points svg{color:var(--accent);flex:none}
      .dp-cta{position:relative;text-align:center;padding:72px 26px;border-radius:44px;overflow:hidden}.dp-cta-icon{position:relative;width:58px;height:58px;border-radius:20px;margin:0 auto 20px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#6a98ff,#2352e8);box-shadow:0 10px 28px -6px #1f5bffa6,inset 0 0 0 1px #a9c4ff80,inset 2px 2px 1px -1px #fff}.dp-cta-icon svg{stroke:#fff}.dp-cta .dp-section-kicker{position:relative}.dp-cta h2{position:relative;font:800 clamp(30px,4.4vw,52px)/1.08 Manrope,sans-serif;letter-spacing:-.045em;margin-top:12px;text-wrap:balance}.dp-cta p{position:relative;max-width:500px;margin:14px auto 28px;color:var(--mist);font-size:15px;line-height:1.75}.dp-footer{position:relative;max-width:1160px;margin:0 auto;padding:28px 24px max(35px,env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid var(--line);color:var(--dim);font-size:11px}.dp-footer-links{display:flex;gap:22px}.dp-footer-links a:hover{color:var(--text)}
      .reveal{opacity:0;transform:translateY(24px);transition:opacity .75s ease,transform .75s cubic-bezier(.2,.8,.2,1)}.reveal.is-visible{opacity:1;transform:translateY(0)}

      /* theme picker inside the phone menu */
      .dp-theme-seg{display:flex;gap:6px;padding:6px;margin-top:6px;border-radius:999px;background:var(--hover-bg);box-shadow:inset 0 0 0 1px var(--line)}.dp-theme-seg button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;min-height:40px;border:0;border-radius:999px;background:transparent;color:var(--mist);font-size:13px;font-weight:700;transition:background .3s,color .3s,transform .3s cubic-bezier(.34,1.56,.64,1)}.dp-theme-seg button:active{transform:scale(.94)}.dp-theme-seg button.is-active{background:linear-gradient(180deg,#6a98ff,#2352e8);color:#fff;box-shadow:0 6px 16px -4px #1f5bff99,inset 0 1px #cfe0ff}

      /* ============ RESPONSIVE ============ */
      @media(max-width:1100px){.dp-hero{gap:30px}.dp-nav-links{gap:22px}.dp-chip-left{left:-10px}.dp-chip-right{right:-8px}}
      @media(max-width:960px){
        .dp-nav-links{display:none}.dp-menu-button{display:grid}
        .dp-mobile-menu{position:absolute;top:calc(100% + 10px);left:0;right:0;padding:12px;border-radius:30px;pointer-events:auto;animation:dp-menu-in .25s ease both}.dp-mobile-menu a{display:block;padding:15px 16px;border-radius:18px;color:var(--text);font-size:15px;font-weight:600}.dp-mobile-menu a:active,.dp-mobile-menu a:hover{background:var(--hover-bg)}
        .dp-hero{grid-template-columns:1fr;gap:20px;padding:76px 0 56px;min-height:0}.dp-hero-copy{text-align:center}.dp-hero h1,.dp-hero-description{margin-left:auto;margin-right:auto}.dp-hero-actions,.dp-trust-row,.dp-hero-note{justify-content:center}.dp-preview-wrap{max-width:700px;width:100%;margin:0 auto}
        .dp-feature-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dp-how-grid{grid-template-columns:repeat(3,1fr);gap:14px}.dp-security-panel{padding:34px;gap:20px}.dp-section{padding:76px 0}
        .dp-grid-glow{background-size:22vw 22vw}
      }
      @media(max-width:640px){
        .dp-nav-shell{padding:max(10px,env(safe-area-inset-top)) 12px 0}.dp-nav{min-height:62px;padding:8px 9px 8px 14px}.dp-brand-mark{width:38px;height:38px;border-radius:13px}.dp-brand-name{font-size:15px}.dp-brand-sub{display:none}.dp-nav-actions .dp-button-secondary,.dp-theme-button{display:none}.dp-nav-actions .dp-button{min-height:42px;padding:0 18px;font-size:12px}
        .dp-main{padding:0 16px}.dp-hero{padding:60px 0 44px;gap:14px}.dp-hero h1{font-size:clamp(38px,11.5vw,54px);letter-spacing:-.04em;margin:20px 0 16px}.dp-hero-description{font-size:15px}
        .dp-hero-actions{flex-direction:column;max-width:380px;margin:26px auto 0}.dp-button{width:100%;min-height:54px;font-size:14px}.dp-nav-actions .dp-button{width:auto}.dp-trust-row{gap:10px 16px;font-size:12px}
        .dp-preview-wrap{padding:22px 0 34px}.dp-dashboard{padding:14px;border-radius:26px}.dp-dashboard-top{padding-bottom:12px}.dp-window-dot{width:8px;height:8px}.dp-dashboard-top .text-xs{display:none}.dp-dashboard-heading{padding:16px 0 12px}.dp-dashboard-heading h3{font-size:16px}.dp-date-pill{display:none}
        .dp-metric-grid{gap:7px}.dp-metric-card{padding:11px;min-height:124px;border-radius:16px}.dp-metric-head{font-size:9px}.dp-metric-head svg{width:13px;height:13px}.dp-metric-card strong{font-size:clamp(12px,3.9vw,18px);margin-top:12px}.dp-metric-card small{font-size:9px}
        .dp-dashboard-bottom{grid-template-columns:1fr;gap:8px}.dp-chart-panel{padding:13px;border-radius:16px}.dp-chart{height:96px}.dp-activity-panel{display:none}
        .dp-float-chip{padding:8px 14px 8px 9px;gap:8px}.dp-chip-left{left:-4px;bottom:-4px}.dp-chip-right{right:-4px;top:-2px}.dp-chip-icon{width:28px;height:28px}.dp-chip-icon svg{width:14px;height:14px}.dp-float-chip b{font-size:11px}.dp-float-chip small{font-size:9px}
        .dp-blob-hero{right:-16%;bottom:-10%;width:68%}
        .dp-section{padding:60px 0}.dp-section-heading{margin-bottom:30px}.dp-feature-grid{grid-template-columns:1fr;gap:12px}.dp-feature-card{min-height:0;padding:22px;border-radius:26px}.dp-feature-card p{max-width:88%}.dp-feature-tag{margin-top:18px}
        .dp-how-grid{grid-template-columns:1fr;gap:12px}.dp-how-card{padding:22px}.dp-security-panel{grid-template-columns:1fr;padding:26px 20px;gap:6px;border-radius:30px}.dp-security-visual{min-height:180px;grid-row:1}.dp-security-ring{width:170px;height:170px}.dp-shield{width:92px;height:92px;border-radius:30px}.dp-security-copy{text-align:center}.dp-security-points{text-align:left;max-width:300px;margin:20px auto 0}
        .dp-cta{padding:52px 20px;border-radius:32px}.dp-blob-cta{top:-4%;width:120%;margin-left:-60%}.dp-footer{padding:24px 16px max(30px,env(safe-area-inset-bottom));flex-direction:column;text-align:center}.dp-footer-links{gap:16px;flex-wrap:wrap;justify-content:center}
        .dp-puff:nth-child(even){display:none}.dp-orb{display:none}.dp-streak:nth-of-type(n+3){display:none}
      }
      @media(max-width:400px){.dp-nav-actions .dp-button-primary{padding:0 14px}.dp-brand-name{font-size:14px}.dp-hero h1{font-size:36px}.dp-metric-card{padding:9px}.dp-metric-card strong{font-size:12px}.dp-metric-card small{font-size:8px}.dp-chip-right{display:none}}
      /* touch screens: no sticky hover lifts */
      @media(hover:none){.dp-button:hover,.dp-feature-card:hover,.dp-how-card:hover{transform:none}.dp-feature-card:hover .dp-feature-icon{transform:none}}
      @keyframes dp-menu-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      @media(prefers-reduced-motion:reduce){.dp-home *, .dp-home *:before,.dp-home *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none}}
    `}</style>

    <SparkleField />
    <header className="dp-nav-shell"><nav className={`dp-nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Main navigation">
      <button className="dp-brand bg-transparent border-0 text-left" onClick={() => navigate("/")} aria-label="Duka Poa home">
        <span className="dp-brand-mark"><ShoppingBag size={21} strokeWidth={2.4}/></span>
        <span><span className="dp-brand-name block">Duka Poa <span className="dp-pos">POS</span></span><span className="dp-brand-sub">Smart Retail Platform</span></span>
      </button>
      <div className="dp-nav-links">{navItems.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
      <div className="dp-nav-actions">
        <button type="button" className="dp-menu-button dp-theme-button" onClick={cycleMode} title={`Mandhari: ${MODE_LABEL[mode]}`} aria-label={`Badilisha mandhari. Sasa: ${MODE_LABEL[mode]}`}><ModeIcon size={19}/></button>
        <button className="dp-button dp-button-secondary" onClick={()=>navigate("/login")}>Ingia</button>
        <button className="dp-button dp-button-primary" onClick={()=>navigate("/register")}>Anza bure <ArrowRight size={15}/></button>
        <button className="dp-menu-button" onClick={()=>setMenuOpen(v=>!v)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen}>{menuOpen?<X size={19}/>:<Menu size={19}/>}</button>
      </div>
      {menuOpen&&<div className="dp-mobile-menu">{navItems.map(([label,href])=><a key={href} href={href} onClick={closeMenu}>{label}</a>)}<div className="dp-theme-seg" role="group" aria-label="Mandhari">{THEME_MODES.map((m)=>{const Icon=MODE_ICON[m];return <button type="button" key={m} className={mode===m?"is-active":""} onClick={()=>setMode(m)} aria-pressed={mode===m}><Icon size={15}/>{MODE_LABEL[m]}</button>;})}</div><a href="/login" onClick={e=>{e.preventDefault();closeMenu();navigate("/login")}}>Ingia kwenye akaunti</a><a href="/register" onClick={e=>{e.preventDefault();closeMenu();navigate("/register")}}>Fungua akaunti</a></div>}
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
        <GlassBlob className="dp-blob-cta" rotate={10} />
        <div className="dp-cta-icon"><Sparkles size={25}/></div><span className="dp-section-kicker">Hatua inayofuata inaanza hapa</span>
        <h2>Biashara yako. <span className="dp-gradient-text">Mpangilio mpya.</span></h2>
        <p>Anza kusimamia duka lako kwa muonekano ulio wazi zaidi. Fungua akaunti ya Duka Poa na ujenge msingi bora wa biashara yako.</p>
        <div className="relative flex justify-center"><Button onClick={()=>navigate("/register")}>Anza na Duka Poa</Button></div>
      </div></section>
    </main>

    <footer className="dp-footer">
      <div className="dp-brand"><span className="dp-brand-mark !w-8 !h-8 !rounded-xl"><ShoppingBag size={16}/></span><span><span className="dp-brand-name block !text-sm">Duka Poa <span className="dp-pos">POS</span></span><span className="dp-brand-sub">Smart Retail Platform</span></span></div>
      <span>© {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.</span>
      <div className="dp-footer-links"><a href="#features">Vipengele</a><a href="#security">Usalama</a><a href="/login" onClick={e=>{e.preventDefault();navigate("/login")}}>Ingia</a></div>
    </footer>
  </div>;
}

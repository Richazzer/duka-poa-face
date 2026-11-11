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

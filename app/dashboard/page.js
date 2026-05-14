"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getCurrentUser } from "../lib/api";

// ── Feature grid data ────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "📊", name: "Loan Tracker", href: "/loan-tracker" },
  { icon: "🛒", name: "Direct Market", href: "/market" },
  { icon: "🌧️", name: "Weather",      href: "/weather" },
  { icon: "🏛️", name: "Schemes",      href: "/schemes" },
  { icon: "🔬", name: "Crop Doctor",  href: "/crop-doctor" },
  { icon: "👥", name: "Community",    href: "/community" },
  { icon: "💸", name: "Debt Fund",    href: "/debt-fund" },
  { icon: "📈", name: "Analytics",    href: "/analytics" },
  { icon: "🎓", name: "Knowledge",    href: "/knowledge" },
  { icon: "🤖", name: "AI Chatbot",   href: "/chatbot" },
  { icon: "📶", name: "Offline Mode", href: "/offline" },
];

const SCHEME_NEWS = [
  ["🏅 PM-Kisan: Verified ✓", "Drone Subsidy: 80% Complete"],
  ["🗞️ Govt: 15% subsidy on Drones", "Apply before 31 May!"],
  ["🚜 PM-Kisan 16th installment", "Released — Check Status"],
  ["📅 2 Schemes deadline this week", "Apply Now!"],
];

const MANDI = [
  { crop: "Wheat",  price: "₹2450", h: 130, color: "linear-gradient(180deg,#2ed573,#00b894)" },
  { crop: "Paddy",  price: "₹1980", h: 100, color: "linear-gradient(180deg,#2ed573,#00b894)" },
  { crop: "Onion",  price: "₹1200", h: 75,  color: "linear-gradient(180deg,#ffa502,#ff6348)" },
  { crop: "Potato", price: "₹950",  h: 60,  color: "linear-gradient(180deg,#ff4757,#c0392b)" },
  { crop: "Maize",  price: "₹1820", h: 90,  color: "linear-gradient(180deg,#2ed573,#00b894)" },
];

const LOANS = [
  { name: "SBI Crop Loan",     pct: 65, color: "linear-gradient(90deg,#2ed573,#00b894)" },
  { name: "Cooperative Loan",  pct: 40, color: "linear-gradient(90deg,#ffa502,#ff6348)" },
  { name: "Moneylender Debt",  pct: 15, color: "linear-gradient(90deg,#ff4757,#c0392b)" },
];

// ── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target, duration = 1600) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let current = 0;
    const step = target / 80;
    const t = setInterval(() => {
      current = Math.min(current + step, target);
      setVal(Math.floor(current));
      if (current >= target) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [dark, setDark] = useState(false);
  const [clock, setClock] = useState("--:--:-- AM");
  const [greeting, setGreeting] = useState("Namaste, Farmer! 🙏");
  const [temp, setTemp] = useState("32°C ☀️");
  const [schemeIdx, setSchemeIdx] = useState(0);
  const [animate, setAnimate] = useState(false);

  const debt = useCounter(145000);
  const earn = useCounter(28500);

  // ── Clock & greeting ────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString());
      const h = now.getHours();
      const user = getCurrentUser();
      const name = "Farmer";
      const greet = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
      setGreeting(`${greet}, ${name}! 🙏`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Trigger chart animations after mount ────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 600);
    return () => clearTimeout(t);
  }, []);

  // ── Live weather ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const r = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`
        );
        const d = await r.json();
        const t = Math.round(d.current_weather.temperature);
        const icon = t > 35 ? "🔥" : t > 28 ? "☀️" : t > 20 ? "⛅" : "🌧️";
        setTemp(`${t}°C ${icon}`);
      } catch {}
    });
  }, []);

  // ── Scheme news rotation ────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setSchemeIdx((i) => (i + 1) % SCHEME_NEWS.length), 4000);
    return () => clearInterval(id);
  }, []);

  // ── Dark mode persistence ──────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem("brightness") === "dark") setDark(true);
  }, []);
  const toggleDark = () => {
    setDark((d) => {
      localStorage.setItem("brightness", d ? "light" : "dark");
      return !d;
    });
  };

  return (
    <div data-theme={dark ? "dark" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Poppins:wght@700;900&display=swap');
        :root{--glass:rgba(255,255,255,0.12);--glass-border:rgba(255,255,255,0.25);--neon-red:#ff4757;--neon-green:#2ed573;--neon-blue:#54a0ff;--neon-yellow:#ffa502}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;min-height:100vh;color:white}

        .dash-wrap{min-height:100vh;background:transparent;position:relative}
        [data-theme="dark"] .dash-wrap{filter:brightness(0.75) contrast(1.1)}

        /* TICKER */
        .ticker-bar{position:relative;z-index:10;background:rgba(6,78,59,0.9);backdrop-filter:blur(8px);border-bottom:1px solid rgba(46,213,115,0.3);padding:8px 0;overflow:hidden;white-space:nowrap}
        .ticker-inner{display:inline-block;animation:ticker 45s linear infinite;font-size:.78rem;font-weight:700;color:#2ed573;letter-spacing:.5px}
        @keyframes ticker{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}

        /* NAV */
        .page-nav{position:relative;z-index:10;background:rgba(6,78,59,0.85);backdrop-filter:blur(16px);padding:14px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);box-shadow:0 4px 30px rgba(0,0,0,0.2)}
        .logo{font-family:'Poppins',sans-serif;font-size:1.7rem;font-weight:900;color:white;letter-spacing:-1px}
        .logo span{color:#2ed573}
        .nav-right{display:flex;align-items:center;gap:12px}
        .moon-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;font-size:1.2rem;cursor:pointer;padding:8px 12px;border-radius:10px;transition:.3s}
        .moon-btn:hover{background:rgba(255,255,255,0.2)}
        .btn-profile{background:linear-gradient(135deg,#2ed573,#00b894);border:none;color:white;padding:9px 20px;border-radius:10px;font-weight:800;font-size:.82rem;cursor:pointer;transition:.3s;font-family:inherit}
        .btn-profile:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(46,213,115,0.4)}

        /* MAIN */
        .main{position:relative;z-index:5;padding:36px 40px 60px;max-width:1400px;margin:0 auto}

        /* HERO */
        .dash-hero{margin-bottom:32px}
        .hero-greeting{font-family:'Poppins',sans-serif;font-size:2.2rem;font-weight:900;line-height:1.2}
        .hero-sub{font-size:.9rem;color:rgba(255,255,255,0.7);margin-top:6px}
        .live-dot{display:inline-block;width:8px;height:8px;background:#2ed573;border-radius:50%;margin-right:6px;animation:pulse 1.5s infinite}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(46,213,115,0.6)}50%{box-shadow:0 0 0 8px rgba(46,213,115,0)}}

        /* STATS */
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px}
        .stat-card{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:22px;padding:24px;position:relative;overflow:hidden;animation:slideUp .8s cubic-bezier(.175,.885,.32,1.275) forwards,float 5s ease-in-out infinite;opacity:0}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:22px 22px 0 0}
        .stat-card.debt::before{background:var(--neon-red)}
        .stat-card.earn::before{background:var(--neon-green)}
        .stat-card.weather::before{background:var(--neon-blue)}
        .stat-card.schemes::before{background:var(--neon-yellow)}
        .stat-card:nth-child(1){animation-delay:.1s,.1s}
        .stat-card:nth-child(2){animation-delay:.2s,.2s}
        .stat-card:nth-child(3){animation-delay:.3s,.3s}
        .stat-card:nth-child(4){animation-delay:.4s,.4s}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .stat-card:hover{transform:scale(1.04)!important;box-shadow:0 20px 50px rgba(0,0,0,0.25);z-index:5}
        .stat-label{font-size:.68rem;font-weight:800;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
        .stat-val{font-family:'Poppins',sans-serif;font-size:2rem;font-weight:900;color:white;margin-bottom:12px}
        .stat-info{font-size:.65rem;font-weight:700;padding:6px 10px;border-radius:30px;display:inline-block;line-height:1.6}

        /* CHARTS */
        .charts-row{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
        .chart-card{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:22px;padding:28px}
        .chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .chart-title{font-family:'Poppins',sans-serif;font-size:1rem;font-weight:800;color:white}
        .chart-btn{font-size:.68rem;font-weight:700;color:#2ed573;background:rgba(46,213,115,0.1);border:1px solid rgba(46,213,115,0.3);border-radius:20px;padding:5px 12px;cursor:pointer;text-decoration:none}

        .progress-item{margin-bottom:18px}
        .progress-header{display:flex;justify-content:space-between;font-size:.8rem;font-weight:700;color:rgba(255,255,255,0.85);margin-bottom:7px}
        .progress-track{height:10px;background:rgba(255,255,255,0.1);border-radius:20px;overflow:hidden}
        .progress-fill{height:100%;border-radius:20px;transition:width 2.5s cubic-bezier(.1,.5,.1,1);position:relative;overflow:hidden}
        .progress-fill::after{content:'';position:absolute;top:0;left:-100%;right:0;bottom:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);animation:shimmer 2s infinite}
        @keyframes shimmer{to{left:100%}}

        .mandi-wrap{background:rgba(255,255,255,0.05);border-radius:16px;padding:20px}
        .mandi-bars{display:flex;align-items:flex-end;justify-content:space-around;height:150px}
        .mandi-bar-wrap{display:flex;flex-direction:column;align-items:center;gap:6px}
        .mandi-bar{width:36px;border-radius:8px 8px 0 0;transition:height 2s cubic-bezier(.175,.885,.32,1.275);cursor:pointer}
        .mandi-bar:hover{filter:brightness(1.3)}
        .mandi-price{font-size:.55rem;font-weight:800;color:rgba(255,255,255,0.7)}
        .mandi-label{font-size:.55rem;font-weight:700;color:rgba(255,255,255,0.6);text-align:center;width:40px}

        /* FEATURES */
        .features-title{font-family:'Poppins',sans-serif;font-size:1rem;font-weight:800;color:rgba(255,255,255,0.8);margin-bottom:16px;letter-spacing:1px;text-transform:uppercase}
        .feature-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}
        .feature-tile{background:var(--glass);backdrop-filter:blur(12px);border:1px solid var(--glass-border);border-radius:18px;padding:18px 10px;text-align:center;text-decoration:none;transition:.3s;position:relative;overflow:hidden;color:white}
        .feature-tile::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.08),transparent);opacity:0;transition:.3s}
        .feature-tile:hover{transform:translateY(-8px);border-color:rgba(46,213,115,0.5);box-shadow:0 15px 40px rgba(0,0,0,0.2)}
        .feature-tile:hover::after{opacity:1}
        .feature-icon{font-size:1.8rem;margin-bottom:8px;display:block}
        .feature-name{font-size:.62rem;font-weight:800;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:.8px}

        @media(max-width:1024px){.stats-row{grid-template-columns:repeat(2,1fr)}.feature-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:640px){.stats-row{grid-template-columns:1fr}.charts-row{grid-template-columns:1fr}.feature-grid{grid-template-columns:repeat(2,1fr)}.main{padding:20px 16px 40px}.page-nav{padding:14px 16px}}
      `}</style>

      <div className="dash-wrap">
        {/* ── TICKER ─────────────────────────────────────────────────────── */}
        <div className="ticker-bar">
          <div className="ticker-inner">
            🌾 WHEAT: ₹2,450/qtl (+2.1%) &nbsp;|&nbsp; 🍚 PADDY: ₹1,980/qtl (+1.5%) &nbsp;|&nbsp; 🧅 ONION: ₹1,200/qtl (-3.2%) &nbsp;|&nbsp; 🚜 PM-Kisan 16th Installment Released &nbsp;|&nbsp; 🌧️ Monsoon Forecast: Normal Rainfall Expected &nbsp;|&nbsp; 💰 Drone Subsidy: 80% Approved for Maharashtra &nbsp;|&nbsp; 🥔 POTATO: ₹950/qtl &nbsp;|&nbsp; 🌽 MAIZE: ₹1,820/qtl (+0.9%) &nbsp;|&nbsp;
          </div>
        </div>

        {/* ── NAV ────────────────────────────────────────────────────────── */}
        <nav className="page-nav">
          <div className="logo">🌱 Crop<span>IQ</span></div>
          <div className="nav-right">
            <button className="moon-btn" onClick={toggleDark}>{dark ? "☀️" : "🌙"}</button>
            <Link href="/farmer-orders"><button className="btn-profile" style={{ marginRight: '10px' }}>📦 My Orders</button></Link>
            <Link href="/profile"><button className="btn-profile">👤 My Profile</button></Link>
          </div>
        </nav>

        <div className="main">
          {/* ── HERO ───────────────────────────────────────────────────── */}
          <div className="dash-hero" translate="yes">
            <div className="hero-greeting">{greeting}</div>
            <div className="hero-sub">
              <span className="live-dot" /> Live Sync Active &nbsp;·&nbsp; <span>{clock}</span> &nbsp;·&nbsp; Real-Time Agricultural Command Center
            </div>
          </div>

          {/* ── STATS ──────────────────────────────────────────────────── */}
          <div className="stats-row">
            <div className="stat-card debt" translate="yes">
              <div className="stat-label">Total Debt · Financial Health</div>
              <div className="stat-val">₹{debt.toLocaleString("en-IN")}</div>
              <div className="stat-info" style={{ background: "rgba(255,71,87,0.15)", color: "#ff6b81" }}>
                ⚠️ Next EMI: ₹4,200 (14 May)<br />
                <span style={{ opacity: .8 }}>Interest Saved: ₹1,200 this month</span>
              </div>
            </div>
            <div className="stat-card earn" translate="yes">
              <div className="stat-label">Market Earnings · Live Trade</div>
              <div className="stat-val">₹{earn.toLocaleString("en-IN")}</div>
              <div className="stat-info" style={{ background: "rgba(46,213,115,0.15)", color: "#2ed573" }}>
                ✅ Active Bids: 3 &nbsp;|&nbsp; +14% Surge<br />
                <span style={{ opacity: .8 }}>Wheat sold at ₹2,450/qtl today</span>
              </div>
            </div>
            <div className="stat-card weather">
              <div className="stat-label">Precision Weather · Field Sync</div>
              <div className="stat-val">{temp}</div>
              <div className="stat-info" style={{ background: "rgba(84,160,255,0.15)", color: "#54a0ff" }}>
                💧 Moisture: 22% &nbsp;|&nbsp; Humidity: 65%<br />
                <span style={{ opacity: .8 }}>Wind: 12km/h &nbsp;·&nbsp; Rain in 48hrs</span>
              </div>
            </div>
            <div className="stat-card schemes">
              <div className="stat-label">Govt. Schemes · Verified</div>
              <div className="stat-val">4 <span style={{ fontSize: "1rem", fontWeight: 700 }}>Active</span></div>
              <div className="stat-info" style={{ background: "rgba(255,165,0,0.15)", color: "#ffa502" }}>
                {SCHEME_NEWS[schemeIdx][0]}<br />
                <span style={{ opacity: .8 }}>{SCHEME_NEWS[schemeIdx][1]}</span>
              </div>
            </div>
          </div>

          {/* ── CHARTS ─────────────────────────────────────────────────── */}
          <div className="charts-row">
            {/* Loan Progress */}
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">📊 Loan Repayment Progress</div>
                <Link href="/loan-tracker" className="chart-btn">View All →</Link>
              </div>
              {LOANS.map((l) => (
                <div className="progress-item" key={l.name}>
                  <div className="progress-header"><span>{l.name}</span><span>{l.pct}%</span></div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ background: l.color, width: animate ? `${l.pct}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Mandi Prices */}
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title">📈 Today&apos;s Mandi Prices</div>
                <Link href="/market" className="chart-btn">All Prices →</Link>
              </div>
              <div className="mandi-wrap">
                <div className="mandi-bars">
                  {MANDI.map((m) => (
                    <div className="mandi-bar-wrap" key={m.crop}>
                      <div className="mandi-price">{m.price}</div>
                      <div className="mandi-bar" style={{ background: m.color, height: animate ? `${m.h}px` : "0px" }} />
                      <div className="mandi-label">{m.crop}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── FEATURE GRID ───────────────────────────────────────────── */}
          <div className="features-title">⚡ Quick Access — All Features</div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <Link href={f.href} className="feature-tile" key={f.name} translate="yes">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-name">{f.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

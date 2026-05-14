"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { WMO, ICONS, DAYS, getCropAlerts, getCropImpacts } from "./weatherData";
import CropHealthScore from "../components/CropHealthScore";
import { WhatsAppShareBtn } from "../components/WhatsAppShare";

export default function WeatherPage() {
  const [w, setW] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loc, setLoc] = useState("🛰️ Detecting GPS...");
  const [locFull, setLocFull] = useState("📍 Fetching your location...");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));
    if (!navigator.geolocation) { load(19.076,72.877); return; }
    navigator.geolocation.getCurrentPosition(
      p => load(p.coords.latitude, p.coords.longitude),
      () => load(19.076, 72.877)
    );
  }, []);

  async function load(lat, lon) {
    try {
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        .then(r=>r.json()).then(gd=>{
          const locality = gd.locality||gd.city||"";
          const city = gd.city||gd.principalSubdivision||locality||"Your Location";
          const district = gd.localityInfo?.administrative?.[3]?.name||"";
          const state = gd.principalSubdivision||"";
          const parts = [locality,city,district,state].filter((v,i,a)=>v&&a.indexOf(v)===i);
          setLocFull("📍 "+parts.join(", "));
          setLoc("📍 "+(locality||city));
        }).catch(()=>{
          setLocFull(`📍 ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
          setLoc(`📍 ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`);
        });

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,weathercode,visibility,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;
      const res = await fetch(url);
      const d = await res.json();
      setW({
        temp: Math.round(d.current.temperature_2m),
        feels: Math.round(d.current.apparent_temperature),
        humidity: d.current.relative_humidity_2m,
        wind: Math.round(d.current.wind_speed_10m),
        rain: d.current.precipitation_probability,
        wcode: d.current.weathercode,
        uv: d.current.uv_index ? Math.round(d.current.uv_index) : 0,
        vis: d.current.visibility ? Math.round(d.current.visibility/1000) : "--",
      });
      setDaily(d.daily);
    } catch { setW(null); }
  }

  const alerts = w ? getCropAlerts(w.temp, w.rain, w.wind, w.humidity, w.uv) : [];
  const crops = w ? getCropImpacts(w.temp, w.rain, w.wind, w.humidity) : [];

  const Shimmer = ({h,mb=0}) => <div style={{height:h,marginBottom:mb,borderRadius:12,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:transparent;min-height:100vh;color:#111}
        .page-nav{position:relative;z-index:1;background:rgba(6,78,59,0.9);backdrop-filter:blur(10px);padding:14px 30px;display:flex;align-items:center;justify-content:space-between}
        .nav-logo{color:white;font-weight:900;font-size:1.4rem}
        .nav-back{color:rgba(255,255,255,0.8);text-decoration:none;font-size:.85rem;font-weight:600}
        .nav-back:hover{color:white}
        .loc-badge{color:white;font-size:.8rem;background:rgba(255,255,255,0.1);padding:6px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.2)}
        .wrap{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:30px 20px 60px}
        .page-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(46,213,115,0.2);border:1px solid rgba(46,213,115,0.5);color:#2ed573;padding:6px 16px;border-radius:30px;font-size:.75rem;font-weight:800;margin-bottom:12px}
        .live-dot{width:8px;height:8px;background:#2ed573;border-radius:50%;animation:pulse 1.5s infinite}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(46,213,115,0.6)}50%{box-shadow:0 0 0 6px rgba(46,213,115,0)}}
        h1{font-size:2.2rem;font-weight:900;color:#fff;margin-bottom:8px;text-shadow:0 2px 20px rgba(0,0,0,0.5),0 0 40px rgba(46,213,115,0.3)}
        .sub{color:rgba(255,255,255,0.85);font-size:.95rem;margin-bottom:28px;text-shadow:0 1px 8px rgba(0,0,0,0.5);font-weight:500}
        .weather-hero{background:linear-gradient(135deg,#1d4ed8,#3b82f6,#06b6d4);border-radius:24px;padding:36px;color:white;margin-bottom:24px;box-shadow:0 15px 45px rgba(29,78,216,0.25);position:relative;overflow:hidden}
        .weather-hero::before{content:'';position:absolute;top:-80px;right:-80px;width:300px;height:300px;background:radial-gradient(circle,rgba(255,255,255,0.15),transparent 70%);border-radius:50%}
        .weather-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;position:relative;z-index:1}
        .temp-big{font-size:5.5rem;font-weight:900;line-height:1;letter-spacing:-3px}
        .cond-row{display:flex;align-items:center;gap:10px;font-size:1.4rem;font-weight:700;margin-top:10px}
        .location-text{font-size:.85rem;opacity:.8;margin-top:6px}
        .weather-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .w-stat{background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border-radius:14px;padding:16px;text-align:center;border:1px solid rgba(255,255,255,0.2)}
        .w-stat-label{font-size:.65rem;font-weight:800;opacity:.75;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
        .w-stat-val{font-size:1.4rem;font-weight:900}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}
        .card{background:white;border-radius:20px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e5e7eb}
        .card-title{font-size:1rem;font-weight:800;color:#064e3b;margin-bottom:18px;display:flex;align-items:center;gap:8px}
        .forecast-row{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:12px;margin-bottom:8px;background:#f9fafb;transition:.2s}
        .forecast-row:hover{background:#f0fdf4;transform:translateX(4px)}
        .f-day{font-weight:700;font-size:.85rem;color:#374151;width:80px}
        .f-icon{font-size:1.4rem}
        .f-cond{font-size:.78rem;color:#6b7280;font-weight:600;flex:1;text-align:center}
        .f-temp{font-weight:800;font-size:.95rem;color:#111827}
        .f-rain{font-size:.7rem;color:#9ca3af;margin-right:6px}
        .alert-item{padding:16px;border-radius:14px;margin-bottom:14px;border:1px solid transparent}
        .alert-high{background:#fff7ed;border-color:#ffedd5;border-left:5px solid #f97316}
        .alert-med{background:#fefce8;border-color:#fef9c3;border-left:5px solid #eab308}
        .alert-good{background:#f0fdf4;border-color:#dcfce7;border-left:5px solid #22c55e}
        .alert-title{font-weight:800;font-size:.9rem;margin-bottom:6px}
        .alert-body{font-size:.8rem;color:#4b5563;line-height:1.5}
        .alert-action{font-size:.75rem;font-weight:700;margin-top:8px;color:#064e3b;background:white;padding:6px 12px;border-radius:8px;display:inline-block}
        .alert-crops{font-size:.72rem;font-weight:800;color:#4b5563;margin:6px 0;padding:4px 10px;background:rgba(0,0,0,0.04);border-radius:8px}
        .alert-fert{margin-top:8px;padding:8px 12px;background:rgba(16,185,129,0.08);border-radius:8px;font-size:.72rem;font-weight:700;color:#065f46;border-left:3px solid #10b981}
        .crop-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-top:24px}
        .crop-card{background:white;border-radius:18px;padding:18px;border:1px solid #e5e7eb;box-shadow:0 2px 10px rgba(0,0,0,0.05);transition:.2s}
        .crop-card:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,0,0,0.1)}
        .crop-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .crop-name{font-size:.95rem;font-weight:800;color:#111827}
        .crop-status{font-size:.6rem;font-weight:800;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px}
        .status-safe{background:#dcfce7;color:#166534}
        .status-warn{background:#fef9c3;color:#854d0e}
        .status-risk{background:#fee2e2;color:#991b1b}
        .crop-impact{font-size:.75rem;color:#4b5563;line-height:1.5;margin-bottom:8px}
        .crop-rec{font-size:.7rem;font-weight:700;color:#065f46;background:#f0fdf4;padding:6px 10px;border-radius:8px;border-left:3px solid #10b981}
        .ai-tag{font-size:.6rem;background:#f0fdf4;color:#064e3b;padding:3px 8px;border-radius:20px;font-weight:800}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media(max-width:700px){.grid2{grid-template-columns:1fr}.weather-stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      <nav className="page-nav">
        <Link href="/dashboard" className="nav-back">← Dashboard</Link>
        <span className="nav-logo">🌱 CropIQ</span>
        <span className="loc-badge">{loc}</span>
      </nav>

      <div className="wrap">
        <div className="page-badge"><div className="live-dot" /> LIVE WEATHER · GPS SYNCED</div>
        <h1>🌦️ Weather &amp; Crop Impact</h1>
        <p className="sub">Real-time hyper-local weather mapped to your crops. Get AI-powered alerts to protect your harvest.</p>

        {/* MAIN WEATHER CARD */}
        <div className="weather-hero">
          <div className="weather-top">
            <div>
              <div className="temp-big">{w ? `${w.temp}°C` : <Shimmer h={80} />}</div>
              <div className="cond-row">
                <span>{w ? (ICONS[w.wcode]||"🌡️") : "🌡️"}</span>
                <span>{w ? (WMO[w.wcode]||"Clear") : "Loading weather..."}</span>
              </div>
              <div className="location-text">{locFull}</div>
              <div style={{fontSize:".8rem",opacity:.7,marginTop:4}}>{dateStr}</div>
            </div>
            <div className="weather-stats">
              <div className="w-stat"><div className="w-stat-label">Humidity</div><div className="w-stat-val">{w?`${w.humidity}%`:"--%"}</div></div>
              <div className="w-stat"><div className="w-stat-label">Wind</div><div className="w-stat-val">{w?`${w.wind} km/h`:"-- km/h"}</div></div>
              <div className="w-stat"><div className="w-stat-label">Rain</div><div className="w-stat-val">{w?`${w.rain}%`:"--%"}</div></div>
              <div className="w-stat"><div className="w-stat-label">UV Index</div><div className="w-stat-val">{w?w.uv:"--"}</div></div>
              <div className="w-stat"><div className="w-stat-label">Visibility</div><div className="w-stat-val">{w?`${w.vis} km`:"-- km"}</div></div>
              <div className="w-stat"><div className="w-stat-label">Feels Like</div><div className="w-stat-val">{w?`${w.feels}°C`:"--°C"}</div></div>
            </div>
          </div>
          {/* HEALTH SCORE */}
          {w && (
            <div style={{marginTop:20,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.15)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,position:"relative",zIndex:1}}>
              <CropHealthScore data={{temp:w.temp,rain:w.rain,humidity:w.humidity,pestRisk:"low",priceUp:true}} size="sm" />
              <WhatsAppShareBtn text={`🌦️ CropIQ Weather Update:\nTemp: ${w.temp}°C | Humidity: ${w.humidity}% | Rain: ${w.rain}% | Wind: ${w.wind} km/h\n\nStay informed with CropIQ!`} label="Share Weather" style={{background:"rgba(37,211,102,0.2)",border:"1px solid rgba(37,211,102,0.4)",backdropFilter:"blur(8px)"}} />
            </div>
          )}
        </div>

        <div className="grid2">
          {/* 7-DAY FORECAST */}
          <div className="card">
            <div className="card-title">📅 7-Day Forecast</div>
            {!daily ? [1,2,3,4,5].map(i=><Shimmer key={i} h={40} mb={10} />) : daily.time.map((date,i)=>{
              const d2 = new Date(date);
              const label = i===0?"Today":i===1?"Tomorrow":DAYS[d2.getDay()];
              const wc = i===0?w.wcode:daily.weathercode[i];
              const hi = Math.round(daily.temperature_2m_max[i]);
              const lo = Math.round(daily.temperature_2m_min[i]);
              const rp = daily.precipitation_probability_max[i];
              return (
                <div className="forecast-row" key={date}>
                  <span className="f-day">{label}</span>
                  <span className="f-icon">{ICONS[wc]||"⛅"}</span>
                  <span className="f-cond">{WMO[wc]||"Clear"}</span>
                  <span className="f-rain">💧{rp}%</span>
                  <span className="f-temp">
                    {i===0 ? <><span style={{color:"#064e3b",fontWeight:900}}>{w.temp}°C</span> <span style={{color:"#9ca3af",fontWeight:500,fontSize:".75rem"}}>Now</span></> : <>{hi}° <span style={{color:"#9ca3af",fontWeight:500,fontSize:".8rem"}}>/{lo}°</span></>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CROP ALERTS */}
          <div className="card">
            <div className="card-title">⚠️ Crop Impact Alerts <span className="ai-tag">AI ACTIVE</span></div>
            {alerts.length===0 ? [1,2,3].map(i=><Shimmer key={i} h={80} mb={12} />) : alerts.map((a,i)=>(
              <div key={i} className={`alert-item ${a.type==="high"?"alert-high":a.type==="med"?"alert-med":"alert-good"}`}>
                <div className="alert-title">{a.title}</div>
                <div className="alert-crops">🌿 Affected Crops: {a.crops}</div>
                <div className="alert-body">{a.body}</div>
                <div className="alert-fert">🧪 Fertilizer/Spray: {a.fertilizer}</div>
                <div className="alert-action">💡 Action: {a.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PER-CROP IMPACT */}
        <div className="card" style={{marginTop:24}}>
          <div className="card-title">🌾 Per-Crop Weather Impact — Today&apos;s Analysis <span className="ai-tag">LIVE</span></div>
          <div className="crop-grid">
            {crops.length===0 ? [1,2,3,4,5].map(i=><Shimmer key={i} h={140} />) : crops.map((c,i)=>(
              <div key={i} className="crop-card">
                <div className="crop-card-head">
                  <div><div style={{fontSize:"1.6rem"}}>{c.emoji}</div><div className="crop-name">{c.name}</div></div>
                  <span className={`crop-status ${c.status==="risk"?"status-risk":c.status==="warn"?"status-warn":"status-safe"}`}>
                    {c.status==="risk"?"⚠️ At Risk":c.status==="warn"?"⚡ Caution":"✅ Safe"}
                  </span>
                </div>
                <div className="crop-impact">{c.impact}</div>
                <div className="crop-rec">🧪 {c.rec}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const CROPS = ["wheat","paddy","tomato","cotton","sugarcane","maize","onion","potato"];
const SOILS = ["sandy","loamy","clay","black cotton"];

export default function IrrigationPage() {
  const [crop, setCrop] = useState("wheat");
  const [soil, setSoil] = useState("loamy");
  const [land, setLand] = useState("2");
  const [weather, setWeather] = useState({ temp: 32, humidity: 55, rainProb: 20 });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,relative_humidity_2m,precipitation_probability`);
          const d = await r.json();
          setWeather({ temp: Math.round(d.current.temperature_2m), humidity: d.current.relative_humidity_2m, rainProb: d.current.precipitation_probability || 0 });
        } catch {}
      });
    }
  }, []);

  async function calculate() {
    setLoading(true);
    try {
      const res = await fetch("/api/irrigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, soilType: soil, landArea: parseFloat(land), ...weather, growthStage: stage }),
      });
      setData(await res.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => { calculate(); }, [crop, soil, land, stage]);

  const statusColor = (s) => s === "rain" ? "#3b82f6" : s === "water" ? "#f59e0b" : "#22c55e";
  const statusIcon = (s) => s === "rain" ? "🌧️" : s === "water" ? "💧" : "✅";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(6,78,59,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .back{color:rgba(255,255,255,0.8);text-decoration:none;font-weight:600;font-size:.9rem}.back:hover{color:white}
        .logo{color:white;text-decoration:none;font-weight:900;font-size:1.3rem}
        .header{background:linear-gradient(135deg,#0c4a6e,#0369a1,#0284c7);padding:56px 24px;color:white;text-align:center;position:relative;overflow:hidden}
        .header::before{content:'';position:absolute;bottom:-40px;left:50%;transform:translateX(-50%);width:600px;height:300px;background:radial-gradient(ellipse,rgba(56,189,248,0.2),transparent 70%);border-radius:50%}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(56,189,248,0.2);border:1px solid rgba(56,189,248,0.4);padding:8px 18px;border-radius:999px;font-size:.75rem;font-weight:800;margin-bottom:16px;color:#7dd3fc}
        .header h1{font-size:2.2rem;font-weight:900;margin-bottom:10px;position:relative;z-index:1}
        .header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto;position:relative;z-index:1}
        .body{max-width:1200px;margin:0 auto;padding:32px 20px 60px}
        .grid-layout{display:grid;grid-template-columns:320px 1fr;gap:28px}
        .sidebar{position:sticky;top:80px;align-self:start}
        .card{background:white;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06)}
        .card-title{font-size:1.05rem;font-weight:900;color:#0c4a6e;margin-bottom:16px}
        .form-group{margin-bottom:16px}.form-label{display:block;font-size:.78rem;font-weight:700;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
        .form-select,.form-input{width:100%;padding:10px 14px;border:2px solid #e5e7eb;border-radius:10px;font-size:.88rem;font-family:inherit;outline:none;transition:.2s}
        .form-select:focus,.form-input:focus{border-color:#0ea5e9}
        .weather-bar{background:linear-gradient(135deg,#1e293b,#334155);border-radius:12px;padding:14px;display:flex;justify-content:space-around;color:white;margin-bottom:16px}
        .w-item{text-align:center}.w-val{font-size:1.2rem;font-weight:900}.w-lbl{font-size:.65rem;opacity:.7;font-weight:600}
        .kpi-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
        .kpi{background:white;border-radius:16px;padding:22px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06);text-align:center}
        .kpi-icon{font-size:2rem;margin-bottom:8px}
        .kpi-val{font-size:1.6rem;font-weight:900;color:#0c4a6e}
        .kpi-lbl{font-size:.72rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;margin-top:4px}
        .schedule{margin-top:24px}
        .sched-day{display:flex;align-items:center;gap:16px;padding:16px;border-radius:14px;margin-bottom:10px;background:#f9fafb;border:1px solid #f3f4f6;transition:.2s}
        .sched-day:hover{background:#f0f9ff;border-color:#bae6fd;transform:translateX(4px)}
        .sched-icon{font-size:1.6rem;width:44px;text-align:center}
        .sched-info{flex:1}
        .sched-date{font-size:.88rem;font-weight:800;color:#111827}
        .sched-detail{font-size:.78rem;color:#6b7280;font-weight:600;margin-top:2px}
        .sched-amt{font-size:.88rem;font-weight:900;min-width:80px;text-align:right}
        .risk-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px}
        .risk-card{padding:20px;border-radius:14px;border:1px solid}
        .risk-low{background:#f0fdf4;border-color:#bbf7d0;color:#166534}
        .risk-med{background:#fefce8;border-color:#fef08a;color:#854d0e}
        .risk-high{background:#fef2f2;border-color:#fecaca;color:#991b1b}
        .risk-title{font-size:.78rem;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
        .risk-val{font-size:1.4rem;font-weight:900}
        .ai-box{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:14px;padding:22px;margin-top:24px}
        .ai-box h4{font-size:.88rem;font-weight:800;color:#0c4a6e;margin-bottom:8px}
        .ai-box p{font-size:.85rem;color:#075985;line-height:1.7}
        .stage-bar{display:flex;gap:2px;margin-top:8px}
        .stage-btn{flex:1;padding:8px 4px;border:none;border-radius:8px;font-size:.65rem;font-weight:700;cursor:pointer;background:#f3f4f6;color:#6b7280;transition:.2s;font-family:inherit}
        .stage-btn.active{background:#0ea5e9;color:white}
        @media(max-width:768px){.grid-layout{grid-template-columns:1fr}.kpi-row{grid-template-columns:1fr}.risk-row{grid-template-columns:1fr}}
      `}</style>

      <nav className="nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <div/>
      </nav>

      <div className="header">
        <div className="badge">💧 Smart Water Management</div>
        <h1>Irrigation Advisor</h1>
        <p>AI-powered irrigation scheduling based on real-time weather, soil type, and crop growth stage.</p>
      </div>

      <div className="body">
        <div className="grid-layout">
          <div>
            <div className="card sidebar">
              <div className="card-title">⚙️ Settings</div>
              <div className="weather-bar">
                <div className="w-item"><div className="w-val">{weather.temp}°</div><div className="w-lbl">TEMP</div></div>
                <div className="w-item"><div className="w-val">{weather.humidity}%</div><div className="w-lbl">HUMIDITY</div></div>
                <div className="w-item"><div className="w-val">{weather.rainProb}%</div><div className="w-lbl">RAIN</div></div>
              </div>
              <div className="form-group">
                <label className="form-label">Crop</label>
                <select className="form-select" value={crop} onChange={e=>{setCrop(e.target.value);setStage(0)}}>{CROPS.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}</select>
              </div>
              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select className="form-select" value={soil} onChange={e=>setSoil(e.target.value)}>{SOILS.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select>
              </div>
              <div className="form-group">
                <label className="form-label">Land Area (acres)</label>
                <input className="form-input" type="number" value={land} onChange={e=>setLand(e.target.value)} min="0.5" step="0.5" />
              </div>
              {data?.stages && (
                <div className="form-group">
                  <label className="form-label">Growth Stage</label>
                  <div className="stage-bar">
                    {data.stages.map((s,i)=>(<button key={i} className={`stage-btn ${stage===i?"active":""}`} onClick={()=>setStage(i)}>{s}</button>))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            {data && !loading && (
              <>
                <div className="kpi-row">
                  <div className="kpi"><div className="kpi-icon">💧</div><div className="kpi-val">{data.dailyWater?.toLocaleString()}</div><div className="kpi-lbl">Litres / Day</div></div>
                  <div className="kpi"><div className="kpi-icon">📅</div><div className="kpi-val">{data.weeklyTotal?.toLocaleString()}</div><div className="kpi-lbl">Weekly Total (L)</div></div>
                  <div className="kpi"><div className="kpi-icon">⏰</div><div className="kpi-val" style={{fontSize:"1rem"}}>{data.optimalTime?.split("(")[0]}</div><div className="kpi-lbl">Best Time</div></div>
                </div>

                <div className="card">
                  <div className="card-title">📅 7-Day Irrigation Schedule</div>
                  <div style={{fontSize:".78rem",color:"#6b7280",marginBottom:16,fontWeight:600}}>Method: <strong style={{color:"#0c4a6e"}}>{data.method}</strong> {data.savings && <span style={{color:"#10b981"}}>· {data.savings}</span>}</div>
                  <div className="schedule">
                    {data.schedule?.map((d, i) => (
                      <div key={i} className="sched-day">
                        <div className="sched-icon">{statusIcon(d.status)}</div>
                        <div className="sched-info">
                          <div className="sched-date">{d.date}</div>
                          <div className="sched-detail">
                            {d.status === "rain" ? `Rain expected (${d.rainChance}% chance) — Skip watering` :
                             d.status === "water" ? `Water needed — Rain chance ${d.rainChance}%` :
                             "Adequate moisture — Monitor only"}
                          </div>
                        </div>
                        <div className="sched-amt" style={{color: statusColor(d.status)}}>
                          {d.amount > 0 ? `${d.amount.toLocaleString()} L` : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="risk-row">
                  <div className={`risk-card risk-${data.droughtRisk?.toLowerCase()}`}>
                    <div className="risk-title">🏜️ Drought Risk</div>
                    <div className="risk-val">{data.droughtRisk}</div>
                  </div>
                  <div className={`risk-card risk-${data.waterlogRisk?.toLowerCase()}`}>
                    <div className="risk-title">🌊 Waterlogging Risk</div>
                    <div className="risk-val">{data.waterlogRisk}</div>
                  </div>
                </div>

                <div className="ai-box">
                  <h4>🤖 AI Irrigation Advice</h4>
                  <p>{data.aiAdvice}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

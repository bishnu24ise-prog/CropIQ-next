"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Script from "next/script";
import { crops, mandiVariations, regionalData, cropOptions, mandiOptions } from "./analyticsData";

export default function AnalyticsPage() {
  const [crop, setCrop] = useState("wheat");
  const [mandi, setMandi] = useState("pune");
  const [unit, setUnit] = useState("Q");
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const cropBase = crops[crop] || crops.wheat;
  const variation = mandiVariations[mandi] || { region: "west", var: 1.0 };
  const currentPrice = cropBase.base * variation.var;
  const predictedPrice = currentPrice * cropBase.trendFactor;
  const trendPct = ((cropBase.trendFactor - 1) * 100).toFixed(1);

  const fmt = (val) => {
    const p = unit === "Q" ? val : val / 100;
    return p.toLocaleString(undefined, { minimumFractionDigits: unit === "KG" ? 2 : 0 });
  };
  const unitLabel = unit === "Q" ? "/ q" : "/ kg";

  const signal = trendPct > 5 ? { cls: "signal-buy", text: "STRONG BUY / HOLD" } : trendPct < -2 ? { cls: "signal-sell", text: "SELL SOON" } : { cls: "signal-hold", text: "NEUTRAL / HOLD" };

  const cropLabel = useMemo(() => {
    for (const g of cropOptions) for (const i of g.items) if (i.v === crop) return i.l;
    return crop;
  }, [crop]);

  const nearbyMandis = useMemo(() => {
    const region = regionalData[variation.region] || regionalData.west;
    return region.map(m => ({ ...m, price: currentPrice * (0.95 + Math.random() * 0.1) })).sort((a, b) => b.price - a.price);
  }, [crop, mandi, unit]);

  // Chart.js rendering
  useEffect(() => {
    if (!chartReady || !chartRef.current) return;
    const Chart = window.Chart;
    if (!Chart) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const data = [0.94, 0.96, 0.98, 0.97, 0.99, 1.0].map(m => unit === "Q" ? currentPrice * m : (currentPrice * m) / 100);
    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "line",
      data: { labels: ["Jan","Feb","Mar","Apr","May","Jun"], datasets: [{ label: "Price", data, borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.1)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#10b981" }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#f1f5f9" } }, x: { grid: { display: false } } } }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [chartReady, crop, mandi, unit]);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" onReady={() => setChartReady(true)} />
      <style>{`
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-800:#065f46;--green-900:#064e3b;--red-500:#ef4444;--gold-500:#f59e0b;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-200:#e5e7eb;--gray-500:#6b7280;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08)}
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
        .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
        .page-header{padding:50px 20px;color:white;text-align:center}
        .badge{display:inline-block;padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;margin-bottom:12px}
        .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
        .page-header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
        .page-body{max-width:1200px;margin:0 auto;padding:32px 20px 60px}
        .analytics-grid{display:grid;grid-template-columns:320px 1fr;gap:24px}
        .sidebar{position:sticky;top:80px;align-self:start}
        .card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06)}
        .sidebar-title{font-size:1.1rem;font-weight:800;color:var(--green-900);margin-bottom:12px}
        .form-group{margin-bottom:16px}.form-label{display:block;font-size:.85rem;font-weight:600;color:var(--gray-700);margin-bottom:6px}
        .form-select{width:100%;padding:10px 14px;border:1px solid var(--gray-200);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit}
        .form-select optgroup{font-weight:800;color:var(--green-800);background:#f8fafc}
        .unit-toggle{display:flex;background:var(--gray-100);padding:4px;border-radius:30px;margin-bottom:20px}
        .unit-btn{flex:1;padding:8px;border-radius:25px;border:none;cursor:pointer;font-weight:700;font-size:.75rem;background:transparent;color:var(--gray-500);transition:.3s;font-family:inherit}
        .unit-btn.active{background:white;color:var(--green-700);box-shadow:0 2px 8px rgba(0,0,0,0.05)}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .mandi-table{width:100%;border-collapse:collapse;margin-top:15px;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.03)}
        .mandi-table thead{background:#064e3b;color:white}
        .mandi-table th{padding:14px 12px;text-align:left;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
        .mandi-table td{padding:14px 12px;border-bottom:1px solid var(--gray-50);font-size:.85rem;color:#334155}
        .mandi-table tr:hover{background:#f8fafc}
        .mandi-table tr.best-mandi{background:#f0fdf4;border-left:4px solid #10b981}
        .price-up{color:#059669;font-weight:700}.price-down{color:#dc2626;font-weight:700}.price-stable{color:#64748b;font-weight:700}
        .badge-recommend{background:#10b981;color:white;padding:2px 8px;border-radius:4px;font-size:.65rem;font-weight:800;margin-left:8px}
        .signal-badge{padding:6px 16px;border-radius:20px;font-weight:800;font-size:.8rem;text-transform:uppercase}
        .signal-hold{background:#fef3c7;color:#92400e;border:1px solid #fde68a}
        .signal-sell{background:#dcfce7;color:#166534;border:1px solid #bbf7d0}
        .signal-buy{background:#e0f2fe;color:#075985;border:1px solid #bae6fd}
        @media(max-width:900px){.analytics-grid{grid-template-columns:1fr}.grid-2{grid-template-columns:1fr}}
      `}</style>

      <nav className="page-nav"><Link href="/dashboard" className="back">← Dashboard</Link><Link href="/" className="logo">🌱 CropIQ Data</Link></nav>

      <div className="page-header" style={{background:"linear-gradient(135deg,#0f172a,#1e293b)"}}>
        <div className="badge" style={{background:"var(--gold-500)",color:"white"}}>🌍 Pan-India Intelligence</div>
        <h1>Market Analytics</h1>
        <p>Real-time price tracking for all crops in every state of India.</p>
      </div>

      <div className="page-body">
        <div className="analytics-grid">
          {/* SIDEBAR */}
          <div className="card sidebar">
            <h3 className="sidebar-title">Settings</h3>
            <div className="unit-toggle">
              <button className={`unit-btn ${unit==="Q"?"active":""}`} onClick={()=>setUnit("Q")}>₹ / Quintal</button>
              <button className={`unit-btn ${unit==="KG"?"active":""}`} onClick={()=>setUnit("KG")}>₹ / kg</button>
            </div>
            <div className="form-group"><label className="form-label">Select Crop</label>
              <select className="form-select" value={crop} onChange={e=>setCrop(e.target.value)}>
                {cropOptions.map(g=><optgroup key={g.group} label={g.group}>{g.items.map(i=><option key={i.v} value={i.v}>{i.l}</option>)}</optgroup>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Primary Mandi</label>
              <select className="form-select" value={mandi} onChange={e=>setMandi(e.target.value)}>
                {mandiOptions.map(g=><optgroup key={g.group} label={g.group}>{g.items.map(i=><option key={i.v} value={i.v}>{i.l}</option>)}</optgroup>)}
              </select>
            </div>
          </div>

          <div>
            {/* CHART */}
            <div className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <h3>{cropLabel} Market Depth</h3>
                <div style={{fontSize:"1.6rem",fontWeight:900,color:"var(--green-700)"}}>₹ {fmt(currentPrice)} {unitLabel}</div>
              </div>
              <div style={{height:350}}><canvas ref={chartRef} /></div>
            </div>

            <div className="grid-2" style={{marginTop:24}}>
              {/* AI PREDICTION */}
              <div className="card">
                <h3>🤖 AI Prediction</h3>
                <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:10}}>
                  <span style={{fontSize:"2rem",fontWeight:800,color:"var(--green-600)"}}>₹ {fmt(predictedPrice)}</span>
                  <span style={{color:trendPct>0?"var(--green-500)":"var(--red-500)",fontWeight:700}}>{trendPct>0?"↑":"↓"} {Math.abs(trendPct)}%</span>
                </div>
                <div style={{marginTop:15}}><span className={`signal-badge ${signal.cls}`}>Signal: {signal.text}</span></div>
              </div>

              {/* MANDI TABLE */}
              <div className="card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <h3>📍 Nearby Mandi Comparison</h3>
                  <span style={{fontSize:".7rem",color:"var(--gray-500)",fontWeight:600}}>LIVE REGIONAL DATA</span>
                </div>
                <table className="mandi-table">
                  <thead><tr><th>Mandi</th><th>Price ({unit==="Q"?"/q":"/kg"})</th><th>Distance</th><th>Arrivals</th><th>Trend</th></tr></thead>
                  <tbody>
                    {nearbyMandis.map((m,i)=>(
                      <tr key={m.name} className={i===0?"best-mandi":""}>
                        <td><strong>{m.name}</strong>{i===0&&<span className="badge-recommend">BEST PRICE</span>}</td>
                        <td>₹ {fmt(m.price)}</td>
                        <td style={{color:"var(--gray-500)",fontSize:".75rem",fontWeight:600}}>{m.dist===0?"Current":`${m.dist} km`}</td>
                        <td><span style={{background:"#f1f5f9",padding:"2px 6px",borderRadius:4,fontSize:".75rem",color:"#475569"}}>{m.vol}t</span></td>
                        <td className={m.trend==="↑"?"price-up":m.trend==="↓"?"price-down":"price-stable"}>{m.trend==="↑"?"↗":m.trend==="↓"?"↘":"→"} {m.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

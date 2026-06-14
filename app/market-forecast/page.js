"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";

const CROPS = [
  { v: "wheat", l: "Wheat" }, { v: "paddy", l: "Paddy" }, { v: "maize", l: "Maize" },
  { v: "onion", l: "Onion" }, { v: "tomato", l: "Tomato" }, { v: "potato", l: "Potato" },
  { v: "cotton", l: "Cotton" }, { v: "soybean", l: "Soybean" }, { v: "chana", l: "Gram" },
  { v: "mustard", l: "Mustard" }, { v: "sugarcane", l: "Sugarcane" }, { v: "chilli", l: "Chilli" },
];

export default function MarketForecastPage() {
  const [crop, setCrop] = useState("wheat");
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  async function fetchForecast() {
    setLoading(true);
    try {
      const res = await fetch("/api/market-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, days }),
      });
      const d = await res.json();
      setData(d);
    } catch { setData(null); }
    setLoading(false);
  }

  useEffect(() => { fetchForecast(); }, [crop, days]);

  useEffect(() => {
    if (!chartReady || !chartRef.current || !data?.forecast) return;
    const Chart = window.Chart;
    if (!Chart) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = data.forecast.map(p => `Day ${p.day}`);
    const prices = data.forecast.map(p => p.price);
    const upper = prices.map(p => Math.round(p * 1.05));
    const lower = prices.map(p => Math.round(p * 0.95));

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Predicted Price", data: prices, borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.1)", fill: false, tension: 0.4, pointRadius: 2, borderWidth: 3 },
          { label: "Upper Band", data: upper, borderColor: "rgba(16,185,129,0.3)", borderDash: [5,5], fill: false, tension: 0.4, pointRadius: 0, borderWidth: 1 },
          { label: "Lower Band", data: lower, borderColor: "rgba(239,68,68,0.3)", borderDash: [5,5], fill: "-1", backgroundColor: "rgba(16,185,129,0.05)", tension: 0.4, pointRadius: 0, borderWidth: 1 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#6b7280", font: { size: 11, weight: "600" } } } },
        scales: {
          y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => `₹${v}` } },
          x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } }
        }
      }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [chartReady, data]);

  const pctChange = data ? (((data.forecast?.[data.forecast.length-1]?.price || 0) - data.currentPrice) / data.currentPrice * 100).toFixed(1) : 0;

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" onReady={() => setChartReady(true)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(6,78,59,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .back{color:rgba(255,255,255,0.8);text-decoration:none;font-weight:600;font-size:.9rem}.back:hover{color:white}
        .logo{color:white;text-decoration:none;font-weight:900;font-size:1.3rem}
        .page-header{background:linear-gradient(135deg,#0f172a,#1e293b,#0f172a);padding:56px 24px;color:white;text-align:center}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(245,158,11,0.2);border:1px solid rgba(245,158,11,0.4);padding:8px 18px;border-radius:999px;font-size:.75rem;font-weight:800;margin-bottom:16px;color:#fbbf24}
        .page-header h1{font-size:2.2rem;font-weight:900;margin-bottom:10px}
        .page-header p{opacity:.8;font-size:.95rem;max-width:600px;margin:0 auto}
        .body{max-width:1200px;margin:0 auto;padding:32px 20px 60px}
        .controls{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;align-items:center}
        .sel{padding:10px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:.88rem;font-family:inherit;outline:none;font-weight:600}
        .sel:focus{border-color:#10b981}
        .period-btns{display:flex;gap:4px;background:#f3f4f6;padding:4px;border-radius:10px}
        .period-btn{padding:8px 16px;border:none;border-radius:8px;font-size:.78rem;font-weight:700;cursor:pointer;background:transparent;color:#6b7280;transition:.2s;font-family:inherit}
        .period-btn.active{background:white;color:#064e3b;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .kpi{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06)}
        .kpi-label{font-size:.7rem;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
        .kpi-value{font-size:1.8rem;font-weight:900;color:#111827}
        .kpi-sub{font-size:.75rem;font-weight:700;margin-top:4px}
        .card{background:white;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06);margin-bottom:24px}
        .card-title{font-size:1.1rem;font-weight:900;color:#064e3b;margin-bottom:20px}
        .ai-box{background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:1px solid #d1fae5;border-radius:14px;padding:20px;margin-top:24px}
        .ai-box h4{font-size:.88rem;font-weight:800;color:#064e3b;margin-bottom:8px;display:flex;align-items:center;gap:6px}
        .ai-box p{font-size:.85rem;color:#065f46;line-height:1.7}
        .shimmer{height:40px;border-radius:10px;background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media(max-width:768px){.grid{grid-template-columns:repeat(2,1fr)}.controls{flex-direction:column}}
      `}</style>

      <nav className="page-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <div/>
      </nav>

      <div className="page-header">
        <div className="badge">📈 AI-Powered Predictions</div>
        <h1>Market Price Forecast</h1>
        <p>AI-driven price predictions with confidence intervals to help you sell at the best time.</p>
      </div>

      <div className="body">
        <div className="controls">
          <select className="sel" value={crop} onChange={e => setCrop(e.target.value)}>
            {CROPS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
          </select>
          <div className="period-btns">
            {[{d:30,l:"30 Days"},{d:60,l:"60 Days"},{d:90,l:"90 Days"}].map(p => (
              <button key={p.d} className={`period-btn ${days===p.d?"active":""}`} onClick={()=>setDays(p.d)}>{p.l}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid">{[1,2,3,4].map(i => <div key={i} className="shimmer" style={{height:100}} />)}</div>
        ) : data && (
          <>
            <div className="grid">
              <div className="kpi">
                <div className="kpi-label">Current Price</div>
                <div className="kpi-value">₹{data.currentPrice?.toLocaleString()}</div>
                <div className="kpi-sub" style={{color:"#6b7280"}}>/quintal</div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Predicted (Day {days})</div>
                <div className="kpi-value">₹{data.forecast?.[data.forecast.length-1]?.price?.toLocaleString()}</div>
                <div className="kpi-sub" style={{color:pctChange>0?"#10b981":"#ef4444"}}>{pctChange>0?"↑":"↓"} {Math.abs(pctChange)}%</div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Best Selling Day</div>
                <div className="kpi-value">Day {data.bestDay}</div>
                <div className="kpi-sub" style={{color:"#f59e0b"}}>₹{data.maxPrice?.toLocaleString()} peak</div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Confidence</div>
                <div className="kpi-value">{data.confidence}%</div>
                <div className="kpi-sub" style={{color:"#6366f1"}}>AI Model</div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">📊 Price Forecast — {CROPS.find(c=>c.v===crop)?.l || crop}</div>
              <div style={{height:400}}><canvas ref={chartRef} /></div>
            </div>

            <div className="ai-box">
              <h4>🤖 AI Market Insight</h4>
              <p>{data.aiInsight}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

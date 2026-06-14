"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";

// Simulated farm analytics data
function generateData(period) {
  const months = period === "3m" ? 3 : period === "6m" ? 6 : 12;
  const labels = [];
  const revenue = [], expenses = [], profit = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }));
    const rev = 15000 + Math.random() * 25000 + Math.sin(i / 3) * 5000;
    const exp = 8000 + Math.random() * 12000;
    revenue.push(Math.round(rev));
    expenses.push(Math.round(exp));
    profit.push(Math.round(rev - exp));
  }

  const cropDist = [
    { label: "Wheat", value: 35, color: "#22c55e" },
    { label: "Rice", value: 25, color: "#3b82f6" },
    { label: "Tomato", value: 20, color: "#ef4444" },
    { label: "Cotton", value: 12, color: "#f59e0b" },
    { label: "Other", value: 8, color: "#8b5cf6" },
  ];

  const expenseBreakdown = {
    labels: labels.slice(-6),
    seeds: Array.from({length: 6}, () => Math.round(2000 + Math.random() * 3000)),
    fertilizer: Array.from({length: 6}, () => Math.round(3000 + Math.random() * 4000)),
    labor: Array.from({length: 6}, () => Math.round(4000 + Math.random() * 5000)),
    irrigation: Array.from({length: 6}, () => Math.round(1500 + Math.random() * 2500)),
    pesticide: Array.from({length: 6}, () => Math.round(1000 + Math.random() * 2000)),
  };

  const totalRev = revenue.reduce((a, b) => a + b, 0);
  const totalExp = expenses.reduce((a, b) => a + b, 0);

  return {
    labels, revenue, expenses, profit, cropDist, expenseBreakdown,
    kpis: {
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      netProfit: totalRev - totalExp,
      roi: (((totalRev - totalExp) / totalExp) * 100).toFixed(1),
    }
  };
}

export default function FarmerAnalyticsPage() {
  const [period, setPeriod] = useState("6m");
  const [data, setData] = useState(null);
  const [chartReady, setChartReady] = useState(false);
  const revenueRef = useRef(null);
  const cropRef = useRef(null);
  const expenseRef = useRef(null);
  const profitRef = useRef(null);
  const charts = useRef({});

  useEffect(() => { setData(generateData(period)); }, [period]);

  useEffect(() => {
    if (!chartReady || !data) return;
    const Chart = window.Chart;
    if (!Chart) return;

    Object.values(charts.current).forEach(c => c?.destroy());

    // Revenue & Expenses Line
    if (revenueRef.current) {
      charts.current.revenue = new Chart(revenueRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [
            { label: "Revenue", data: data.revenue, borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", fill: true, tension: 0.4, borderWidth: 3 },
            { label: "Expenses", data: data.expenses, borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.05)", fill: true, tension: 0.4, borderWidth: 2, borderDash: [5,5] },
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 11, weight: "600" } } } }, scales: { y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => `₹${(v/1000).toFixed(0)}k` } }, x: { grid: { display: false } } } }
      });
    }

    // Crop Distribution Doughnut
    if (cropRef.current) {
      charts.current.crop = new Chart(cropRef.current.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: data.cropDist.map(c => c.label),
          datasets: [{ data: data.cropDist.map(c => c.value), backgroundColor: data.cropDist.map(c => c.color), borderWidth: 3, borderColor: "#fff" }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { font: { size: 11, weight: "600" }, padding: 16 } } }, cutout: "65%" }
      });
    }

    // Expense Breakdown Stacked Bar
    if (expenseRef.current) {
      const eb = data.expenseBreakdown;
      charts.current.expense = new Chart(expenseRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: eb.labels,
          datasets: [
            { label: "Seeds", data: eb.seeds, backgroundColor: "#22c55e" },
            { label: "Fertilizer", data: eb.fertilizer, backgroundColor: "#3b82f6" },
            { label: "Labor", data: eb.labor, backgroundColor: "#f59e0b" },
            { label: "Irrigation", data: eb.irrigation, backgroundColor: "#06b6d4" },
            { label: "Pesticide", data: eb.pesticide, backgroundColor: "#ef4444" },
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 10, weight: "600" } } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: "#f1f5f9" }, ticks: { callback: v => `₹${(v/1000).toFixed(0)}k` } } } }
      });
    }

    // Profit/Loss Area
    if (profitRef.current) {
      charts.current.profit = new Chart(profitRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [{
            label: "Profit/Loss", data: data.profit, fill: true, tension: 0.4, borderWidth: 3,
            borderColor: ctx => { const v = data.profit; return v.map(p => p >= 0 ? "#22c55e" : "#ef4444"); },
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return "rgba(34,197,94,0.1)";
              const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              g.addColorStop(0, "rgba(34,197,94,0.2)"); g.addColorStop(0.5, "rgba(34,197,94,0.02)"); g.addColorStop(1, "rgba(239,68,68,0.1)");
              return g;
            },
            segment: { borderColor: ctx => ctx.p0.parsed.y >= 0 && ctx.p1.parsed.y >= 0 ? "#22c55e" : "#ef4444" },
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => `₹${(v/1000).toFixed(0)}k` } }, x: { grid: { display: false } } } }
      });
    }

    return () => { Object.values(charts.current).forEach(c => c?.destroy()); };
  }, [chartReady, data]);

  const fmt = v => `₹${Math.abs(v).toLocaleString("en-IN")}`;

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" onReady={() => setChartReady(true)} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(6,78,59,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .back{color:rgba(255,255,255,0.8);text-decoration:none;font-weight:600;font-size:.9rem}.back:hover{color:white}
        .logo{color:white;text-decoration:none;font-weight:900;font-size:1.3rem}
        .header{background:linear-gradient(135deg,#581c87,#7c3aed,#6d28d9);padding:56px 24px;color:white;text-align:center}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(167,139,250,0.2);border:1px solid rgba(167,139,250,0.4);padding:8px 18px;border-radius:999px;font-size:.75rem;font-weight:800;margin-bottom:16px;color:#c4b5fd}
        .header h1{font-size:2.2rem;font-weight:900;margin-bottom:10px}
        .header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
        .body{max-width:1300px;margin:0 auto;padding:32px 20px 60px}
        .period-bar{display:flex;gap:4px;background:#f3f4f6;padding:4px;border-radius:10px;width:fit-content;margin-bottom:24px}
        .period-btn{padding:8px 20px;border:none;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;background:transparent;color:#6b7280;transition:.2s;font-family:inherit}
        .period-btn.active{background:white;color:#6d28d9;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
        .kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
        .kpi{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06);position:relative;overflow:hidden}
        .kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:16px 16px 0 0}
        .kpi.rev::before{background:#22c55e}.kpi.exp::before{background:#ef4444}.kpi.pro::before{background:#6d28d9}.kpi.roi::before{background:#f59e0b}
        .kpi-label{font-size:.7rem;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
        .kpi-value{font-size:1.7rem;font-weight:900;color:#111827}
        .kpi-trend{font-size:.75rem;font-weight:700;margin-top:6px}
        .chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}
        .chart-card{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06)}
        .chart-title{font-size:1rem;font-weight:900;color:#111827;margin-bottom:16px;display:flex;align-items:center;gap:8px}
        @media(max-width:768px){.kpi-row{grid-template-columns:repeat(2,1fr)}.chart-grid{grid-template-columns:1fr}}
      `}</style>

      <nav className="nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <div/>
      </nav>

      <div className="header">
        <div className="badge">📊 Farm Intelligence</div>
        <h1>Farmer Analytics</h1>
        <p>Track your revenue, expenses, crop distribution, and profitability with interactive charts.</p>
      </div>

      <div className="body">
        <div className="period-bar">
          {[{v:"3m",l:"3 Months"},{v:"6m",l:"6 Months"},{v:"1y",l:"1 Year"}].map(p => (
            <button key={p.v} className={`period-btn ${period===p.v?"active":""}`} onClick={()=>setPeriod(p.v)}>{p.l}</button>
          ))}
        </div>

        {data && (
          <>
            <div className="kpi-row">
              <div className="kpi rev">
                <div className="kpi-label">Total Revenue</div>
                <div className="kpi-value">{fmt(data.kpis.totalRevenue)}</div>
                <div className="kpi-trend" style={{color:"#22c55e"}}>↑ 12.5% vs last period</div>
              </div>
              <div className="kpi exp">
                <div className="kpi-label">Total Expenses</div>
                <div className="kpi-value">{fmt(data.kpis.totalExpenses)}</div>
                <div className="kpi-trend" style={{color:"#ef4444"}}>↑ 8.2% vs last period</div>
              </div>
              <div className="kpi pro">
                <div className="kpi-label">Net Profit</div>
                <div className="kpi-value" style={{color:data.kpis.netProfit>=0?"#22c55e":"#ef4444"}}>{fmt(data.kpis.netProfit)}</div>
                <div className="kpi-trend" style={{color:data.kpis.netProfit>=0?"#22c55e":"#ef4444"}}>{data.kpis.netProfit>=0?"↑":"↓"} Profitable</div>
              </div>
              <div className="kpi roi">
                <div className="kpi-label">Return on Investment</div>
                <div className="kpi-value">{data.kpis.roi}%</div>
                <div className="kpi-trend" style={{color:"#f59e0b"}}>ROI Ratio</div>
              </div>
            </div>

            <div className="chart-grid">
              <div className="chart-card">
                <div className="chart-title">📈 Revenue vs Expenses</div>
                <div style={{height:300}}><canvas ref={revenueRef} /></div>
              </div>
              <div className="chart-card">
                <div className="chart-title">🌾 Crop Distribution</div>
                <div style={{height:300}}><canvas ref={cropRef} /></div>
              </div>
              <div className="chart-card">
                <div className="chart-title">💰 Expense Breakdown</div>
                <div style={{height:300}}><canvas ref={expenseRef} /></div>
              </div>
              <div className="chart-card">
                <div className="chart-title">📊 Profit/Loss Timeline</div>
                <div style={{height:300}}><canvas ref={profitRef} /></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

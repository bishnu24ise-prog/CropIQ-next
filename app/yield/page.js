"use client";
import { useState } from "react";
import Link from "next/link";

export default function YieldPredictorPage() {
  const [formData, setFormData] = useState({
    crop: "Rice",
    landArea: 2,
    soilPh: 6.2,
    nitrogen: "Low",
    rainfall: 800,
    temp: 28
  });
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    try {
      const res = await fetch("/api/yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setData(result);
    } catch {}
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f9fafb}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(6,78,59,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .back{color:rgba(255,255,255,0.8);text-decoration:none;font-weight:600;font-size:.9rem}.back:hover{color:white}
        .logo{color:white;text-decoration:none;font-weight:900;font-size:1.3rem}
        .header{background:linear-gradient(135deg,#c2410c,#9a3412,#7c2d12);padding:56px 24px;color:white;text-align:center;position:relative;overflow:hidden}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(253,186,116,0.2);border:1px solid rgba(253,186,116,0.4);padding:8px 18px;border-radius:999px;font-size:.75rem;font-weight:800;margin-bottom:16px;color:#fed7aa}
        .header h1{font-size:2.2rem;font-weight:900;margin-bottom:10px}
        .body{max-width:1000px;margin:0 auto;padding:32px 20px 60px}
        .grid-layout{display:grid;grid-template-columns:300px 1fr;gap:28px}
        .card{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06);margin-bottom:24px}
        .form-group{margin-bottom:16px}
        .form-label{display:block;font-size:.78rem;font-weight:700;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
        .form-input,.form-select{width:100%;padding:10px 14px;border:2px solid #e5e7eb;border-radius:10px;font-size:.88rem;font-family:inherit;outline:none;transition:.2s;color:#111827;background:white;}
        .form-input:focus,.form-select:focus{border-color:#ea580c}
        .btn{width:100%;padding:14px;border-radius:10px;font-weight:800;font-size:.9rem;cursor:pointer;border:none;background:linear-gradient(135deg,#ea580c,#c2410c);color:white;transition:.2s;margin-top:16px}
        .btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(234,88,12,0.3)}
        .wolfram-box{background:#fff7ed;border:2px solid #fed7aa;border-radius:14px;padding:24px;margin-bottom:20px;position:relative}
        .wolfram-logo{position:absolute;top:-12px;right:24px;background:#ea580c;color:white;padding:4px 12px;border-radius:20px;font-size:.7rem;font-weight:900;letter-spacing:1px}
        .w-title{font-size:.85rem;color:#9a3412;font-weight:800;margin-bottom:8px;text-transform:uppercase}
        .w-value{font-size:1.2rem;font-weight:700;color:#7c2d12;line-height:1.6}
        @media(max-width:768px){.grid-layout{grid-template-columns:1fr}}
      `}</style>

      <nav className="nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <div/>
      </nav>

      <div className="header">
        <div className="badge">🧮 Powered by Wolfram Alpha</div>
        <h1>Yield & Fertilizer Intelligence</h1>
        <p>Computational knowledge engine for precision agriculture calculations.</p>
      </div>

      <div className="body">
        <div className="grid-layout">
          <div className="card" style={{ alignSelf: "start" }}>
            <h3 style={{fontSize:"1.1rem",fontWeight:900,color:"#111827",marginBottom:20}}>Field Parameters</h3>
            <div className="form-group">
              <label className="form-label">Crop Type</label>
              <select className="form-select" value={formData.crop} onChange={e=>setFormData({...formData,crop:e.target.value})}>
                <option>Rice</option><option>Wheat</option><option>Cotton</option><option>Sugarcane</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Land Area (Acres)</label>
              <input type="number" className="form-input" value={formData.landArea} onChange={e=>setFormData({...formData,landArea:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Soil pH</label>
              <input type="number" step="0.1" className="form-input" value={formData.soilPh} onChange={e=>setFormData({...formData,soilPh:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Nitrogen Level</label>
              <select className="form-select" value={formData.nitrogen} onChange={e=>setFormData({...formData,nitrogen:e.target.value})}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expected Rainfall (mm)</label>
              <input type="number" className="form-input" value={formData.rainfall} onChange={e=>setFormData({...formData,rainfall:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Avg Temperature (°C)</label>
              <input type="number" className="form-input" value={formData.temp} onChange={e=>setFormData({...formData,temp:e.target.value})} />
            </div>
            <button className="btn" onClick={calculate}>{loading ? "Computing..." : "Run Computation"}</button>
          </div>

          <div>
            {!data && !loading && (
              <div style={{textAlign:"center",padding:60,color:"#6b7280",fontWeight:600,background:"white",borderRadius:16,border:"1px solid #e5e7eb"}}>
                <div style={{fontSize:"3rem",marginBottom:16}}>🔬</div>
                Enter your field parameters and let Wolfram Alpha compute exact fertilizer requirements and yield estimations.
              </div>
            )}
            
            {loading && (
              <div style={{textAlign:"center",padding:60,color:"#ea580c",fontWeight:800}}>
                Querying Wolfram Alpha Computational Engine...
              </div>
            )}

            {data && !loading && (
              <>
                <div className="wolfram-box">
                  <div className="wolfram-logo">WOLFRAM ALPHA</div>
                  <div className="w-title">🧪 Fertilizer Computation</div>
                  <div className="w-value">{data.fertilizerInsight}</div>
                </div>

                <div className="wolfram-box" style={{background:"#f0fdfa",borderColor:"#99f6e4"}}>
                  <div className="wolfram-logo" style={{background:"#0d9488"}}>WOLFRAM ALPHA</div>
                  <div className="w-title">📈 Yield Estimation</div>
                  <div className="w-value" style={{color:"#115e59"}}>{data.yieldInsight}</div>
                </div>

                <div className="card">
                  <h4 style={{fontSize:".9rem",fontWeight:800,color:"#4b5563",marginBottom:8}}>Total Farm Projection</h4>
                  <p style={{fontSize:"1.1rem",fontWeight:700,color:"#111827"}}>{data.totalEstimatedYield}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

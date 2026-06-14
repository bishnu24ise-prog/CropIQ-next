"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getDiagnosisHistory, deleteDiagnosis } from "../lib/api";
import { shareWhatsApp } from "../components/WhatsAppShare";
import ConfidenceGauge from "../components/ConfidenceGauge";
import DiseaseHeatmap from "../components/DiseaseHeatmap";

const CROPS = ["Tomato","Rice","Wheat","Maize","Potato","Sugarcane","Cotton","Chilli","Onion","Garlic","Pulses","Mustard"];
const STATUSES = ["EXTRACTING LEAF PIGMENTATION...","DETECTING CHLOROPHYLL VARIANCE...","SCANNING FOR PEST SIGNATURES...","CROSS-REFERENCING GLOBAL DATABASE...","CALCULATING DISEASE SEVERITY...","ANALYZING CELLULAR STRUCTURE...","MATCHING PATHOGEN PROFILE..."];

export default function CropDoctorPage() {
  const [cropType, setCropType] = useState("Tomato");
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("scan");
  const fileRef = useRef(null);
  const fileObjRef = useRef(null);

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    try {
      const d = await getDiagnosisHistory();
      setHistory(d.history || []);
    } catch { setHistory([]); }
  }

  function flash(m, t="success") { setToast({msg:m,type:t}); setTimeout(()=>setToast(null),3000); }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    fileObjRef.current = file;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleScan(e) {
    e.preventDefault();
    if (!fileObjRef.current) { flash("Please select an image","error"); return; }

    setScanning(true); setResult(null); setShowHeatmap(false);
    let idx = 0;
    const si = setInterval(() => { setStatusMsg(STATUSES[idx]); idx = (idx+1)%STATUSES.length; }, 600);
    setTimeout(() => setShowHeatmap(true), 1000);

    try {
      const formData = new FormData();
      formData.append("image", fileObjRef.current);
      formData.append("cropType", cropType);

      const apiRes = await fetch("/api/crop-scan", { method: "POST", body: formData });
      let res = await apiRes.json();
      if (res.error) throw new Error(res.error);

      clearInterval(si);
      setStatusMsg("DIAGNOSIS COMPLETE!");
      setScanning(false);
      setResult({ ...res, hash: "IQ-"+Math.random().toString(36).substr(2,6).toUpperCase() });
      try { await loadHistory(); } catch {}
      flash("AI Analysis Complete!");
    } catch (err) {
      clearInterval(si);
      setScanning(false);
      setStatusMsg("ANALYSIS FAILED");
      flash("Error: "+err.message,"error");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this diagnosis record?")) return;
    try { await deleteDiagnosis(id); flash("Record deleted"); loadHistory(); } catch { flash("Delete failed","error"); }
  }

  function speakResults() {
    if (!result) return;
    const text = `Diagnosis complete. We detected ${result.disease}. The severity level is ${result.severity}. Confidence is ${result.confidence} percent. Recommended organic recipe: ${result.organicTreatment}`;
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9; msg.lang = "en-IN";
    window.speechSynthesis.speak(msg);
  }

  function generateReport() {
    if (!result) return;
    const report = `
═══════════════════════════════════════════════
       CROPIQ AI CROP DIAGNOSIS REPORT
═══════════════════════════════════════════════

Date: ${new Date().toLocaleDateString("en-IN", {day:"numeric",month:"long",year:"numeric"})}
Reference: ${result.hash}
Crop Type: ${cropType}

───────────────────────────────────────────────
DIAGNOSIS
───────────────────────────────────────────────
Disease: ${result.disease}
Confidence: ${result.confidence}%
Severity: ${result.severity}
Affected Area: ${result.affectedArea || "N/A"}
Spread Risk: ${result.spreadRisk || "N/A"}

───────────────────────────────────────────────
SYMPTOMS
───────────────────────────────────────────────
${result.symptoms}

───────────────────────────────────────────────
IMMEDIATE ACTION
───────────────────────────────────────────────
${result.immediateAction}

───────────────────────────────────────────────
ORGANIC TREATMENT
───────────────────────────────────────────────
${result.organicTreatment}

───────────────────────────────────────────────
CHEMICAL TREATMENT
───────────────────────────────────────────────
${result.chemicalTreatment}

───────────────────────────────────────────────
PREVENTION
───────────────────────────────────────────────
${result.prevention}

───────────────────────────────────────────────
DETAILED ANALYSIS
───────────────────────────────────────────────
${result.detailedAnalysis || "N/A"}

═══════════════════════════════════════════════
Generated by CropIQ AI · cropiq.vercel.app
═══════════════════════════════════════════════`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `CropIQ-Report-${result.hash}.txt`;
    a.click(); URL.revokeObjectURL(url);
    flash("Report downloaded!");
  }

  const sevPct = result ? (result.severity?.toLowerCase()==="severe"?100:result.severity?.toLowerCase()==="medium"||result.severity?.toLowerCase()==="moderate"?60:30) : 0;
  const sevColor = sevPct>80?"#ef4444":sevPct>40?"#f59e0b":"#22c55e";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-400:#34d399;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-800:#065f46;--green-900:#064e3b;--red-500:#ef4444;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-300:#d1d5db;--gray-400:#9ca3af;--gray-500:#6b7280;--gray-600:#4b5563;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:16px;--radius-sm:10px;--shadow-md:0 4px 24px rgba(0,0,0,.08);--transition:all .25s ease}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(6,78,59,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .back{color:rgba(255,255,255,0.8);text-decoration:none;font-weight:600;font-size:.9rem;transition:.2s}.back:hover{color:white}
        .logo{color:white;text-decoration:none;font-weight:900;font-size:1.3rem}
        .page-header{background:linear-gradient(135deg,#065f46,#064e3b,#0f766e);padding:56px 24px;color:white;text-align:center;position:relative;overflow:hidden}
        .page-header::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;background:radial-gradient(circle,rgba(16,185,129,0.15),transparent 70%);border-radius:50%}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);backdrop-filter:blur(8px);padding:8px 18px;border-radius:999px;font-size:.75rem;font-weight:800;margin-bottom:16px;border:1px solid rgba(255,255,255,0.15)}
        .version-tag{background:rgba(16,185,129,0.3);color:#a7f3d0;padding:3px 10px;border-radius:20px;font-size:.65rem;font-weight:800;margin-left:8px}
        .page-header h1{font-size:2.2rem;font-weight:900;margin-bottom:10px;letter-spacing:-0.5px}
        .page-header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
        .page-body{max-width:1200px;margin:0 auto;padding:32px 20px 60px}
        .layout-sidebar{display:grid;grid-template-columns:300px 1fr;gap:28px}
        .sidebar{position:sticky;top:80px;align-self:start}
        .sidebar-title{font-size:1.1rem;font-weight:900;color:var(--green-900);margin-bottom:14px;display:flex;align-items:center;gap:8px}
        .card{background:var(--white);border-radius:var(--radius-md);padding:28px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06);transition:var(--transition)}
        .card:hover{box-shadow:0 8px 32px rgba(0,0,0,.1)}
        .form-group{margin-bottom:18px}.form-label{display:block;font-size:.82rem;font-weight:700;color:var(--gray-700);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
        .form-input,.form-select{width:100%;padding:12px 16px;border:2px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.9rem;outline:none;font-family:inherit;transition:.2s}
        .form-input:focus,.form-select:focus{border-color:var(--green-500);box-shadow:0 0 0 3px rgba(16,185,129,0.1)}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 22px;border-radius:var(--radius-sm);font-weight:800;font-size:.88rem;cursor:pointer;border:none;font-family:inherit;transition:var(--transition)}
        .btn-green{background:linear-gradient(135deg,var(--green-600),var(--green-700));color:white;width:100%}.btn-green:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(5,150,105,0.3)}
        .btn-green:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
        .btn-outline{background:transparent;border:2px solid var(--gray-300);color:var(--gray-700)}.btn-outline:hover{border-color:var(--green-500);color:var(--green-700)}
        .btn-sm{padding:8px 14px;font-size:.78rem}
        .scanner-container{position:relative;width:100%;border-radius:16px;overflow:hidden;background:#000;margin-bottom:15px}
        .scan-line{position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,transparent,#10b981,transparent);box-shadow:0 0 20px #10b981,0 0 40px #10b981;animation:scan 2s infinite ease-in-out;z-index:10}
        .scan-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(16,185,129,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.08) 1px,transparent 1px);background-size:20px 20px;z-index:5;pointer-events:none}
        @keyframes scan{0%{top:0}50%{top:100%}100%{top:0}}
        .status-msg{font-size:.82rem;color:var(--green-600);font-weight:800;margin-top:16px;text-align:center;letter-spacing:1.5px;font-family:'Courier New',monospace}
        .results-glass{background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.6);border-radius:24px;padding:36px;box-shadow:0 20px 60px rgba(0,0,0,0.08);margin-top:28px}
        .severity-meter{height:10px;background:#e2e8f0;border-radius:10px;overflow:hidden;margin:12px 0}
        .severity-fill{height:100%;transition:width 1.5s ease-out;border-radius:10px}
        .treatment-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:24px}
        .treatment-card{padding:20px;border-radius:16px;border:1px solid rgba(0,0,0,0.05);transition:.2s}
        .treatment-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.06)}
        .t-organic{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-left:4px solid #22c55e}
        .t-chemical{background:linear-gradient(135deg,#fef2f2,#fee2e2);border-left:4px solid #ef4444}
        .result-meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:20px}
        .meta-chip{background:#f8fafc;border:1px solid #e2e8f0;padding:10px 16px;border-radius:12px;font-size:.82rem;display:flex;flex-direction:column;gap:2px;flex:1;min-width:120px}
        .meta-chip-label{font-size:.68rem;font-weight:800;color:var(--gray-500);text-transform:uppercase;letter-spacing:.5px}
        .meta-chip-value{font-weight:800;color:var(--gray-900)}
        .gauge-row{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;margin:24px 0;padding:20px;background:linear-gradient(135deg,#064e3b,#065f46);border-radius:16px}
        .history-item{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:10px;transition:.3s;display:flex;justify-content:space-between;align-items:center;cursor:pointer}
        .history-item:hover{border-color:var(--green-400);box-shadow:0 4px 16px rgba(0,0,0,0.06);transform:translateX(4px)}
        .btn-delete{background:none;border:none;color:#ef4444;cursor:pointer;padding:6px;font-size:1rem;border-radius:8px;transition:.2s}
        .btn-delete:hover{background:#fef2f2}
        .tab-bar{display:flex;gap:4px;background:var(--gray-100);padding:4px;border-radius:12px;margin-bottom:20px}
        .tab-btn{flex:1;padding:10px;border:none;border-radius:10px;font-size:.82rem;font-weight:700;cursor:pointer;background:transparent;color:var(--gray-500);transition:.2s;font-family:inherit}
        .tab-btn.active{background:white;color:var(--green-800);box-shadow:0 2px 8px rgba(0,0,0,0.06)}
        .action-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
        .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200;animation:toastIn .4s cubic-bezier(.175,.885,.32,1.275)}
        .toast-success{background:var(--green-600);color:white}.toast-error{background:var(--red-500);color:white}
        @keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media(max-width:768px){.layout-sidebar{grid-template-columns:1fr}.treatment-grid{grid-template-columns:1fr}.gauge-row{flex-direction:column}}
      `}</style>

      <nav className="page-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <div/>
      </nav>

      <div className="page-header">
        <div className="badge">🔬 AI Vision Analysis<span className="version-tag">v2.0</span></div>
        <h1>AI Crop Doctor</h1>
        <p>Upload a photo of your crop leaf — our AI identifies diseases instantly and prescribes organic + chemical treatments.</p>
      </div>

      <div className="page-body">
        <div className="layout-sidebar">
          {/* SIDEBAR */}
          <div className="card sidebar">
            <div className="tab-bar">
              <button className={`tab-btn ${activeTab==="scan"?"active":""}`} onClick={()=>setActiveTab("scan")}>🔬 New Scan</button>
              <button className={`tab-btn ${activeTab==="history"?"active":""}`} onClick={()=>setActiveTab("history")}>📋 History ({history.length})</button>
            </div>

            {activeTab === "history" && (
              <>
                <h3 className="sidebar-title">📋 Diagnosis History</h3>
                {history.length === 0 ? (
                  <p style={{fontSize:".85rem",color:"var(--gray-500)"}}>No history yet. Start your first scan!</p>
                ) : history.map(item => (
                  <div className="history-item" key={item._id}>
                    <div>
                      <h4 style={{fontSize:".85rem",color:"var(--gray-900)",marginBottom:3,fontWeight:700}}>{item.disease}</h4>
                      <p style={{fontSize:".72rem",color:"var(--gray-500)",fontWeight:600}}>{item.cropType} · {new Date(item.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
                    </div>
                    <button className="btn-delete" onClick={()=>handleDelete(item._id)} title="Delete">🗑️</button>
                  </div>
                ))}
              </>
            )}

            {activeTab === "scan" && (
              <form onSubmit={handleScan}>
                <div className="form-group">
                  <label className="form-label">Crop Type</label>
                  <select className="form-select" value={cropType} onChange={e=>setCropType(e.target.value)}>
                    {CROPS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Upload Leaf Photo</label>
                  <input type="file" className="form-input" accept="image/*" capture="environment" ref={fileRef} onChange={onFileChange} />
                </div>
                {preview && !scanning && (
                  <div style={{marginBottom:16}}>
                    <img src={preview} style={{width:"100%",height:"auto",borderRadius:12,border:"2px solid var(--green-100)"}} alt="crop preview" />
                  </div>
                )}
                <button type="submit" className="btn btn-green" disabled={scanning}>
                  {scanning ? "⏳ Analyzing..." : result ? "🔄 Scan Another Leaf" : "🔬 Start AI Diagnosis"}
                </button>
              </form>
            )}
          </div>

          <div>
            {/* SCANNER PREVIEW */}
            {preview && scanning && (
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <div className="scanner-container">
                  <div className="scan-grid" />
                  <div className="scan-line" />
                  <DiseaseHeatmap visible={showHeatmap} severity={result?.severity || "Medium"} />
                  <img src={preview} style={{width:"100%",height:"auto",display:"block"}} alt="scanning crop" />
                </div>
                <div style={{padding:20}}>
                  <div className="status-msg" style={{color:statusMsg==="ANALYSIS FAILED"?"#ef4444":"var(--green-600)"}}>{statusMsg}</div>
                </div>
              </div>
            )}

            {/* RESULT CARD */}
            {result && (
              <div className="results-glass" id="resultCard">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{background:"#f0fdf4",color:"#166534",fontSize:".7rem",marginBottom:14,padding:"8px 14px",borderRadius:20,fontWeight:800,border:"1px solid #bbf7d0",display:"inline-flex",alignItems:"center",gap:6}}>
                      <span style={{color:"#22c55e",fontSize:".6rem"}}>●</span> NEURAL-PATHOGEN SCAN VERIFIED
                    </div>
                    <h2 style={{color:"var(--green-900)",marginBottom:6,fontSize:"1.7rem",fontWeight:900,letterSpacing:"-0.5px"}}>{result.disease||"Unknown"}</h2>
                    <p style={{fontSize:".82rem",color:"var(--gray-500)",fontWeight:600}}>
                      Hash: <span style={{fontFamily:"monospace",color:"var(--gray-400)"}}>{result.hash}</span>
                    </p>
                  </div>
                </div>

                {/* CONFIDENCE GAUGE ROW */}
                <div className="gauge-row">
                  <ConfidenceGauge value={result.confidence || 90} size={130} label="Confidence" />
                  <div style={{color:"white",textAlign:"left"}}>
                    <div style={{fontSize:".75rem",fontWeight:800,opacity:.7,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Severity Level</div>
                    <div style={{fontSize:"1.8rem",fontWeight:900}}>{(result.severity||"Medium").toUpperCase()}</div>
                    <div className="severity-meter" style={{background:"rgba(255,255,255,0.15)",width:200}}>
                      <div className="severity-fill" style={{width:`${sevPct}%`,background:sevColor}} />
                    </div>
                  </div>
                </div>

                {/* META CHIPS */}
                <div className="result-meta">
                  <div className="meta-chip"><span className="meta-chip-label">Affected Area</span><span className="meta-chip-value">{result.affectedArea || "15-25%"}</span></div>
                  <div className="meta-chip"><span className="meta-chip-label">Spread Risk</span><span className="meta-chip-value" style={{color:result.spreadRisk==="High"?"#ef4444":result.spreadRisk==="Low"?"#22c55e":"#f59e0b"}}>{result.spreadRisk || "Medium"}</span></div>
                  <div className="meta-chip"><span className="meta-chip-label">Crop Type</span><span className="meta-chip-value">{cropType}</span></div>
                  <div className="meta-chip"><span className="meta-chip-label">Date</span><span className="meta-chip-value">{new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span></div>
                </div>

                {/* SYMPTOMS */}
                <div style={{marginTop:24,background:"#f8fafc",padding:22,borderRadius:14,border:"1px solid #e2e8f0"}}>
                  <h4 style={{color:"#475569",fontSize:".88rem",marginBottom:10,fontWeight:800}}>🔬 Pathogen Assessment</h4>
                  <p style={{fontSize:".85rem",lineHeight:1.7,color:"#64748b"}}>{result.symptoms||"Symptoms not detailed."}</p>
                </div>

                {/* DETAILED ANALYSIS */}
                {result.detailedAnalysis && (
                  <div style={{marginTop:16,background:"#eff6ff",padding:22,borderRadius:14,border:"1px solid #bfdbfe"}}>
                    <h4 style={{color:"#1e40af",fontSize:".88rem",marginBottom:10,fontWeight:800}}>🧬 Detailed Analysis</h4>
                    <p style={{fontSize:".85rem",lineHeight:1.7,color:"#3b82f6"}}>{result.detailedAnalysis}</p>
                  </div>
                )}

                {/* IMMEDIATE ACTION */}
                <div style={{marginTop:16,background:"#fff7ed",padding:22,borderRadius:14,borderLeft:"4px solid #f97316"}}>
                  <h4 style={{color:"#9a3412",fontSize:".88rem",marginBottom:10,fontWeight:800}}>🚨 Immediate Triage</h4>
                  <p style={{fontSize:".85rem",lineHeight:1.7,color:"#c2410c",fontWeight:600}}>{result.immediateAction||"Monitor closely."}</p>
                </div>

                {/* TREATMENTS */}
                <div className="treatment-grid">
                  <div className="treatment-card t-organic">
                    <h4 style={{color:"#166534",marginBottom:10,fontWeight:800}}>🌿 Organic Treatment</h4>
                    <p style={{fontSize:".85rem",lineHeight:1.7,color:"#14532d"}}>{result.organicTreatment||"N/A"}</p>
                  </div>
                  <div className="treatment-card t-chemical">
                    <h4 style={{color:"#991b1b",marginBottom:10,fontWeight:800}}>🧪 Chemical Control</h4>
                    <p style={{fontSize:".85rem",lineHeight:1.7,color:"#7f1d1d"}}>{result.chemicalTreatment||"N/A"}</p>
                  </div>
                </div>

                {/* PREVENTION */}
                <div style={{marginTop:16,background:"white",padding:20,borderRadius:14,border:"1px solid rgba(0,0,0,0.06)"}}>
                  <h4 style={{fontSize:".88rem",marginBottom:8,fontWeight:800}}>💡 Long-Term Prevention</h4>
                  <p style={{fontSize:".85rem",color:"var(--gray-600)",lineHeight:1.7}}>{result.prevention||"N/A"}</p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="action-row">
                  <button className="btn btn-outline btn-sm" onClick={speakResults}>🔊 Listen Report</button>
                  <button className="btn btn-outline btn-sm" onClick={generateReport}>📄 Download Report</button>
                  <button className="btn btn-sm" style={{background:"#25D366",color:"white",border:"none"}} onClick={()=>shareWhatsApp(`🌿 CropIQ AI Diagnosis:\n\nDisease: ${result.disease}\nCrop: ${cropType}\nSeverity: ${result.severity}\nConfidence: ${result.confidence}%\n\nOrganic: ${result.organicTreatment}\n\nRef: ${result.hash} | CropIQ AI`)}>💬 Share</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

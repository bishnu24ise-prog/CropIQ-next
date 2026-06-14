"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getUserProfile } from "../lib/api";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [tab, setTab] = useState("ai-recommend");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [profile, setProfile] = useState({ state: "Maharashtra", crops: "Wheat", landArea: 2, category: "General", income: 50000 });
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Apply modal
  const [applyModal, setApplyModal] = useState(null); // scheme object
  const [files, setFiles] = useState({});

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    let currentProfile = { ...profile };
    try {
      const u = await getUserProfile();
      if (u && !u.error) {
        currentProfile = { state: u.state || profile.state, crops: u.crops || profile.crops, landArea: u.landArea || profile.landArea, category: u.category || profile.category, income: u.income || profile.income };
        setProfile(currentProfile);
      }
    } catch {}

    try {
      const res = await fetch("/api/scheme-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProfile),
      });
      const data = await res.json();
      setSchemes(data.recommendations || []);
      setAiInsight(data.aiSummary || "");
    } catch {
      setSchemes([]);
    }
    setLoading(false);
  }

  async function refreshRecommendations() {
    setShowProfileModal(false);
    setLoading(true);
    try {
      const res = await fetch("/api/scheme-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      setSchemes(data.recommendations || []);
      setAiInsight(data.aiSummary || "");
    } catch {}
    setLoading(false);
  }

  function flash(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }

  function openApply(s) { setFiles({}); setApplyModal(s); }

  function handleFile(req, e) {
    const f = e.target.files?.[0];
    if (f) setFiles(prev => ({ ...prev, [req]: f.name }));
  }

  function submitApplication() {
    const reqs = applyModal.requirements?.length ? applyModal.requirements : ["Aadhaar Card"];
    const allDone = reqs.every(r => files[r]);
    if (!allDone) { flash("Please upload ALL required documents before submitting.", "error"); return; }
    setApplyModal(null);
    flash(`Success! Your application for ${applyModal.name} has been submitted.`);
  }

  const activeSchemes = tab === "ai-recommend" ? schemes.filter(s => s.matchScore >= 40) : tab === "all" ? schemes : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f9fafb}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:rgba(6,78,59,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:50}
        .back{color:rgba(255,255,255,0.8);text-decoration:none;font-weight:600;font-size:.9rem}.back:hover{color:white}
        .logo{color:white;text-decoration:none;font-weight:900;font-size:1.3rem}
        .header{background:linear-gradient(135deg,#b91c1c,#991b1b,#7f1d1d);padding:56px 24px;color:white;text-align:center;position:relative;overflow:hidden}
        .header::before{content:'';position:absolute;top:-50%;right:-10%;width:400px;height:400px;background:radial-gradient(circle,rgba(248,113,113,0.15),transparent 70%);border-radius:50%}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(254,226,226,0.1);border:1px solid rgba(254,226,226,0.2);padding:8px 18px;border-radius:999px;font-size:.75rem;font-weight:800;margin-bottom:16px;color:#fca5a5}
        .header h1{font-size:2.2rem;font-weight:900;margin-bottom:10px}
        .header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
        .body{max-width:1200px;margin:0 auto;padding:32px 20px 60px}
        .layout-grid{display:grid;grid-template-columns:300px 1fr;gap:28px}
        .sidebar{position:sticky;top:80px;align-self:start}
        .card{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.06);margin-bottom:24px}
        .profile-btn{width:100%;padding:12px;border:2px dashed #e5e7eb;border-radius:12px;background:transparent;color:#4b5563;font-weight:700;font-size:.85rem;cursor:pointer;transition:.2s;margin-top:16px}
        .profile-btn:hover{border-color:#b91c1c;color:#b91c1c}
        .ai-box{background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fecaca;border-radius:14px;padding:20px;margin-bottom:24px}
        .ai-box h4{font-size:.88rem;font-weight:800;color:#991b1b;margin-bottom:8px}
        .ai-box p{font-size:.85rem;color:#7f1d1d;line-height:1.7}
        .tab-bar{display:flex;gap:4px;background:#f3f4f6;padding:4px;border-radius:12px;margin-bottom:24px}
        .tab-btn{flex:1;padding:10px;border:none;border-radius:10px;font-size:.82rem;font-weight:700;cursor:pointer;background:transparent;color:#6b7280;transition:.2s;font-family:inherit}
        .tab-btn.active{background:white;color:#991b1b;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
        .scheme-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px}
        .scheme-card{background:white;border-radius:16px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.06);transition:.2s;display:flex;flex-direction:column}
        .scheme-card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,0.08);border-color:#fca5a5}
        .s-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
        .s-title{font-size:1.1rem;font-weight:800;color:#111827}
        .s-match{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;padding:4px 10px;border-radius:20px;font-size:.7rem;font-weight:800}
        .s-match.high{background:#f0fdf4;color:#166534;border-color:#bbf7d0}
        .s-match.med{background:#fffbeb;color:#b45309;border-color:#fde68a}
        .s-desc{font-size:.85rem;color:#4b5563;line-height:1.6;flex:1;margin-bottom:16px}
        .s-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
        .s-tag{background:#f3f4f6;padding:4px 10px;border-radius:6px;font-size:.7rem;font-weight:700;color:#4b5563}
        .btn{padding:10px 18px;border-radius:10px;font-weight:800;font-size:.85rem;cursor:pointer;border:none;font-family:inherit;transition:.2s;width:100%}
        .btn-red{background:linear-gradient(135deg,#dc2626,#b91c1c);color:white}.btn-red:hover{box-shadow:0 4px 15px rgba(220,38,38,0.4)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
        .modal{background:white;width:100%;max-width:500px;border-radius:20px;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,0.2);animation:modalIn .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)}
        @keyframes modalIn{from{opacity:0;transform:scale(.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .m-close{position:absolute;top:20px;right:20px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#9ca3af}
        .doc-item{border:1px solid #e5e7eb;padding:12px;border-radius:10px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
        .file-input{display:none}
        .upload-btn{background:#f3f4f6;padding:6px 12px;border-radius:6px;font-size:.75rem;font-weight:700;cursor:pointer}
        .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:10px;font-weight:700;font-size:.85rem;z-index:200;color:white;animation:toastIn .4s}
        @keyframes toastIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){.layout-grid{grid-template-columns:1fr}.scheme-grid{grid-template-columns:1fr}}
      `}</style>

      <nav className="nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <div/>
      </nav>

      <div className="header">
        <div className="badge">🏛️ Govt. Scheme Matcher</div>
        <h1>Scheme Recommendation</h1>
        <p>AI matches your farmer profile with government subsidies, loans, and insurance schemes.</p>
      </div>

      <div className="body">
        <div className="layout-grid">
          <div className="sidebar">
            <div className="card" style={{padding:20}}>
              <h3 style={{fontSize:"1rem",fontWeight:800,marginBottom:16,color:"#111827"}}>👤 Farmer Profile</h3>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem"}}><span style={{color:"#6b7280"}}>State</span><strong style={{color:"#111827"}}>{profile.state}</strong></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem"}}><span style={{color:"#6b7280"}}>Land Area</span><strong style={{color:"#111827"}}>{profile.landArea} Acres</strong></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem"}}><span style={{color:"#6b7280"}}>Crops</span><strong style={{color:"#111827"}}>{profile.crops}</strong></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem"}}><span style={{color:"#6b7280"}}>Category</span><strong style={{color:"#111827"}}>{profile.category}</strong></div>
              </div>
              <button className="profile-btn" onClick={()=>setShowProfileModal(true)}>✏️ Edit Profile for Better Match</button>
            </div>

            {aiInsight && (
              <div className="ai-box">
                <h4>🤖 AI Advisory</h4>
                <p>{aiInsight}</p>
              </div>
            )}
          </div>

          <div>
            <div className="tab-bar">
              <button className={`tab-btn ${tab==="ai-recommend"?"active":""}`} onClick={()=>setTab("ai-recommend")}>✨ AI Recommended ({schemes.filter(s=>s.matchScore>=40).length})</button>
              <button className={`tab-btn ${tab==="all"?"active":""}`} onClick={()=>setTab("all")}>All Schemes ({schemes.length})</button>
            </div>

            {loading ? (
              <div style={{textAlign:"center",padding:40,color:"#6b7280",fontWeight:600}}>AI is analyzing scheme eligibility...</div>
            ) : (
              <div className="scheme-grid">
                {activeSchemes.map(s => (
                  <div key={s.id} className="scheme-card">
                    <div className="s-head">
                      <div className="s-title">{s.name}</div>
                      <div className={`s-match ${s.matchScore>=70?"high":"med"}`}>{s.matchScore}% Match</div>
                    </div>
                    <div className="s-desc">{s.description}</div>
                    <div className="s-meta">
                      <span className="s-tag">💰 {s.benefit}</span>
                      <span className="s-tag">🏢 {s.ministry}</span>
                      <span className="s-tag">📅 {s.deadline}</span>
                    </div>
                    <button className="btn btn-red" onClick={()=>openApply(s)}>Apply Now</button>
                  </div>
                ))}
              </div>
            )}
            {!loading && activeSchemes.length === 0 && (
              <div style={{textAlign:"center",padding:40,background:"white",borderRadius:16,border:"1px solid #e5e7eb"}}>
                No schemes match your profile currently. Try adjusting your profile.
              </div>
            )}
          </div>
        </div>
      </div>

      {applyModal && (
        <div className="modal-overlay">
          <div className="modal" style={{position:"relative"}}>
            <button className="m-close" onClick={()=>setApplyModal(null)}>×</button>
            <h2 style={{fontSize:"1.4rem",fontWeight:900,marginBottom:8,color:"#111827"}}>{applyModal.name}</h2>
            <p style={{fontSize:".85rem",color:"#6b7280",marginBottom:24}}>Upload the required documents to submit your application.</p>
            
            <div style={{marginBottom:24}}>
              {(applyModal.requirements || []).map((req, i) => (
                <div key={i} className="doc-item">
                  <div style={{fontSize:".85rem",fontWeight:700,color:"#374151"}}>
                    {req} {files[req] && <span style={{color:"#10b981",marginLeft:8}}>✓ Uploaded</span>}
                  </div>
                  <label className="upload-btn">
                    {files[req] ? "Change" : "Upload"}
                    <input type="file" className="file-input" onChange={(e)=>handleFile(req, e)} />
                  </label>
                </div>
              ))}
            </div>
            
            <button className="btn btn-red" onClick={submitApplication} style={{width:"100%"}}>Submit Application</button>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal" style={{position:"relative"}}>
            <button className="m-close" onClick={()=>setShowProfileModal(false)}>×</button>
            <h2 style={{fontSize:"1.4rem",fontWeight:900,marginBottom:16,color:"#111827"}}>Edit Profile</h2>
            <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>
              <div>
                <label style={{display:"block",fontSize:".8rem",fontWeight:700,marginBottom:4}}>State</label>
                <select value={profile.state} onChange={e=>setProfile({...profile,state:e.target.value})} style={{width:"100%",padding:10,borderRadius:8,border:"1px solid #d1d5db"}}>
                  <option>Maharashtra</option><option>Uttar Pradesh</option><option>Punjab</option><option>Telangana</option><option>Odisha</option><option>All</option>
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:".8rem",fontWeight:700,marginBottom:4}}>Land Area (Acres)</label>
                <input type="number" value={profile.landArea} onChange={e=>setProfile({...profile,landArea:parseFloat(e.target.value)})} style={{width:"100%",padding:10,borderRadius:8,border:"1px solid #d1d5db"}} />
              </div>
              <div>
                <label style={{display:"block",fontSize:".8rem",fontWeight:700,marginBottom:4}}>Category</label>
                <select value={profile.category} onChange={e=>setProfile({...profile,category:e.target.value})} style={{width:"100%",padding:10,borderRadius:8,border:"1px solid #d1d5db"}}>
                  <option>General</option><option>OBC</option><option>SC</option><option>ST</option>
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:".8rem",fontWeight:700,marginBottom:4}}>Crops</label>
                <input type="text" value={profile.crops} onChange={e=>setProfile({...profile,crops:e.target.value})} style={{width:"100%",padding:10,borderRadius:8,border:"1px solid #d1d5db"}} />
              </div>
            </div>
            <button className="btn btn-red" onClick={refreshRecommendations} style={{width:"100%"}}>Update & Re-calculate Matches</button>
          </div>
        </div>
      )}

      {toast && <div className="toast" style={{background:toast.type==="error"?"#ef4444":"#10b981"}}>{toast.msg}</div>}
    </>
  );
}

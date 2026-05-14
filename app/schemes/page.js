"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getGovernmentSchemes, getUserProfile } from "../lib/api";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState(null);
  const [tab, setTab] = useState("eligible");
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState({ state: "Maharashtra", crops: "Wheat, Tomato", landArea: "2.5", category: "General" });

  // Apply modal
  const [applyModal, setApplyModal] = useState(null); // index of scheme
  const [files, setFiles] = useState({});

  useEffect(() => {
    if (localStorage.getItem("brightness") === "dark") setDark(true);
    loadData();
  }, []);

  async function loadData() {
    const MOCK_SCHEMES = [
      { _id: "1", name: "PM-Kisan Samman Nidhi", description: "Direct income support of ₹6,000 per year in three installments to all land-holding farmer families.", amount: "₹6,000 / Year", requirements: ["Aadhaar", "Land Record", "Bank Passbook"] },
      { _id: "2", name: "Soil Health Card Scheme", description: "Provides farmers with Soil Health Cards to understand nutrient deficiencies and use fertilizers judiciously.", amount: "Free Testing", requirements: ["Soil Sample", "Land ID"] },
      { _id: "3", name: "PM Fasal Bima Yojana (PMFBY)", description: "Comprehensive crop insurance against natural calamities, pests, and diseases for all food and oilseed crops.", amount: "Insurance Cover", requirements: ["Kisan Credit Card", "Sowing Certificate"] }
    ];

    try {
      const u = await getUserProfile();
      if (u && !u.error) setProfile(p => ({ ...p, state: u.state || p.state, crops: u.crops || p.crops, landArea: u.landArea || p.landArea, category: u.category || p.category }));
    } catch {}
    try {
      const res = await getGovernmentSchemes();
      setSchemes(res.schemes && res.schemes.length > 0 ? res.schemes : MOCK_SCHEMES);
    } catch { 
      setSchemes(MOCK_SCHEMES); 
    }
  }

  function flash(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }

  function openApply(idx) { setFiles({}); setApplyModal(idx); }

  function handleFile(req, e) {
    const f = e.target.files?.[0];
    if (f) setFiles(prev => ({ ...prev, [req]: f.name }));
  }

  function submitApplication() {
    const scheme = schemes[applyModal];
    const reqs = scheme.requirements?.length ? scheme.requirements : ["Aadhaar Card", "Land Records"];
    const allDone = reqs.every(r => files[r]);
    if (!allDone) { flash("Please upload ALL required documents before submitting.", "error"); return; }
    setApplyModal(null);
    flash(`Success! Your application for ${scheme.name} has been submitted.`);
  }

  const activeScheme = applyModal !== null && schemes ? schemes[applyModal] : null;
  const reqs = activeScheme?.requirements?.length ? activeScheme.requirements : ["Aadhaar Card", "Land Records"];

  return (
    <>
      <style>{`
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-800:#065f46;--green-900:#064e3b;--red-500:#ef4444;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-300:#d1d5db;--gray-500:#6b7280;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08);--transition:all .2s ease;--blue-100:#dbeafe;--blue-600:#2563eb}
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        [data-theme="dark"]{filter:brightness(.85) contrast(1.05)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
        .moon-btn{background:none;border:none;font-size:1.5rem;cursor:pointer}
        .nav-btn{padding:8px 18px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;cursor:pointer;border:none;font-family:inherit;background:var(--green-600);color:white;transition:var(--transition)}
        .nav-btn:hover{background:var(--green-700)}
        .page-header{background:linear-gradient(135deg,var(--green-900),#0f766e);padding:48px 24px;color:white;text-align:center}
        .badge{display:inline-block;background:rgba(255,255,255,.15);padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;margin-bottom:12px}
        .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
        .page-header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
        .page-body{max-width:1100px;margin:0 auto;padding:32px 20px 60px}
        .layout-sidebar{display:grid;grid-template-columns:280px 1fr;gap:24px}
        .sidebar{position:sticky;top:80px;align-self:start}
        .sidebar-title{font-size:1.1rem;font-weight:800;color:var(--green-900);margin-bottom:12px}
        .card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06)}
        .tabs{display:flex;gap:4px;background:var(--gray-100);border-radius:var(--radius-sm);padding:4px;margin-bottom:20px}
        .tab-btn{flex:1;padding:8px 16px;border:none;border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;background:transparent;color:var(--gray-500);font-family:inherit;transition:var(--transition)}
        .tab-btn.active{background:var(--white);color:var(--green-900);box-shadow:0 1px 3px rgba(0,0,0,.08)}
        .status{padding:4px 10px;border-radius:999px;font-size:.7rem;font-weight:700}
        .status-success{background:var(--green-100);color:var(--green-700)}
        .status-info{background:var(--blue-100);color:var(--blue-600)}
        .btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;cursor:pointer;border:none;font-family:inherit;transition:var(--transition)}
        .btn-green{background:var(--green-600);color:white}.btn-green:hover{background:var(--green-700)}
        .btn-outline{background:transparent;border:1px solid var(--gray-300);color:var(--gray-700);text-decoration:none;font-size:.85rem}
        .btn-sm{padding:6px 14px;font-size:.8rem}
        .upload-item{display:flex;flex-direction:column;gap:8px;padding:15px;border:1px dashed var(--gray-300);border-radius:var(--radius-md);margin-bottom:12px;transition:var(--transition)}
        .upload-item:hover{border-color:var(--green-500);background:var(--green-50)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100}
        .modal{background:var(--white);border-radius:16px;padding:32px;width:90%;max-width:550px;max-height:90vh;overflow-y:auto}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .modal-title{font-size:1.2rem;font-weight:800;color:var(--green-900)}
        .modal-close{background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--gray-500)}
        .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200;animation:fadeIn .3s}
        .toast-success{background:var(--green-600);color:white}.toast-error{background:var(--red-500);color:white}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .page-footer{text-align:center;padding:24px;font-size:.82rem;color:var(--gray-500);border-top:1px solid var(--gray-100);margin-top:40px}
        @media(max-width:768px){.layout-sidebar{grid-template-columns:1fr}}
      `}</style>

      <div data-theme={dark ? "dark" : ""}>
        <nav className="page-nav">
          <Link href="/dashboard" className="back">← Dashboard</Link>
          <button className="moon-btn" onClick={() => setDark(d => { localStorage.setItem("brightness", d ? "light" : "dark"); return !d; })}>{dark ? "☀️" : "🌙"}</button>
          <Link href="/profile"><button className="nav-btn">Update Profile</button></Link>
        </nav>

        <div className="page-header">
          <div className="badge">🏛️ Government Schemes</div>
          <h1>Scheme Notifier</h1>
          <p>Upload your documents and apply for verified government subsidies directly from your dashboard.</p>
        </div>

        <div className="page-body">
          <div className="layout-sidebar">
            {/* SIDEBAR */}
            <div className="card sidebar">
              <h3 className="sidebar-title">Farmer Profile</h3>
              <div style={{ fontSize: ".85rem", color: "var(--gray-700)", marginBottom: 12 }}>Your current details:</div>
              <ul style={{ listStyle: "none", padding: 0, fontSize: ".88rem", color: "var(--green-900)", marginBottom: 20 }}>
                <li style={{ marginBottom: 8 }}>📍 <strong>State:</strong> {profile.state}</li>
                <li style={{ marginBottom: 8 }}>🌾 <strong>Crops:</strong> {profile.crops}</li>
                <li style={{ marginBottom: 8 }}>📏 <strong>Land:</strong> {profile.landArea} Acres</li>
                <li style={{ marginBottom: 8 }}>💳 <strong>Category:</strong> {profile.category}</li>
              </ul>
              <Link href="/profile" className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>Edit Profile</Link>
            </div>

            <div>
              {/* TABS */}
              <div className="tabs">
                <button className={`tab-btn ${tab === "eligible" ? "active" : ""}`} onClick={() => setTab("eligible")}>Eligible Schemes</button>
                <button className={`tab-btn ${tab === "applied" ? "active" : ""}`} onClick={() => setTab("applied")}>Applied (1)</button>
              </div>

              {/* ELIGIBLE TAB */}
              {tab === "eligible" && (
                schemes === null ? <p style={{ padding: 20, textAlign: "center", color: "var(--gray-500)" }}>Loading schemes...</p> :
                schemes.length === 0 ? <p style={{ padding: 20, textAlign: "center", color: "var(--gray-500)" }}>No schemes found.</p> :
                schemes.map((s, idx) => (
                  <div className="card" key={s._id || idx} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <h3 style={{ color: "var(--green-900)" }}>{s.name}</h3>
                      <span className="status status-success">Eligible</span>
                    </div>
                    <p style={{ fontSize: ".9rem", color: "var(--gray-700)", marginBottom: 15 }}>{s.description}</p>
                    <div style={{ display: "flex", gap: 20, marginBottom: 20, fontSize: ".85rem", background: "var(--gray-50)", padding: 10, borderRadius: "var(--radius-sm)" }}>
                      <div><strong>Benefit:</strong> {s.amount}</div>
                      <div><strong>Process:</strong> Online Upload</div>
                    </div>
                    <button className="btn btn-green" onClick={() => openApply(idx)}>Apply Now (Upload Docs)</button>
                  </div>
                ))
              )}

              {/* APPLIED TAB */}
              {tab === "applied" && (
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--green-900)" }}>Maha DBT - Farm Mechanization</h3>
                    <span className="status status-info">Under Process</span>
                  </div>
                  <p style={{ fontSize: ".9rem", color: "var(--gray-700)" }}>Application Submitted (10 Apr)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* APPLY MODAL */}
        {applyModal !== null && activeScheme && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setApplyModal(null); }}>
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">📑 Document Upload Portal</h3>
                <button className="modal-close" onClick={() => setApplyModal(null)}>✕</button>
              </div>
              <p style={{ fontSize: ".9rem", color: "var(--gray-700)", marginBottom: 20 }}>
                Please upload clear copies of the following documents for <strong>{activeScheme.name}</strong>:
              </p>
              {reqs.map(req => (
                <div className="upload-item" key={req}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "var(--green-900)", fontSize: ".9rem" }}>{req}</span>
                    <label className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
                      📎 Select File
                      <input type="file" style={{ display: "none" }} onChange={e => handleFile(req, e)} />
                    </label>
                  </div>
                  <div style={{ fontSize: ".75rem", color: files[req] ? "var(--green-600)" : "var(--gray-500)" }}>
                    {files[req] ? `✅ Selected: ${files[req]}` : "No file selected"}
                  </div>
                </div>
              ))}
              <div style={{ background: "var(--green-50)", padding: 15, borderRadius: "var(--radius-md)", marginBottom: 20, fontSize: ".85rem", color: "var(--green-800)" }}>
                ℹ️ Files must be in PDF, JPG, or PNG format (Max 5MB).
              </div>
              <button className="btn btn-green" style={{ width: "100%" }} onClick={submitApplication}>Final Submit Application</button>
            </div>
          </div>
        )}

        {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        <footer className="page-footer"><p>© 2026 CropIQ — Empowering Indian Farmers</p></footer>
      </div>
    </>
  );
}

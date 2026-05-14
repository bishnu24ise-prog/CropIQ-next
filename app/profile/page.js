"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserProfile, updateUserProfile } from "../lib/api";

export default function ProfilePage() {
  const [tab, setTab] = useState("personal");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [crops, setCrops] = useState("Wheat, Tomato");
  const [land, setLand] = useState("2.5");
  const [category, setCategory] = useState("General");

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      const u = await getUserProfile();
      if (u) {
        setName(u.name || ""); setEmail(u.email || ""); setPhone(u.phone || "");
        setState(u.state || ""); setDistrict(u.district || "");
        setCrops(u.crops || "Wheat, Tomato"); setLand(u.landArea || "2.5");
        setCategory(u.category || "General");
      }
    } catch {} finally { setLoading(false); }
  }

  function flash(m, t = "success") { setToast({ msg: m, type: t }); setTimeout(() => setToast(null), 3000); }

  async function handleSave() {
    const data = { name, phone, state, district, crops, landArea: land, category };
    try {
      const res = await updateUserProfile(data);
      if (res) {
        flash("✅ Profile updated successfully!");
        const cur = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...cur, ...data }));
      }
    } catch { flash("❌ Failed to update profile", "error"); }
  }

  function logout() {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    window.location.href = "/login";
  }

  const avatar = (name || "F").charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-900:#064e3b;--red-100:#fee2e2;--red-500:#ef4444;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-300:#d1d5db;--gray-500:#6b7280;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08);--transition:all .2s ease}
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
        .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
        .nav-btn{padding:8px 18px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;cursor:pointer;border:none;font-family:inherit;transition:var(--transition)}
        .page-body{max-width:800px;margin:0 auto;padding:32px 20px 60px}
        .card{background:var(--white);border-radius:var(--radius-md);padding:32px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06)}
        .profile-header{display:flex;align-items:center;gap:24px;margin-bottom:32px}
        .profile-avatar{width:100px;height:100px;border-radius:50%;background:var(--green-600);color:white;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:800;box-shadow:var(--shadow-md)}
        .profile-info h1{margin:0;color:var(--green-900)}
        .profile-info p{margin:4px 0 0;color:var(--gray-500);font-weight:600;font-size:.9rem}
        .tabs{display:flex;gap:4px;background:var(--gray-100);border-radius:var(--radius-sm);padding:4px;margin-bottom:24px}
        .tab-btn{flex:1;padding:10px 16px;border:none;border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;background:transparent;color:var(--gray-500);font-family:inherit;transition:var(--transition)}
        .tab-btn.active{background:var(--white);color:var(--green-900);box-shadow:0 1px 3px rgba(0,0,0,.08)}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .form-group{margin-bottom:16px}
        .form-label{display:block;font-size:.85rem;font-weight:600;color:var(--gray-700);margin-bottom:6px}
        .form-input,.form-select{width:100%;padding:10px 14px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit;transition:var(--transition)}
        .form-input:focus{border-color:var(--green-500);box-shadow:0 0 0 3px rgba(16,185,129,.12)}
        .btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;cursor:pointer;border:none;font-family:inherit;transition:var(--transition)}
        .btn-green{background:var(--green-600);color:white}.btn-green:hover{background:var(--green-700)}
        .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200}
        .toast-success{background:var(--green-600);color:white}.toast-error{background:var(--red-500);color:white}
        @media(max-width:600px){.grid-2{grid-template-columns:1fr}.profile-header{flex-direction:column;text-align:center}}
      `}</style>

      <nav className="page-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <button className="nav-btn" style={{ background: "var(--red-100)", color: "var(--red-500)" }} onClick={logout}>Logout</button>
      </nav>

      <div className="page-body">
        <div className="card">
          {loading ? (
            <p style={{ textAlign: "center", padding: 40, color: "var(--gray-500)" }}>Loading profile...</p>
          ) : (
            <>
              <div className="profile-header">
                <div className="profile-avatar">{avatar}</div>
                <div className="profile-info">
                  <h1>{name || "Farmer"}</h1>
                  <p>{email || "farmer@example.com"}</p>
                </div>
              </div>

              <div className="tabs">
                <button className={`tab-btn ${tab === "personal" ? "active" : ""}`} onClick={() => setTab("personal")}>Personal Details</button>
                <button className={`tab-btn ${tab === "farming" ? "active" : ""}`} onClick={() => setTab("farming")}>Farming Info</button>
              </div>

              {tab === "personal" && (
                <div>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">State</label><input className="form-input" value={state} onChange={e => setState(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">District</label><input className="form-input" value={district} onChange={e => setDistrict(e.target.value)} /></div>
                  </div>
                  <div style={{ marginTop: 24 }}><button className="btn btn-green" onClick={handleSave}>Save Personal Info</button></div>
                </div>
              )}

              {tab === "farming" && (
                <div>
                  <div className="form-group"><label className="form-label">Primary Crops (comma separated)</label><input className="form-input" placeholder="e.g. Wheat, Tomato, Rice" value={crops} onChange={e => setCrops(e.target.value)} /></div>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Total Land Area (Acres)</label><input type="number" className="form-input" value={land} onChange={e => setLand(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Category</label>
                      <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC/ST">SC/ST</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}><button className="btn btn-green" onClick={handleSave}>Save Farming Info</button></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

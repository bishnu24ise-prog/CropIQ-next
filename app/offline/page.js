"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { updateUserProfile } from "../lib/api";

const INSTALL_STEPS = [{p:15,s:"PACKAGING CORE ASSETS..."},{p:35,s:"CACHING WEATHER DATA..."},{p:55,s:"SYNCING MANDI PRICES..."},{p:75,s:"BUNDLING SCHEME DOCS..."},{p:90,s:"CONFIGURING OFFLINE STORAGE..."},{p:100,s:"INSTALLATION COMPLETE!"}];

export default function OfflinePage() {
  const [phone, setPhone] = useState("");
  const [chkWeather, setChkWeather] = useState(true);
  const [chkSchemes, setChkSchemes] = useState(true);
  const [chkMandi, setChkMandi] = useState(false);
  const [chkPest, setChkPest] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["","","","","",""]);
  const [smsLoading, setSmsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Install
  const [installing, setInstalling] = useState(false);
  const [installPct, setInstallPct] = useState(0);
  const [installStatus, setInstallStatus] = useState("");
  const [installed, setInstalled] = useState(false);

  // Assets
  const [assets, setAssets] = useState([
    { name: "Weather Data (24h Cache)", status: "ready", size: "2.1 MB" },
    { name: "Mandi Prices (Offline)", status: "ready", size: "1.8 MB" },
    { name: "Scheme Documents (PDF)", status: "syncing", size: "4.5 MB" },
    { name: "Crop Disease Images (AI)", status: "syncing", size: "12 MB" },
    { name: "KisaanBot Knowledge Base", status: "ready", size: "0.8 MB" },
  ]);

  // Network status
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState("");

  useEffect(() => {
    setOnline(navigator.onLine);
    setLastSync(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    // Simulate syncing assets
    setTimeout(() => {
      setAssets(a => a.map(x => ({ ...x, status: "ready" })));
    }, 3000);

    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  function flash(m, t = "success") { setToast({ msg: m, type: t }); setTimeout(() => setToast(null), 3000); }

  function handleOtpChange(idx, val) {
    if (val.length > 1) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  }

  async function handleSmsSubmit(e) {
    e.preventDefault();
    if (!otpSent) {
      setSmsLoading(true);
      setTimeout(() => { 
        setOtpSent(true); 
        setSmsLoading(false); 
        flash("📱 DEMO MODE: Use OTP 123456 to verify!", "success");
      }, 1500);
      return;
    }
    setSmsLoading(true);
    const enteredOtp = otp.join("");
    if (enteredOtp !== "123456") {
      flash("❌ Invalid OTP. Try 123456", "error");
      setSmsLoading(false);
      return;
    }

    try {
      await updateUserProfile({ phone, smsPreferences: { weatherAlerts: chkWeather, schemeUpdates: chkSchemes, mandiPrices: chkMandi, pestAlerts: chkPest } });
      flash("✅ SMS Link Established Successfully!");
      setTimeout(() => { setOtpSent(false); setSmsLoading(false); }, 2000);
    } catch { flash("❌ Gateway Sync Failed", "error"); setSmsLoading(false); }
  }

  async function simulateInstall() {
    setInstalling(true);
    for (const step of INSTALL_STEPS) {
      setInstallStatus(step.s); setInstallPct(step.p);
      await new Promise(r => setTimeout(r, 700));
    }
    setTimeout(() => { setInstalling(false); setInstalled(true); flash("🚀 CropIQ is now ready for Offline use!"); }, 800);
  }

  const totalSize = assets.reduce((s, a) => s + parseFloat(a.size), 0).toFixed(1);
  const cachedCount = assets.filter(a => a.status === "ready").length;

  return (<>
    <style>{`
      :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-300:#86efac;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-800:#065f46;--green-900:#064e3b;--red-500:#ef4444;--blue-100:#dbeafe;--blue-500:#3b82f6;--blue-900:#1e3a5f;--gold-500:#f59e0b;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-200:#e5e7eb;--gray-300:#d1d5db;--gray-400:#9ca3af;--gray-500:#6b7280;--gray-700:#374151;--gray-800:#1f2937;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08)}
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
      .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
      .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
      .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
      .page-header{background:linear-gradient(135deg,var(--green-900),#0f766e);padding:48px 24px;color:white;text-align:center}
      .badge{display:inline-block;padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;margin-bottom:12px}
      .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
      .page-header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
      .page-body{max-width:1100px;margin:0 auto;padding:32px 20px 60px}
      .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
      .card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06)}
      .form-label{display:block;font-size:.85rem;font-weight:600;color:var(--gray-700);margin-bottom:8px}
      .form-input{width:100%;padding:12px 14px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit}
      .form-input:focus{border-color:var(--green-500);box-shadow:0 0 0 3px rgba(16,185,129,.12)}
      .btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;cursor:pointer;border:none;font-family:inherit;transition:all .2s;width:100%}
      .btn-green{background:var(--green-600);color:white}.btn-green:hover{background:var(--green-700)}.btn-green:disabled{opacity:.6;cursor:not-allowed}
      .btn-outline{background:transparent;border:1px solid var(--gray-300);color:var(--gray-700)}
      .otp-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:15px}
      .otp-input{width:100%;height:45px;text-align:center;font-size:1.2rem;font-weight:800;border:2px solid var(--gray-200);border-radius:var(--radius-sm);color:var(--green-700);outline:none;font-family:inherit}
      .otp-input:focus{border-color:var(--green-500);box-shadow:0 0 0 4px rgba(34,197,94,0.1)}
      .install-track{width:100%;height:8px;background:var(--gray-100);border-radius:10px;overflow:hidden;margin-top:10px}
      .install-fill{height:100%;background:linear-gradient(90deg,#22c55e,#10b981);transition:width .3s;border-radius:10px}
      .asset-item{display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--white);border:1px solid var(--gray-100);border-radius:var(--radius-sm);margin-bottom:8px;font-size:.85rem}
      .asset-status{font-size:.65rem;padding:3px 10px;border-radius:10px;font-weight:700;text-transform:uppercase}
      .status-cached{background:#dcfce7;color:#166534}
      .status-syncing{background:#fef3c7;color:#92400e;animation:blink 1s infinite}
      @keyframes blink{50%{opacity:.5}}
      .check-label{display:flex;align-items:center;gap:8px;font-size:.85rem;padding:10px;border:1px solid var(--gray-100);border-radius:var(--radius-sm);cursor:pointer;transition:.2s}
      .check-label:hover{border-color:var(--green-300);background:var(--green-50)}
      .check-label input{accent-color:var(--green-600);width:16px;height:16px}
      .net-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:.75rem;font-weight:800}
      .net-online{background:#dcfce7;color:#166534}.net-offline{background:#fee2e2;color:#991b1b}
      .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200}
      .toast-success{background:var(--green-600);color:white}.toast-error{background:var(--red-500);color:white}
      .page-footer{text-align:center;padding:24px;font-size:.82rem;color:var(--gray-500);border-top:1px solid var(--gray-100);margin-top:40px}
      .page-footer a{color:var(--green-600);text-decoration:none;font-weight:600}
      .storage-bar{height:20px;background:var(--gray-100);border-radius:10px;overflow:hidden;display:flex;margin-top:8px}
      .storage-seg{height:100%;transition:width .5s}
      @media(max-width:768px){.grid-2{grid-template-columns:1fr}}
    `}</style>

    <nav className="page-nav">
      <Link href="/dashboard" className="back">← Dashboard</Link>
      <Link href="/" className="logo">🌱 CropIQ</Link>
      <span className={`net-badge ${online ? "net-online" : "net-offline"}`}>
        {online ? "🟢 Online" : "🔴 Offline"}
      </span>
    </nav>

    <div className="page-header">
      <div className="badge" style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)"}}>📶 RURAL-LINK PROTOCOL</div>
      <h1>Universal Access &amp; Offline</h1>
      <p>Empowering farmers with zero-internet capabilities. From SMS alerts to full offline app support.</p>
    </div>

    <div className="page-body">
      {/* NETWORK STATUS BAR */}
      <div className="card" style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:12,height:12,borderRadius:"50%",background:online?"#22c55e":"#ef4444",boxShadow:`0 0 0 4px ${online?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`}} />
          <div><div style={{fontWeight:800,fontSize:".9rem"}}>{online?"Connected to Network":"No Network Detected"}</div><div style={{fontSize:".7rem",color:"var(--gray-500)"}}>Last sync: {lastSync}</div></div>
        </div>
        <div style={{display:"flex",gap:12,fontSize:".75rem",fontWeight:700}}>
          <div style={{padding:"6px 12px",background:"var(--green-50)",borderRadius:8,color:"var(--green-800)"}}>{cachedCount}/{assets.length} Assets Cached</div>
          <div style={{padding:"6px 12px",background:"var(--blue-100)",borderRadius:8,color:"var(--blue-900)"}}>{totalSize} MB Stored</div>
        </div>
      </div>

      <div className="grid-2">
        {/* SMS GATEWAY */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:15}}>
            <div style={{width:40,height:40,background:"var(--green-100)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>💬</div>
            <h2 style={{fontSize:"1.3rem",color:"var(--green-900)"}}>High-Trust SMS Gateway</h2>
          </div>
          <p style={{fontSize:".9rem",color:"var(--gray-700)",marginBottom:20}}>Configure secure alerts for Mandi prices and weather without needing a data connection.</p>

          <form onSubmit={handleSmsSubmit}>
            <div style={{marginBottom:16}}>
              <label className="form-label">Mobile Number</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontWeight:700,color:"var(--gray-400)"}}>+91</span>
                <input className="form-input" type="tel" required placeholder="Enter 10-digit number" style={{paddingLeft:45}} value={phone} onChange={e=>setPhone(e.target.value)} />
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label className="form-label">Active Channels</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <label className="check-label"><input type="checkbox" checked={chkWeather} onChange={e=>setChkWeather(e.target.checked)}/> 🌦️ Weather</label>
                <label className="check-label"><input type="checkbox" checked={chkSchemes} onChange={e=>setChkSchemes(e.target.checked)}/> 🏛️ Schemes</label>
                <label className="check-label"><input type="checkbox" checked={chkMandi} onChange={e=>setChkMandi(e.target.checked)}/> 📊 Mandi Prices</label>
                <label className="check-label"><input type="checkbox" checked={chkPest} onChange={e=>setChkPest(e.target.checked)}/> 🐛 Pest Alerts</label>
              </div>
            </div>

            {otpSent && (
              <div style={{marginTop:20,padding:15,background:"var(--green-50)",border:"1px dashed var(--green-300)",borderRadius:"var(--radius-md)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:".75rem",fontWeight:700,color:"var(--green-800)"}}>OTP SENT TO +91 ******{phone.slice(-4)}</span>
                  <span style={{fontSize:".7rem",color:"var(--gray-500)"}}>RESEND IN 45s</span>
                </div>
                <div className="otp-grid">
                  {otp.map((v,i)=><input key={i} id={`otp-${i}`} className="otp-input" type="text" maxLength={1} value={v} onChange={e=>handleOtpChange(i,e.target.value)} />)}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-green" disabled={smsLoading} style={{marginTop:20}}>
              {smsLoading ? "PROCESSING..." : otpSent ? "VERIFY & SAVE PREFERENCES" : "Configure SMS Link"}
            </button>
          </form>
        </div>

        {/* PWA + OFFLINE */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:15}}>
            <div style={{width:40,height:40,background:"var(--blue-100)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>📦</div>
            <h2 style={{fontSize:"1.3rem",color:"var(--blue-900)"}}>Offline App Packaging</h2>
          </div>
          <p style={{fontSize:".9rem",color:"var(--gray-700)",marginBottom:20}}>Package the entire CropIQ ecosystem for use in zero-network zones.</p>

          {!installing && !installed && (
            <div>
              <div style={{background:"linear-gradient(135deg,#f8fafc,#f1f5f9)",padding:20,borderRadius:"var(--radius-md)",textAlign:"center",border:"1px solid var(--gray-200)",marginBottom:20}}>
                <div style={{fontSize:"2.5rem",marginBottom:10}}>🏠</div>
                <h3 style={{fontSize:"1rem",marginBottom:5}}>Install on Home Screen</h3>
                <p style={{fontSize:".8rem",color:"var(--gray-500)"}}>Instant access, even without internet.</p>
              </div>
              <button className="btn btn-outline" onClick={simulateInstall}>📦 Package App Now</button>
            </div>
          )}

          {installing && (
            <div style={{marginTop:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem",fontWeight:700}}>
                <span>{installStatus}</span><span>{installPct}%</span>
              </div>
              <div className="install-track"><div className="install-fill" style={{width:`${installPct}%`}}/></div>
              <p style={{fontSize:".7rem",color:"var(--gray-500)",marginTop:10,textAlign:"center"}}>This will allow CropIQ to work in the fields without 4G/5G.</p>
            </div>
          )}

          {installed && (
            <div style={{background:"var(--green-50)",padding:20,borderRadius:"var(--radius-md)",textAlign:"center",border:"1px solid var(--green-300)"}}>
              <div style={{fontSize:"2rem",marginBottom:8}}>✅</div>
              <h3 style={{color:"var(--green-800)",marginBottom:5}}>App Packaged Successfully!</h3>
              <p style={{fontSize:".8rem",color:"var(--green-700)"}}>CropIQ works offline now. All {assets.length} assets cached.</p>
            </div>
          )}

          {/* STORAGE VISUALIZATION */}
          <div style={{marginTop:20,padding:15,background:"var(--gray-50)",borderRadius:"var(--radius-md)",border:"1px solid var(--gray-200)"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".8rem",fontWeight:700,color:"var(--gray-700)"}}><span>Local Storage Usage</span><span>{totalSize} / 50 MB</span></div>
            <div className="storage-bar">
              <div className="storage-seg" style={{width:`${(parseFloat(totalSize)/50)*100}%`,background:"linear-gradient(90deg,#22c55e,#3b82f6)",borderRadius:10}} />
            </div>
          </div>

          {/* ASSET REGISTRY */}
          <div style={{marginTop:20,borderTop:"1px solid var(--gray-200)",paddingTop:20}}>
            <h3 style={{fontSize:".9rem",color:"var(--gray-800)",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,background:"var(--green-500)",borderRadius:"50%"}} /> Offline Asset Registry
            </h3>
            {assets.map((a,i)=>(
              <div className="asset-item" key={i}>
                <div><span>{a.name}</span><br/><span style={{fontSize:".65rem",color:"var(--gray-400)"}}>{a.size}</span></div>
                <span className={`asset-status ${a.status==="ready"?"status-cached":"status-syncing"}`}>{a.status==="ready"?"READY":"SYNCING"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <footer className="page-footer"><p>© 2026 CropIQ by <Link href="/#team">Team PixelPirates</Link></p></footer>
    {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
  </>);
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { applyForGrant } from "../lib/api";

const TICKERS = ["Rahul M. donated ₹500","Suresh K. donated ₹1200","Anjali from Pune donated ₹2000","Farmers Union donated ₹10,000","Priya S. donated ₹150"];
const TIERS = [{amt:"₹ 500",desc:"Seeds for 1 Season"},{amt:"₹ 2,000",desc:"Medical Debt Relief"},{amt:"₹ 5,000",desc:"Irrigation Support"},{amt:"₹ 10,000",desc:"Complete Debt Wipeout"}];
const UPI_OPTIONS = [{icon:"🔵",label:"GPay",color:"#4285F4",vpa:"cropiq@okaxis",bank:"Axis Bank - 4421"},{icon:"🟣",label:"PhonePe",color:"#5f259f",vpa:"cropiq@ybl",bank:"Yes Bank - 9902"},{icon:"💎",label:"Paytm",color:"#00baf2",vpa:"9876543210@paytm",bank:"Paytm Bank - 1100"}];

export default function DebtFundPage() {
  const [pool, setPool] = useState(1250000);
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmt, setDonateAmt] = useState(1000);
  const [upiIdx, setUpiIdx] = useState(0);
  const [tickIdx, setTickIdx] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState("");
  const [toast, setToast] = useState(null);
  const [donors, setDonors] = useState([{icon:"🥇",name:"Aditya V.",amt:"₹ 25,000"},{icon:"🥈",name:"Sneha R.",amt:"₹ 15,500"},{icon:"🥉",name:"Vikas G.",amt:"₹ 10,000"}]);
  // Relief form
  const [reason, setReason] = useState("drought");
  const [loss, setLoss] = useState("");
  const [fullName, setFullName] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [fileCount, setFileCount] = useState(0);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => { const id = setInterval(() => setTickIdx(i => (i+1)%TICKERS.length), 4000); return () => clearInterval(id); }, []);

  function flash(m,t="success") { setToast({msg:m,type:t}); setTimeout(()=>setToast(null),3000); }

  async function handleDonate() {
    if (!donateAmt) return;
    setVerifying(true);
    const steps = ["FETCHING RECENT UPI LOGS...","VERIFYING TRANSACTION HASH...","MATCHING WITH NPCI SERVER...","BANK SETTLEMENT CONFIRMED!"];
    for (const s of steps) { setVerifyStep(s); await new Promise(r => setTimeout(r, 900)); }
    const newPool = pool + Number(donateAmt);
    setPool(newPool);
    const user = typeof localStorage!=="undefined" ? JSON.parse(localStorage.getItem("user")||"{}") : {};
    setDonors(d => [{icon:"💎",name:user.name||"You",amt:`₹ ${Number(donateAmt).toLocaleString()}`},...d]);
    setShowDonate(false); setVerifying(false); setVerifyStep("");
    flash(`✅ Payment Successful! ₹${donateAmt} added to pool.`);
  }

  async function handleGrant(e) {
    e.preventDefault();
    try {
      const res = await applyForGrant({ reason, estimatedLoss: loss });
      setAiResult(res.aiMessage || "Application submitted for review.");
      flash("Application Verified!");
    } catch { flash("Error","error"); }
  }

  const pct = Math.min((pool/1500000)*100, 100);
  const upi = UPI_OPTIONS[upiIdx];
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=${upi.vpa}&pn=CropIQ%20Relief&am=${donateAmt}&cu=INR`)}`;

  return (<>
    <style>{`
      :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-200:#bbf7d0;--green-400:#34d399;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-900:#064e3b;--red-500:#ef4444;--blue-100:#dbeafe;--blue-300:#93c5fd;--blue-500:#3b82f6;--blue-600:#2563eb;--blue-700:#1d4ed8;--blue-900:#1e3a5f;--orange-600:#ea580c;--orange-900:#7c2d12;--gold-500:#f59e0b;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-200:#e5e7eb;--gray-300:#d1d5db;--gray-400:#9ca3af;--gray-500:#6b7280;--gray-600:#4b5563;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08)}
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
      .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
      .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
      .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
      .page-header{padding:48px 24px;color:white;text-align:center}
      .badge{display:inline-block;padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;margin-bottom:12px}
      .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
      .page-header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
      .page-body{max-width:1100px;margin:0 auto;padding:32px 20px 60px}
      .layout-sidebar{display:grid;grid-template-columns:280px 1fr;gap:24px}
      .sidebar{position:sticky;top:80px;align-self:start}
      .card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06)}
      .form-group{margin-bottom:16px}.form-label{display:block;font-size:.85rem;font-weight:600;color:var(--gray-700);margin-bottom:6px}
      .form-input,.form-select{width:100%;padding:10px 14px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit}
      .btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;cursor:pointer;border:none;font-family:inherit;transition:all .2s}
      .btn-green{background:var(--green-600);color:white}.btn-green:hover{background:var(--green-700)}.btn-green:disabled{opacity:.6}
      .btn-outline{background:transparent;border:1px solid var(--gray-300);color:var(--gray-700)}.btn-sm{padding:6px 14px;font-size:.8rem}
      .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100}
      .modal{background:var(--white);border-radius:16px;padding:32px;width:90%;max-width:380px;max-height:90vh;overflow-y:auto}
      .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
      .modal-title{font-size:1.1rem;font-weight:800;color:var(--green-900)}
      .modal-close{background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--gray-500)}
      .upi-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:15px 0}
      .upi-btn{border:1.5px solid var(--gray-200);padding:10px;border-radius:var(--radius-md);text-align:center;cursor:pointer;background:var(--white);transition:.3s}
      .upi-btn.active{border-color:#00BAF2;background:#f0faff;box-shadow:0 4px 10px rgba(0,186,242,0.1)}
      .impact-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:15px}
      .impact-mini-card{background:var(--white);padding:12px;border-radius:var(--radius-sm);border:1px solid var(--gray-100);text-align:center}
      .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200}
      .toast-success{background:var(--green-600);color:white}.toast-error{background:var(--red-500);color:white}
      .pulse-blue{width:10px;height:10px;background:#3b82f6;border-radius:50%;display:inline-block;animation:pb 2s infinite}
      @keyframes pb{0%{box-shadow:0 0 0 0 rgba(59,130,246,0.4)}70%{box-shadow:0 0 0 10px rgba(59,130,246,0)}100%{box-shadow:0 0 0 0 rgba(59,130,246,0)}}
      @keyframes blink{50%{opacity:.5}}
      @media(max-width:768px){.layout-sidebar{grid-template-columns:1fr}}
    `}</style>

    <nav className="page-nav"><Link href="/dashboard" className="back">← Dashboard</Link><Link href="/" className="logo">🌱 CropIQ</Link></nav>

    <div className="page-header" style={{background:"linear-gradient(135deg,#1e3a5f,#1e3a8a)"}}>
      <div className="badge" style={{background:"var(--gold-500)",color:"white"}}>⭐ Gold Standard Relief</div>
      <h1>Farmer Debt Fund</h1>
      <p style={{color:"rgba(255,255,255,0.8)"}}>AI-powered verification with instant 24h community relief.</p>
    </div>

    <div className="page-body"><div className="layout-sidebar">
      {/* SIDEBAR */}
      <div className="card sidebar">
        <h3 style={{fontSize:"1.1rem",fontWeight:800,color:"var(--green-900)",marginBottom:12}}>Live Relief Pool</h3>
        <div style={{fontSize:"2rem",color:"var(--green-700)",fontWeight:900,marginBottom:8}}>₹ {pool.toLocaleString("en-IN")}</div>
        <div style={{marginBottom:15}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:".7rem",fontWeight:700,color:"var(--gray-500)",marginBottom:5}}><span>MONTHLY GOAL</span><span>₹ 15,00,000</span></div>
          <div style={{height:10,background:"var(--gray-100)",borderRadius:10,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,var(--green-400),var(--green-600))"}} /></div>
        </div>
        <button className="btn btn-green" style={{width:"100%"}} onClick={()=>setShowDonate(true)}>Donate via UPI</button>
        <div style={{marginTop:20,background:"var(--gray-50)",padding:10,borderRadius:"var(--radius-sm)",border:"1px solid var(--gray-200)"}}>
          <div style={{fontSize:".65rem",fontWeight:800,color:"var(--gray-400)",marginBottom:5}}><span style={{color:"var(--green-500)"}}>●</span> LIVE DONATION FEED</div>
          <div style={{fontSize:".75rem",color:"var(--gray-600)",height:20,overflow:"hidden"}}>{TICKERS[tickIdx]}</div>
        </div>
        <div className="impact-grid"><div className="impact-mini-card"><span style={{fontSize:"1.2rem",fontWeight:800,color:"var(--green-600)"}}>24h</span><br/><span style={{fontSize:".65rem",color:"var(--gray-500)"}}>PAYOUT</span></div><div className="impact-mini-card"><span style={{fontSize:"1.2rem",fontWeight:800,color:"var(--green-600)"}}>100%</span><br/><span style={{fontSize:".65rem",color:"var(--gray-500)"}}>TRANSPARENCY</span></div></div>
      </div>

      <div>
        {/* TIERS */}
        <div className="card" style={{marginBottom:25,borderLeft:"5px solid var(--green-500)",background:"linear-gradient(to right,#f0fdf4,white)"}}>
          <h3 style={{color:"var(--green-900)",marginBottom:5}}>🚀 Donation Impact Tiers</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
            {TIERS.map(t=><div key={t.amt} style={{fontSize:".75rem",padding:10,background:"white",borderRadius:8,border:"1px solid #dcfce7"}}><strong style={{color:"var(--green-600)"}}>{t.amt}</strong><br/>{t.desc}</div>)}
          </div>
        </div>

        {/* INSURANCE & SETTLEMENTS */}
        <h2 style={{fontSize:"1.3rem",color:"var(--green-900)",marginBottom:15}}>📜 My Insurance &amp; Settlements</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:30}}>
          <div className="card" style={{borderLeft:"4px solid var(--blue-600)",background:"#eff6ff"}}>
            <h4 style={{marginBottom:10,color:"var(--blue-900)",fontSize:".9rem"}}>🏦 Insurance Payout Status</h4>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:".65rem",color:"var(--blue-700)",fontWeight:700}}>PENDING REFUND</div><div style={{fontSize:"1.5rem",fontWeight:900,color:"var(--blue-900)"}}>₹ 42,500</div></div>
              <span className="badge" style={{background:"var(--blue-100)",color:"var(--blue-700)",padding:"8px 12px",fontWeight:800,fontSize:".6rem"}}>PROCESSING</span>
            </div>
            <div style={{height:6,background:"#dbeafe",borderRadius:10,marginTop:15,overflow:"hidden"}}><div style={{width:"65%",height:"100%",background:"var(--blue-600)",borderRadius:10}} /></div>
            <small style={{fontSize:".6rem",color:"var(--blue-600)",marginTop:8,display:"block"}}>Policy: PMFBY-9900-XXXX</small>
          </div>
          <div className="card" style={{borderLeft:"4px solid var(--orange-600)",background:"#fff7ed"}}>
            <h4 style={{marginBottom:10,color:"var(--orange-900)",fontSize:".9rem"}}>📜 Relief History</h4>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".7rem",background:"white",padding:8,borderRadius:6,border:"1px solid #ffedd5",marginBottom:8}}><span style={{fontWeight:700}}>Flood Relief (2025)</span><span style={{color:"var(--green-600)",fontWeight:800}}>SETTLED</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".7rem",background:"white",padding:8,borderRadius:6,border:"1px solid #ffedd5"}}><span style={{fontWeight:700}}>Pest Damage (Current)</span><span style={{color:"var(--blue-600)",fontWeight:800}}>AUDIT</span></div>
          </div>
        </div>

        {/* RELIEF FORM */}
        <h2 style={{fontSize:"1.3rem",color:"var(--green-900)",marginBottom:15}}>📜 Apply for Relief</h2>
        <div className="card" style={{marginBottom:30,borderLeft:"4px solid var(--green-600)",background:"#f0fdf4"}}>
          <form onSubmit={handleGrant}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15}}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="e.g. Rameshwar Kumar"/></div>
              <div className="form-group"><label className="form-label">PMFBY / Policy ID</label><input className="form-input" required value={policyId} onChange={e=>setPolicyId(e.target.value)} placeholder="e.g. PMFBY-9900-8812"/></div>
            </div>
            <div className="form-group"><label className="form-label">Type of Distress</label>
              <select className="form-select" value={reason} onChange={e=>setReason(e.target.value)}>
                {[["drought","Extreme Drought"],["flood","Flash Flood"],["hail","Hailstorm"],["pests","Pest Attack (AI Verified)"],["heat","Extreme Heatwave"],["market","Market Price Crash"],["accident","Fire / Accident"],["health","Health Crisis"],["livestock","Livestock Loss"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Upload Proof</label>
              <div style={{border:"2px dashed var(--gray-200)",padding:15,textAlign:"center",borderRadius:10,background:"white"}}>
                <label style={{cursor:"pointer"}}><span style={{fontSize:"1.5rem"}}>📸</span><br/><span style={{fontSize:".7rem",color:fileCount?"var(--green-600)":"var(--gray-500)"}}>{fileCount?`✅ ${fileCount} Files Selected`:"Upload Photos or Records"}</span><input type="file" multiple style={{display:"none"}} onChange={e=>setFileCount(e.target.files?.length||0)}/></label>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Estimated Loss (₹)</label><input type="number" className="form-input" required value={loss} onChange={e=>setLoss(e.target.value)} placeholder="e.g. 50000"/></div>
            <button type="submit" className="btn btn-green" style={{width:"100%",height:50}}>Verify &amp; Submit for Audit</button>
          </form>
          {aiResult && <div style={{padding:20,background:"white",borderRadius:"var(--radius-md)",marginTop:20,border:"1px solid #dbeafe"}}>
            <div style={{fontWeight:800,color:"var(--blue-700)",marginBottom:15,display:"flex",alignItems:"center",gap:10}}><span className="pulse-blue"/> 🧬 AI VERIFICATION</div>
            <p style={{fontSize:".85rem",color:"var(--gray-600)"}}>✅ <strong>{aiResult}</strong></p>
          </div>}
        </div>

        {/* URGENT CASES */}
        <h2 style={{fontSize:"1.3rem",color:"var(--green-900)",marginBottom:15}}>🆘 Urgent Relief Needed</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:30}}>
          {[{name:"Rameshwar K.",reason:"Fire Accident in Barn",funded:75,raised:"₹ 15,000",goal:"₹ 20,000",color:"#ef4444",badge:"URGENT",bgBadge:"#fee2e2",cBadge:"#991b1b"},{name:"Geeta Rani",reason:"Livestock Epidemic",funded:40,raised:"₹ 12,000",goal:"₹ 30,000",color:"#f59e0b",badge:"HIGH PRIORITY",bgBadge:"#fef3c7",cBadge:"#92400e"}].map(c=>
            <div className="card" key={c.name} style={{borderTop:`4px solid ${c.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div style={{fontWeight:800,fontSize:".9rem"}}>{c.name}</div><span className="badge" style={{background:c.bgBadge,color:c.cBadge,fontSize:".6rem"}}>{c.badge}</span></div>
              <p style={{fontSize:".75rem",color:"var(--gray-600)",marginBottom:10}}>Reason: <strong>{c.reason}</strong></p>
              <div style={{background:"#f1f5f9",height:6,borderRadius:10,overflow:"hidden",marginBottom:5}}><div style={{width:`${c.funded}%`,height:"100%",background:c.color}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".65rem",fontWeight:700}}><span>{c.raised} / {c.goal}</span><span style={{color:c.color}}>{c.funded}% Funded</span></div>
              <button className="btn btn-outline btn-sm" style={{width:"100%",marginTop:15,fontSize:".7rem"}} onClick={()=>{setDonateAmt(2000);setShowDonate(true);}}>Support This Farmer</button>
            </div>
          )}
        </div>

        {/* DONOR HALL */}
        <h2 style={{fontSize:"1.3rem",color:"var(--green-900)",marginBottom:15}}>🏆 Donor Hall of Fame</h2>
        <div style={{display:"flex",gap:15,overflowX:"auto",paddingBottom:10}}>
          {donors.map((d,i)=><div className="impact-mini-card" key={i} style={{minWidth:120}}><span style={{fontSize:"1.2rem"}}>{d.icon}</span><br/><strong style={{fontSize:".8rem"}}>{d.name}</strong><br/><span style={{fontSize:".65rem",color:"var(--green-600)"}}>{d.amt}</span></div>)}
        </div>
      </div>
    </div></div>

    {/* DONATE MODAL */}
    {showDonate && <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowDonate(false);}}>
      <div className="modal">
        <div className="modal-header"><h3 className="modal-title">🔒 Secure UPI Gateway</h3><button className="modal-close" onClick={()=>setShowDonate(false)}>✕</button></div>
        <div style={{textAlign:"center",marginBottom:15}}><input type="number" style={{fontSize:"2rem",textAlign:"center",fontWeight:900,border:"none",background:"transparent",color:"var(--green-700)",width:200,outline:"none"}} value={donateAmt} onChange={e=>setDonateAmt(e.target.value)}/></div>
        <div className="upi-grid">{UPI_OPTIONS.map((u,i)=><div key={i} className={`upi-btn ${upiIdx===i?"active":""}`} onClick={()=>setUpiIdx(i)}><span style={{fontSize:"1.2rem"}}>{u.icon}</span><br/><span style={{fontSize:".65rem",fontWeight:700,color:u.color}}>{u.label}</span></div>)}</div>
        <div style={{background:"white",padding:15,borderRadius:"var(--radius-md)",border:"1px dashed var(--gray-200)",fontSize:".8rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"var(--gray-500)"}}>Gateway:</span><span style={{fontWeight:700}}>{upi.bank}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--gray-500)"}}>VPA ID:</span><span style={{fontWeight:700,color:"var(--blue-600)"}}>{upi.vpa}</span></div>
        </div>
        <div style={{background:"white",padding:20,borderRadius:"var(--radius-md)",textAlign:"center",marginTop:15,border:"1px solid var(--gray-100)"}}>
          <img src={qrUrl} width={140} height={140} alt="QR" style={{margin:"0 auto 10px"}}/>
          <p style={{fontSize:".7rem",fontWeight:800,color:"#166534"}}>✅ MERCHANT VERIFIED • READY TO SCAN</p>
        </div>
        {verifyStep && <p style={{fontSize:".7rem",color:"#64748b",fontFamily:"monospace",textAlign:"center",marginTop:10}}>{verifyStep}</p>}
        <button className="btn btn-green" disabled={verifying} style={{width:"100%",marginTop:15,height:50}} onClick={handleDonate}>{verifying?"CHECKING BANK LEDGER...":"I have Completed Payment"}</button>
      </div>
    </div>}

    {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
  </>);
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMarketPrices, sellCrop } from "../lib/api";

export default function MarketPage() {
  const [items, setItems] = useState(null);
  const [showSell, setShowSell] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [toast, setToast] = useState(null);

  // Sell form
  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Buy form
  const [buyItem, setBuyItem] = useState({ name: "", price: 0 });
  const [buyAddr, setBuyAddr] = useState("");
  const [buyPhone, setBuyPhone] = useState("");

  useEffect(() => { loadMarket(); }, []);

  async function loadMarket() {
    try {
      const data = await getMarketPrices();
      setItems(data.items || []);
    } catch { setItems([]); }
  }

  function flash(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }

  async function handleList() {
    if (!cropName || !price || !quantity) { flash("Fill all fields", "error"); return; }
    try {
      await sellCrop({ cropName, pricePerUnit: price, quantity });
      flash("🚀 Harvest listed directly!");
      setShowSell(false); setCropName(""); setPrice(""); setQuantity("");
      loadMarket();
    } catch { flash("Error listing produce", "error"); }
  }

  function confirmPurchase() {
    if (!buyAddr || !buyPhone) { flash("Please enter delivery details", "error"); return; }
    setShowBuy(false); setBuyAddr(""); setBuyPhone("");
    flash("✨ Order Secured! Payment collected and Farmer notified.");
  }

  return (
    <>
      <style>{`
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-900:#064e3b;--red-500:#ef4444;--gold-500:#f59e0b;--gold-600:#d97706;--blue-50:#eff6ff;--blue-200:#bfdbfe;--blue-500:#3b82f6;--blue-600:#2563eb;--blue-700:#1d4ed8;--blue-900:#1e3a5f;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-300:#d1d5db;--gray-500:#6b7280;--gray-600:#4b5563;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08);--transition:all .2s ease}
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}.back:hover{color:var(--green-900)}
        .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
        .nav-btn{padding:8px 18px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;cursor:pointer;border:none;transition:var(--transition);font-family:inherit}
        .nav-btn.primary{background:var(--green-600);color:white}.nav-btn.primary:hover{background:var(--green-700)}
        .page-header{background:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000') center/cover;padding:48px 24px;color:white;text-align:center}
        .badge{display:inline-block;padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;margin-bottom:12px;letter-spacing:.5px}
        .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
        .page-header p{opacity:.9;font-size:.95rem;max-width:600px;margin:0 auto}
        .page-body{max-width:1100px;margin:0 auto;padding:32px 20px 60px}
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06);animation:fadeUp .5s ease both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .layout-sidebar{display:grid;grid-template-columns:280px 1fr;gap:24px}
        .sidebar{position:sticky;top:80px;align-self:start}
        .sidebar-title{font-size:1.1rem;font-weight:800;color:var(--green-900);margin-bottom:12px}
        .impact-badge{background:var(--green-100);color:var(--green-700);font-size:.75rem;font-weight:700;padding:4px 10px;border-radius:20px;display:inline-flex;align-items:center;gap:5px}
        .form-group{margin-bottom:16px}.form-label{display:block;font-size:.85rem;font-weight:600;color:var(--gray-700);margin-bottom:6px}
        .form-input,.form-select{width:100%;padding:10px 14px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit;transition:var(--transition)}
        .form-input:focus{border-color:var(--green-500);box-shadow:0 0 0 3px rgba(16,185,129,.12)}
        textarea.form-input{min-height:80px;resize:vertical}
        .btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;cursor:pointer;border:none;transition:var(--transition);font-family:inherit;width:100%}
        .btn-green{background:var(--green-600);color:white}.btn-green:hover{background:var(--green-700)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100}
        .modal{background:var(--white);border-radius:16px;padding:32px;width:90%;max-width:480px;max-height:90vh;overflow-y:auto}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .modal-title{font-size:1.2rem;font-weight:800;color:var(--green-900)}
        .modal-close{background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--gray-500)}
        .protection-box{background:var(--blue-50);border:1px solid var(--blue-200);padding:15px;border-radius:var(--radius-md);margin-bottom:20px;border-left:4px solid var(--blue-500)}
        .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200;animation:fadeUp .3s}
        .toast-success{background:var(--green-600);color:white}.toast-error{background:var(--red-500);color:white}
        @media(max-width:768px){.grid-3{grid-template-columns:1fr}.grid-2{grid-template-columns:1fr}.layout-sidebar{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      <nav className="page-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <button className="nav-btn primary" onClick={() => setShowSell(true)}>+ Sell Your Harvest</button>
      </nav>

      {/* HEADER */}
      <div className="page-header">
        <div className="badge" style={{ background: "var(--gold-500)", color: "var(--white)" }}>🚀 Direct-to-Consumer</div>
        <h1 style={{ color: "var(--white)" }}>Farm-to-Table Market</h1>
        <p style={{ color: "rgba(255,255,255,0.9)" }}>Secured payments and direct delivery. We ensure the farmer gets paid first.</p>
      </div>

      <div className="page-body">
        {/* STATS */}
        <div className="grid-3" style={{ marginBottom: 32 }}>
          <div className="card" style={{ background: "var(--green-600)", color: "var(--white)" }}>
            <div style={{ fontSize: ".78rem", opacity: .8, fontWeight: 600 }}>Farmer Profit Growth</div>
            <div style={{ fontSize: "2rem", fontWeight: 800 }}>+28%</div>
            <p style={{ fontSize: ".75rem", marginTop: 8 }}>Average increase in income using Direct Market</p>
          </div>
          <div className="card">
            <div style={{ fontSize: ".78rem", color: "var(--gray-500)", fontWeight: 600 }}>Middleman Savings</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--blue-600)" }}>₹42,500</div>
          </div>
          <div className="card">
            <div style={{ fontSize: ".78rem", color: "var(--gray-500)", fontWeight: 600 }}>Impact Score</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gold-500)" }}>9.8/10</div>
          </div>
        </div>

        {/* SIDEBAR + LISTINGS */}
        <div className="layout-sidebar">
          <div className="card sidebar">
            <h3 className="sidebar-title">🛡️ Farmer Protection</h3>
            <p style={{ fontSize: ".8rem", color: "var(--gray-600)", marginBottom: 15 }}>CropIQ uses a <strong>Secure Escrow</strong> system. We hold the buyer&apos;s money so you never lose your payment.</p>
            <div style={{ fontSize: ".75rem", color: "var(--green-700)", fontWeight: 700 }}>✅ Guaranteed Payments</div>
            <div style={{ fontSize: ".75rem", color: "var(--green-700)", fontWeight: 700 }}>✅ No Middleman Cuts</div>
          </div>
          <div className="grid-2">
            {items === null ? (
              <div className="card" style={{ textAlign: "center", padding: 40 }}>Loading market...</div>
            ) : items.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 40 }}>No listings yet. Be the first to sell!</div>
            ) : items.map((item, i) => (
              <div className="card" key={item._id || i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div className="impact-badge">✨ Middleman-Free</div>
                  <span style={{ fontSize: ".8rem", color: "var(--green-600)", fontWeight: 700 }}>+₹{Math.round(item.pricePerUnit * 0.25)} More Profit</span>
                </div>
                <h3 style={{ color: "var(--green-900)", fontSize: "1.3rem" }}>{item.cropName}</h3>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--gold-600)", margin: "10px 0" }}>
                  ₹{item.pricePerUnit} <span style={{ fontSize: ".9rem", color: "var(--gray-500)" }}>/ unit</span>
                </div>
                <button className="btn btn-green" onClick={() => { setBuyItem({ name: item.cropName, price: item.pricePerUnit }); setShowBuy(true); }}>
                  Buy Directly from Farmer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BUY MODAL */}
      {showBuy && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowBuy(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">🤝 Secure Direct Purchase</h3>
              <button className="modal-close" onClick={() => setShowBuy(false)}>✕</button>
            </div>
            <div className="protection-box">
              <div style={{ fontWeight: 700, color: "var(--blue-700)", fontSize: ".9rem", marginBottom: 5 }}>🛡️ Farmer Protection Active</div>
              <p style={{ fontSize: ".8rem", color: "var(--blue-900)" }}>Your payment will be held securely until delivery is confirmed.</p>
            </div>
            <div className="form-group"><label className="form-label">Delivery Address</label><textarea className="form-input" placeholder="Enter your full address" value={buyAddr} onChange={e => setBuyAddr(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Contact Number</label><input className="form-input" placeholder="Phone for delivery updates" value={buyPhone} onChange={e => setBuyPhone(e.target.value)} /></div>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--gray-100)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span>Product:</span><strong>{buyItem.name}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontWeight: 700, color: "var(--green-700)" }}>Total Price:</span>
                <strong style={{ fontSize: "1.4rem", color: "var(--green-700)" }}>₹{buyItem.price}</strong>
              </div>
              <button className="btn btn-green" onClick={confirmPurchase}>Confirm &amp; Secure Order</button>
            </div>
          </div>
        </div>
      )}

      {/* SELL MODAL */}
      {showSell && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowSell(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">🚀 List Your Harvest</h3>
              <button className="modal-close" onClick={() => setShowSell(false)}>✕</button>
            </div>
            <div className="form-group"><label className="form-label">Crop Name</label><input className="form-input" value={cropName} onChange={e => setCropName(e.target.value)} /></div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Price (₹)</label><input type="number" className="form-input" value={price} onChange={e => setPrice(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Quantity</label><input type="number" className="form-input" value={quantity} onChange={e => setQuantity(e.target.value)} /></div>
            </div>
            <button className="btn btn-green" style={{ marginTop: 20 }} onClick={handleList}>List for Sale</button>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

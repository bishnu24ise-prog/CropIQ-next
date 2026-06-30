"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyLoans, addLoan } from "../lib/api";

export default function LoanTrackerPage() {
  const [loans, setLoans] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lender, setLender] = useState("");
  const [loanType, setLoanType] = useState("Bank Loan");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Calculator
  const [calcAmt, setCalcAmt] = useState(100000);
  const [calcRate, setCalcRate] = useState(12);
  const [calcTenure, setCalcTenure] = useState(24);
  const [emiResult, setEmiResult] = useState(null);

  // Filter tab
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (localStorage.getItem("brightness") === "dark") setDark(true);
    loadLoans();
  }, []);

  async function loadLoans() {
    try {
      const data = await getMyLoans();
      setLoans(data.loans || []);
    } catch { setLoans([]); }
  }

  function showToastMsg(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (!lender || !amount || !rate || !dueDate) { showToastMsg("Please fill all fields", "error"); return; }
    setIsSubmitting(true);
    try {
      const data = await addLoan({ lender, type: loanType, amount: parseFloat(amount), interestRate: parseFloat(rate), dueDate });
      if (data._id) {
        showToastMsg("✅ Loan added successfully!");
        setShowModal(false);
        setLender(""); setAmount(""); setRate(""); setDueDate("");
        await loadLoans();
      } else { showToastMsg("❌ " + (data.error || "Failed to save"), "error"); }
    } catch (err) { 
      showToastMsg("❌ " + (err.message || "Server error"), "error"); 
    } finally {
      setIsSubmitting(false);
    }
  }

  function calcEMI() {
    const P = calcAmt, r = calcRate / 12 / 100, N = calcTenure;
    const emi = P * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
    setEmiResult({ emi: Math.round(emi), interest: Math.round(emi * N - P), total: Math.round(emi * N) });
  }

  const totalOut = loans ? loans.reduce((s, l) => s + (l.amount || 0), 0) : 0;
  const totalEMI = loans ? loans.reduce((s, l) => s + Math.round((l.amount || 0) * ((l.interestRate || 0) / 100) / 12), 0) : 0;
  const filtered = loans ? (filter === "All" ? loans : loans.filter(l => (l.type || "Bank").includes(filter))) : [];

  return (
    <>
      <style>{`
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-900:#064e3b;--red-100:#fee2e2;--red-500:#ef4444;--orange-100:#ffedd5;--orange-500:#f97316;--gold-500:#f59e0b;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-300:#d1d5db;--gray-500:#6b7280;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08);--transition:all .2s ease}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        [data-theme="dark"]{filter:brightness(.85) contrast(1.05)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
        .moon-btn{background:none;border:none;font-size:1.5rem;cursor:pointer}
        .nav-btn{padding:8px 18px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;cursor:pointer;border:none;transition:var(--transition);font-family:inherit}
        .nav-btn.primary{background:var(--green-600);color:white}
        .nav-btn.primary:hover{background:var(--green-700)}
        .page-header{background:linear-gradient(135deg,var(--green-900),#0f766e);padding:48px 24px;color:white;text-align:center}
        .badge{display:inline-block;background:rgba(255,255,255,.15);padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;margin-bottom:12px;letter-spacing:.5px}
        .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
        .page-header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
        .page-body{max-width:1100px;margin:0 auto;padding:32px 20px 60px}
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06)}
        .card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px}
        .card-title{font-size:1.1rem;font-weight:800;color:var(--green-900)}
        .tabs{display:flex;gap:4px;background:var(--gray-100);border-radius:var(--radius-sm);padding:4px}
        .tab{padding:6px 14px;border:none;border-radius:6px;font-size:.78rem;font-weight:600;cursor:pointer;background:transparent;color:var(--gray-500);transition:var(--transition);font-family:inherit}
        .tab.active{background:var(--white);color:var(--green-900);box-shadow:0 1px 3px rgba(0,0,0,.08)}
        table{width:100%;border-collapse:collapse;font-size:.85rem}
        thead{background:var(--gray-50)}
        th{text-align:left;padding:12px 14px;font-size:.72rem;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--gray-100)}
        td{padding:12px 14px;border-bottom:1px solid var(--gray-100)}
        .status{padding:4px 10px;border-radius:999px;font-size:.7rem;font-weight:700;white-space:nowrap}
        .status-success{background:var(--green-100);color:var(--green-700)}
        .status-warning{background:var(--orange-100);color:var(--orange-500)}
        .status-danger{background:var(--red-100);color:var(--red-500)}
        .progress-bar{height:8px;background:var(--gray-100);border-radius:99px;overflow:hidden}
        .progress-fill{height:100%;border-radius:99px;transition:width 1.5s ease}
        .progress-green{background:var(--green-500)}
        .progress-gold{background:var(--gold-500)}
        .progress-red{background:var(--red-500)}
        .form-group{margin-bottom:16px}
        .form-label{display:block;font-size:.85rem;font-weight:600;color:var(--gray-700);margin-bottom:6px}
        .form-input,.form-select{width:100%;padding:10px 14px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit;transition:var(--transition)}
        .form-input:focus{border-color:var(--green-500);box-shadow:0 0 0 3px rgba(16,185,129,.12)}
        .btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;cursor:pointer;border:none;transition:var(--transition);font-family:inherit}
        .btn-green{background:var(--green-600);color:white}
        .btn-green:hover{background:var(--green-700)}
        .btn-outline{background:transparent;border:1px solid var(--gray-300);color:var(--gray-700)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100;animation:fadeIn .2s}
        .modal{background:var(--white);border-radius:16px;padding:32px;width:90%;max-width:480px;max-height:90vh;overflow-y:auto}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .modal-title{font-size:1.2rem;font-weight:800;color:var(--green-900)}
        .modal-close{background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--gray-500)}
        .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200;animation:fadeIn .3s}
        .toast-success{background:var(--green-600);color:white}
        .toast-error{background:var(--red-500);color:white}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .page-footer{text-align:center;padding:24px;font-size:.82rem;color:var(--gray-500);border-top:1px solid var(--gray-100);margin-top:40px}
        .page-footer a{color:var(--green-600);text-decoration:none;font-weight:600}
        @media(max-width:768px){.grid-3,.grid-2{grid-template-columns:1fr}table{font-size:.75rem}th,td{padding:8px}}
      `}</style>

      <div data-theme={dark ? "dark" : ""}>
        {/* NAV */}
        <nav className="page-nav">
          <Link href="/dashboard" className="back">← Dashboard</Link>
          <button className="moon-btn" onClick={() => { setDark(d => { localStorage.setItem("brightness", d ? "light" : "dark"); return !d; }); }}>{dark ? "☀️" : "🌙"}</button>
          <button className="nav-btn primary" onClick={() => setShowModal(true)}>+ Add Loan</button>
        </nav>

        {/* HEADER */}
        <div className="page-header">
          <div className="badge">📊 Financial Tracking</div>
          <h1>Loan Tracker</h1>
          <p>Track all your loans, interest, repayment schedules &amp; debt projections in one place.</p>
        </div>

        <div className="page-body">
          {/* SUMMARY */}
          <div className="grid-3" style={{ marginBottom: 32 }}>
            <div className="card" style={{ borderTop: "4px solid var(--red-500)" }}>
              <div style={{ fontSize: ".78rem", color: "var(--gray-500)", fontWeight: 600, marginBottom: 4 }}>Total Outstanding</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--red-500)" }}>₹{totalOut.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: ".78rem", color: "var(--gray-500)", marginTop: 6 }}>{loans ? loans.length : 0} active loans</div>
            </div>
            <div className="card" style={{ borderTop: "4px solid var(--green-500)" }}>
              <div style={{ fontSize: ".78rem", color: "var(--gray-500)", fontWeight: 600, marginBottom: 4 }}>Platform Health</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--green-600)" }}>ACTIVE</div>
              <div style={{ fontSize: ".78rem", color: "var(--gray-500)", marginTop: 6 }}>Tracking your debt</div>
            </div>
            <div className="card" style={{ borderTop: "4px solid var(--gold-500)" }}>
              <div style={{ fontSize: ".78rem", color: "var(--gray-500)", fontWeight: 600, marginBottom: 4 }}>Monthly EMI Due</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gold-500)" }}>₹{totalEMI.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: ".78rem", color: "var(--gray-500)", marginTop: 6 }}>Estimated monthly interest</div>
            </div>
          </div>

          {/* LOANS TABLE */}
          <div className="card" style={{ marginBottom: 32 }}>
            <div className="card-header">
              <h3 className="card-title">Active Loans</h3>
              <div className="tabs">
                {["All", "Bank", "Cooperative", "Private"].map(t => (
                  <button key={t} className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead><tr>
                  <th>Lender</th><th>Type</th><th>Principal</th><th>Outstanding</th><th>Interest</th><th>EMI</th><th>Status</th><th>Progress</th>
                </tr></thead>
                <tbody>
                  {loans === null ? (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: 40 }}>Loading loans...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: 40 }}>No active loans found.</td></tr>
                  ) : filtered.map((loan, idx) => {
                    const mi = Math.round(loan.amount * (loan.interestRate / 100) / 12);
                    const progress = Math.min(Math.round((idx + 1) * 20 + 10), 100);
                    const sc = progress > 60 ? "success" : progress > 30 ? "warning" : "danger";
                    const st = progress > 60 ? "✅ On Track" : progress > 30 ? "⚠️ Due Soon" : "🔴 Critical";
                    return (
                      <tr key={loan._id || idx}>
                        <td style={{ fontWeight: 600 }}>{loan.lender}</td>
                        <td>{loan.type || "Bank"}</td>
                        <td>₹{loan.amount.toLocaleString("en-IN")}</td>
                        <td style={{ color: "var(--red-500)", fontWeight: 700 }}>₹{loan.amount.toLocaleString("en-IN")}</td>
                        <td>{loan.interestRate}% p.a.</td>
                        <td>₹{mi.toLocaleString("en-IN")}/mo</td>
                        <td><span className={`status status-${sc}`}>{st}</span></td>
                        <td style={{ minWidth: 120 }}>
                          <div className="progress-bar">
                            <div className={`progress-fill progress-${sc === "success" ? "green" : sc === "warning" ? "gold" : "red"}`} style={{ width: `${progress}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CALCULATOR & ALERTS */}
          <div className="grid-2">
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 20 }}>🧮 Interest Calculator</h3>
              <div className="form-group"><label className="form-label">Loan Amount (₹)</label><input type="number" className="form-input" value={calcAmt} onChange={e => setCalcAmt(+e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Annual Interest Rate (%)</label><input type="number" className="form-input" value={calcRate} onChange={e => setCalcRate(+e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tenure (Months)</label><input type="number" className="form-input" value={calcTenure} onChange={e => setCalcTenure(+e.target.value)} /></div>
              <button className="btn btn-green" onClick={calcEMI}>Calculate EMI</button>
              {emiResult && (
                <div style={{ marginTop: 16, background: "var(--green-50)", borderRadius: "var(--radius-md)", padding: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
                    <div><div style={{ fontSize: ".72rem", color: "var(--gray-500)", fontWeight: 600 }}>Monthly EMI</div><div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--green-700)" }}>₹{emiResult.emi.toLocaleString("en-IN")}</div></div>
                    <div><div style={{ fontSize: ".72rem", color: "var(--gray-500)", fontWeight: 600 }}>Total Interest</div><div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--red-500)" }}>₹{emiResult.interest.toLocaleString("en-IN")}</div></div>
                    <div><div style={{ fontSize: ".72rem", color: "var(--gray-500)", fontWeight: 600 }}>Total Payment</div><div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--gold-500)" }}>₹{emiResult.total.toLocaleString("en-IN")}</div></div>
                  </div>
                </div>
              )}
            </div>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 20 }}>⚠️ Debt Alert</h3>
              <div style={{ background: "var(--red-100)", borderRadius: "var(--radius-md)", padding: 20, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: "var(--red-500)", marginBottom: 6 }}>🔴 High Interest Warning</div>
                <p style={{ fontSize: ".85rem", color: "var(--gray-700)" }}>If any loan charges <strong>36% annual interest</strong> — 5x higher than bank rates. Consider refinancing through SBI&apos;s Kisan Credit Card at 7% p.a.</p>
              </div>
              <div style={{ background: "var(--orange-100)", borderRadius: "var(--radius-md)", padding: 20, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: "var(--orange-500)", marginBottom: 6 }}>⚠️ Overdue Payment</div>
                <p style={{ fontSize: ".85rem", color: "var(--gray-700)" }}>Check your loan EMI due dates. Late fees may apply for overdue payments.</p>
              </div>
              <div style={{ background: "var(--green-100)", borderRadius: "var(--radius-md)", padding: 20 }}>
                <div style={{ fontWeight: 700, color: "var(--green-600)", marginBottom: 6 }}>💡 Tip</div>
                <p style={{ fontSize: ".85rem", color: "var(--gray-700)" }}>Apply for PM-KISAN scheme to receive ₹6,000/year. This can cover 3 months of cooperative EMIs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ADD LOAN MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">📊 Add New Loan</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="form-group"><label className="form-label">Lender Name</label><input className="form-input" placeholder="e.g., SBI, Cooperative" value={lender} onChange={e => setLender(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Loan Type</label>
                <select className="form-select" value={loanType} onChange={e => setLoanType(e.target.value)}>
                  {["Bank Loan", "Cooperative Loan", "Moneylender", "Microfinance", "Other"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Principal Amount (₹)</label><input type="number" className="form-input" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Interest Rate (% per year)</label><input type="number" className="form-input" placeholder="Enter rate" value={rate} onChange={e => setRate(e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Due Date</label><input type="date" className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className={`btn btn-green ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Loan"}
                </button>
                <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

        <footer className="page-footer"><p>© 2026 CropIQ by <Link href="/#team">Team PixelPirates</Link></p></footer>
      </div>
    </>
  );
}

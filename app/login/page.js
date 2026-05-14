"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();

  // Auth mode: "login" | "signup"
  const [mode, setMode] = useState("login");
  // Active tab: "phone" | "email"
  const [tab, setTab] = useState("phone");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isSignup = mode === "signup";

  // ── Handle email login / signup ────────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isSignup) {
        data = await registerUser({
          name: fullName || "Farmer",
          email,
          password,
          role: "farmer",
        });
      } else {
        data = await loginUser(email, password);
      }

      if (data.token) {
        // Save token to localStorage AND cookie (cookie is read by middleware)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || { name: fullName || "Farmer", email }));
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        setSuccess(isSignup ? "✅ Account created!" : "✅ Login successful!");
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/dashboard";
        setTimeout(() => router.push(redirect), 600);
      } else {
        setError("❌ " + (data.error || data.message || "Something went wrong"));
      }
    } catch {
      setError("❌ Cannot connect to server. Make sure backend is running!");
    } finally {
      setLoading(false);
    }
  };

  // ── Handle phone login (placeholder — OTP flow) ───────────────────────────
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("📱 OTP login is coming soon. Please use Email tab for now.");
  };

  return (
    <div style={{
      backgroundImage: "url('/images/background.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <style>{`
        /* ── CSS Variables (shared page theme) ─────────────────────────────── */
        :root {
          --green-900: #064e3b;
          --green-800: #065f46;
          --green-700: #047857;
          --green-600: #059669;
          --green-500: #10b981;
          --green-400: #34d399;
          --green-100: #d1fae5;
          --green-50:  #ecfdf5;
          --gray-900:  #111827;
          --gray-700:  #374151;
          --gray-500:  #6b7280;
          --gray-300:  #d1d5db;
          --gray-100:  #f3f4f6;
          --gray-50:   #f9fafb;
          --white:     #ffffff;
          --radius-sm: 8px;
          --radius-md: 12px;
          --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
          --shadow-md: 0 4px 20px rgba(0,0,0,.08);
          --transition: all .2s ease;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: transparent; color: var(--gray-900); }

        /* ── Nav ───────────────────────────────────────────────────────────── */
        .page-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px; background: var(--white);
          border-bottom: 1px solid rgba(0,0,0,.06);
          position: sticky; top: 0; z-index: 50;
        }
        .page-nav .back {
          color: var(--green-700); text-decoration: none; font-weight: 600;
          font-size: .9rem; transition: var(--transition);
        }
        .page-nav .back:hover { color: var(--green-900); }

        /* ── Login Container ───────────────────────────────────────────────── */
        .login-container {
          min-height: calc(100vh - 60px); display: flex;
          align-items: center; justify-content: center; padding: 20px;
        }

        /* ── Card ──────────────────────────────────────────────────────────── */
        .card {
          background: var(--white); border-radius: var(--radius-md);
          border: 1px solid rgba(0,0,0,.06); box-shadow: var(--shadow-md);
        }
        .login-card {
          width: 100%; max-width: 480px; padding: 40px; text-align: center;
          animation: fadeUp .5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Logo ──────────────────────────────────────────────────────────── */
        .login-logo {
          font-size: 2rem; font-weight: 900; color: var(--green-900);
          text-decoration: none; display: inline-flex; align-items: center;
          gap: 10px; margin-bottom: 30px;
        }

        /* ── Toggle (Login / Sign Up) ──────────────────────────────────────── */
        .auth-toggle {
          background: var(--gray-100); border-radius: var(--radius-sm);
          padding: 4px; display: inline-flex; margin-bottom: 20px; width: 100%;
        }
        .auth-toggle button {
          flex: 1; padding: 8px; border: none; border-radius: 4px;
          font-weight: 600; cursor: pointer; font-size: .9rem;
          transition: var(--transition); font-family: inherit;
        }
        .auth-toggle .active-toggle {
          background: var(--white); font-weight: 700;
          color: var(--green-900); box-shadow: var(--shadow-sm);
        }
        .auth-toggle .inactive-toggle {
          background: transparent; color: var(--gray-500);
        }

        /* ── Tabs ──────────────────────────────────────────────────────────── */
        .tabs {
          display: flex; justify-content: center; gap: 4px;
          margin-bottom: 24px; background: var(--gray-100);
          border-radius: var(--radius-sm); padding: 4px;
        }
        .tab-btn {
          flex: 1; padding: 8px 16px; border: none; border-radius: 6px;
          font-size: .85rem; font-weight: 600; cursor: pointer;
          transition: var(--transition); font-family: inherit;
          color: var(--gray-500); background: transparent;
        }
        .tab-btn.active {
          background: var(--white); color: var(--green-900);
          box-shadow: var(--shadow-sm);
        }

        /* ── Form ──────────────────────────────────────────────────────────── */
        .form-group { margin-bottom: 16px; text-align: left; }
        .form-label {
          display: block; font-size: .85rem; font-weight: 600;
          color: var(--gray-700); margin-bottom: 6px;
        }
        .form-input {
          width: 100%; padding: 10px 14px; border: 1px solid var(--gray-300);
          border-radius: var(--radius-sm); font-size: .95rem;
          transition: var(--transition); outline: none; font-family: inherit;
        }
        .form-input:focus { border-color: var(--green-500); box-shadow: 0 0 0 3px rgba(16,185,129,.12); }

        /* ── Google Button ─────────────────────────────────────────────────── */
        .google-btn {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; width: 100%; padding: 12px;
          background: var(--white); border: 1px solid var(--gray-300);
          border-radius: var(--radius-sm); font-size: .95rem;
          font-weight: 600; color: var(--gray-700);
          cursor: pointer; transition: var(--transition);
          margin-bottom: 20px; font-family: inherit;
        }
        .google-btn:hover { background: var(--gray-50); border-color: var(--gray-500); }

        /* ── Divider ───────────────────────────────────────────────────────── */
        .divider {
          display: flex; align-items: center; text-align: center;
          color: var(--gray-500); font-size: .85rem; font-weight: 600;
          margin: 20px 0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .divider::before { margin-right: .5em; }
        .divider::after  { margin-left: .5em; }

        /* ── Submit Button ─────────────────────────────────────────────────── */
        .btn-green {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 14px; margin-top: 10px;
          background: var(--green-600); color: var(--white);
          border: none; border-radius: var(--radius-sm);
          font-size: .95rem; font-weight: 700; cursor: pointer;
          transition: var(--transition); text-decoration: none;
          font-family: inherit;
        }
        .btn-green:hover { background: var(--green-700); }
        .btn-green:disabled { opacity: .6; cursor: not-allowed; }

        /* ── Messages ──────────────────────────────────────────────────────── */
        .msg-error {
          background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;
          padding: 10px 14px; border-radius: var(--radius-sm);
          font-size: .85rem; margin-bottom: 16px; text-align: left;
        }
        .msg-success {
          background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46;
          padding: 10px 14px; border-radius: var(--radius-sm);
          font-size: .85rem; margin-bottom: 16px; text-align: left;
        }

        /* ── Responsive ────────────────────────────────────────────────────── */
        @media (max-width: 500px) {
          .login-card { padding: 24px 20px; }
        }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="page-nav">
        <Link href="/" className="back">← Back to Home</Link>
      </nav>

      {/* ── LOGIN CARD ───────────────────────────────────────────────────── */}
      <div className="login-container">
        <div className="card login-card">

          <Link href="/" className="login-logo">🌱 CropIQ</Link>

          <h2 style={{ fontSize: "1.5rem", color: "var(--green-900)", marginBottom: 10 }}>
            {isSignup ? "Create your Account" : "Welcome Back, Farmer!"}
          </h2>
          <p style={{ fontSize: ".9rem", color: "var(--gray-700)", marginBottom: 30 }}>
            {isSignup ? "Join 140 million farmers on CropIQ." : "Enter your details to access your dashboard."}
          </p>

          {/* ── Login / Sign Up Toggle ────────────────────────────────────── */}
          <div className="auth-toggle">
            <button
              className={mode === "login" ? "active-toggle" : "inactive-toggle"}
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            >Login</button>
            <button
              className={mode === "signup" ? "active-toggle" : "inactive-toggle"}
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
            >Sign Up</button>
          </div>

          {/* ── Tabs: Phone / Email ───────────────────────────────────────── */}
          <div className="tabs">
            <button
              className={`tab-btn ${tab === "phone" ? "active" : ""}`}
              onClick={() => { setTab("phone"); setError(""); setSuccess(""); }}
            >Phone Number</button>
            <button
              className={`tab-btn ${tab === "email" ? "active" : ""}`}
              onClick={() => { setTab("email"); setError(""); setSuccess(""); }}
            >Email (Gmail)</button>
          </div>

          {/* ── Messages ──────────────────────────────────────────────────── */}
          {error && <div className="msg-error">{error}</div>}
          {success && <div className="msg-success">{success}</div>}

          {/* ── PHONE TAB ─────────────────────────────────────────────────── */}
          {tab === "phone" && (
            <form onSubmit={handlePhoneSubmit} style={{ textAlign: "left" }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input type="text" className="form-input" value="+91" style={{ width: 70, textAlign: "center" }} readOnly />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter 10 digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">OTP / Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter OTP sent to your phone"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-green">
                {isSignup ? "Create Account via OTP" : "Login to Dashboard"}
              </button>
            </form>
          )}

          {/* ── EMAIL TAB ─────────────────────────────────────────────────── */}
          {tab === "email" && (
            <form onSubmit={handleEmailSubmit} style={{ textAlign: "left" }}>
              <button type="button" className="google-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Gmail
              </button>

              <div className="divider">OR</div>

              {/* Name field — only visible on signup */}
              {isSignup && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-green" disabled={loading}>
                {loading ? "Please wait…" : isSignup ? "Create Account" : "Login with Email"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

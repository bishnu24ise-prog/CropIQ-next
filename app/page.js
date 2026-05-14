"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { diagnoseCrop, isLoggedIn } from "./lib/api";

// ─── Static Data ─────────────────────────────────────────────────────────────
const STATS = [
  { target: 140,   label: "Million Farming Families"    },
  { target: 80,    label: "% Miss Govt. Schemes"        },
  { target: 10000, label: "Farmer Suicides/Year"        },
  { target: 60,    label: "% Interest by Moneylenders"  },
];

const PROBLEMS = [
  { icon:"💰", title:"Debt Trap",             body:"Loans from moneylenders at 30–60% interest. One bad harvest = years of debt. Farmers have no visibility into their total financial burden." },
  { icon:"🌪️", title:"Climate Shocks",        body:"No early warnings. Crop damage discovered too late to act. Farmers lose entire seasons of income to unpredictable weather events." },
  { icon:"🤝", title:"Middlemen Exploitation", body:"Farmers sell at ₹5/kg. Consumer buys at ₹50/kg. Farmer gets nothing. The entire supply chain is designed to exploit the producer." },
  { icon:"🏛️", title:"Missed Govt. Schemes",  body:"80% of farmers never access government subsidies they qualify for. Complex application processes in English exclude rural communities." },
];

const FEATURES = [
  { icon:"📊", title:"Loan Tracker",              tag:"Core",         path:"/loan-tracker",  body:"Daily tracking of outstanding loans, interest accumulation, repayment schedules & debt projections." },
  { icon:"💸", title:"Farmer Debt Fund",           tag:"Core",         path:"/debt-fund",     body:"Crowdfunding pool where urban donors contribute to help farmers in distress. Verified farmers get grants (not more loans) during crop failure." },
  { icon:"🌦️", title:"Weather & Crop Impact",     tag:"Core",         path:"/weather",       body:"Hyper-local daily weather updates mapped to the farmer's specific crop type. Alerts like: 'Heavy rain expected — protect your tomato crop today.'" },
  { icon:"🛒", title:"Direct Consumer Market",     tag:"Core",         path:"/market",        body:"Zero middlemen. Farmers list produce directly. Consumers and local businesses buy at fair prices. More money stays with the farmer." },
  { icon:"🏛️", title:"Government Scheme Notifier", tag:"Core",        path:"/schemes",       body:"Personalized alerts for new schemes based on farmer profile. Step-by-step application guidance in local language." },
  { icon:"🔬", title:"AI Crop Disease Detector",   tag:"AI Powered",   path:"/crop-doctor",   body:"Farmer clicks a photo of the affected crop. AI identifies the disease & suggests treatment instantly." },
  { icon:"🌐", title:"Multilingual Support",        tag:"Accessibility",path:null,             body:"Full platform in Hindi, Kannada, Tamil, Telugu, Marathi. Voice input for low-literacy users. Breaking every language barrier." },
  { icon:"🤖", title:"AI Farming Advisor Chatbot",  tag:"AI Powered",   path:"/chatbot",       body:"Ask anything: 'When to plant wheat in UP?', 'Which pesticide is safe for paddy?'. Answers in local language using AI." },
  { icon:"📱", title:"SMS / Offline Mode",          tag:"Accessibility",path:"/offline",       body:"Critical alerts via SMS for farmers with no smartphones. Works on 2G networks in rural areas. No internet? No problem." },
  { icon:"👥", title:"Farmer Community Forum",      tag:"Community",    path:"/community",     body:"Share experiences, farming tips, sell/buy seeds & tools locally. Peer-to-peer knowledge exchange." },
  { icon:"📈", title:"Crop Price Analytics",        tag:"Analytics",    path:"/analytics",     body:"Real-time mandi prices. Predict best time to sell. Historical price trends by season & region." },
  { icon:"🎓", title:"Farming Knowledge Base",      tag:"Education",    path:"/knowledge",     body:"Video tutorials, best practices, and seasonal farming guides curated by agricultural experts." },
];

const TECH_STACK = [
  { label:"Frontend",          color:"#4ade80", items:["React.js","Tailwind CSS","PWA (Offline Support)","i18n (Multilingual)"] },
  { label:"Backend",           color:"#60a5fa", items:["Node.js + Express","REST APIs","Socket.io (Live Alerts)","JWT Auth"] },
  { label:"AI / ML",           color:"#f59e0b", items:["Python + FastAPI","TensorFlow / PyTorch","OpenWeatherMap API","Google Vision API"] },
  { label:"Database & Cloud",  color:"#a78bfa", items:["MongoDB Atlas","Firebase (Notifications)","AWS S3 (Media)","Razorpay (Payments)"] },
];

const AI_STEPS = [
  { num:1, title:"Select Crop",    body:"Choose your crop type from the dropdown (Tomato, Rice, Wheat, etc.)." },
  { num:2, title:"Upload Photo",   body:"Click to upload a photo of the affected leaf or crop using your phone camera." },
  { num:3, title:"AI Analysis",    body:"Our AI model analyzes the crop type and image to identify the disease instantly." },
  { num:4, title:"Get Treatment",  body:"Receive disease name, severity, confidence score, and organic/chemical treatments." },
];

// Matches aiController.js database keys exactly
const CROP_TYPES = ["Tomato","Rice","Wheat","Potato","Sugarcane","Pulses","Chilli"];

const TAG_COLORS = {
  "Core":"#4ade80", "AI Powered":"#f59e0b", "Accessibility":"#60a5fa",
  "Community":"#a78bfa", "Analytics":"#fb923c", "Education":"#34d399",
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800) {
  const [count, setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatItem({ target, label }) {
  const { count, ref } = useCountUp(target);
  return (
    <div ref={ref} className="stat-item">
      <div className="stat-number">{count.toLocaleString("en-IN")}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Reveal({ children, className="", style={}, delay=0, tag="div" }) {
  const { ref, visible } = useReveal();
  const Tag = tag;
  return (
    <Tag ref={ref} className={`rv ${visible?"rv-in":""} ${className}`}
      style={{ ...style, transitionDelay:`${delay}ms` }}>
      {children}
    </Tag>
  );
}

// ─── Diagnosis Result Card ────────────────────────────────────────────────────
function DiagnosisCard({ d }) {
  if (d.error) return <p style={{color:"#fca5a5",marginTop:12,fontSize:".85rem"}}>{d.error}</p>;
  const sevColor = d.severity==="Severe"?"#f87171":d.severity==="High"?"#fb923c":"#facc15";
  return (
    <div style={{textAlign:"left",marginTop:16,background:"rgba(0,0,0,.3)",borderRadius:12,padding:16,border:"1px solid rgba(74,222,128,.15)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{color:"#4ade80",fontWeight:700,fontSize:".95rem"}}>{d.disease}</span>
        <span style={{background:sevColor+"22",color:sevColor,border:`1px solid ${sevColor}44`,padding:"2px 10px",borderRadius:999,fontSize:".72rem",fontWeight:700}}>{d.severity}</span>
      </div>
      <div style={{fontSize:".78rem",color:"#9cb89c",marginBottom:8}}>Confidence: <strong style={{color:"#4ade80"}}>{d.confidence}%</strong></div>
      <div style={{fontSize:".8rem",color:"#c8e6c8",marginBottom:6}}><strong>Symptoms:</strong> {d.symptoms}</div>
      <div style={{fontSize:".8rem",color:"#c8e6c8",marginBottom:6}}><strong>Immediate Action:</strong> {d.immediateAction}</div>
      <div style={{fontSize:".8rem",color:"#a7f3d0",marginBottom:4}}><strong>🌿 Organic:</strong> {d.organicTreatment}</div>
      <div style={{fontSize:".8rem",color:"#bfdbfe"}}><strong>💊 Chemical:</strong> {d.chemicalTreatment}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [dark,      setDark]      = useState(true);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  // AI Crop Doctor state
  const [cropImage,  setCropImage]  = useState(null);
  const [cropType,   setCropType]   = useState("Tomato");
  const [diagnosis,  setDiagnosis]  = useState(null);   // full response object
  const [diagnosing, setDiagnosing] = useState(false);
  const fileInputRef = useRef(null);

  // Navbar scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── AI Crop Doctor (uses /lib/api.js) ───────────────────────────────────────
  const handleCropUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropImage(URL.createObjectURL(file));
    setDiagnosis(null);
    setDiagnosing(true);
    try {
      if (!isLoggedIn()) {
        setDiagnosis({ error: "⚠️ Please log in first to use the AI Crop Doctor." });
        setDiagnosing(false);
        return;
      }
      const data = await diagnoseCrop(file, cropType);
      if (data.error) {
        setDiagnosis({ error: `⚠️ ${data.error}` });
      } else {
        setDiagnosis(data);
      }
    } catch {
      setDiagnosis({ error: "⚠️ Could not reach the server. Please try again later." });
    } finally {
      setDiagnosing(false);
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const bg   = dark ? "#0a0f0a" : "#f4f7f4";
  const bg2  = dark ? "#111811" : "#eaf0ea";
  const bg3  = dark ? "#161e16" : "#ddeadd";
  const card = dark ? "#111c11" : "#ffffff";
  const bdr  = dark ? "rgba(74,222,128,.12)" : "rgba(22,101,52,.12)";
  const txt  = dark ? "#e8f5e8" : "#0f2e12";
  const txt2 = dark ? "#9cb89c" : "#3a6b3a";
  const shd  = dark ? "rgba(0,0,0,.5)" : "rgba(0,0,0,.15)";

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{color:${txt};font-family:Georgia,'Times New Roman',serif;line-height:1.6;overflow-x:hidden;transition:color .3s;background-color:transparent}

        /* NAVBAR */
        .nb{position:fixed;top:0;left:0;right:0;z-index:100;
          background:${scrolled?(dark?"rgba(10,15,10,.92)":"rgba(244,247,244,.92)"):"transparent"};
          backdrop-filter:${scrolled?"blur(12px)":"none"};
          box-shadow:${scrolled?`0 1px 0 ${bdr}`:"none"};transition:background .3s,box-shadow .3s}
        .nb-in{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:14px 24px}
        .nb-logo{display:flex;align-items:center;gap:8px;font-size:1.35rem;font-weight:700;color:#4ade80;text-decoration:none}
        .nb-logo .pulse{width:7px;height:7px;border-radius:50%;background:#4ade80;animation:pulse 1.8s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
        .nb-links{display:flex;gap:4px;list-style:none;margin-left:auto}
        .nb-links a{color:${txt2};font-size:.85rem;text-decoration:none;padding:6px 12px;border-radius:8px;transition:color .2s,background .2s}
        .nb-links a:hover{color:${txt};background:${bdr}}
        .nb-cta{background:#4ade80;color:#0a0f0a;padding:8px 18px;border-radius:8px;font-size:.85rem;font-weight:700;text-decoration:none;white-space:nowrap;transition:opacity .2s}
        .nb-cta:hover{opacity:.85}
        .nb-theme{background:${bg3};border:1px solid ${bdr};color:${txt};padding:6px 10px;border-radius:8px;cursor:pointer;font-size:.85rem}
        .nb-mob{display:none;background:none;border:none;color:${txt};font-size:1.4rem;cursor:pointer}
        @media(max-width:768px){
          .nb-links{display:${menuOpen?"flex":"none"};flex-direction:column;position:absolute;top:60px;left:0;right:0;background:${bg2};padding:12px;border-bottom:1px solid ${bdr}}
          .nb-mob{display:block;margin-left:auto}
          .nb-cta{display:none}
        }

        /* HERO */
        .hero{min-height:100vh;display:flex;align-items:center;padding:120px 24px 80px;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 40%,${dark?"rgba(74,222,128,.06)":"rgba(22,101,52,.08)"} 0%,transparent 70%);pointer-events:none}
        .hero-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
        @media(max-width:900px){.hero-in{grid-template-columns:1fr}.hero-vis{display:none}}
        .badge{display:inline-flex;align-items:center;gap:8px;background:${bg3};border:1px solid ${bdr};padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;color:#4ade80;margin-bottom:20px;letter-spacing:.5px;text-transform:uppercase}
        h1.hero-h{font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.1;font-weight:700;color:${txt};margin-bottom:20px}
        h1.hero-h .hi{color:#4ade80}
        .hero-sub{color:${txt2};font-size:1.05rem;margin-bottom:36px;max-width:520px}
        .hero-btns{display:flex;gap:14px;flex-wrap:wrap}
        .btn-p{background:#4ade80;color:#0a0f0a;padding:12px 28px;border-radius:10px;font-weight:700;font-size:.95rem;text-decoration:none;transition:transform .2s,opacity .2s;display:inline-block}
        .btn-p:hover{transform:translateY(-2px);opacity:.9}
        .btn-s{background:transparent;color:${txt};padding:12px 28px;border-radius:10px;font-weight:600;font-size:.95rem;text-decoration:none;border:1px solid ${bdr};transition:background .2s;display:inline-block}
        .btn-s:hover{background:${bg3}}
        .hero-img-wrap{border-radius:20px;border:1px solid ${bdr};box-shadow:0 32px 80px ${shd};position:relative}
        .hero-img-wrap img{width:100%;height:auto;display:block;border-radius:20px}
        .ftag{position:absolute;background:${card};border:1px solid ${bdr};border-radius:10px;padding:8px 14px;font-size:.78rem;font-weight:600;color:${txt};box-shadow:0 8px 24px ${shd};animation:flt 3s ease-in-out infinite}
        .ftag:nth-child(2){top:12%;left:-14%;animation-delay:0s}
        .ftag:nth-child(3){top:40%;right:-14%;animation-delay:.6s}
        .ftag:nth-child(4){bottom:22%;left:-12%;animation-delay:1.2s}
        .ftag:nth-child(5){bottom:6%;right:-10%;animation-delay:1.8s}
        @keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

        /* STATS */
        .stats{background:${bg3};border-top:1px solid ${bdr};border-bottom:1px solid ${bdr};padding:40px 24px}
        .stats-g{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}
        @media(max-width:640px){.stats-g{grid-template-columns:repeat(2,1fr)}}
        .stat-number{font-size:2.4rem;font-weight:800;color:#4ade80;letter-spacing:-1px}
        .stat-label{font-size:.78rem;color:${txt2};margin-top:4px;font-weight:500}

        /* SECTIONS */
        section{padding:100px 24px}
        .s-in{max-width:1200px;margin:0 auto}
        .s-hdr{text-align:center;margin-bottom:64px}
        .s-badge{display:inline-block;background:${bg3};border:1px solid ${bdr};padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;color:#4ade80;letter-spacing:.5px;text-transform:uppercase;margin-bottom:16px}
        .s-title{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:700;color:${txt};margin-bottom:14px}
        .s-sub{color:${txt2};font-size:1rem;max-width:560px;margin:0 auto}

        /* PROBLEM */
        .prob-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;margin-bottom:40px}
        .prob-c{background:${card};border:1px solid ${bdr};border-radius:16px;padding:32px 24px;transition:transform .25s,box-shadow .25s}
        .prob-c:hover{transform:translateY(-4px);box-shadow:0 16px 48px ${shd}}
        .prob-c h3{font-size:1.1rem;font-weight:700;color:${txt};margin:12px 0 8px}
        .prob-c p{color:${txt2};font-size:.875rem;line-height:1.7}
        .alert{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:12px;padding:20px 24px;color:#fca5a5;font-size:.9rem;line-height:1.6}

        /* SOLUTION */
        .sol-bg{background:${bg2}}
        .sol-hub{display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;padding:20px 0}
        .sol-col{display:flex;flex-direction:column;gap:12px}
        .sol-item{background:${card};border:1px solid ${bdr};padding:12px 20px;border-radius:12px;font-size:.875rem;font-weight:600;color:${txt};text-align:center;transition:border-color .2s}
        .sol-item:hover{border-color:#4ade80}
        .sol-ctr{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#1a3a1a,#0d200d);border:3px solid #4ade80;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(74,222,128,.2);font-weight:800;color:#4ade80;font-size:1rem}
        .sol-ctr .ic{font-size:2rem}

        /* FEATURES */
        .feat-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
        .feat-c{background:${card};border:1px solid ${bdr};border-radius:16px;padding:28px 24px;cursor:pointer;transition:transform .25s,box-shadow .25s,border-color .25s;display:flex;flex-direction:column;gap:8px}
        .feat-c:hover{transform:translateY(-4px);box-shadow:0 16px 40px ${shd};border-color:#4ade80}
        .feat-c h3{font-size:1rem;font-weight:700;color:${txt}}
        .feat-c p{color:${txt2};font-size:.835rem;line-height:1.7;flex:1}
        .f-tag{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.72rem;font-weight:700;letter-spacing:.4px;border:1px solid;margin-top:4px;width:fit-content}

        /* AI DOCTOR */
        .ai-bg{background:${bg2}}
        .ai-g{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
        @media(max-width:768px){.ai-g{grid-template-columns:1fr}}
        .ai-up{background:${bg3};border:2px dashed ${bdr};border-radius:20px;padding:40px 28px;text-align:center;cursor:pointer;transition:border-color .2s}
        .ai-up:hover{border-color:#4ade80}
        .ai-up h3{font-size:1.15rem;font-weight:700;color:${txt};margin:10px 0 6px}
        .ai-up p{color:${txt2};font-size:.85rem}
        .crop-sel{width:100%;margin-top:16px;padding:10px 14px;border-radius:10px;border:1px solid ${bdr};background:${bg};color:${txt};font-size:.9rem;cursor:pointer;font-family:inherit}
        .upload-btn{margin-top:14px;background:#4ade80;color:#0a0f0a;border:none;padding:10px 24px;border-radius:10px;font-weight:700;cursor:pointer;font-size:.9rem;transition:opacity .2s}
        .upload-btn:hover{opacity:.85}
        .ai-steps{display:flex;flex-direction:column;gap:24px}
        .ai-step{display:flex;gap:16px;align-items:flex-start}
        .ai-num{min-width:36px;height:36px;border-radius:50%;background:#4ade80;color:#0a0f0a;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.9rem}
        .ai-step h4{font-size:1rem;font-weight:700;color:${txt};margin-bottom:4px}
        .ai-step p{color:${txt2};font-size:.85rem;line-height:1.7}

        /* TECH */
        .tech-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}
        .tech-c{background:${card};border:1px solid ${bdr};border-radius:16px;padding:24px}
        .tech-h{font-size:.82rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid ${bdr}}
        .tech-item{background:${bg3};border:1px solid ${bdr};border-radius:8px;padding:8px 14px;font-size:.8rem;font-weight:600;color:${txt};margin-bottom:8px}

        /* TEAM */
        .team-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:48px}
        .team-c{background:${card};border:1px solid ${bdr};border-radius:20px;padding:36px 28px;text-align:center;transition:transform .25s,box-shadow .25s}
        .team-c:hover{transform:translateY(-4px);box-shadow:0 16px 48px ${shd}}
        .av{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#4ade80,#c8a84b);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:#0a0f0a;margin:0 auto 16px}
        .team-c h3{font-size:1.15rem;font-weight:700;color:${txt};margin-bottom:6px}
        .team-role{display:inline-block;background:${bg3};border:1px solid ${bdr};padding:4px 12px;border-radius:999px;font-size:.75rem;font-weight:600;color:#4ade80;margin-bottom:10px}
        .team-inst{font-size:.82rem;color:${txt2};font-weight:600;margin-bottom:12px;line-height:1.4;word-wrap:break-word}
        .team-desc{color:${txt2};font-size:.85rem;line-height:1.7}
        .team-banner{background:linear-gradient(135deg,${bg3},${bg2});border:1px solid ${bdr};border-radius:20px;padding:36px;text-align:center}
        .team-banner h3{font-size:1.5rem;font-weight:800;color:#4ade80;margin-bottom:8px}

        /* CTA */
        .cta-s{background:linear-gradient(135deg,#0a2a0a,#0f1f0f);border-top:1px solid ${bdr};border-bottom:1px solid ${bdr};text-align:center;padding:100px 24px}
        .cta-s h2{font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:700;color:${txt};margin-bottom:16px}
        .cta-s p{color:${txt2};font-size:1rem;margin-bottom:36px;max-width:540px;margin-left:auto;margin-right:auto}

        /* FOOTER */
        footer{background:${bg2};border-top:1px solid ${bdr};padding:48px 24px 24px;text-align:center}
        .ft-logo{font-size:1.4rem;font-weight:800;color:#4ade80;margin-bottom:8px}
        .ft-tag{color:${txt2};font-size:.85rem;margin-bottom:24px}
        .ft-links{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:32px}
        .ft-links a{color:${txt2};font-size:.85rem;text-decoration:none;transition:color .2s}
        .ft-links a:hover{color:${txt}}
        .ft-copy{color:${txt2};font-size:.78rem;border-top:1px solid ${bdr};padding-top:20px}

        /* HELPLINE */
        .helpline{position:fixed;bottom:24px;right:24px;z-index:99;background:#4ade80;color:#0a0f0a;display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:999px;font-weight:700;font-size:.85rem;text-decoration:none;box-shadow:0 8px 24px rgba(74,222,128,.3);transition:transform .2s,opacity .2s}
        .helpline:hover{transform:translateY(-2px);opacity:.9}
        @media(max-width:500px){.helpline .hl-txt{display:none}}

        /* REVEAL */
        .rv{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
        .rv-in{opacity:1;transform:translateY(0)}
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="nb">
        <div className="nb-in">
          <Link href="/" className="nb-logo">
            <span className="pulse" /> CropIQ
          </Link>
          <ul className="nb-links">
            {[["problem","The Problem"],["solution","Solution"],["features","Features"],["ai-doctor","AI Doctor"],["team","Team"]].map(([id,label])=>(
              <li key={id}><a href={`#${id}`} onClick={()=>setMenuOpen(false)}>{label}</a></li>
            ))}
          </ul>
          <Link href="/login" className="nb-cta">Get Started →</Link>
          <button className="nb-theme" onClick={()=>setDark(d=>!d)}>{dark?"☀️":"🌙"}</button>
          <button className="nb-mob" onClick={()=>setMenuOpen(o=>!o)}>☰</button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-in">
          <div>
            <div className="badge"><span className="pulse"/>Farmer Welfare Platform</div>
            <h1 className="hero-h"><span className="hi">CropIQ</span><br/>Bridging the Gap Between<br/>Farmers &amp; a Better Future</h1>
            <p className="hero-sub">One platform. Every problem a farmer faces — solved. From debt tracking to AI crop diagnosis, direct market access to government scheme notifications.</p>
            <div className="hero-btns">
              <Link href="/login" className="btn-p">🌾 Explore Features</Link>
              <a href="#ai-doctor" className="btn-s">🤖 Try AI Crop Doctor</a>
            </div>
          </div>
          <div className="hero-vis">
            <div className="hero-img-wrap">
              <img src="/images/famers.png" alt="Indian farmers with technology" width={600} height={400} style={{width:"100%",height:"auto"}}/>
              <div className="ftag">📊 Loan Tracker</div>
              <div className="ftag">🛒 Direct Market</div>
              <div className="ftag">🌦️ Weather Alerts</div>
              <div className="ftag">🏛️ Govt. Schemes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <div className="stats">
        <div className="stats-g">
          {STATS.map((s,i)=><StatItem key={i} {...s}/>)}
        </div>
      </div>

      {/* ── PROBLEM ────────────────────────────────────────────────────────── */}
      <section id="problem">
        <div className="s-in">
          <Reveal className="s-hdr">
            <div className="s-badge">⚠️ The Crisis</div>
            <h2 className="s-title">Why Do Farmers Remain Trapped in Poverty?</h2>
            <p className="s-sub">India&#39;s farmers face a cycle of debt, climate vulnerability, exploitation, and inaccessible government support.</p>
          </Reveal>
          <div className="prob-g">
            {PROBLEMS.map((p,i)=>(
              <Reveal key={i} className="prob-c" delay={i*80}>
                <div style={{fontSize:"2rem"}}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="alert">
            <strong>⚠️ Every year, over 10,000 Indian farmers die by suicide</strong> — debt being the leading cause. CropIQ aims to change this.
          </Reveal>
        </div>
      </section>

      {/* ── SOLUTION ───────────────────────────────────────────────────────── */}
      <section id="solution" className="sol-bg">
        <div className="s-in">
          <Reveal className="s-hdr">
            <div className="s-badge">💡 Our Solution</div>
            <h2 className="s-title">CropIQ — One Platform, Every Solution</h2>
            <p className="s-sub">A unified digital lifeline connecting farmers to financial tools, market access, AI-powered insights, and government support.</p>
          </Reveal>
          <Reveal>
            <div className="sol-hub">
              <div className="sol-col">
                {["📊 Loan Tracker","💸 Debt Fund","🌦️ Weather Alerts"].map(t=><div key={t} className="sol-item">{t}</div>)}
              </div>
              <div className="sol-ctr"><span className="ic">🌱</span><span>CropIQ</span></div>
              <div className="sol-col">
                {["🛒 Direct Market","🏛️ Govt. Schemes","🔬 AI Crop Doctor"].map(t=><div key={t} className="sol-item">{t}</div>)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features">
        <div className="s-in">
          <Reveal className="s-hdr">
            <div className="s-badge">🚀 Core Features</div>
            <h2 className="s-title">Everything a Farmer Needs, In One Place</h2>
            <p className="s-sub">Twelve powerful modules designed with simplicity, accessibility, and real-world farmer needs at the core.</p>
          </Reveal>
          <div className="feat-g">
            {FEATURES.map((f,i)=>(
              <Reveal key={i} className="feat-c" delay={i*40}
                style={{cursor:f.path?"pointer":"default"}}
                onClick={()=>f.path&&(window.location.href=f.path)}>
                <div style={{fontSize:"2rem"}}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <span className="f-tag" style={{color:TAG_COLORS[f.tag]||"#4ade80",borderColor:(TAG_COLORS[f.tag]||"#4ade80")+"44"}}>{f.tag}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CROP DOCTOR ─────────────────────────────────────────────────── */}
      <section id="ai-doctor" className="ai-bg">
        <div className="s-in">
          <Reveal className="s-hdr">
            <div className="s-badge">🔬 AI Powered</div>
            <h2 className="s-title">AI Crop Doctor — Instant Disease Detection</h2>
            <p className="s-sub">Select your crop, upload a photo, and get an instant diagnosis with treatment recommendations.</p>
          </Reveal>
          <div className="ai-g">
            {/* Upload Panel */}
            <Reveal>
              <div className="ai-up">
                <div style={{fontSize:"2.5rem"}}>📸</div>
                <h3>Upload Crop Photo</h3>
                <p>Select your crop type, then upload a photo</p>

                {/* Crop type selector — matches aiController.js database keys */}
                <select
                  className="crop-sel"
                  value={cropType}
                  onChange={e=>setCropType(e.target.value)}
                  onClick={e=>e.stopPropagation()}
                >
                  {CROP_TYPES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>

                <button className="upload-btn" onClick={()=>fileInputRef.current?.click()}>
                  📂 Choose Image
                </button>
                <p style={{fontSize:".72rem",color:`${txt2}`,marginTop:8}}>Supports JPG, PNG · Works with low-res images</p>

                <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleCropUpload}/>

                {/* Image preview */}
                {cropImage && (
                  <img src={cropImage} alt="Crop preview"
                    style={{maxWidth:"100%",maxHeight:180,borderRadius:12,border:"2px solid #c8a84b",marginTop:16}}/>
                )}

                {/* Loading */}
                {diagnosing && (
                  <p style={{color:"#4ade80",marginTop:12,fontSize:".85rem",fontWeight:600}}>
                    🔍 Analyzing your {cropType} crop…
                  </p>
                )}

                {/* Result card */}
                {diagnosis && !diagnosing && <DiagnosisCard d={diagnosis}/>}
              </div>
            </Reveal>

            {/* Steps */}
            <Reveal>
              <div className="ai-steps">
                {AI_STEPS.map(s=>(
                  <div key={s.num} className="ai-step">
                    <div className="ai-num">{s.num}</div>
                    <div><h4>{s.title}</h4><p>{s.body}</p></div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ─────────────────────────────────────────────────────── */}
      <section id="techstack">
        <div className="s-in">
          <Reveal className="s-hdr">
            <div className="s-badge">⚙️ Tech Stack</div>
            <h2 className="s-title">Built With Modern Technology</h2>
          </Reveal>
          <div className="tech-g">
            {TECH_STACK.map((col,i)=>(
              <Reveal key={i} className="tech-c" delay={i*80}>
                <div className="tech-h" style={{color:col.color}}>{col.label}</div>
                {col.items.map(item=><div key={item} className="tech-item">{item}</div>)}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ───────────────────────────────────────────────────────────── */}
      <section id="team" className="sol-bg">
        <div className="s-in">
          <Reveal className="s-hdr">
            <div className="s-badge">👥 Our Team</div>
            <h2 className="s-title">Built by Team PixelPirates</h2>
            <p className="s-sub">Two passionate engineers on a mission to empower India&#39;s farming backbone.</p>
          </Reveal>
          <div className="team-g">
            {[
              {initials:"AS",name:"Ansika Singh",role:"Frontend & AI Lead",inst:"Cambridge Institute of Technology, KR Puram, Bangalore",desc:"Specializes in creating intuitive user interfaces and integrating AI models for agricultural solutions."},
              {initials:"BS",name:"Bishnu Sardar",role:"Backend & Full-Stack Lead",inst:"Cambridge Institute of Technology, KR Puram, Bangalore",desc:"Architects the backend infrastructure, database systems, and API integrations that power CropIQ."},
            ].map((m,i)=>(
              <Reveal key={i} className="team-c" delay={i*100}>
                <div className="av">{m.initials}</div>
                <h3>{m.name}</h3>
                <div className="team-role">{m.role}</div>
                <div className="team-inst">{m.inst}</div>
                <p className="team-desc">{m.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="team-banner">
              <h3>🏴‍☠️ Team PixelPirates</h3>
              <p style={{color:txt2,fontSize:".95rem"}}>Building technology that empowers 140 million Indian farming families.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="cta-s">
        <Reveal>
          <h2>Ready to Empower Farmers?</h2>
          <p>Join CropIQ today and be part of the solution. Every farmer deserves access to technology, fair markets, and financial freedom.</p>
          <div className="hero-btns" style={{justifyContent:"center"}}>
            <Link href="/login" className="btn-p">🌾 Get Started Free</Link>
            <a href="#features" className="btn-s">Learn More</a>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer>
        <div className="ft-logo">🌱 CropIQ</div>
        <div className="ft-tag">Empowering India&#39;s Farmers with Technology</div>
        <div className="ft-links">
          {[["#problem","The Problem"],["#solution","Solution"],["#features","Features"],["#ai-doctor","AI Doctor"],["#team","Team"]].map(([href,label])=>(
            <a key={href} href={href}>{label}</a>
          ))}
        </div>
        <div className="ft-copy">© 2025 CropIQ by Team PixelPirates. Built for India&#39;s farming backbone.</div>
      </footer>

      {/* ── HELPLINE ─────────────────────────────────────────────────────── */}
      <a href="tel:18001801551" className="helpline">
        📞 <span className="hl-txt">Kisan Helpline: 1800-180-1551</span>
      </a>
    </>
  );
}


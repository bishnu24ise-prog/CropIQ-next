"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getAIReply, SUGGESTIONS, LANGUAGES } from "./chatbotData";
import { shareWhatsApp } from "../components/WhatsAppShare";
import ChatMessage from "../components/ChatMessage";

export default function ChatbotPage() {
  const [usingGemini, setUsingGemini] = useState(false);
  const [language, setLanguage] = useState("en");
  const [msgs, setMsgs] = useState([
    { type: "bot", html: '🙏 <strong>Namaste!</strong> I am <strong>KisaanBot 2.0</strong>, your AI farming advisor powered by CropIQ.<br><br>I can help you with:<br>🌾 Crop advice & sowing calendar<br>🐛 Pest & disease management<br>💧 Irrigation & fertilizer guidance<br>🏛️ Government schemes & subsidies<br>💰 Loan & financial planning<br>🌿 Organic farming techniques<br>🛡️ Crop insurance guidance<br><br>🌐 <em>I speak Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati & Punjabi!</em><br><br>What would you like to know today?' }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const boxRef = useRef(null);
  const recogRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }, [msgs, typing]);

  function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

  async function send(text) {
    if (!text.trim()) return;
    setInput("");
    const langObj = LANGUAGES.find(l => l.code === language);
    const userMsg = { type: "user", html: text, text, time: now(), lang: langObj?.native };
    setMsgs(p => [...p, userMsg]);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyRef.current.slice(-10), language })
      });
      const data = await res.json();
      if (data.reply) {
        setUsingGemini(true);
        historyRef.current = [...historyRef.current, { type: "user", text }, { type: "bot", text: data.reply }];
        setTyping(false);
        setMsgs(p => [...p, { type: "bot", html: data.reply, text: data.reply, time: now(), lang: langObj?.native }]);
        return;
      }
    } catch {}

    setUsingGemini(false);
    setTimeout(() => {
      setTyping(false);
      const reply = getAIReply(text);
      setMsgs(p => [...p, { type: "bot", html: reply, text: reply, time: now() }]);
    }, 1200);
  }

  function toggleVoice() {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported. Use Chrome."); return; }
    if (!recogRef.current) {
      recogRef.current = new SR();
      recogRef.current.continuous = false;
      recogRef.current.interimResults = false;
      recogRef.current.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
      recogRef.current.onend = () => setListening(false);
    }
    // Set recognition language
    const langMap = { en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", mr: "mr-IN", bn: "bn-IN", gu: "gu-IN", pa: "pa-IN" };
    recogRef.current.lang = langMap[language] || "en-IN";

    if (listening) { recogRef.current.stop(); } else { recogRef.current.start(); setListening(true); }
  }

  function handleShare(msg) {
    const text = msg.text || msg.html?.replace(/<[^>]*>/g, "");
    shareWhatsApp(`CropIQ KisaanBot says:\n${text}`);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:transparent;min-height:100vh}
        .page-nav,.chat-page{position:relative;z-index:1}
        .page-nav{background:rgba(6,78,59,0.95);backdrop-filter:blur(16px);padding:14px 30px;display:flex;align-items:center;justify-content:space-between}
        .nav-logo{color:white;font-weight:900;font-size:1.4rem;text-decoration:none}
        .nav-back{color:rgba(255,255,255,0.8);text-decoration:none;font-size:.85rem;font-weight:600}.nav-back:hover{color:white}
        .chat-page{max-width:950px;margin:0 auto;padding:30px 20px}
        .chat-header{text-align:center;margin-bottom:24px}
        .chat-header h1{font-size:1.8rem;font-weight:900;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,0.5),0 0 40px rgba(46,213,115,0.3)}
        .chat-header p{color:rgba(255,255,255,0.85);font-size:.9rem;margin-top:6px;text-shadow:0 1px 8px rgba(0,0,0,0.4)}
        .badge-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px}
        .ai-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(46,213,115,0.2);border:1px solid rgba(46,213,115,0.5);color:#2ed573;padding:6px 16px;border-radius:30px;font-size:.75rem;font-weight:800}
        .ai-dot{width:8px;height:8px;background:#2ed573;border-radius:50%;animation:pulse 1.5s infinite}
        .gemini-badge{background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.5);color:#a5b4fc}
        .lang-selector{display:flex;align-items:center;gap:8px;justify-content:center;margin-top:12px}
        .lang-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);padding:5px 12px;border-radius:20px;font-size:.7rem;font-weight:700;cursor:pointer;transition:.2s;font-family:inherit}
        .lang-btn:hover,.lang-btn.active{background:rgba(46,213,115,0.3);border-color:rgba(46,213,115,0.6);color:#2ed573}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(46,213,115,0.6)}50%{box-shadow:0 0 0 6px rgba(46,213,115,0)}}
        .chat-window{background:white;border-radius:24px;box-shadow:0 10px 50px rgba(0,0,0,0.1);border:1px solid #e5e7eb;overflow:hidden;display:flex;flex-direction:column;height:65vh}
        .chat-messages{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
        .msg{max-width:78%;padding:14px 18px;border-radius:20px;font-size:.88rem;line-height:1.65;animation:msgIn .3s ease}
        @keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .msg.bot{background:linear-gradient(135deg,#f0fdf4,#ecfdf5);color:#1f2937;align-self:flex-start;border-bottom-left-radius:4px;border:1px solid #d1fae5}
        .msg.user{background:linear-gradient(135deg,#064e3b,#047857);color:white;align-self:flex-end;border-bottom-right-radius:4px}
        .typing-dots span{display:inline-block;width:8px;height:8px;background:#10b981;border-radius:50%;margin:0 2px;animation:dot 1.2s infinite}
        .typing-dots span:nth-child(2){animation-delay:.2s}
        .typing-dots span:nth-child(3){animation-delay:.4s}
        @keyframes dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px)}}
        .suggestions{display:flex;gap:8px;padding:10px 20px;overflow-x:auto;border-top:1px solid #f3f4f6;flex-wrap:wrap}
        .chip{background:#f0fdf4;color:#064e3b;border:1px solid #d1fae5;padding:7px 14px;border-radius:20px;font-size:.72rem;font-weight:700;cursor:pointer;transition:.2s;white-space:nowrap}
        .chip:hover{background:#064e3b;color:white;transform:translateY(-1px)}
        .chat-input-row{display:flex;gap:10px;padding:16px;border-top:1px solid #e5e7eb;background:#fafafa}
        .chat-input{flex:1;padding:12px 16px;border:2px solid #e5e7eb;border-radius:14px;font-size:.9rem;font-family:'Inter',sans-serif;outline:none;transition:.2s}
        .chat-input:focus{border-color:#064e3b;box-shadow:0 0 0 3px rgba(6,78,59,0.1)}
        .btn-send{background:linear-gradient(135deg,#064e3b,#047857);color:white;border:none;padding:12px 22px;border-radius:14px;font-weight:800;font-size:.85rem;cursor:pointer;transition:.2s;font-family:inherit}
        .btn-send:hover{transform:scale(1.05);box-shadow:0 5px 15px rgba(6,78,59,0.3)}
        .btn-voice{background:#f0fdf4;border:2px solid #d1fae5;color:#064e3b;padding:12px;border-radius:14px;cursor:pointer;font-size:1.1rem;transition:.2s}
        .btn-voice:hover{background:#064e3b;color:white}
        .btn-voice.listening{background:#ef4444;color:white;border-color:#ef4444;animation:pulse 1s infinite}
      `}</style>

      <nav className="page-nav">
        <Link href="/dashboard" className="nav-back">← Dashboard</Link>
        <Link href="/" className="nav-logo">🌱 CropIQ</Link>
        <div />
      </nav>

      <div className="chat-page">
        <div className="chat-header">
          <div className="badge-row">
            <div className="ai-badge"><div className="ai-dot" /> KISAANBOT 2.0 · ONLINE</div>
            {usingGemini && <div className="ai-badge gemini-badge">✨ Gemini AI Active</div>}
          </div>
          <h1>🤖 KisaanBot — Smart Farming Guide</h1>
          <p>Ask any question about crops, weather, loans, pests, or schemes in your language.</p>
          <div className="lang-selector">
            {LANGUAGES.map(l => (
              <button key={l.code} className={`lang-btn ${language === l.code ? "active" : ""}`} onClick={() => setLanguage(l.code)}>
                {l.native}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-window">
          <div className="chat-messages" ref={boxRef}>
            {msgs.map((m, i) => (
              <ChatMessage key={i} msg={m} index={i} onShare={handleShare} />
            ))}
            {typing && (
              <div>
                <div style={{width:32,height:32,background:"linear-gradient(135deg,#064e3b,#047857)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",marginBottom:4}}>🤖</div>
                <div className="msg bot"><div className="typing-dots"><span /><span /><span /></div></div>
              </div>
            )}
          </div>

          <div className="suggestions">
            {SUGGESTIONS.map((s, i) => <div key={i} className="chip" onClick={() => send(s.q)}>{s.label}</div>)}
          </div>

          <div className="chat-input-row">
            <button className={`btn-voice ${listening ? "listening" : ""}`} onClick={toggleVoice}>{listening ? "🔴" : "🎤"}</button>
            <input className="chat-input" placeholder="Ask me anything about farming..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(input); }} />
            <button className="btn-send" onClick={() => send(input)}>Send ➤</button>
          </div>
        </div>
      </div>
    </>
  );
}

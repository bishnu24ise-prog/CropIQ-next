"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { parseVoiceCommand, LANG_CODES, LANG_LABELS } from "../lib/voiceCommands";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState("en-IN");
  const [toast, setToast] = useState(null);
  const [recentCmds, setRecentCmds] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const recogRef = useRef(null);

  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsListening(false);
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, [pathname]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith("en")) || voices[0];
    if (v) u.voice = v;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
    setIsSpeaking(true);
  }

  function toggleListen() {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported. Use Chrome."); return; }

    if (isListening) {
      recogRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recogRef.current) {
      recogRef.current = new SR();
      recogRef.current.continuous = false;
      recogRef.current.interimResults = false;
    }
    recogRef.current.lang = lang;
    recogRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      handleCommand(transcript);
    };
    recogRef.current.onerror = () => setIsListening(false);
    recogRef.current.onend = () => setIsListening(false);
    recogRef.current.start();
    setIsListening(true);
    showToast(`🎙️ Listening in ${LANG_LABELS[lang] || "English"}...`);
  }

  function handleCommand(transcript) {
    const result = parseVoiceCommand(transcript);
    setRecentCmds(prev => [{ text: transcript, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), ...result }, ...prev].slice(0, 5));

    if (result.type === "navigate") {
      showToast(`🗺️ Navigating to ${result.label}`);
      speak(`Opening ${result.label}`);
      setTimeout(() => router.push(result.route), 600);
    } else {
      showToast(`💬 "${transcript}" — Opening chatbot`);
      speak("Opening chatbot with your question");
      setTimeout(() => router.push("/chatbot"), 600);
    }
  }

  function togglePageRead() {
    if (!window.speechSynthesis) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll(".voice-wrap, .trans-wrap, .sos-wrap, script, style, noscript, iframe").forEach(el => el.remove());
    let content = clone.innerText || "";
    if (!content.trim()) content = "No content available.";
    speak(content);
    showToast(`🔊 Reading page in ${LANG_LABELS[lang] || "English"}`);
  }

  useEffect(() => { window.speechSynthesis?.getVoices(); }, []);

  return (
    <>
      <style>{`
        .voice-wrap{position:fixed;bottom:212px;right:20px;z-index:990;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
        .voice-orb{width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.4rem;transition:all .3s;position:relative}
        .voice-orb.idle{background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:white;box-shadow:0 4px 15px rgba(139,92,246,0.4)}
        .voice-orb.idle:hover{transform:scale(1.1);box-shadow:0 6px 25px rgba(139,92,246,0.6)}
        .voice-orb.listening{background:linear-gradient(135deg,#ef4444,#dc2626);color:white;animation:pulseVoice 1.2s infinite}
        .voice-orb.speaking{background:linear-gradient(135deg,#10b981,#059669);color:white;animation:pulseVoice 1.5s infinite}
        @keyframes pulseVoice{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(139,92,246,0.5)}70%{transform:scale(1.08);box-shadow:0 0 0 15px rgba(139,92,246,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(139,92,246,0)}}
        .voice-panel{background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border:1px solid #e5e7eb;border-radius:16px;padding:16px;width:260px;box-shadow:0 10px 40px rgba(0,0,0,0.12);animation:panelIn .3s ease}
        @keyframes panelIn{from{opacity:0;transform:translateY(10px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        .panel-title{font-size:.82rem;font-weight:800;color:#064e3b;margin-bottom:10px;display:flex;align-items:center;gap:6px}
        .lang-row{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px}
        .lang-chip{padding:4px 8px;border-radius:8px;font-size:.65rem;font-weight:700;border:1px solid #e5e7eb;background:white;color:#6b7280;cursor:pointer;transition:.2s}
        .lang-chip.active{background:#064e3b;color:white;border-color:#064e3b}
        .panel-actions{display:flex;flex-direction:column;gap:6px}
        .panel-btn{padding:10px;border:1px solid #e5e7eb;border-radius:10px;background:white;font-size:.78rem;font-weight:700;cursor:pointer;transition:.2s;text-align:left;font-family:inherit;color:#374151}
        .panel-btn:hover{background:#f0fdf4;border-color:#10b981}
        .recent-cmd{padding:6px 10px;background:#f9fafb;border-radius:8px;font-size:.7rem;color:#6b7280;margin-top:4px}
        .voice-toast{position:fixed;bottom:280px;right:20px;background:rgba(31,41,55,0.95);backdrop-filter:blur(8px);color:white;padding:10px 18px;border-radius:10px;font-size:.82rem;font-weight:600;z-index:999;animation:toastIn .3s ease;box-shadow:0 4px 16px rgba(0,0,0,0.2)}
        @keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="voice-wrap">
        {toast && <div className="voice-toast">{toast}</div>}

        {expanded && (
          <div className="voice-panel">
            <div className="panel-title">🎙️ Voice Assistant <span style={{fontSize:".6rem",color:"#10b981",fontWeight:800}}>v2.0</span></div>
            <div className="lang-row">
              {Object.entries(LANG_LABELS).map(([code, label]) => (
                <button key={code} className={`lang-chip ${lang === code ? "active" : ""}`} onClick={() => setLang(code)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="panel-actions">
              <button className="panel-btn" onClick={toggleListen}>
                {isListening ? "🔴 Stop Listening" : "🎤 Voice Command"}
              </button>
              <button className="panel-btn" onClick={togglePageRead}>
                {isSpeaking ? "⏹️ Stop Reading" : "🔊 Read This Page"}
              </button>
            </div>
            {recentCmds.length > 0 && (
              <div style={{marginTop:10}}>
                <div style={{fontSize:".68rem",fontWeight:800,color:"#9ca3af",marginBottom:4}}>RECENT COMMANDS</div>
                {recentCmds.map((c, i) => (
                  <div key={i} className="recent-cmd">"{c.text}" · {c.time}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          className={`voice-orb ${isListening ? "listening" : isSpeaking ? "speaking" : "idle"}`}
          onClick={() => expanded ? toggleListen() : setExpanded(true)}
          onDoubleClick={() => setExpanded(e => !e)}
          title="Voice Assistant (double-click to expand)"
        >
          {isListening ? "🔴" : isSpeaking ? "🔊" : "🎙️"}
        </button>
      </div>
    </>
  );
}

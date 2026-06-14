"use client";

export default function ChatMessage({ msg, index, onShare }) {
  const isBot = msg.type === "bot";

  function speak() {
    const text = msg.text || msg.html?.replace(/<[^>]*>/g, "");
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.lang = "en-IN";
    window.speechSynthesis.speak(u);
  }

  function copy() {
    const text = msg.text || msg.html?.replace(/<[^>]*>/g, "");
    navigator.clipboard?.writeText(text || "");
  }

  return (
    <div style={{ animation: "msgIn .3s ease" }}>
      {isBot && (
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#064e3b,#047857)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem", marginBottom: 4 }}>
          🤖
        </div>
      )}
      <div
        className={`msg ${msg.type}`}
        dangerouslySetInnerHTML={{ __html: msg.html }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: isBot ? "flex-start" : "flex-end", gap: 8, marginTop: 3 }}>
        {msg.time && <span style={{ fontSize: ".6rem", opacity: .5 }}>{msg.time}</span>}
        {msg.lang && <span style={{ fontSize: ".55rem", background: "#eff6ff", color: "#3b82f6", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{msg.lang}</span>}
        {isBot && index > 0 && (
          <>
            <button onClick={speak} style={{ background: "none", border: "none", fontSize: ".6rem", color: "#059669", cursor: "pointer", fontWeight: 700 }}>🔊 Listen</button>
            <button onClick={copy} style={{ background: "none", border: "none", fontSize: ".6rem", color: "#6366f1", cursor: "pointer", fontWeight: 700 }}>📋 Copy</button>
            {onShare && <button onClick={() => onShare(msg)} style={{ background: "none", border: "none", fontSize: ".6rem", color: "#25D366", cursor: "pointer", fontWeight: 700 }}>💬 Share</button>}
          </>
        )}
      </div>
    </div>
  );
}

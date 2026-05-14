"use client";
import { useEffect, useState } from "react";

export default function SOSButton() {
  const [open, setOpen] = useState(false);

  const contacts = [
    { label: "Kisan Helpline", num: "18001801551", icon: "🌾", color: "#059669" },
    { label: "Ambulance", num: "108", icon: "🚑", color: "#dc2626" },
    { label: "Police", num: "100", icon: "👮", color: "#2563eb" },
    { label: "Disaster Relief", num: "1078", icon: "🆘", color: "#ea580c" },
  ];

  return (
    <>
      <style>{`
        .sos-wrap{position:fixed;bottom:88px;right:20px;z-index:990;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
        .sos-btn{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#dc2626,#991b1b);color:white;border:none;font-size:1.3rem;cursor:pointer;box-shadow:0 4px 20px rgba(220,38,38,0.4);animation:sosGlow 2s infinite;font-weight:900;display:flex;align-items:center;justify-content:center}
        @keyframes sosGlow{0%,100%{box-shadow:0 4px 20px rgba(220,38,38,0.4)}50%{box-shadow:0 4px 30px rgba(220,38,38,0.8)}}
        .sos-menu{background:white;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.2);padding:12px;display:flex;flex-direction:column;gap:8px;animation:menuIn .2s ease;min-width:200px;border:1px solid rgba(0,0,0,.08)}
        @keyframes menuIn{from{opacity:0;transform:scale(0.9) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .sos-contact{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;text-decoration:none;transition:.2s;border:1px solid transparent}
        .sos-contact:hover{background:#f9fafb;border-color:#e5e7eb}
        .sos-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
        .sos-info{flex:1}
        .sos-name{font-size:.8rem;font-weight:800;color:#111827}
        .sos-num{font-size:.7rem;color:#6b7280;font-weight:600}
        .sos-call{background:#059669;color:white;border:none;padding:4px 10px;border-radius:6px;font-size:.7rem;font-weight:700;cursor:pointer}
        .sos-title{font-size:.7rem;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;padding:4px 12px;margin-bottom:4px}
      `}</style>

      <div className="sos-wrap">
        {open && (
          <div className="sos-menu">
            <div className="sos-title">🆘 Emergency Contacts</div>
            {contacts.map(c => (
              <div className="sos-contact" key={c.num}>
                <div className="sos-icon" style={{ background: c.color + "20" }}>
                  {c.icon}
                </div>
                <div className="sos-info">
                  <div className="sos-name">{c.label}</div>
                  <div className="sos-num">{c.num}</div>
                </div>
                <a href={`tel:${c.num}`} className="sos-call" style={{ background: c.color, textDecoration: "none" }}>Call</a>
              </div>
            ))}
          </div>
        )}
        <button
          className="sos-btn"
          onClick={() => setOpen(o => !o)}
          title="Emergency SOS"
        >
          {open ? "✕" : "🆘"}
        </button>
      </div>
    </>
  );
}

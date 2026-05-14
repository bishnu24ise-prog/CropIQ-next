"use client";

/**
 * WhatsApp share utility
 * @param {string} text - The message to share
 */
export function shareWhatsApp(text) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

/**
 * WhatsApp Share Button component
 */
export function WhatsAppShareBtn({ text, label = "Share on WhatsApp", style = {} }) {
  return (
    <>
      <style>{`
        .wa-btn{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:white;border:none;padding:9px 18px;border-radius:10px;font-weight:700;font-size:.82rem;cursor:pointer;font-family:inherit;transition:all .2s;text-decoration:none}
        .wa-btn:hover{background:#128C7E;transform:scale(1.03);box-shadow:0 6px 20px rgba(37,211,102,0.3)}
        .wa-icon{font-size:1.1rem}
      `}</style>
      <button className="wa-btn" style={style} onClick={() => shareWhatsApp(text)}>
        <span className="wa-icon">💬</span>
        {label}
      </button>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShow(true); };
    window.addEventListener("beforeinstallprompt", handler);

    // Show prompt after 5 seconds if not dismissed
    const timer = setTimeout(() => { if (!installed) setShow(true); }, 5000);

    return () => { window.removeEventListener("beforeinstallprompt", handler); clearTimeout(timer); };
  }, []);

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    }
    setShow(false);
  }

  if (!show || installed) return null;

  return (
    <>
      <style>{`
        .pwa-banner{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9998;background:linear-gradient(135deg,#064e3b,#047857);color:white;border-radius:18px;padding:16px 24px;display:flex;align-items:center;gap:16px;box-shadow:0 20px 60px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.1);animation:slideUp .4s ease;max-width:420px;width:90vw}
        @keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .pwa-icon{font-size:2.2rem;flex-shrink:0}
        .pwa-text h4{font-size:.95rem;font-weight:800;margin-bottom:3px}
        .pwa-text p{font-size:.72rem;opacity:.85;line-height:1.4}
        .pwa-actions{display:flex;flex-direction:column;gap:8px;flex-shrink:0}
        .pwa-install{background:white;color:#064e3b;border:none;padding:8px 16px;border-radius:10px;font-weight:800;font-size:.8rem;cursor:pointer;white-space:nowrap}
        .pwa-dismiss{background:none;border:none;color:rgba(255,255,255,0.6);font-size:.72rem;cursor:pointer;text-align:center}
      `}</style>
      <div className="pwa-banner">
        <div className="pwa-icon">🌱</div>
        <div className="pwa-text">
          <h4>Install CropIQ App</h4>
          <p>Works offline in the fields. No internet needed!</p>
        </div>
        <div className="pwa-actions">
          <button className="pwa-install" onClick={handleInstall}>Install Now</button>
          <button className="pwa-dismiss" onClick={() => setShow(false)}>Maybe later</button>
        </div>
      </div>
    </>
  );
}

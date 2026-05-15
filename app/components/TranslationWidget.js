"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TranslationWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Add Google Translate Script
    const addScript = () => {
      if (document.getElementById("google-translate-script")) return;
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'hi,kn,bn,gu,ta,ml,te,mr,pa,or',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    addScript();
  }, []);

  // Re-trigger translation when navigating between pages
  useEffect(() => {
    const timer = setTimeout(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo && combo.value && combo.value !== 'en') {
        console.log("Auto-translating new page content...");
        combo.dispatchEvent(new Event("change"));
      }
    }, 800); // Wait for page transition to settle
    return () => clearTimeout(timer);
  }, [pathname]);

  const changeLanguage = (langCode) => {
    if (langCode === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    }
    setOpen(false);
    window.location.reload();
  };

  const languages = [
    { code: "en", label: "English", icon: "🇺🇸" },
    { code: "hi", label: "हिन्दी (Hindi)", icon: "🇮🇳" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)", icon: "🌾" },
    { code: "bn", label: "বাংলা (Bengali)", icon: "🐟" },
    { code: "ta", label: "தமிழ் (Tamil)", icon: "☕" },
    { code: "te", label: "తెలుగు (Telugu)", icon: "☀️" },
    { code: "ml", label: "മലയാളം (Malayalam)", icon: "🌴" },
    { code: "gu", label: "ગુજરાતી (Gujarati)", icon: "🏙️" },
    { code: "mr", label: "मराठी (Marathi)", icon: "🚩" },
    { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)", icon: "🌾" },
    { code: "or", label: "ଓଡ଼ିଆ (Odia)", icon: "🌊" },
  ];

  return (
    <>
      <style>{`
        /* Hide Google Translate UI Elements */
        .goog-te-banner-frame, .goog-te-balloon-frame, .goog-te-menu-value span:nth-child(2), .goog-te-gadget-icon, .goog-logo-link { display: none !important; }
        .goog-te-gadget { color: transparent !important; font-size: 0 !important; }
        body { top: 0 !important; }
        #google_translate_element { display: none; }

        /* Custom UI */
        .trans-wrap { position: fixed; bottom: 150px; right: 20px; z-index: 1000; }
        .trans-btn { width: 52px; height: 52px; border-radius: 50%; background: #064e3b; color: white; border: none; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .trans-btn:hover { transform: scale(1.1); background: #059669; }
        .trans-menu { position: absolute; bottom: 65px; right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 8px; width: 220px; animation: slideUp 0.3s ease; border: 1px solid rgba(0,0,0,0.08); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .lang-opt { width: 100%; text-align: left; padding: 10px 14px; border: none; background: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: #374151; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
        .lang-opt:hover { background: #f3f4f6; color: #064e3b; }
      `}</style>

      <div id="google_translate_element"></div>

      <div className="trans-wrap">
        {open && (
          <div className="trans-menu">
            <div style={{fontSize:'0.7rem', fontWeight:800, color:'#9ca3af', padding:'4px 12px', textTransform:'uppercase'}}>Select Language</div>
            {languages.map((l) => (
              <button key={l.code} className="lang-opt" onClick={() => changeLanguage(l.code)}>
                <span>{l.icon}</span> {l.label}
              </button>
            ))}
          </div>
        )}
        <button className="trans-btn" onClick={() => setOpen(!open)} title="Change Language">
          {open ? "✕" : "🌐"}
        </button>
      </div>
    </>
  );
}

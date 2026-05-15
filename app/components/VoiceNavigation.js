"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function VoiceNavigation() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [pathname]);

  const getLanguageCode = () => {
    let lang = "en";
    
    // 1. Check Google Translate cookie (format: googtrans=/source/target e.g., /en/hi or /auto/bn)
    const match = document.cookie.match(/googtrans=\/[^/]+\/([a-zA-Z-]+)/i);
    if (match) {
      lang = match[1].toLowerCase();
    } else {
      // 2. Check the translation combo box
      const combo = document.querySelector(".goog-te-combo");
      if (combo && combo.value) {
        lang = combo.value.toLowerCase();
      } else {
        // 3. Check html lang attribute if Google Translate modified it
        const htmlLang = document.documentElement.lang;
        if (htmlLang && htmlLang !== "en") {
          lang = htmlLang.toLowerCase();
        }
      }
    }
    
    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      bn: "bn-IN",
      ta: "ta-IN",
      te: "te-IN",
      ml: "ml-IN",
      gu: "gu-IN",
      mr: "mr-IN",
      pa: "pa-IN",
      or: "or-IN"
    };
    
    console.log("[VoiceNavigation] Detected language prefix:", lang, "Mapped to:", langMap[lang] || "en-IN");
    return langMap[lang] || "en-IN";
  };

  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clone = document.body.cloneNode(true);
    const hiddenElements = clone.querySelectorAll(".trans-wrap, .sos-wrap, .voice-wrap, script, style, noscript, iframe");
    hiddenElements.forEach(el => el.remove());
    
    let content = clone.innerText || clone.textContent;
    if (!content.trim()) {
      content = "No content available to read.";
    }

    const utterance = new SpeechSynthesisUtterance(content);
    const langCode = getLanguageCode();
    utterance.lang = langCode;
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    
    // Try to find exact match (e.g., hi-IN)
    let voice = voices.find(v => v.lang.replace("_", "-").toLowerCase() === langCode.toLowerCase());
    
    // Fallback to partial match (e.g., hi)
    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().startsWith(langCode.split("-")[0].toLowerCase()));
    }

    if (voice) {
      utterance.voice = voice;
      console.log(`[VoiceNavigation] Found matching voice: ${voice.name} (${voice.lang})`);
    } else {
      console.log(`[VoiceNavigation] No exact voice found for ${langCode}, falling back to browser default for this lang code.`);
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis Error:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <>
      <style>{`
        .voice-wrap { position: fixed; bottom: 212px; right: 20px; z-index: 990; display: flex; align-items: flex-end; }
        .voice-btn { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; border: none; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 15px rgba(139,92,246,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .voice-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(139,92,246,0.6); }
        .voice-btn.speaking { animation: pulseVoice 1.5s infinite; background: linear-gradient(135deg, #10b981, #059669); }
        @keyframes pulseVoice { 
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.7); } 
          70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(16,185,129,0); } 
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0); } 
        }
      `}</style>
      <div className="voice-wrap">
        <button 
          className={isSpeaking ? "voice-btn speaking" : "voice-btn"} 
          onClick={toggleSpeech}
          title={isSpeaking ? "Stop Speaking" : "Read Page"}
        >
          {isSpeaking ? "⏹️" : "🎙️"}
        </button>
      </div>
    </>
  );
}

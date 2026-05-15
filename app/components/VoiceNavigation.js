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
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/i);
    if (match) {
      lang = match[1];
    } else {
      const combo = document.querySelector(".goog-te-combo");
      if (combo && combo.value) {
        lang = combo.value;
      }
    }
    
    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      bn: "bn-IN",
      te: "te-IN",
      ta: "ta-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      kn: "kn-IN",
      pa: "pa-IN",
      or: "or-IN",
      ml: "ml-IN"
    };
    return langMap[lang] || "en-US";
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
    const voice = voices.find(v => v.lang.replace("_", "-").toLowerCase() === langCode.toLowerCase()) 
               || voices.find(v => v.lang.startsWith(langCode.split("-")[0]));
    if (voice) {
      utterance.voice = voice;
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

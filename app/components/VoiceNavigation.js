"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function VoiceNavigation() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showToast, setShowToast] = useState(false);
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
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.startsWith("en"));
    
    // Fallback to the first available voice if no English voice is found to prevent the mute bug
    if (!voice && voices.length > 0) {
      voice = voices[0]; 
    }
    
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
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <>
      <style>{`
        .voice-wrap { position: fixed; bottom: 212px; right: 20px; z-index: 990; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .voice-btn { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; border: none; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 15px rgba(139,92,246,0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .voice-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(139,92,246,0.6); }
        .voice-btn.speaking { animation: pulseVoice 1.5s infinite; background: linear-gradient(135deg, #10b981, #059669); }
        @keyframes pulseVoice { 
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.7); } 
          70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(16,185,129,0); } 
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0); } 
        }
        .voice-toast {
          background: #1f2937; color: white; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: toastIn 0.3s ease; white-space: nowrap;
        }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="voice-wrap">
        {showToast && (
          <div className="voice-toast">
            🎙️ Reading page in English
          </div>
        )}
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

// Voice command parser for multilingual navigation
const ROUTES = {
  dashboard: "/dashboard", weather: "/weather", market: "/market",
  "crop doctor": "/crop-doctor", chatbot: "/chatbot", analytics: "/analytics",
  schemes: "/schemes", community: "/community", "debt fund": "/debt-fund",
  "loan tracker": "/loan-tracker", knowledge: "/knowledge", profile: "/profile",
  irrigation: "/irrigation", "price forecast": "/market-forecast",
  "farm analytics": "/farmer-analytics", offline: "/offline",
};

const HINDI_ROUTES = {
  "डैशबोर्ड": "/dashboard", "मौसम": "/weather", "बाज़ार": "/market",
  "फसल डॉक्टर": "/crop-doctor", "चैटबॉट": "/chatbot", "एनालिटिक्स": "/analytics",
  "योजना": "/schemes", "समुदाय": "/community", "ऋण": "/loan-tracker",
  "सिंचाई": "/irrigation", "प्रोफाइल": "/profile",
  "मौसम दिखाओ": "/weather", "फसल जांचो": "/crop-doctor",
  "बाज़ार दिखाओ": "/market", "योजनाएं दिखाओ": "/schemes",
};

const TAMIL_ROUTES = {
  "வானிலை": "/weather", "சந்தை": "/market", "பயிர் மருத்துவர்": "/crop-doctor",
  "நீர்ப்பாசனம்": "/irrigation", "திட்டங்கள்": "/schemes",
};

const TELUGU_ROUTES = {
  "వాతావరణం": "/weather", "మార్కెట్": "/market", "పంట వైద్యుడు": "/crop-doctor",
  "నీటిపారుదల": "/irrigation", "పథకాలు": "/schemes",
};

const KANNADA_ROUTES = {
  "ಹವಾಮಾನ": "/weather", "ಮಾರುಕಟ್ಟೆ": "/market", "ಬೆಳೆ ವೈದ್ಯ": "/crop-doctor",
  "ನೀರಾವರಿ": "/irrigation", "ಯೋಜನೆಗಳು": "/schemes",
};

const ALL_ROUTES = { ...ROUTES, ...HINDI_ROUTES, ...TAMIL_ROUTES, ...TELUGU_ROUTES, ...KANNADA_ROUTES };

export function parseVoiceCommand(transcript) {
  const text = transcript.toLowerCase().trim();

  // Direct route matching
  for (const [key, route] of Object.entries(ALL_ROUTES)) {
    if (text.includes(key.toLowerCase())) {
      return { type: "navigate", route, label: key };
    }
  }

  // English navigation commands
  const navPatterns = [
    /(?:go to|open|show|navigate to|take me to)\s+(.+)/i,
    /(.+)\s+(?:page|screen|section|दिखाओ|खोलो)/i,
  ];

  for (const pattern of navPatterns) {
    const match = text.match(pattern);
    if (match) {
      const target = match[1].trim().toLowerCase();
      for (const [key, route] of Object.entries(ALL_ROUTES)) {
        if (target.includes(key.toLowerCase()) || key.toLowerCase().includes(target)) {
          return { type: "navigate", route, label: key };
        }
      }
    }
  }

  // Action commands
  if (text.includes("scan") || text.includes("diagnose") || text.includes("जांच")) {
    return { type: "navigate", route: "/crop-doctor", label: "Crop Doctor" };
  }
  if (text.includes("price") || text.includes("rate") || text.includes("दाम") || text.includes("भाव")) {
    return { type: "navigate", route: "/analytics", label: "Market Analytics" };
  }
  if (text.includes("help") || text.includes("मदद") || text.includes("सहायता")) {
    return { type: "navigate", route: "/chatbot", label: "KisaanBot" };
  }

  // If no route matched, treat as chatbot query
  return { type: "chat", text: transcript };
}

export const LANG_CODES = {
  en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN",
  kn: "kn-IN", mr: "mr-IN", bn: "bn-IN", gu: "gu-IN", pa: "pa-IN",
};

export const LANG_LABELS = {
  "en-IN": "English", "hi-IN": "हिन्दी", "ta-IN": "தமிழ்",
  "te-IN": "తెలుగు", "kn-IN": "ಕನ್ನಡ", "mr-IN": "मराठी",
  "bn-IN": "বাংলা", "gu-IN": "ગુજરાતી", "pa-IN": "ਪੰਜਾਬੀ",
};

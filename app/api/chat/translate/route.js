import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const LANG_MAP = {
  hi: "Hindi", ta: "Tamil", te: "Telugu", kn: "Kannada",
  mr: "Marathi", bn: "Bengali", gu: "Gujarati", pa: "Punjabi",
  en: "English",
};

export async function POST(request) {
  try {
    const { text, targetLang = "hi" } = await request.json();

    if (!text || !GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing text or API key" }, { status: 400 });
    }

    const langName = LANG_MAP[targetLang] || "Hindi";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: `Translate the following text to ${langName}. Only respond with the translation, nothing else.\n\nText: ${text}` }]
          }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.2 }
        })
      }
    );

    if (!res.ok) throw new Error("Translation failed");

    const data = await res.json();
    const translated = data.candidates?.[0]?.content?.parts?.[0]?.text || text;

    return NextResponse.json({ translated: translated.trim() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

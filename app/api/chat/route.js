import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are KisaanBot 2.0, an expert AI farming advisor for Indian farmers built by CropIQ.

Your expertise covers:
- Crop advice, sowing calendars, seed varieties for all Indian agro-climatic zones
- Pest/disease identification with organic and chemical remedies (India-specific brands)
- Irrigation, fertilizer, and soil health (Penman-Monteith, SHC-based)
- Government schemes: PM-KISAN, PMFBY, PM-ASHA, KCC, PMKSY, SHC, state schemes
- Loan planning, KCC, crop insurance, MSP, e-NAM
- Market prices, mandi rates, best selling time
- Weather impact on crops
- Seasonal calendars (Rabi: Oct-Mar, Kharif: Jun-Oct, Zaid: Mar-Jun)

Rules:
1. Answer in the SAME LANGUAGE the user asks in (Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, or English).
2. Be concise — use bullet points and sections with emojis.
3. Give practical, actionable advice with specific quantities, dates, and brands.
4. Reference Indian context: Indian crop varieties, Indian states, Indian schemes.
5. If unsure, recommend Kisan Call Centre: 1800-180-1551 (Free, 24/7).
6. Format with HTML: <br> for line breaks, <strong> for emphasis.
7. Include a "Quick Tip" at the end of each response.
8. For financial questions, always mention KCC and relevant subsidies.
9. Be encouraging and supportive — many farmers face financial stress.
10. Current season awareness: Check if Rabi/Kharif/Zaid based on current month.`;

export async function POST(request) {
  try {
    const { message, history = [], language = "en" } = await request.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "NO_KEY" }, { status: 400 });
    }

    const langContext = language !== "en"
      ? `\n\nIMPORTANT: The user prefers ${language}. Respond in ${language} language with Devanagari/native script.`
      : "";

    const contents = [
      ...history.map(m => ({
        role: m.type === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT + langContext }] },
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      }
    );

    if (!res.ok) throw new Error("Gemini API error");

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const html = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>")
      .replace(/•/g, "•");

    return NextResponse.json({ reply: html });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

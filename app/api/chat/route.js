import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const SYSTEM_PROMPT = `You are KisaanBot, an expert AI farming advisor for Indian farmers. 
Your role is to help farmers with:
- Crop advice, sowing calendars, and best practices
- Pest and disease identification and natural remedies
- Irrigation, fertilizer, and soil health guidance
- Government schemes like PM-Kisan, KCC, PMFBY, PMKSY
- Loan and financial planning for farmers
- Market prices, MSP rates, and selling strategies

Rules:
1. Answer in simple, easy-to-understand English (or Hindi if user asks in Hindi)
2. Be concise but thorough — use bullet points
3. Always give practical, actionable advice
4. Reference Indian-specific context (Indian crops, Indian government schemes, Indian states)
5. Use relevant emojis to make responses friendly
6. If unsure, recommend Kisan Call Centre: 1800-180-1551 (Free, 24/7)
7. Format responses with HTML <br> for line breaks and <strong> for emphasis`;

export async function POST(request) {
  try {
    const { message, history = [] } = await request.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "NO_KEY" }, { status: 400 });
    }

    // Build conversation history for Gemini
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
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
        })
      }
    );

    if (!res.ok) throw new Error("Gemini API error");

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Convert markdown-like formatting to HTML
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

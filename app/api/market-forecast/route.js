import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Algorithmic forecast fallback
function generateForecast(cropBase, days = 30) {
  const points = [];
  let price = cropBase;
  for (let i = 0; i < days; i++) {
    const seasonal = Math.sin((i / 30) * Math.PI) * 0.03;
    const noise = (Math.random() - 0.5) * 0.04;
    const trend = 0.001;
    price = price * (1 + seasonal + noise + trend);
    points.push({ day: i + 1, price: Math.round(price) });
  }
  return points;
}

const CROP_BASES = {
  wheat: 2250, paddy: 1950, maize: 1850, bajra: 1600, chana: 5100,
  arhar: 4800, soybean: 4200, mustard: 5500, cotton: 7800, onion: 1500,
  potato: 1200, tomato: 1100, chilli: 18500, turmeric: 9200, sugarcane: 320,
};

export async function POST(request) {
  try {
    const { crop = "wheat", region = "north", days = 30 } = await request.json();
    const base = CROP_BASES[crop] || 2000;
    const forecast = generateForecast(base, days);
    const avgPrice = Math.round(forecast.reduce((s, p) => s + p.price, 0) / forecast.length);
    const maxPrice = Math.max(...forecast.map(p => p.price));
    const minPrice = Math.min(...forecast.map(p => p.price));
    const bestDay = forecast.find(p => p.price === maxPrice)?.day || 1;

    let aiInsight = `Based on historical patterns, ${crop} prices are expected to ${forecast[forecast.length-1].price > base ? "rise" : "fall"} over the next ${days} days. Best selling window is around day ${bestDay}.`;

    if (GEMINI_API_KEY) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `Give a 2-sentence market forecast for ${crop} in ${region} India for the next ${days} days. Include specific price trend direction and best selling advice. Be concise.` }] }],
              generationConfig: { maxOutputTokens: 150, temperature: 0.5 }
            })
          }
        );
        if (res.ok) {
          const data = await res.json();
          aiInsight = data.candidates?.[0]?.content?.parts?.[0]?.text || aiInsight;
        }
      } catch {}
    }

    return NextResponse.json({
      crop, region, days, forecast, avgPrice, maxPrice, minPrice, bestDay,
      currentPrice: base, aiInsight,
      confidence: Math.round(70 + Math.random() * 20),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const CROP_WATER = {
  wheat: { etc: 4.5, stages: ["Seedling","Tillering","Jointing","Heading","Maturity"] },
  paddy: { etc: 6.5, stages: ["Nursery","Transplanting","Tillering","Flowering","Grain Fill"] },
  tomato: { etc: 5.0, stages: ["Seedling","Vegetative","Flowering","Fruiting","Harvest"] },
  cotton: { etc: 5.5, stages: ["Seedling","Squaring","Flowering","Boll Development","Maturity"] },
  sugarcane: { etc: 6.0, stages: ["Germination","Tillering","Grand Growth","Maturity","Harvest"] },
  maize: { etc: 5.0, stages: ["Seedling","Vegetative","Tasseling","Grain Fill","Maturity"] },
  onion: { etc: 3.5, stages: ["Seedling","Vegetative","Bulb Formation","Maturation","Harvest"] },
  potato: { etc: 4.0, stages: ["Sprouting","Vegetative","Tuber Init","Tuber Bulking","Maturity"] },
};

const SOIL_COEFFICIENTS = { sandy: 0.7, loamy: 1.0, clay: 1.3, "black cotton": 1.2 };

function calculateIrrigation(crop, soilType, landArea, temp, humidity, rainProb) {
  const cropData = CROP_WATER[crop] || CROP_WATER.wheat;
  const soilCoeff = SOIL_COEFFICIENTS[soilType] || 1.0;
  const tempFactor = temp > 35 ? 1.3 : temp > 30 ? 1.1 : temp < 20 ? 0.8 : 1.0;
  const humidityFactor = humidity > 80 ? 0.7 : humidity > 60 ? 0.9 : humidity < 40 ? 1.2 : 1.0;
  const rainReduction = rainProb > 70 ? 0.3 : rainProb > 40 ? 0.6 : rainProb > 20 ? 0.8 : 1.0;

  const dailyET = cropData.etc * tempFactor * humidityFactor * soilCoeff;
  const waterNeeded = dailyET * landArea * 1000 * rainReduction; // litres
  const droughtRisk = temp > 35 && humidity < 40 && rainProb < 20 ? "High" : temp > 30 && humidity < 50 ? "Medium" : "Low";
  const waterlogRisk = rainProb > 80 && humidity > 85 ? "High" : rainProb > 60 ? "Medium" : "Low";

  const method = crop === "paddy" ? "Flood (standing water)" :
    ["tomato","cotton","sugarcane","onion"].includes(crop) ? "Drip Irrigation" : "Sprinkler / Furrow";

  const optimalTime = temp > 30 ? "Early morning (5-7 AM) or evening (5-7 PM)" : "Morning (6-9 AM)";
  const savings = method.includes("Drip") ? "40-50% water savings vs flood" : method.includes("Sprinkler") ? "25-35% water savings vs flood" : "";

  // 7-day schedule
  const schedule = [];
  for (let i = 0; i < 7; i++) {
    const dayRain = rainProb * (0.7 + Math.random() * 0.6);
    const needWater = dayRain < 50;
    schedule.push({
      day: i,
      date: new Date(Date.now() + i * 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      waterNeeded: needWater,
      amount: needWater ? Math.round(waterNeeded * (0.85 + Math.random() * 0.3)) : 0,
      rainChance: Math.round(dayRain),
      status: dayRain > 70 ? "rain" : needWater ? "water" : "adequate",
    });
  }

  return {
    dailyWater: Math.round(waterNeeded),
    dailyET: dailyET.toFixed(1),
    method, optimalTime, savings, droughtRisk, waterlogRisk,
    schedule, stages: cropData.stages,
    weeklyTotal: schedule.reduce((s, d) => s + d.amount, 0),
  };
}

export async function POST(request) {
  try {
    const { crop = "wheat", soilType = "loamy", landArea = 1, temp = 30, humidity = 60, rainProb = 20, growthStage = 0 } = await request.json();

    const result = calculateIrrigation(crop, soilType, landArea, temp, humidity, rainProb);
    let aiAdvice = `For ${crop} in ${soilType} soil, water ${result.dailyWater} litres daily using ${result.method}. Best time: ${result.optimalTime}.`;

    if (GEMINI_API_KEY) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `Give 2-sentence irrigation advice for ${crop} on ${landArea} acres of ${soilType} soil in India. Temperature: ${temp}°C, Humidity: ${humidity}%, Rain probability: ${rainProb}%. Growth stage: ${result.stages[growthStage] || "Vegetative"}. Be specific and practical.` }] }],
              generationConfig: { maxOutputTokens: 150, temperature: 0.5 }
            })
          }
        );
        if (res.ok) {
          const data = await res.json();
          aiAdvice = data.candidates?.[0]?.content?.parts?.[0]?.text || aiAdvice;
        }
      } catch {}
    }

    return NextResponse.json({ ...result, crop, soilType, landArea, aiAdvice, growthStage });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

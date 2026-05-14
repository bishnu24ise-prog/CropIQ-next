export const KB = [
  { k: ['wheat','sow','punjab','sowing time','rabi'], r: '🌾 <strong>Wheat Sowing Guide:</strong><br>• Best time: <strong>November 1–25</strong> in Punjab, Haryana, UP<br>• Late sowing (after Dec 15) reduces yield by 20–30%<br>• Use HD-2967 or PBW-343 for high yield<br>• Seed rate: 100 kg/acre<br>• First irrigation: 21 days after sowing (Crown Root Initiation stage)' },
  { k: ['paddy','rice','fertilizer','urea'], r: '🌾 <strong>Paddy Fertilizer Guide (Per Acre):</strong><br>• Urea: <strong>50 kg</strong> (split in 3 doses)<br>• DAP: 26 kg at transplanting<br>• MOP: 13 kg at transplanting<br>• Zinc sulphate: 10 kg (if deficient)<br>• Apply first dose at transplanting, 2nd at tillering, 3rd at panicle initiation' },
  { k: ['aphid','pest','tomato','insect'], r: '🐛 <strong>Natural Aphid Remedies:</strong><br>• Spray <strong>neem oil</strong> (5ml/litre) every 7 days<br>• Mix 1 tbsp dish soap + 1 litre water, spray on leaves<br>• Garlic spray: boil 5 garlic cloves, cool, spray<br>• Encourage ladybugs — they eat aphids<br>• Yellow sticky traps for monitoring<br>• Avoid excess nitrogen fertilizers' },
  { k: ['pm-kisan','kisan','scheme','subsidy','government'], r: '🏛️ <strong>PM-KISAN Scheme:</strong><br>• Benefit: <strong>₹6,000/year</strong> in 3 installments (₹2,000 each)<br>• Eligibility: All small & marginal farmers with land records<br>• How to apply: pmkisan.gov.in or nearest CSC center<br>• Required docs: Aadhaar, bank account, land records<br>• 16th installment already released — check your status now!' },
  { k: ['loan','kcc','credit card','interest','bank'], r: '💰 <strong>Kisan Credit Card (KCC):</strong><br>• Interest rate: Only <strong>7% p.a.</strong> (4% after subsidy)<br>• Limit: Up to ₹3 lakh without collateral<br>• Available at: SBI, PNB, Bank of Baroda, Cooperative Banks<br>• Docs needed: Land records, ID proof, 2 passport photos<br>• Repay after harvest — flexible schedule' },
  { k: ['drip','irrigation','water','moisture'], r: '💧 <strong>Drip Irrigation Guide:</strong><br>• Saves 30–50% water vs flood irrigation<br>• Best for: Tomato, Cotton, Sugarcane, Grapes<br>• Subsidy: Up to <strong>90% for small farmers</strong> under PMKSY<br>• Install drippers 30–45 cm apart for most crops<br>• Check filters weekly to prevent clogging' },
  { k: ['kharif','maharashtra','season','crop'], r: '🌽 <strong>Best Kharif Crops for Maharashtra:</strong><br>• Soybean — high demand, good MSP<br>• Cotton — Vidarbha specialty, good returns<br>• Tur Dal — drought-resistant<br>• Jowar — traditional, water-efficient<br>• Sowing season: <strong>June–July</strong> with first rains' },
  { k: ['weather','rain','forecast','monsoon'], r: '🌧️ <strong>Monsoon 2026 Forecast:</strong><br>• Expected onset in Kerala: <strong>June 1</strong><br>• Normal rainfall expected across India (IMD)<br>• Prepare your soil: Deep plowing before monsoon<br>• Keep drainage channels clear to avoid waterlogging' },
  { k: ['soil','ph','test','health'], r: '🧪 <strong>Soil Health Tips:</strong><br>• Test soil every 3 years at nearest KVK (free)<br>• Ideal pH: <strong>6.0–7.5</strong><br>• Add lime if too acidic, gypsum if too alkaline<br>• Get Soil Health Card from your agriculture department' },
  { k: ['drone','technology','modern','digital'], r: '🚁 <strong>Drone Technology for Farming:</strong><br>• Govt subsidy: Up to <strong>40–80%</strong> under SMAM scheme<br>• Use cases: Pesticide spray, crop monitoring, soil analysis<br>• Saves 30% chemicals and 5x faster spraying<br>• Training available at nearest KVK center' },
  { k: ['msp','price','market','mandi'], r: '💵 <strong>Current MSP (2025-26):</strong><br>• Wheat: <strong>₹2,425/qtl</strong><br>• Paddy: ₹2,183/qtl<br>• Soybean: ₹4,892/qtl<br>• Cotton: ₹7,121/qtl<br>• Sell at E-NAM portal for best prices' },
  { k: ['help','what can','features','how'], r: '🤖 <strong>I can help with:</strong><br>• 🌾 Crop advice & sowing calendar<br>• 🐛 Pest & disease treatment<br>• 💧 Irrigation & fertilizer guidance<br>• 🏛️ Govt schemes<br>• 💰 Loan & financial planning<br>• 📊 Market prices & MSP rates<br><br>Just type your question!' },
];

export function getAIReply(text) {
  const t = text.toLowerCase();
  for (const item of KB) {
    if (item.k.some(kw => t.includes(kw))) return item.r;
  }
  return `🤖 Great question about "<strong>${text}</strong>"!<br><br>Based on farming best practices:<br>• Consult your nearest KVK<br>• Call Kisan Call Centre: <strong>1800-180-1551</strong> (Free, 24/7)<br>• Check PM-Kisan portal for scheme eligibility<br><br>Ask about wheat, paddy, pests, irrigation, loans, or govt schemes! 🌾`;
}

export const SUGGESTIONS = [
  { label: "🌾 Wheat sowing time?", q: "When to sow wheat in Punjab?" },
  { label: "🐛 Aphid remedy", q: "Natural remedy for aphids on tomatoes" },
  { label: "🌱 Paddy fertilizer", q: "How much fertilizer for paddy per acre?" },
  { label: "🏛️ PM-Kisan scheme", q: "Tell me about PM-Kisan scheme" },
  { label: "🌽 Kharif crops", q: "Best crops for Maharashtra in Kharif season" },
  { label: "💧 Drip irrigation", q: "How to manage drip irrigation?" },
];

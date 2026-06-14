import { NextResponse } from "next/server";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SCHEMES_DB = [
  { id: "pmkisan", name: "PM-KISAN Samman Nidhi", ministry: "Agriculture", benefit: "₹6,000/year", type: "Direct Transfer", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Aadhaar Card","Bank Passbook","Land Records"], deadline: "Rolling", link: "pmkisan.gov.in", description: "Direct income support of ₹6,000 per year in three installments to all land-holding farmer families." },
  { id: "pmfby", name: "PM Fasal Bima Yojana (PMFBY)", ministry: "Agriculture", benefit: "Crop Insurance", type: "Insurance", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["KCC/Bank Account","Sowing Certificate","Land Records"], deadline: "Before sowing season", link: "pmfby.gov.in", description: "Comprehensive crop insurance at just 2% premium for Kharif and 1.5% for Rabi crops." },
  { id: "pmksy", name: "PM Krishi Sinchai Yojana (PMKSY)", ministry: "Water Resources", benefit: "Up to 90% Subsidy", type: "Subsidy", eligibility: { landMax: 5, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Land Records","Bank Account","Quotation for Equipment"], deadline: "Year-round", link: "pmksy.gov.in", description: "Subsidized micro-irrigation (drip/sprinkler) for small and marginal farmers." },
  { id: "shc", name: "Soil Health Card Scheme", ministry: "Agriculture", benefit: "Free Soil Testing", type: "Service", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Land Records","Farmer ID"], deadline: "Year-round", link: "soilhealth.dac.gov.in", description: "Free soil testing and customized fertilizer recommendations based on soil nutrient status." },
  { id: "kcc", name: "Kisan Credit Card (KCC)", ministry: "Finance", benefit: "4-7% Interest Loan", type: "Credit", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Land Records","ID Proof","2 Passport Photos","Bank Account"], deadline: "Year-round", link: "Bank Branch", description: "Low-interest credit up to ₹3 lakh without collateral for crop production and allied activities." },
  { id: "smam", name: "Sub-Mission on Agricultural Mechanization", ministry: "Agriculture", benefit: "40-80% Subsidy", type: "Subsidy", eligibility: { landMax: 10, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Land Records","Aadhaar","Bank Account","Quotation"], deadline: "Year-round", link: "agrimachinery.nic.in", description: "Subsidized farm equipment including tractors, harvesters, drones, and sprayers." },
  { id: "rkvy", name: "Rashtriya Krishi Vikas Yojana", ministry: "Agriculture", benefit: "Project Funding", type: "Grant", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Project Proposal","Land Records"], deadline: "State-specific", link: "rkvy.nic.in", description: "Incentivizes states to increase public investment in agriculture and allied sectors." },
  { id: "pmasha", name: "PM-AASHA (Annadata Aay Sanrakshan Abhiyan)", ministry: "Agriculture", benefit: "MSP Protection", type: "Price Support", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Farmer Registration","Crop Details"], deadline: "During procurement", link: "Agriculture Dept", description: "Ensures farmers get MSP for their produce through price support and deficiency payment schemes." },
  { id: "rythu", name: "Rythu Bandhu (Telangana)", ministry: "State", benefit: "₹10,000/acre/year", type: "Direct Transfer", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "Telangana" }, requirements: ["Pattadar Passbook","Aadhaar","Bank Account"], deadline: "Before each season", link: "rythubandhu.telangana.gov.in", description: "Investment support for agriculture at ₹10,000 per acre per year for Telangana farmers." },
  { id: "mahadbt", name: "MahaDBT (Maharashtra)", ministry: "State", benefit: "Various Subsidies", type: "Subsidy", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "Maharashtra" }, requirements: ["Aadhaar","7/12 Extract","Bank Account"], deadline: "Scheme-specific", link: "mahadbt.maharashtra.gov.in", description: "Single-window portal for 40+ agricultural subsidies in Maharashtra." },
  { id: "kalia", name: "KALIA (Odisha)", ministry: "State", benefit: "₹10,000/family/season", type: "Direct Transfer", eligibility: { landMax: 5, categories: ["General","SC","ST","OBC"], states: "Odisha" }, requirements: ["Aadhaar","Bank Account","Land Records"], deadline: "Before each season", link: "kalia.odisha.gov.in", description: "Financial assistance of ₹10,000 per family for 5 seasons to small and marginal farmers in Odisha." },
  { id: "nmsa", name: "National Mission on Sustainable Agriculture", ministry: "Agriculture", benefit: "Training + Subsidy", type: "Capacity Building", eligibility: { landMax: 100, categories: ["General","SC","ST","OBC"], states: "All" }, requirements: ["Farmer Registration"], deadline: "Year-round", link: "nmsa.dac.gov.in", description: "Promotes sustainable agriculture through soil health management, water use efficiency, and climate adaptation." },
];

function matchSchemes(profile) {
  return SCHEMES_DB.map(scheme => {
    let score = 50;
    if (scheme.eligibility.states === "All" || scheme.eligibility.states === profile.state) score += 20;
    else score -= 30;
    if (profile.landArea <= scheme.eligibility.landMax) score += 15;
    if (scheme.eligibility.categories.includes(profile.category || "General")) score += 15;
    score = Math.min(Math.max(score, 10), 99);
    return { ...scheme, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export async function POST(request) {
  try {
    const { state = "Maharashtra", crops = "Wheat", landArea = 2, category = "General", income = 0 } = await request.json();
    const profile = { state, crops, landArea: parseFloat(landArea), category, income };
    const recommendations = matchSchemes(profile);

    let aiSummary = `Based on your profile (${landArea} acres in ${state}), you're eligible for ${recommendations.filter(r => r.matchScore > 60).length} schemes.`;

    if (GEMINI_API_KEY) {
      try {
        const topSchemes = recommendations.slice(0, 3).map(s => s.name).join(", ");
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `In 2 sentences, advise a ${category} farmer in ${state} with ${landArea} acres growing ${crops} about applying for: ${topSchemes}. Be specific about benefits and deadlines.` }] }],
              generationConfig: { maxOutputTokens: 150, temperature: 0.5 }
            })
          }
        );
        if (res.ok) {
          const data = await res.json();
          aiSummary = data.candidates?.[0]?.content?.parts?.[0]?.text || aiSummary;
        }
      } catch {}
    }

    return NextResponse.json({ recommendations, aiSummary, profile });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

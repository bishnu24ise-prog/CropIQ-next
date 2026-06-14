import { NextResponse } from "next/server";
import { queryWolfram } from "../../lib/wolfram";

export async function POST(request) {
  try {
    const { crop, landArea, soilPh, nitrogen, rainfall, temp } = await request.json();

    // Construct computational queries for Wolfram
    const fertilizerQuery = `fertilizer recommendation for ${crop} soil pH ${soilPh} nitrogen ${nitrogen}`;
    const yieldQuery = `expected ${crop} yield per acre with rainfall ${rainfall}mm and temperature ${temp} C`;

    // Run queries in parallel
    const [wolframFertilizer, wolframYield] = await Promise.all([
      queryWolfram(fertilizerQuery),
      queryWolfram(yieldQuery)
    ]);

    // Format the response
    const result = {
      crop, landArea,
      fertilizerInsight: wolframFertilizer || "Wolfram API data unavailable. Try basic NPK 120:60:40.",
      yieldInsight: wolframYield || `Estimated 15-20 quintals per acre for ${crop}.`,
      computationalSource: "Wolfram Alpha Computational Knowledge Engine",
      totalEstimatedYield: wolframYield ? `Check Wolfram insight for per acre rate, then multiply by ${landArea} acres.` : `Estimated ${15 * landArea} to ${20 * landArea} quintals.`
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

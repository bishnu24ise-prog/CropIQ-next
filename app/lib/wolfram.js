export async function queryWolfram(query) {
  const appId = process.env.WOLFRAM_APP_ID;
  if (!appId || appId === "YOUR_WOLFRAM_APP_ID_HERE") {
    console.warn("Wolfram API Key is missing. Falling back to local computation.");
    return null;
  }

  try {
    // Short Answers API gives direct computational responses without extra formatting
    const url = `https://api.wolframalpha.com/v1/result?appid=${appId}&i=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error("Wolfram API Error:", error);
    return null;
  }
}

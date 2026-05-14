"use client";
import { useMemo } from "react";

/**
 * Calculates a 0-100 crop health score from available data.
 * @param {{temp: number, rain: number, humidity: number, pestRisk: string, priceUp: boolean}} data
 */
function calcScore({ temp = 25, rain = 70, humidity = 60, pestRisk = "low", priceUp = true }) {
  let score = 100;
  // Temperature stress
  if (temp > 38) score -= 20;
  else if (temp > 34) score -= 10;
  else if (temp < 10) score -= 15;
  // Rain stress
  if (rain < 20) score -= 15;
  else if (rain > 200) score -= 10;
  // Humidity
  if (humidity > 85) score -= 10; // disease risk
  else if (humidity < 30) score -= 8;
  // Pest risk
  if (pestRisk === "high") score -= 20;
  else if (pestRisk === "medium") score -= 10;
  // Market
  if (!priceUp) score -= 5;
  return Math.max(0, Math.min(100, score));
}

function getGrade(score) {
  if (score >= 85) return { grade: "A", label: "Excellent", color: "#059669", bg: "#dcfce7" };
  if (score >= 70) return { grade: "B", label: "Good", color: "#2563eb", bg: "#dbeafe" };
  if (score >= 50) return { grade: "C", label: "Fair", color: "#d97706", bg: "#fef3c7" };
  return { grade: "D", label: "At Risk", color: "#dc2626", bg: "#fee2e2" };
}

export default function CropHealthScore({ data = {}, size = "md" }) {
  const score = useMemo(() => calcScore(data), [data]);
  const { grade, label, color, bg } = getGrade(score);
  const r = size === "sm" ? 32 : 48;
  const strokeW = size === "sm" ? 5 : 7;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <>
      <style>{`
        .hs-wrap{display:flex;align-items:center;gap:${size === "sm" ? "10" : "16"}px}
        .hs-ring{transform:rotate(-90deg)}
        .hs-score{font-size:${size === "sm" ? "1.1rem" : "1.8rem"};font-weight:900;color:${color};line-height:1}
        .hs-grade{font-size:${size === "sm" ? ".6rem" : ".75rem"};font-weight:800;padding:3px 8px;border-radius:20px;background:${bg};color:${color};margin-top:4px;display:inline-block}
        .hs-label{font-size:${size === "sm" ? ".7rem" : ".85rem"};font-weight:700;color:#374151}
        .hs-bar{height:6px;background:#f3f4f6;border-radius:10px;overflow:hidden;margin-top:6px;width:80px}
        .hs-fill{height:100%;border-radius:10px;background:${color};transition:width .8s ease;width:${score}%}
      `}</style>
      <div className="hs-wrap">
        <div style={{ position: "relative", width: (r + strokeW) * 2, height: (r + strokeW) * 2, flexShrink: 0 }}>
          <svg width={(r + strokeW) * 2} height={(r + strokeW) * 2}>
            {/* Background ring */}
            <circle cx={r + strokeW} cy={r + strokeW} r={r} stroke="#f3f4f6" strokeWidth={strokeW} fill="none" />
            {/* Score ring */}
            <circle
              className="hs-ring"
              cx={r + strokeW} cy={r + strokeW} r={r}
              stroke={color} strokeWidth={strokeW} fill="none"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              style={{ transformOrigin: `${r + strokeW}px ${r + strokeW}px`, transition: "stroke-dasharray .8s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="hs-score">{score}</span>
          </div>
        </div>
        <div>
          <div className="hs-label">Crop Health Score</div>
          <span className="hs-grade">{grade} — {label}</span>
          <div className="hs-bar"><div className="hs-fill" /></div>
        </div>
      </div>
    </>
  );
}

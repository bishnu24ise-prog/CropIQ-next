"use client";

export default function DiseaseHeatmap({ visible = false, severity = "Medium" }) {
  const zones = severity?.toLowerCase() === "severe"
    ? "radial-gradient(circle at 25% 35%,rgba(239,68,68,0.5),transparent 35%),radial-gradient(circle at 65% 55%,rgba(239,68,68,0.5),transparent 30%),radial-gradient(circle at 45% 75%,rgba(239,68,68,0.4),transparent 25%),radial-gradient(circle at 80% 30%,rgba(245,158,11,0.3),transparent 20%)"
    : severity?.toLowerCase() === "medium" || severity?.toLowerCase() === "moderate"
    ? "radial-gradient(circle at 30% 40%,rgba(239,68,68,0.4),transparent 30%),radial-gradient(circle at 70% 60%,rgba(239,68,68,0.4),transparent 25%),radial-gradient(circle at 50% 20%,rgba(245,158,11,0.3),transparent 20%)"
    : "radial-gradient(circle at 40% 50%,rgba(245,158,11,0.3),transparent 25%),radial-gradient(circle at 60% 40%,rgba(245,158,11,0.2),transparent 20%)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: zones,
        zIndex: 4,
        transition: "opacity 1s ease",
        opacity: visible ? 1 : 0,
        mixBlendMode: "color-burn",
        pointerEvents: "none",
        borderRadius: "inherit",
      }}
      aria-hidden="true"
    />
  );
}

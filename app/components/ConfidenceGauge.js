"use client";
import { useEffect, useRef } from "react";

export default function ConfidenceGauge({ value = 0, size = 120, label = "Confidence" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = size / 2 - 10;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    let currentVal = 0;

    const getColor = (v) => {
      if (v >= 80) return "#22c55e";
      if (v >= 50) return "#f59e0b";
      return "#ef4444";
    };

    function draw() {
      ctx.clearRect(0, 0, size, size);

      // Background arc
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.stroke();

      // Value arc
      const angle = startAngle + (endAngle - startAngle) * (currentVal / 100);
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, angle);
      ctx.strokeStyle = getColor(currentVal);
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.stroke();

      // Glow effect
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, angle);
      ctx.strokeStyle = getColor(currentVal) + "40";
      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.stroke();

      // Value text
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${size * 0.25}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(currentVal)}%`, cx, cy - 4);

      // Label
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `600 ${size * 0.1}px Inter, sans-serif`;
      ctx.fillText(label, cx, cy + size * 0.18);

      if (currentVal < value) {
        currentVal = Math.min(currentVal + 1.5, value);
        requestAnimationFrame(draw);
      }
    }

    const timer = setTimeout(() => draw(), 200);
    return () => clearTimeout(timer);
  }, [value, size, label]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      aria-label={`${label}: ${value}%`}
    />
  );
}

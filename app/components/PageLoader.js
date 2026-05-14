"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    setWidth(20);
    const t1 = setTimeout(() => setWidth(60), 100);
    const t2 = setTimeout(() => setWidth(85), 300);
    const t3 = setTimeout(() => { setWidth(100); }, 500);
    const t4 = setTimeout(() => { setLoading(false); setWidth(0); }, 700);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [pathname]);

  if (!loading) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, height: 3, zIndex: 9999,
      width: `${width}%`, transition: "width 0.3s ease",
      background: "linear-gradient(90deg, #10b981, #34d399, #6ee7b7)",
      boxShadow: "0 0 10px rgba(16,185,129,0.6)",
    }} />
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getKnowledgeBase } from "../lib/api";

export default function KnowledgePage() {
  const [vids, setVids] = useState(null);
  const [query, setQuery] = useState("");
  const [player, setPlayer] = useState(null); // {url, title}

  useEffect(() => {
    (async () => {
      try { const d = await getKnowledgeBase(); setVids(d.articles || []); } catch { setVids([]); }
    })();
  }, []);

  const filtered = vids ? vids.filter(v => !query || v.title?.toLowerCase().includes(query.toLowerCase()) || v.category?.toLowerCase().includes(query.toLowerCase())) : null;

  const getThumbnail = (url) => {
    if (!url) return null;
    const match = url.match(/embed\/([^?]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };

  return (
    <>
      <style>{`
        :root{--green-50:#ecfdf5;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-900:#064e3b;--gold-600:#d97706;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-400:#9ca3af;--gray-500:#6b7280;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08)}
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
        .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
        .page-header{background:var(--green-900);padding:48px 24px;color:white;text-align:center}
        .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
        .page-header p{opacity:.7;font-size:.95rem;max-width:600px;margin:0 auto}
        .page-body{max-width:1100px;margin:0 auto;padding:32px 20px 60px}
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .search-wrap{margin-top:25px;max-width:600px;margin-left:auto;margin-right:auto;display:flex}
        .search-input{flex:1;padding:12px 20px;border:none;border-radius:20px 0 0 20px;font-size:1rem;outline:none;color:var(--gray-900)}
        .search-btn{padding:0 25px;border:none;border-radius:0 20px 20px 0;background:var(--green-600);color:white;font-size:1rem;cursor:pointer;font-weight:700}
        .video-card{cursor:pointer;transition:.3s;border-radius:12px;overflow:hidden;background:var(--white);box-shadow:0 4px 15px rgba(0,0,0,0.05)}
        .video-card:hover{transform:translateY(-5px);box-shadow:0 8px 25px rgba(0,0,0,0.1)}
        .thumb{height:160px;background:#000;display:flex;align-items:center;justify-content:center}
        .play-btn{font-size:3rem;color:white;opacity:.8;text-shadow:0 2px 10px rgba(0,0,0,0.5)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:100;flex-direction:column}
        .modal-player{position:relative;padding-bottom:56.25%;height:0;width:100%}
        .modal-player iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px}
        .modal-top{display:flex;justify-content:flex-end;gap:10px;margin-bottom:10px;width:95%;max-width:850px}
        .modal-frame{width:95%;max-width:850px}
        .btn-yt{padding:8px 16px;border-radius:8px;background:var(--green-600);color:white;border:none;font-weight:700;font-size:.85rem;cursor:pointer;font-family:inherit}
        .btn-close{color:white;font-size:1.5rem;background:none;border:none;cursor:pointer}
        @media(max-width:768px){.grid-3{grid-template-columns:1fr}}
      `}</style>

      <nav className="page-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🎓 CropIQ Academy</Link>
      </nav>

      <div className="page-header">
        <h1>Farmer Video Academy</h1>
        <p>Search and watch expert farming tutorials instantly.</p>
        <div className="search-wrap">
          <input className="search-input" placeholder="Search (e.g. 'farming')" value={query} onChange={e => setQuery(e.target.value)} />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="page-body">
        <div className="grid-3">
          {filtered === null ? (
            <p style={{ textAlign: "center", padding: 100, gridColumn: "span 3", color: "var(--gray-400)" }}>Syncing Academy Library...</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: 100, gridColumn: "span 3", color: "var(--gray-400)" }}>No videos found.</p>
          ) : filtered.map((v, i) => {
            const thumbUrl = getThumbnail(v.contentUrl);
            return (
              <div className="video-card" key={v._id || i} onClick={() => setPlayer({ url: v.contentUrl, title: v.title })}>
                <div className="thumb" style={{ background: thumbUrl ? `url(${thumbUrl}) center/cover` : '#000' }}>
                  <div className="play-btn">▶️</div>
                </div>
                <div style={{ padding: 15 }}>
                  <div style={{ fontSize: ".7rem", color: "var(--gold-600)", fontWeight: 700 }}>{v.category}</div>
                  <h3 style={{ fontSize: ".95rem", color: "var(--green-900)", margin: "5px 0" }}>{v.title}</h3>
                  <p style={{ fontSize: ".8rem", color: "var(--gray-500)" }}>{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PLAYER MODAL */}
      {player && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setPlayer(null); }}>
          <div className="modal-top">
            <button className="btn-yt" onClick={() => window.open(player.url?.replace("embed/", "watch?v="), "_blank")}>Open in YouTube ↗</button>
            <button className="btn-close" onClick={() => setPlayer(null)}>✕</button>
          </div>
          <div className="modal-frame">
            <div className="modal-player">
              <iframe src={player.url} allowFullScreen title={player.title} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

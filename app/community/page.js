"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCommunityPosts, createCommunityPost, addCommentToPost, likePost } from "../lib/api";

export default function CommunityPage() {
  const [posts, setPosts] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState({}); // {postId: inputText}
  const [openComments, setOpenComments] = useState({}); // {postId: bool}
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    try { const d = await getCommunityPosts(); setPosts(d.posts || []); } catch { setPosts([]); }
  }

  function flash(m, t = "success") { setToast({ msg: m, type: t }); setTimeout(() => setToast(null), 3000); }

  async function handleNewPost() {
    if (!title || !content) return;
    await createCommunityPost({ title, content, category: "General Discussion" });
    setShowModal(false); setTitle(""); setContent("");
    loadPosts();
  }

  async function handleLike(id) { await likePost(id); loadPosts(); }

  async function handleComment(id) {
    const text = comments[id];
    if (!text) return;
    try {
      await addCommentToPost(id, text);
      setComments(p => ({ ...p, [id]: "" }));
      flash("Comment posted!");
      loadPosts();
    } catch { flash("Error posting comment", "error"); }
  }

  function toggleComments(id) { setOpenComments(p => ({ ...p, [id]: !p[id] })); }

  return (
    <>
      <style>{`
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-400:#34d399;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-900:#064e3b;--red-500:#ef4444;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-300:#d1d5db;--gray-500:#6b7280;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-md:0 4px 20px rgba(0,0,0,.08);--transition:all .2s ease}
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}
        .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
        .nav-btn{padding:8px 18px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;cursor:pointer;border:none;font-family:inherit;background:var(--green-600);color:white;transition:var(--transition)}
        .nav-btn:hover{background:var(--green-700)}
        .page-header{background:linear-gradient(135deg,var(--green-900),#0f766e);padding:48px 24px;color:white;text-align:center}
        .badge{display:inline-block;background:rgba(255,255,255,.15);padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;margin-bottom:12px}
        .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
        .page-header p{opacity:.85;font-size:.95rem;max-width:600px;margin:0 auto}
        .page-body{max-width:1100px;margin:0 auto;padding:32px 20px 60px}
        .layout-sidebar{display:grid;grid-template-columns:250px 1fr;gap:24px}
        .sidebar{position:sticky;top:80px;align-self:start}
        .sidebar-title{font-size:1.1rem;font-weight:800;color:var(--green-900);margin-bottom:12px}
        .sidebar-item{padding:10px 14px;border-radius:var(--radius-sm);font-size:.88rem;font-weight:600;color:var(--gray-700);cursor:pointer;transition:var(--transition);margin-bottom:4px}
        .sidebar-item:hover,.sidebar-item.active{background:var(--green-50);color:var(--green-900)}
        .card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid rgba(0,0,0,.06)}
        .form-group{margin-bottom:16px}.form-label{display:block;font-size:.85rem;font-weight:600;color:var(--gray-700);margin-bottom:6px}
        .form-input{width:100%;padding:10px 14px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit}
        .form-textarea{width:100%;padding:10px 14px;border:1px solid var(--gray-300);border-radius:var(--radius-sm);font-size:.95rem;outline:none;font-family:inherit;min-height:100px;resize:vertical}
        .btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;border-radius:var(--radius-sm);font-weight:700;font-size:.9rem;cursor:pointer;border:none;font-family:inherit;transition:var(--transition)}
        .btn-green{background:var(--green-600);color:white}.btn-green:hover{background:var(--green-700)}
        .btn-outline{background:transparent;border:1px solid var(--gray-300);color:var(--gray-700)}
        .btn-sm{padding:6px 14px;font-size:.8rem}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100}
        .modal{background:var(--white);border-radius:16px;padding:32px;width:90%;max-width:480px}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .modal-title{font-size:1.2rem;font-weight:800;color:var(--green-900)}
        .modal-close{background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--gray-500)}
        .toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);font-weight:700;font-size:.85rem;z-index:200;animation:fadeIn .3s}
        .toast-success{background:var(--green-600);color:white}.toast-error{background:var(--red-500);color:white}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @media(max-width:768px){.layout-sidebar{grid-template-columns:1fr}}
      `}</style>

      <nav className="page-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <button className="nav-btn" onClick={() => setShowModal(true)}>+ New Post</button>
      </nav>

      <div className="page-header">
        <div className="badge">👥 Community Forum</div>
        <h1>Farmer Community</h1>
        <p>Share knowledge, ask questions, and grow together.</p>
      </div>

      <div className="page-body">
        <div className="layout-sidebar">
          <div className="card sidebar">
            <h3 className="sidebar-title">Categories</h3>
            {["All","Crop Advice","Equipment"].map(c => (
              <div key={c} className={`sidebar-item ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
                {c === "All" ? "💬" : c === "Crop Advice" ? "🌾" : "🚜"} {c === "All" ? "All Discussions" : c}
              </div>
            ))}
          </div>

          <div>
            {posts === null ? (
              <p style={{ textAlign: "center", padding: 40, color: "var(--gray-500)" }}>Loading community feed...</p>
            ) : posts.length === 0 ? (
              <p style={{ textAlign: "center", padding: 40, color: "var(--gray-500)" }}>No posts yet. Start the conversation!</p>
            ) : posts.map(post => (
              <div className="card" key={post._id} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
                  <div style={{ fontWeight: 700, color: "var(--green-900)" }}>{post.userId?.name || "Farmer"}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--gray-500)" }}>{post.category} • {new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--green-900)", marginBottom: 10 }}>{post.title}</h3>
                <p style={{ fontSize: ".9rem", color: "var(--gray-700)", marginBottom: 15 }}>{post.content}</p>

                <div style={{ display: "flex", gap: 15, paddingTop: 15, borderTop: "1px solid var(--gray-100)", alignItems: "center" }}>
                  <button className="btn btn-sm" style={{ border: "none", background: "none", cursor: "pointer", fontSize: ".85rem" }} onClick={() => handleLike(post._id)}>👍 {post.likes || 0}</button>
                  <button className="btn btn-sm" style={{ border: "none", background: "none", cursor: "pointer", fontSize: ".85rem" }} onClick={() => toggleComments(post._id)}>💬 {post.comments?.length || 0} Comments</button>
                  {post.category === "Equipment Buy/Sell" && (
                    <button className="btn btn-green btn-sm" style={{ marginLeft: "auto" }} onClick={() => alert(`Farmer: ${post.userId?.name}\nPhone: ${post.userId?.phone || "9876543210"}`)}>📞 Contact</button>
                  )}
                </div>

                {openComments[post._id] && (
                  <div style={{ marginTop: 15 }}>
                    {(post.comments || []).map((c, i) => (
                      <div key={i} style={{ marginTop: 12, padding: 10, background: "var(--gray-50)", borderRadius: "var(--radius-sm)" }}>
                        <div style={{ fontWeight: 700, fontSize: ".8rem", color: "var(--green-900)" }}>{c.name}</div>
                        <p style={{ fontSize: ".85rem", color: "var(--gray-700)", marginTop: 4 }}>{c.text}</p>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                      <input className="form-input" placeholder="Add a comment..." style={{ padding: "8px 12px" }} value={comments[post._id] || ""} onChange={e => setComments(p => ({ ...p, [post._id]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") handleComment(post._id); }} />
                      <button className="btn btn-green btn-sm" onClick={() => handleComment(post._id)}>Post</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW POST MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">📝 Create Post</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Details</label><textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} /></div>
            <button className="btn btn-green" style={{ width: "100%" }} onClick={handleNewPost}>Post to Community</button>
          </div>
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

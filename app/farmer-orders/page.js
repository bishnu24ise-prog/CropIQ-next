"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getFarmerOrders } from "../lib/api";

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getFarmerOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <>
      <style>{`
        :root{--green-50:#ecfdf5;--green-100:#d1fae5;--green-500:#10b981;--green-600:#059669;--green-700:#047857;--green-900:#064e3b;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-300:#d1d5db;--gray-500:#6b7280;--gray-600:#4b5563;--gray-700:#374151;--gray-900:#111827;--white:#fff;--radius-md:12px;--radius-sm:8px;--shadow-sm:0 2px 10px rgba(0,0,0,.05);--shadow-md:0 4px 20px rgba(0,0,0,.08);--transition:all .2s ease}
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--gray-50);color:var(--gray-900)}
        .page-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--white);border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:50}
        .back{color:var(--green-700);text-decoration:none;font-weight:600;font-size:.9rem}.back:hover{color:var(--green-900)}
        .logo{color:var(--green-900);text-decoration:none;font-weight:800;font-size:1.2rem}
        .page-header{background:var(--green-900);padding:40px 24px;color:white;text-align:center}
        .page-header h1{font-size:2rem;font-weight:800;margin-bottom:8px}
        .page-body{max-width:1000px;margin:0 auto;padding:40px 20px 80px}
        
        .order-card{background:var(--white);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-sm);border:1px solid rgba(0,0,0,.06);margin-bottom:20px;display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;animation:fadeUp .4s ease both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        
        .order-meta{display:flex;gap:15px;font-size:.85rem;color:var(--gray-500);margin-bottom:12px;font-weight:600}
        .order-product{font-size:1.4rem;font-weight:800;color:var(--green-900);margin-bottom:4px}
        .order-price{font-size:1.2rem;font-weight:800;color:var(--green-600)}
        
        .buyer-box{background:var(--gray-50);border:1px solid var(--gray-100);padding:15px;border-radius:var(--radius-sm);margin-top:15px}
        .buyer-box p{font-size:.9rem;color:var(--gray-700);line-height:1.6;margin-bottom:4px}
        .buyer-box strong{color:var(--gray-900)}

        .status-badge{padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:700;text-transform:uppercase;background:#fef3c7;color:#d97706;border:1px solid #fde68a}
        .status-badge.completed{background:var(--green-100);color:var(--green-700);border-color:#bbf7d0}
        
        .empty-state{text-align:center;padding:60px 20px;background:var(--white);border-radius:var(--radius-md);border:1px dashed var(--gray-300)}
        .empty-state h3{color:var(--gray-700);margin-bottom:10px}
        
        @media(max-width:600px){.order-card{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      <nav className="page-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <Link href="/" className="logo">🌱 CropIQ</Link>
        <div style={{ width: 100 }}></div>
      </nav>

      {/* HEADER */}
      <div className="page-header">
        <h1>📦 My Incoming Orders</h1>
        <p style={{ opacity: .9, fontSize: ".95rem" }}>Track and manage purchase orders from direct consumers.</p>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="empty-state">
            <h3>Loading your orders...</h3>
          </div>
        ) : orders && orders.length > 0 ? (
          orders.map((order, i) => (
            <div className="order-card" key={order._id || i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div>
                <div className="order-meta">
                  <span>Order ID: #{order._id?.slice(-6).toUpperCase() || 'NEW'}</span>
                  <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="order-product">{order.product}</h3>
                <div className="order-price">₹{order.totalPrice}</div>

                <div className="buyer-box">
                  <p><strong>Buyer Name:</strong> {order.buyerName}</p>
                  <p><strong>📞 Contact:</strong> <a href={`tel:${order.contactNumber}`} style={{ color: "var(--blue-600)", textDecoration: "none" }}>{order.contactNumber}</a></p>
                  <p><strong>📍 Delivery Address:</strong> {order.deliveryAddress}, {order.city} - {order.pincode}</p>
                </div>
              </div>
              
              <div style={{ textAlign: "right" }}>
                <div className={`status-badge ${order.status === 'completed' ? 'completed' : ''}`}>
                  {order.status || 'Pending'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div style={{ fontSize: "3rem", marginBottom: 15 }}>🛒</div>
            <h3>No Orders Yet</h3>
            <p style={{ color: "var(--gray-500)", fontSize: ".9rem" }}>When a consumer buys your listed crops, the order will appear here.</p>
          </div>
        )}
      </div>
    </>
  );
}

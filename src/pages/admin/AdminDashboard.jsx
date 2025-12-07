// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/admin/orders"),
        ]);

        const products = prodRes.data.items || [];
        const orders = ordersRes.data || [];

        const totalRevenue = orders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0
        );

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          recentOrders: orders.slice(0, 5),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p style={{ padding: "1.5rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: 8 }}>
          <h3>Total Products</h3>
          <p style={{ fontSize: 24 }}>{stats.totalProducts}</p>
        </div>
        <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: 8 }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: 24 }}>{stats.totalOrders}</p>
        </div>
        <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: 8 }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: 24 }}>₹{stats.totalRevenue}</p>
        </div>
      </div>

      <section style={{ marginTop: "2rem" }}>
        <h2>Recent Orders</h2>
        {!stats.recentOrders.length ? (
          <p>No orders yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-6)}</td>
                  <td>{o.user?.name || o.user?.email || "N/A"}</td>
                  <td>{o.status}</td>
                  <td>₹{o.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p style={{ marginTop: "1rem" }}>
          <Link to="/admin/products">Manage products</Link> |{" "}
          <Link to="/admin/orders">Manage orders</Link>
        </p>
      </section>
    </div>
  );
}

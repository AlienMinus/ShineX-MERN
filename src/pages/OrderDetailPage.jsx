// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="page">Loading...</p>;
  if (!order) return <p className="page">Order not found.</p>;

  const { shippingAddress, items } = order;

  const isAdmin = user?.role === "admin";

  return (
    <div className="page">
      <h1>Order #{order._id.slice(-6)}</h1>
      <p>
        Status: <strong>{order.status}</strong>
      </p>
      <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
      <p>Tracking ID: {order.trackingId || "N/A"}</p>

      {/* 👇 extra info for admin */}
      {isAdmin && order.user && (
        <p>
          Customer: <strong>{order.user.name || "N/A"}</strong> (
          {order.user.email})
        </p>
      )}

      <h2 style={{ marginTop: "1rem" }}>Shipping Address</h2>
      <p>
        {shippingAddress.fullName} <br />
        {shippingAddress.line1}
        {shippingAddress.line2 && <>, {shippingAddress.line2}</>}
        <br />
        {shippingAddress.city}, {shippingAddress.state} –{" "}
        {shippingAddress.pincode}
        <br />
        {shippingAddress.country}
        <br />
        Phone: {shippingAddress.phone}
      </p>

      <h2 style={{ marginTop: "1rem" }}>Items</h2>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id}>
              <td>
                {it.product?.title || it.product || "Product"}
              </td>
              <td style={{ textAlign: "center" }}>{it.quantity}</td>
              <td style={{ textAlign: "center" }}>₹{it.price}</td>
              <td style={{ textAlign: "center" }}>
                ₹{it.price * it.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "1rem" }}>Total: ₹{order.totalAmount}</h3>

      <p style={{ marginTop: "1rem" }}>
        {isAdmin ? (
          <Link to="/admin/orders">← Back to admin orders</Link>
        ) : (
          <Link to="/orders">← Back to my orders</Link>
        )}
      </p>
    </div>
  );
}

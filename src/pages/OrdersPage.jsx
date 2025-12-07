// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data || []);
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
      <h1>My Orders</h1>
      {!orders.length ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6)}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>{o.status}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <Link to={`/orders/${o._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

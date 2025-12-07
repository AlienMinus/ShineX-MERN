// src/pages/admin/AdminOrdersPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const STATUS_OPTIONS = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setSavingId(orderId);
      await api.patch(`/orders/${orderId}/status`, { status });
      await loadOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p className="page">Loading...</p>;

  return (
    <div className="page">
      <h1>Admin – Orders</h1>
      {!orders.length ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Details</th>   {/* 👈 new column */}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6)}</td>
                <td>{o.user?.name || o.user?.email || "N/A"}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) =>
                      handleStatusChange(o._id, e.target.value)
                    }
                    disabled={savingId === o._id}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{o.items?.length || 0}</td>
                <td>
                  {/* 👇 admin can now open full order detail page */}
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

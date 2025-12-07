import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function Profile() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newAddr, setNewAddr] = useState({ label: '', name: '', line1: '', city: '', state: '', country: '', postalCode: '', phone: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  function authHeader() {
    const t = localStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  async function loadProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      // You'd need a GET /api/auth/me endpoint
      // For now, just set placeholder
      setUser({ id: 'user1', email: 'test@example.com', name: 'User' });
      // Fetch orders
      // const ordRes = await axios.get(`${process.env.VITE_API_URL}/api/orders`, { headers: authHeader() });
      // setOrders(ordRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addAddress(e) {
    e.preventDefault();
    try {
      // POST /api/auth/address
      setAddresses([...addresses, newAddr]);
      setNewAddr({ label: '', name: '', line1: '', city: '', state: '', country: '', postalCode: '', phone: '' });
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <section>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
      </section>

      <section>
        <h2>Delivery Addresses</h2>
        <form onSubmit={addAddress}>
          <input
            placeholder="Label (Home/Work)"
            value={newAddr.label}
            onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}
          />
          <input
            placeholder="Name"
            value={newAddr.name}
            onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
          />
          <input
            placeholder="Address Line 1"
            value={newAddr.line1}
            onChange={e => setNewAddr({ ...newAddr, line1: e.target.value })}
          />
          <input
            placeholder="City"
            value={newAddr.city}
            onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
          />
          <input
            placeholder="State"
            value={newAddr.state}
            onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
          />
          <input
            placeholder="Country"
            value={newAddr.country}
            onChange={e => setNewAddr({ ...newAddr, country: e.target.value })}
          />
          <input
            placeholder="Postal Code"
            value={newAddr.postalCode}
            onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={newAddr.phone}
            onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
          />
          <button type="submit">Add Address</button>
        </form>
        <ul>
          {addresses.map((a, i) => (
            <li key={i}>{a.label}: {a.line1}, {a.city}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Order History</h2>
        <ul>
          {orders.map(o => (
            <li key={o._id}>{o._id} - {o.status} - Rs. {o.total}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
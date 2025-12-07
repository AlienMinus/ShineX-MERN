import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: '', category: '', stock: '' });

  useEffect(() => {
    loadStats();
  }, []);

  function authHeader() {
    const t = localStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  async function loadStats() {
    try {
      const res = await axios.get(`${process.env.VITE_API_URL}/api/admin/stats`, { headers: authHeader() });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    try {
      await axios.post(`${process.env.VITE_API_URL}/api/products`, newProduct, { headers: authHeader() });
      setNewProduct({ title: '', description: '', price: '', category: '', stock: '' });
      loadStats();
    } catch (err) {
      console.error(err);
    }
  }

  if (!stats) return <div>Loading admin panel...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Stats</h2>
        <p>Total Orders: {stats.totalOrders}</p>
        <p>Total Products: {stats.totalProducts}</p>
      </div>

      <div>
        <h2>Add New Product</h2>
        <form onSubmit={addProduct}>
          <input
            placeholder="Title"
            value={newProduct.title}
            onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
            required
          />
          <input
            placeholder="Description"
            value={newProduct.description}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <input
            placeholder="Stock"
            type="number"
            value={newProduct.stock}
            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}
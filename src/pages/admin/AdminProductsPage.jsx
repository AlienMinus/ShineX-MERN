// src/pages/admin/AdminProductsPage.jsx
import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    brand: "",
    imageUrl: "",
    description: "",
    stock: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.items || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title,
        price: Number(form.price),
        category: form.category || undefined,
        brand: form.brand || undefined,
        imageUrl: form.imageUrl || undefined,
        description: form.description || "",
        stock: form.stock ? Number(form.stock) : 0,
      };

      await api.post("/admin/products", payload);

      setForm({
        title: "",
        price: "",
        category: "",
        brand: "",
        imageUrl: "",
        description: "",
        stock: "",
      });

      await load();
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="page">
      <h1>Admin – Manage Products</h1>

      {error && <p style={{ color: "salmon" }}>{error}</p>}

      {/* Create product form */}
      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <h2>Create New Product</h2>
        <form
          onSubmit={handleCreate}
          style={{
            display: "grid",
            gap: "0.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            marginTop: "0.75rem",
          }}
        >
          <input
            name="title"
            placeholder="Title *"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price *"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
          />
          <input
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ gridColumn: "1 / -1", resize: "vertical" }}
          />

          <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
            <button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Product list */}
      <h2>Existing Products</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : !products.length ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>
                <td>{p.title}</td>
                <td>{p.category || "-"}</td>
                <td>₹{p.price}</td>
                <td>{p.stock ?? 0}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    style={{
                      borderColor: "rgba(255, 99, 132, 0.6)",
                      boxShadow: "0 0 8px rgba(255, 99, 132, 0.6)",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

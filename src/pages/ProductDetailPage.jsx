// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reco, setReco] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);

        // Also fetch personalized recommendations
        const r = await api.get("/reco/personalized");
        // Make sure the current product isn't in the recommendations
        setReco(r.data.filter(p => p._id !== id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const quantity = Number(qty) > 0 ? Number(qty) : 1;
    addItem(product, quantity);
    alert("Added to cart");
  };

  if (loading) return <p className="page">Loading...</p>;
  if (!product) return <p className="page">Product not found.</p>;

  // Use the responsive checkout layout for this page
  return (
    <div className="page checkout-layout">
      {/* Left: product details */}
      <div style={{ background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "12px" }}>
        <h1>{product.title}</h1>
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.title}
            className="product-detail-image"
          />
        )}
        <p style={{ marginTop: "1rem" }}>{product.description}</p>
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "1rem 0" }}>
          ₹{product.price}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label>
            Qty:{" "}
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              style={{ width: 60 }}
            />
          </label>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>

      {/* Right: recommendations */}
      <div>
        <h3>Recommended for you</h3>
        {reco.length === 0 ? (
          <p>No personalized recommendations yet.</p>
        ) : (
          <div className="grid">
            {reco.slice(0, 4).map((p) => ( // Show max 4 recommendations
              <Link key={p._id} to={`/products/${p._id}`} className="card">
                <img src={p.images?.[0]} alt={p.title} />
                <div className="card-content">
                  <h3>{p.title}</h3>
                  <p className="price">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

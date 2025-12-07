// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, recoRes] = await Promise.all([
          api.get("/products", { params: { limit: 8, sort: "latest" } }),
          user ? api.get("/reco/personalized") : Promise.resolve({ data: [] }),
        ]);
        setFeatured(featRes.data.items || []);
        setRecommended(recoRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <section style={{ marginBottom: "2rem" }}>
        <h1>Welcome to ShopX</h1>
        <p>Your one-stop store for electronics, fashion and more.</p>
        <Link to="/products" style={{ textDecoration: "underline" }}>
          Browse all products →
        </Link>
      </section>

      {user && recommended.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2>Recommended for you</h2>
          <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {recommended.map((p) => (
              <Link
                key={p._id}
                to={`/products/${p._id}`}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: "0.5rem",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  src={p.images?.[0]}
                  alt={p.title}
                  style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 4 }}
                />
                <h4>{p.title}</h4>
                <p>₹{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Latest Products</h2>
        <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {featured.map((p) => (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "0.5rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={p.images?.[0]}
                alt={p.title}
                style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 4 }}
              />
              <h4>{p.title}</h4>
              <p>₹{p.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "latest";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await api.get("/products", {
        params: Object.fromEntries(searchParams),
      });
      setData(res.data);
      setLoading(false);

      // log history
      if (user && search) {
        api.post("/products/search-history", {
          query: search,
          filters: { category, sort },
        });
      }
    };
    fetchData();
  }, [searchParams, user]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/products/categories");
        setCategories(res.data || []);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };
    loadCategories();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (val) p.set("search", val);
      else p.delete("search");
      return p;
    });
  };

  const handleCategoryChange = (e) => {
  const val = e.target.value;
  setSearchParams((prev) => {
    const p = new URLSearchParams(prev);
    if (val) p.set("category", val);
    else p.delete("category");
    return p;
  });
};


  const handleSortChange = (e) => {
    const val = e.target.value;
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("sort", val);
      return p;
    });
  };

  return (
    <div className="page">
      <h1>Products</h1>

      <div className="filters">
        <input
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <select value={sort} onChange={handleSortChange}>
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {data.items.map((p) => (
            <div key={p._id} className="card">
              <img src={p.images?.[0]} alt={p.title} />
              <div className="card-content">
                <h3>{p.title}</h3>
                <p className="price">₹{p.price}</p>
              </div>
              <Link to={`/products/${p._id}`} className="card-button">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

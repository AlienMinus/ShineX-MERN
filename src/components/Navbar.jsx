// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Logo / Brand */}
      <Link to="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        ShopX
      </Link>

      {/* Main links */}
      <Link to="/products">Products</Link>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Admin links */}
        {user && user.role === "admin" && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/products">Manage Products</Link>
          </>
        )}

        {/* Cart + Auth */}
        {user ? (
          <>
            {/* Cart link with badge */}
            <Link
              to="/cart"
              style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
            >
              Cart
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -14,
                    background: "red",
                    color: "white",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    lineHeight: 1,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/orders">Orders</Link>
            <button onClick={logout}>Logout ({user.name})</button>
          </>
        ) : (
          <>
            {/* Even when logged out, you can still show cart if you want;
                here we keep it simple: only after login. */}
            <Link to="/login">Login</Link>
            <Link to="/register">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

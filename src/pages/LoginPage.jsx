// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "salmon" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 400,
          gap: "0.5rem",
        }}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

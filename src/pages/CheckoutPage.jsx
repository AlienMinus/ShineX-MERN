// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext.jsx";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      setError("Cart is empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const itemsPayload = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await api.post("/orders", {
        items: itemsPayload,
        shippingAddress: address,
      });

      // clear current user's cart (context + per-user localStorage)
      clearCart();
      navigate(`/orders/${res.data._id}`);
    } catch (e) {
      setError(e.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length)
    return (
      <div className="page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );

  return (
    <div className="page">
      <div className="checkout-layout">
        {/* Left: address form */}
        <div>
          <h1>Shipping Address</h1>
          {error && <p style={{ color: "salmon" }}>{error}</p>}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              maxWidth: 500,
            }}
          >
            <input
              name="fullName"
              placeholder="Full name"
              value={address.fullName}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone"
              value={address.phone}
              onChange={handleChange}
              required
            />
            <input
              name="line1"
              placeholder="Address line 1"
              value={address.line1}
              onChange={handleChange}
              required
            />
            <input
              name="line2"
              placeholder="Address line 2"
              value={address.line2}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              required
            />
            <input
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              required
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>

        {/* Right: summary */}
        <div className="summary-box">
          <h2>Order Summary</h2>
          <ul>
            {cart.map((item) => (
              <li key={item._id}>
                {item.title} × {item.quantity} – ₹
                {item.price * item.quantity}
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: "1rem" }}>Total: ₹{cartTotal}</h3>
        </div>
      </div>
    </div>
  );
}

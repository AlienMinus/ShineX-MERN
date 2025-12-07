import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    if (!cart.length) return;
    navigate("/checkout");
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Your Cart</h1>
      {!cart.length ? (
        <p>
          Your cart is empty. <Link to="/products">Go shopping</Link>
        </p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td style={{ padding: "0.5rem 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                      )}
                      <Link to={`/products/${item._id}`}>{item.title}</Link>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>₹{item.price}</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, Number(e.target.value || 1))
                      }
                      style={{ width: 60 }}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    ₹{item.price * item.quantity}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => removeItem(item._id)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: "1rem",
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.5rem",
            }}
          >
            <h3>Total: ₹{cartTotal}</h3>
            <button onClick={goToCheckout}>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

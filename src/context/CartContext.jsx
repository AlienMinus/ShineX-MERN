// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const getStorageKey = (user) => (user?.id ? `cart_${user.id}` : "cart_guest");

export default function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const key = getStorageKey(user);
      const stored = localStorage.getItem(key);
      if (stored) setCart(JSON.parse(stored));
      else setCart([]);
    } catch {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    try {
      const key = getStorageKey(user);
      localStorage.setItem(key, JSON.stringify(cart));
    } catch {}
  }, [cart, user]);

  const addItem = (product, quantity = 1) => {
    if (!product || !product._id) return;
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
          quantity,
        },
      ];
    });
  };

  const removeItem = (productId) =>
    setCart((prev) => prev.filter((item) => item._id !== productId));

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return;
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

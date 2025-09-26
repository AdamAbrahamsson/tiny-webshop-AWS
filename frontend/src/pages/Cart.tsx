import React, { useEffect, useState } from "react";

interface CartItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const createOrder = async () => {
    const token = localStorage.getItem("token"); // JWT token
    if (!token) {
      alert("You must be logged in to create an order!");
      return;
    }
  
    // Map cart items to the backend format
    const orderItems = cart.map(item => ({
      product_id: item.id, // backend expects product_id
      quantity: item.quantity,
    }));
  
    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send the JWT
        },
        body: JSON.stringify({ items: orderItems }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("Order created successfully!");
        clearCart();
      } else {
        alert(data.error || "Failed to create order.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Check console.");
    }
  };
  
  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new Event("cartUpdated")); // Update navbar
  };

  if (cart.length === 0) return <p className="empty-cart-message">Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      <ul className="cart-list">
        {cart.map(item => (
          <li key={item.id} className="cart-item">
            <div className="cart-item-details">
              <div className="cart-item-title">{item.title}</div>
              <div className="cart-item-quantity-price">
                {item.quantity} × {item.price} SEK = {(item.quantity * item.price).toFixed(2)} SEK
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="cart-total"><strong>Total:</strong> {total.toFixed(2)} SEK</p>
      <div className="cart-buttons">
        <button className="cart-btn create-order-btn" onClick={createOrder}>Create Order</button>
        <button className="cart-btn clear-cart-btn" onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );

};

export default Cart;

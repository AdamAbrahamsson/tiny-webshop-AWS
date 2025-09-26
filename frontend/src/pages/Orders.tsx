import React, { useEffect, useState } from "react";
import "../App.css";

interface OrderItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  created_at: string;
  total: number; // received from backend
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to see your orders!");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          alert(data.error || "Failed to fetch orders.");
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading your orders...</p>;
  if (orders.length === 0) return <p className="cart-empty-text">You have no orders yet.</p>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <ul className="order-items-list">
            {order.items.map(item => (
              <li key={item.id} className="order-item">
                {item.title} - {item.quantity} × {item.price} = {(item.quantity * item.price).toFixed(2)} SEK
              </li>
            ))}
          </ul>
          <p className="order-total">
          <strong>Total:</strong> {Number(order.total).toFixed(2)} SEK
          </p>
        </div>
      ))}
    </div>
  );
};

export default Orders;

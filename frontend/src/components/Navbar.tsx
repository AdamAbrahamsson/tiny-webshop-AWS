import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

interface NavbarProps {
  userName: string | null;
  setUserName: (name: string | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, setUserName }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((acc: any, item: any) => acc + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("cart"); 
    setUserName(null);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">
          Cart <span className="cart-badge">{cartCount}</span>
        </Link>
      </div>

      <div className="navbar-right">
        {userName ? (
          <>
            <span className="navbar-welcome">Welcome, {userName}!</span>
            <Link to="/orders">My Orders</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

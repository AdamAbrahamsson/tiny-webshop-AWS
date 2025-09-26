import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetails";
import Login from "./pages/Login";
import Cart from "./pages/Cart"
import Orders from "./pages/Orders";

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("name"));
  return (
    <Router>
      <Navbar userName={userName} setUserName={setUserName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login setUserName={setUserName} />} />
        <Route path="/orders" element={<Orders />} /> 
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;

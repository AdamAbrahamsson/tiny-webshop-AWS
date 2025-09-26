import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css"; 
//import "./Products.css";

interface Product {
  id: number;
  title: string;
  image_url: string;
  price: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products") // Replace with your backend URL
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="products-container">
      <h2 className="products-title">Products</h2>
      <ul className="products-list">
        {products.map((p) => (
          <li key={p.id} className="product-card">
            <Link to={`/products/${p.id}`} className="product-link">
              <img
                src={p.image_url}
                alt={p.title}
                className="product-image"
              />
              <div className="product-title">{p.title}</div>
              <div className="product-price">{p.price} SEK</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;

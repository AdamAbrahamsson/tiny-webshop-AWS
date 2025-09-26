import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = savedCart.find((i: any) => i.id === product.id);

    if (existing) {
      existing.quantity = Math.min(3, existing.quantity + qty); // max 3
    } else {
      savedCart.push({
        id: product.id,
        title: product.title,
        quantity: qty,
        price: product.price,
      });
    }

    localStorage.setItem("cart", JSON.stringify(savedCart));

    // Notify navbar to update cart count
    window.dispatchEvent(new Event("cartUpdated"));

    alert(`${qty} ${product.title} added to cart`);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-container">
      <h1 className="product-detail-title">{product.title}</h1>
      <img
        src={product.image_url}
        alt={product.title}
        className="product-detail-image"
      />
      <p className="product-detail-description">{product.description}</p>
      <p className="product-detail-price"><strong>Price:</strong> {product.price} SEK</p>
      <p className="product-detail-stock"><strong>Stock:</strong> {product.quantity}</p>

      <label className="product-detail-qty-label">
        Quantity:
        <select
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
          className="product-detail-qty-select"
        >
          {[1, 2, 3].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>

      <br />
      <button
      className={`product-detail-add-btn ${product.quantity === 0 ? "disabled" : ""}`}
      onClick={addToCart}
      disabled={product.quantity === 0}
      >
      {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
  </button>

    </div>
  );
};

export default ProductDetail;

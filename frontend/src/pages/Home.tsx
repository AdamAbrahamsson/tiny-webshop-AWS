import React from "react";
import webshopImage from "../assets/webshop-image.png"; // Import the image

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to Tiny-Webshop</h1>
      <img
        src={webshopImage} // Use the imported image
        alt="Tiny Webshop"
        style={{ marginTop: "2rem" }}
      />
    </div>
  );
};

export default Home;

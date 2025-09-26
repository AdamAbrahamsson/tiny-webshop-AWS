-- Drop Tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS products;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- needed for UUID generation

-----------------------------------------------------------
-- Users tables
-----------------------------------------------------------

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),     -- 128-bit value
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-----------------------------------------------------------
-- Products table
-----------------------------------------------------------

CREATE TABLE products (
    id SERIAL PRIMARY KEY,      --autoincrement by postgress
    title VARCHAR(255) UNIQUE,
    description TEXT,
    image_url TEXT,
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-----------------------------------------------------------
-- Orders table
-----------------------------------------------------------

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_code VARCHAR(50) NOT NULL UNIQUE, -- e.g., ORD-2025-001
    status VARCHAR(50) DEFAULT 'pending',
    total NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-----------------------------------------------------------
-- Order Items table (Details of each product in the order)
-----------------------------------------------------------

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL
);


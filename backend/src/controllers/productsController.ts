import { Request, Response } from 'express';
import pool from '../db';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
    
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

/////////////////////////////////////////////////////////////
// All below functions are not implemented in the UI, however
// it is implemented in postman.
/////////////////////////////////////////////////////////////

// Get a product by id
export const getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err });
    }
};
  
// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
      const { title, description, image_url, price, quantity } = req.body;
      const result = await pool.query(
        `INSERT INTO products (title, description, image_url, price, quantity)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [title, description, image_url, price, quantity]
      );
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      // Error code when you try to enter product with an existing title
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Product title already exists' });
      }
      res.status(500).json({ error: 'Database error', details: err });
    }
};
  
// Update a product
export const updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, image_url, price, quantity } = req.body;
  
      const result = await pool.query(
        `UPDATE products 
         SET title = $1, description = $2, image_url = $3, price = $4, quantity = $5
         WHERE id = $6
         RETURNING *`,
        [title, description, image_url, price, quantity, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err: any) {
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Product title already exists' });
      }
      res.status(500).json({ error: 'Database error', details: err });
    }
};
  
// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err });
    }
  };
  
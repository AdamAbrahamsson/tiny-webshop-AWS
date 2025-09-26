import { Response, NextFunction } from 'express';
import pool from '../db';


interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string };
  }

// Create new order (with authentication)
export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log('createOrder called'); // <-- check if this runs
  const client = await pool.connect();

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    
    const { items } = req.body; // items = [{ product_id, quantity }]
      
    // Ensure 'items' exists, is an array, and is not empty.
    // This prevents malicious or malformed input from reaching the database,
    // which could otherwise cause crashes, data corruption, or exploit vulnerabilities.
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required and must be an array' });
    }

    await client.query('BEGIN');

    const orderCode = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`;

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_code, status, total)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, orderCode, 'pending', 0]
    );

    const order = orderResult.rows[0];
    let total = 0;

    // Insert order items
    for (const item of items) {
      const productResult = await client.query(
        `SELECT price, quantity FROM products WHERE id = $1`,
        [item.product_id]
      );

      if (productResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Product with id ${item.product_id} not found` });
      }

      const product = productResult.rows[0];
      if (product.quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Not enough stock for product ${item.product_id}` });
      }

      const price = product.price;
      const lineTotal = price * item.quantity;
      total += lineTotal;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, price]
      );

      // Reduce stock
      await client.query(
        `UPDATE products SET quantity = quantity - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Update order total
    await client.query(
      `UPDATE orders SET total = $1 WHERE id = $2`,
      [total, order.id]
    );

    await client.query('COMMIT');

    res.status(201).json({ ...order, total });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    client.release();
  }
};

// Get all orders for the authenticated user
export const getOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const client = await pool.connect();

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch all orders for the user
    const ordersResult = await client.query(
      `SELECT id, order_code, status, total, created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      // Fetch items for each order
      const itemsResult = await client.query(
        `SELECT oi.id, p.title, oi.quantity, oi.price
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );

      orders.push({
        id: order.id,
        order_code: order.order_code,
        status: order.status,
        total: order.total,
        created_at: order.created_at,
        items: itemsResult.rows,
      });
    }

    res.status(200).json(orders);
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  } finally {
    client.release();
  }
};
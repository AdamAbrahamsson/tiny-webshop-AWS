import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = (process.env.JWT_SECRET ?? '').toString();


// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if ((existingUser?.rowCount ?? 0) > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, name, email, created_at`, //The returning returns the inserted fileds plus the generated Id without having a seperate SELECT to get the ID
      [name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'User is not found' });
    }

    const user = result.rows[0];

    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'The password is incorrect' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      name: user.name
     });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Your account has been deleted", user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

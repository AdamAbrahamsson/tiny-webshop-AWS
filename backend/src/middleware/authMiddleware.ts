import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // fallback in dev

interface AuthenticatedRequest extends ExpressRequest {
  user?: { id: string; email: string };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "Server misconfiguration: JWT secret missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;

    if (typeof decoded !== "object" || !('id' in decoded) || !('email' in decoded)) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: (decoded as any).id as string, email: (decoded as any).email as string };
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;

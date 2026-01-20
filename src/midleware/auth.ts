import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const result = await pool.query(
      `SELECT id, name, email, role, is_enabled FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!result.rows[0].is_enabled) {
      return res.status(403).json({ message: "Account disabled" });
    }

 
    (req as any).user = result.rows[0];
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// Admin-only middleware
export const admin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
};

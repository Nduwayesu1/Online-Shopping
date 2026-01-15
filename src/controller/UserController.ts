import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../config/db.js";
import { User } from "../model/Users.js";
import { sendEmail } from "../config/email.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

const JWT_EXPIRES_IN =
  (process.env.JWT_EXPIRES_IN as `${number}${"s" | "m" | "h" | "d" | "y"}`) ||
  "1h";


export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const result = await pool.query<User>(
      `INSERT INTO users (name, email, password, is_enabled)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, is_enabled AS "isEnabled", created_at AS "createdAt"`,
      [name, email, hashedPassword, true]
    );

    const user = result.rows[0];

   
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

   
    const subject = "Welcome to Our Platform!";
    const text = `Hi ${user.name},\n\nThank you for signing up! Your account has been created successfully.\n\nCheers,\nThe Team`;

    await sendEmail({
      to: user.email,
      subject,
      text,
    });

    res.status(201).json({ message: "User registered successfully", user, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const result = await pool.query<User & { password: string }>(
      `SELECT id, name, email, password, role, is_enabled , created_at 
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];

    
    const isEnabled = Boolean(user.is_enabled);
    if (isEnabled===false) return res.status(403).json({ message: "Account disabled" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};


export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query<User>(
      `SELECT id, name, email, role, is_enabled , created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    user.is_enabled = Boolean(user.is_enabled);

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
};


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, email, password } = req.body;

    const userResult = await pool.query<User & { password: string }>(
      `SELECT id, name, email, role, password, is_enabled  FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const currentUser = userResult.rows[0];

    const updatedPassword = password
      ? await bcrypt.hash(password, 10)
      : currentUser.password;

    const result = await pool.query<User>(
      `UPDATE users SET name = $1, email = $2, password = $3
       WHERE id = $4
       RETURNING id, name, email, role, is_enabled , created_at`,
      [name || currentUser.name, email || currentUser.email, updatedPassword, userId]
    );

    const updatedUser = result.rows[0];
    updatedUser.is_enabled = Boolean(updatedUser.is_enabled);

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    const userResult = await pool.query<User & { password: string }>(
      `SELECT id, password FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashedNewPassword, userId]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await pool.query<User>(
      `SELECT id, email FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      `UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE id = $3`,
      [hashedToken, expire, user.id]
    );

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/resetpassword/${resetToken}`;
    const text = `Click the link to reset your password: ${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const result = await pool.query<User & { password: string }>(
      `SELECT id, reset_password_expire FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()`,
      [hashedToken]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2`,
      [hashedPassword, result.rows[0].id]
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

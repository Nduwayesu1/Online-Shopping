import { Request, Response } from "express";
import { pool } from "../config/db.js";

export class CartController {

  // =========================
  // CREATE CART
  // =========================
  createCart = async (req: Request, res: Response) => {
    try {
      const { product_id, quantity } = req.body;
      const user_id = (req as any).user.id;

      if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({
          message: "product_id and a valid quantity are required"
        });
      }

      // Get product price
      const productResult = await pool.query(
        "SELECT id, price FROM products WHERE id = $1",
        [product_id]
      );

      if (productResult.rowCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const unit_price = productResult.rows[0].price;
      const total_price = unit_price * quantity;

      const cartInsert = await pool.query(
        `
        INSERT INTO carts (product_id, user_id, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [product_id, user_id, quantity, unit_price, total_price]
      );

      const cartId = cartInsert.rows[0].id;

      const response = await pool.query(
        `
        SELECT 
          cart.id,
          u.id AS user_id,
          u.name AS user_name,
          p.id AS product_id,
          p.name AS product_name,
          c.id AS category_id,
          c.name AS category_name,
          cart.quantity,
          cart.unit_price,
          cart.total_price
        FROM carts cart
        JOIN users u ON cart.user_id = u.id
        JOIN products p ON cart.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE cart.id = $1
        `,
        [cartId]
      );

      res.status(201).json({
        message: "Cart item created successfully",
        data: response.rows[0]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Database error", error });
    }
  };

  // =========================
  // GET ALL CARTS (USER)
  // =========================
  getAllCarts = async (req: Request, res: Response) => {
    try {
      const user_id = (req as any).user.id;
      const { product_id } = req.query;

      let query = `
        SELECT 
          cart.id,
          u.id AS user_id,
          u.name AS user_name,
          p.id AS product_id,
          p.name AS product_name,
          c.id AS category_id,
          c.name AS category_name,
          cart.quantity,
          cart.unit_price,
          cart.total_price
        FROM carts cart
        JOIN users u ON cart.user_id = u.id
        JOIN products p ON cart.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE cart.user_id = $1
      `;

      const values: any[] = [user_id];

      if (product_id) {
        query += " AND cart.product_id = $2";
        values.push(product_id);
      }

      const result = await pool.query(query, values);
      res.status(200).json(result.rows);

    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // =========================
  // GET CART BY ID (USER)
  // =========================
  getCartById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user_id = (req as any).user.id;

    try {
      const result = await pool.query(
        `
        SELECT 
          cart.id,
          u.id AS user_id,
          u.name AS user_name,
          p.id AS product_id,
          p.name AS product_name,
          c.id AS category_id,
          c.name AS category_name,
          cart.quantity,
          cart.unit_price,
          cart.total_price
        FROM carts cart
        JOIN users u ON cart.user_id = u.id
        JOIN products p ON cart.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE cart.id = $1 AND cart.user_id = $2
        `,
        [id, user_id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(result.rows[0]);

    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // =========================
  // UPDATE CART QUANTITY
  // =========================
  updateCart = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { quantity } = req.body;
    const user_id = (req as any).user.id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    try {
      const priceResult = await pool.query(
        `
        SELECT p.price
        FROM carts cart
        JOIN products p ON cart.product_id = p.id
        WHERE cart.id = $1 AND cart.user_id = $2
        `,
        [id, user_id]
      );

      if (!priceResult.rows.length) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const unit_price = priceResult.rows[0].price;
      const total_price = unit_price * quantity;

      const result = await pool.query(
        `
        UPDATE carts
        SET quantity = $3, total_price = $4
        WHERE id = $1 AND user_id = $2
        RETURNING *
        `,
        [id, user_id, quantity, total_price]
      );

      res.status(200).json(result.rows[0]);

    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // =========================
  // DELETE CART ITEM
  // =========================
  deleteCart = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user_id = (req as any).user.id;

    try {
      const result = await pool.query(
        `
        DELETE FROM carts
        WHERE id = $1 AND user_id = $2
        RETURNING *
        `,
        [id, user_id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(result.rows[0]);

    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };
}

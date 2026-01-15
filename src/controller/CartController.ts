import { Request, Response } from "express";
import { pool } from "../config/db.js";

export class CartController {

  // CREATE CART
  createCart = async (req: Request, res: Response) => {
    try {
      const { product_id, quantity } = req.body;
      const user_id = (req as any).user.id; 

      if (!product_id || !quantity) {
        return res.status(400).json({ message: "product_id and quantity are required" });
      }

      const productResult = await pool.query(
        `
        SELECT p.id, p.name, p.price, c.id AS category_id, c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
        `,
        [product_id]
      );

      if (productResult.rowCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = productResult.rows[0];
      const unit_price = product.price;
      const total_price = unit_price * quantity;

      //  Insert cart
      const cartResult = await pool.query(
        `
        INSERT INTO cart (user_id, product_id, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, product_id, quantity, unit_price, total_price
        `,
        [user_id, product_id, quantity, unit_price, total_price]
      );

      
      const response = await pool.query(
        `
        SELECT 
          u.name AS user_name,
          p.name AS product_name,
          c.name AS category_name,
          cart.quantity,
          cart.unit_price,
          cart.total_price
        FROM cart
        JOIN users u ON cart.user_id = u.id
        JOIN products p ON cart.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE cart.id = $1
        `,
        [cartResult.rows[0].id]
      );

      res.status(201).json({
        message: "Cart created successfully",
        data: response.rows[0]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Database error", error });
    }
  };

  // view all carts
  getAllCarts = async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          cart.id,
          u.name AS user_name,
          p.name AS product_name,
          c.name AS category_name,
          cart.quantity,
          cart.unit_price,
          cart.total_price
        FROM cart
        JOIN users u ON cart.user_id = u.id
        JOIN products p ON cart.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        `
      );

      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // find cart by id
  getCartById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const result = await pool.query(
        `
        SELECT 
          cart.id,
          u.name AS user_name,
          p.name AS product_name,
          c.name AS category_name,
          cart.quantity,
          cart.unit_price,
          cart.total_price
        FROM cart
        JOIN users u ON cart.user_id = u.id
        JOIN products p ON cart.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        WHERE cart.id = $1
        `,
        [id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // update cart quantity
  updateCart = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    try {
      // get unit price
      const cartResult = await pool.query(
        `
        SELECT cart.quantity, p.price
        FROM cart
        JOIN products p ON cart.product_id = p.id
        WHERE cart.id = $1
        `,
        [id]
      );

      if (!cartResult.rows.length) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const unit_price = cartResult.rows[0].price;
      const total_price = unit_price * quantity;

      const result = await pool.query(
        `
        UPDATE cart
        SET quantity = $2, total_price = $3
        WHERE id = $1
        RETURNING *
        `,
        [id, quantity, total_price]
      );

      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // delete cart
  deleteCart = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const result = await pool.query(
        "DELETE FROM cart WHERE id = $1 RETURNING *",
        [id]
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

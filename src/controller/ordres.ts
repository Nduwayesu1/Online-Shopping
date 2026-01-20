import { Request, Response } from "express";
import { pool } from "../config/db.js";

export class OrderController {
  createOrder = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { cart_id, status } = req.body;

      // Validation
      if (!cart_id || !status) {
        return res.status(400).json({
          message: "cart_id and status are required",
        });
      }

      const cartResult = await pool.query(
        `SELECT id FROM carts WHERE id = $1 AND user_id = $2`,
        [cart_id, user.id]
      );

      if (cartResult.rows.length === 0) {
        return res.status(403).json({
          message: "Cart does not belong to this user",
        });
      }

    
      const existingOrder = await pool.query(
        `SELECT id FROM orders WHERE cart_id = $1`,
        [cart_id]
      );

      if (existingOrder.rows.length > 0) {
        return res.status(400).json({
          message: "This cart was converted to an order",
        });
      }

   
      const result = await pool.query(
        `
        INSERT INTO orders (cart_id, status)
        VALUES ($1, $2)
        RETURNING *
        `,
        [cart_id, status]
      );

    
      res.status(201).json({
        message: "Order created successfully",
        order: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// GET ALL ORDERS (Admin only)
  getAllOrders = async (req: Request, res: Response) => {
    try {
      // Optional: admin middleware should already check role
      const result = await pool.query(`SELECT * FROM orders ORDER BY created_at DESC`);
      res.status(200).json({
        message: "All orders retrieved successfully",
        orders: result.rows,
      });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // GET ORDERS OF LOGGED-IN USER
  getMyOrders = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const result = await pool.query(
        `
        SELECT o.*, c.user_id
        FROM orders o
        JOIN carts c ON c.id = o.cart_id
        WHERE c.user_id = $1
        ORDER BY o.created_at DESC
        `,
        [user.id]
      );

      res.status(200).json({
        message: "Your orders retrieved successfully",
        orders: result.rows,
      });
    } catch (error) {
      console.error("Error fetching user's orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // UPDATE ORDER STATUS (Admin only)
  updateOrders = async (req: Request, res: Response) => {
    try {
      const { order_id, status } = req.body;

      if (!order_id || !status) {
        return res.status(400).json({ message: "order_id and status are required" });
      }

      // Check if order exists
      const orderCheck = await pool.query(`SELECT * FROM orders WHERE id = $1`, [order_id]);
      if (orderCheck.rows.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update the order
      const result = await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
        [status, order_id]
      );

      res.status(200).json({
        message: "Order updated successfully",
        order: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // VIEW LATEST ORDER OF LOGGED-IN USER
  viewLatestOrders = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      const result = await pool.query(
        `
        SELECT o.*, c.user_id
        FROM orders o
        JOIN carts c ON c.id = o.cart_id
        WHERE c.user_id = $1
        ORDER BY o.created_at DESC
        LIMIT 1
        `,
        [user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }

      res.status(200).json({
        message: "Latest order retrieved successfully",
        order: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching latest order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


}

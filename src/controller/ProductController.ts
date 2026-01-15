import { Request, Response } from "express";
import { pool } from "../config/db.js";

export class ProductController {

  // CREATE
  createProduct = async (req: Request, res: Response) => {
    const { id, name, price, category_id } = req.body;

    if (!id || !name || !price || !category_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO products (id,name, price, category_id)
         VALUES ($1, $2, $3, $4 )
         RETURNING *`,
        [id, name, price, category_id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // READ ALL
  getAllProducts = async (_req: Request, res: Response) => {
    try {
      const result = await pool.query("SELECT * FROM products");
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // READ ONE
  getProductById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // UPDATE
  updateProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, price, categoryId } = req.body;

    try {
      const result = await pool.query(
        `UPDATE products
         SET name = COALESCE($1, name),
             price = COALESCE($2, price),
             category_id = COALESCE($3, category_id)
         WHERE id = $4
         RETURNING *`,
        [name, price, categoryId, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };

  // DELETE
  deleteProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const result = await pool.query(
        "DELETE FROM products WHERE id = $1",
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  };
}

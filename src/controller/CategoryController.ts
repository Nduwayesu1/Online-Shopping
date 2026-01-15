import { Request,Response } from "express";
import { pool } from "../config/db.js";
export class CategoryController {
    // CREATE
    createCategory = async (req: Request, res: Response) => {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const result = await pool.query(
                `INSERT INTO categories (id, name)
                 VALUES ($1, $2)
                 RETURNING *`,
                [id, name]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: "Database error", error });
        }
    };
    // READ ALL
    getAllCategories = async (_req: Request, res: Response) => {
        try {
            const result = await pool.query("SELECT * FROM categories");
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ message: "Database error", error });
        }
    }
    // READ ONE
    getCategoryById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        try {
            const result = await pool.query(
                "SELECT * FROM categories WHERE id = $1",
                [id]
            );
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Category not found" });
            }
            res.status(200).json(result.rows[0]);
        }
        catch (error) {
            res.status(500).json({ message: "Database error", error });
        }
    };
    // UPDATE
    updateCategory = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { name } = req.body;
        try {
            const result = await pool.query(
                `UPDATE categories
                 SET name = $1
                 WHERE id = $2
                 RETURNING *`,
                [name, id]
            );
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: "Database error", error });
        }
    };
    // DELETE
    deleteCategory = async (req: Request, res: Response) => {
        const id = Number(req.params.id);   
        try {
            const result = await pool.query(
                "DELETE FROM categories WHERE id = $1 RETURNING *",
                [id]
            );
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ message: "Database error", error });
        }
    };
    //
}
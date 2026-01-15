import { Router } from "express";
import { CartController } from "../controller/CartController.js";
import { protect } from "../midleware/auth.js";

const router = Router();
const controller = new CartController();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /api/carts/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, quantity, unit_price]
 *             properties:
 *               product_id:
 *                 type: number
 *                 example: 1
 *               quantity:
 *                 type: number
 *                 example: 2
 *               unit_price:
 *                 type: number
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/add", protect, controller.createCart);

/**
 * @swagger
 * /api/carts/all:
 *   get:
 *     summary: Get all cart items
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/all", protect, controller.getAllCarts);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Get cart item by ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Cart item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, controller.getCartById);

/**
 * @swagger
 * /api/carts/update/{id}:
 *   put:
 *     summary: Update cart item
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *               unit_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */
router.put("/update/:id", protect, controller.updateCart);

/**
 * @swagger
 * /api/carts/delete/{id}:
 *   delete:
 *     summary: Delete cart item
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", protect, controller.deleteCart);

export default router;

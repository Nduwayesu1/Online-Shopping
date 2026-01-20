import { Router } from "express";
import { OrderController } from "../controller/ordres.js";
import { protect, admin } from "../midleware/auth.js";

const router = Router();
const controller = new OrderController();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - cart_id
 *         - status
 *       properties:
 *         cart_id:
 *           type: number
 *           example: 1
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: pending
 *           description: Status of the order
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 10
 *         cart_id:
 *           type: number
 *           example: 1
 *         status:
 *           type: string
 *           example: pending
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     UpdateOrderRequest:
 *       type: object
 *       required:
 *         - order_id
 *         - status
 *       properties:
 *         order_id:
 *           type: number
 *           example: 10
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: completed
 */

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create an order from the user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All orders retrieved successfully
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 *       500:
 *         description: Server error
 */
router.get("/all", protect, admin, controller.getAllOrders);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get orders of logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your orders retrieved successfully
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my", protect, controller.getMyOrders);

/**
 * @swagger
 * /api/orders/update:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *                 order:
 *                   $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/update", protect, admin, controller.updateOrders);

/**
 * @swagger
 * /api/orders/latest:
 *   get:
 *     summary: View latest order for logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Latest order retrieved successfully
 *                 order:
 *                   $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No orders found
 *       500:
 *         description: Server error
 */
router.get("/latest", protect, controller.viewLatestOrders);

export default router;

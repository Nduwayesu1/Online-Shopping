import { Router } from "express";
import { ProductController } from "../controller/ProductController.js";
const router = Router();
const productController = new ProductController();
router.post("/add", productController.createProduct);
export default router;
//# sourceMappingURL=Products.js.map
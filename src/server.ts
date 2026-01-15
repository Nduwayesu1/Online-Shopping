import express from "express";
import Products from "./routes/Products.js";
import Categories from "./routes/Category.js";
import Carts from "./routes/Cart.js";
import Users from "./routes/Users.js";
import connectDB, { pool } from "./config/db.js";
import swaggerSetup from "./swager.js"

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.send("Welcome to Klab Academy");
});

// API Routes
app.use("/api/products", Products);
app.use("/api/categories", Categories);
app.use("/api/carts", Carts);
app.use("/api/users", Users);


setupSwagger(app);


app.listen(PORT, async () => {
  await pool.connect();
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

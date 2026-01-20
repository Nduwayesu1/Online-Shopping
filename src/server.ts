import express from "express";
import Products from "./routes/Products.js";
import Categories from "./routes/Category.js";
import Carts from "./routes/Cart.js";
import Users from "./routes/Users.js";
import Orders from "./routes/orders.js";
import connectDB, { createTables } from "./config/db.js";
import { setupSwagger } from "./swager.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Welcome to Klab Academy API");
});

// Routes
app.use("/api/products", Products);
app.use("/api/categories", Categories);
app.use("/api/carts", Carts);
app.use("/api/users", Users);
app.use("/api/orders", Orders);

// Swagger
setupSwagger(app);

// Start server
app.listen(PORT, async () => {
  await connectDB();    
  await createTables();   

  const baseUrl =
    process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

  console.log(`Server running on ${baseUrl}`);
  console.log(`Swagger docs available at ${baseUrl}/api-docs`);
});

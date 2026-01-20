import express from "express";
import Products from "./routes/Products.js";  
import Categories from "./routes/Category.js";
import Carts from "./routes/Cart.js";
import Users from "./routes/Users.js";
import ordres from "./routes/orders.js";  
import connectDB, { pool,createTables } from "./config/db.js";
import { setupSwagger } from "../src/swager.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Welcome to Klab Academy");
});

app.use("/api/products", Products);
app.use("/api/categories", Categories);
app.use("/api/carts", Carts);
app.use("/api/users", Users);
app.use("/api/orders",ordres);

setupSwagger(app);

app.listen(PORT, async () => {
  await pool.connect();
  await createTables();

  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

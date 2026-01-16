import express from "express";
import Products from "./routes/Products";
import Categories from "./routes/Category";
import Carts from "./routes/Cart";
import Users from "./routes/Users";
import connectDB, { pool } from "./config/db";
import { setupSwagger } from "./swager";

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

setupSwagger(app);

app.listen(PORT, async () => {
  await pool.connect();
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import Products from "./routes/Products.js";  
import Categories from "./routes/Category.js";
import Carts from "./routes/Cart.js";
import Users from "./routes/Users.js";
<<<<<<< HEAD
import ordres from "./routes/orders.js";  
import connectDB, { pool,createTables } from "./config/db.js";
import { setupSwagger } from "../src/swager.js";
=======
import connectDB, { pool } from "./config/db.js";
import { setupSwagger } from "./swager.js";
>>>>>>> 42478da51c8cc0e182c2a13bd68d7ed4f1fedec2

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
<<<<<<< HEAD
  await createTables();

  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
=======
  console.log(`Server running on port ${PORT}`);
>>>>>>> 42478da51c8cc0e182c2a13bd68d7ed4f1fedec2
});

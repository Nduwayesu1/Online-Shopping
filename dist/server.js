import express from "express";
import productRoutes from "./routes/Products.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.get("/", (req, res) => {
    console.log("Welcome to my node app");
    res.send("Welcome to my node app");
});
app.use("/api/products/add", productRoutes);
app.listen(PORT, () => {
    console.log("Server is up and running on port " + PORT);
});
//# sourceMappingURL=server.js.map
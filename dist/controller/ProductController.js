import Products from "../model/Products.js";
export class ProductController {
    constructor() {
        this.products = [];
        this.nextId = 1;
        // Create a new product
        this.createProduct = (req, res) => {
            const { name, price, categoryId } = req.body;
            const newProduct = new Products(this.nextId++, name, price, categoryId);
            this.products.push(newProduct);
            res.status(201).json(newProduct);
        };
    }
}
//# sourceMappingURL=ProductController.js.map
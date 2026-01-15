class Products {
    constructor(id, name, price, categoryId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
    }
    // setters and getters methods
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getPrice() {
        return this.price;
    }
    getCategoryId() {
        return this.categoryId;
    }
    setId(id) {
        this.id = id;
    }
    setName(name) {
        this.name = name;
    }
    setPrice(price) {
        this.price = price;
    }
    setCategoryId(categoryId) {
        this.categoryId = categoryId;
    }
}
export default Products;
//# sourceMappingURL=Products.js.map
declare class Products {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    constructor(id: number, name: string, price: number, categoryId: number);
    getId(): number;
    getName(): string;
    getPrice(): number;
    getCategoryId(): number;
    setId(id: number): void;
    setName(name: string): void;
    setPrice(price: number): void;
    setCategoryId(categoryId: number): void;
}
export default Products;
//# sourceMappingURL=Products.d.ts.map
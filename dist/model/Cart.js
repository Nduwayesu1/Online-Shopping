class Cart {
    constructor() {
        this.items = [];
    }
    addItem(productId, quantity) {
        const existingItem = this.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            this.items.push({ productId, quantity });
        }
    }
    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
    }
    getItems() {
        return this.items;
    }
    clearCart() {
        this.items = [];
    }
}
export {};
//# sourceMappingURL=Cart.js.map
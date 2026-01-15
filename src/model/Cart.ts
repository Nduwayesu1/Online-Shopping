export interface Cart{
    id:number;
    product_id:number;
    user_id:number;
    quantity:number;
    unit_price:number;
    total_price:number;

}
export const Cart:Cart[]=[];
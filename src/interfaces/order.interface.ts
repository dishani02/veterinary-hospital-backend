import { Document, Types } from "mongoose";

interface IOrderItem {
    product: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface IOrder {
    orderId: string;
    date: Date;
    customer: string;
    //items: string[]; 
    price: number;
    status: "pending" | "canceled" | "complete"; 
    items: IOrderItem[];
    userId: Types.ObjectId;
}

interface IOrderModel extends IOrder, Document {}

export {
    IOrder,
    IOrderModel
};

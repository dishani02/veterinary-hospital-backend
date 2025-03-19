// order.interface.ts
import { Document } from "mongoose";

interface IOrder {
    orderId: string;
    date: Date;
    customer: string;
    items: string[]; 
    price: number;
    status: "pending" | "in-progress" | "complete";  // Order status with predefined options
}

interface IOrderModel extends IOrder, Document {}

export {
    IOrder,
    IOrderModel
};

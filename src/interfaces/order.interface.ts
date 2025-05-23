import mongoose, { Document, Types } from "mongoose";

interface IOrderItem {
    _id: string | mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface ICustomer {
    name: string;
    address: string;
    phone: string;
    email: string;
}

interface IOrder {
    orderId: string;
    date: Date;
    customer: ICustomer;
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

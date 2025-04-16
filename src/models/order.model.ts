import { model, Schema, Types } from "mongoose";
import { IOrderModel } from "../interfaces/order.interface";

const OrderSchema: Schema<IOrderModel> = new Schema({
    orderId: {
        type: String,
        unique: true,
        default: () => `ORD-${Date.now()}`
    },
    date: {
        type: Date,
        required: true
    },
    customer: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "canceled", "complete"],
        default: "pending"
    },
    items: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            subtotal: {
                type: Number,
                required: true
            },
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { versionKey: false, timestamps: true });

export default model<IOrderModel>("Order", OrderSchema);

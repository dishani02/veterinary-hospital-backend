import { model, Schema, Types } from "mongoose";
import { IOrderModel } from "../interfaces/order.interface";

const OrderSchema: Schema<IOrderModel> = new Schema({
    date: { 
        type: Date, 
        required: true 
    },
    customer: { 
        type: String, 
        required: true 
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
            product:{ 
                type: String, 
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

OrderSchema.virtual("itemCount").get(function () {
    return this.items.length; 
});

export default model<IOrderModel>("Order", OrderSchema);

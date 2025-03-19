import { model, Schema } from "mongoose";
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
    items: [{ 
        type: String, 
        required: true 
    }],
    price: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ["pending", "in-progress", "complete"],  
        default: "pending" 
    }
}, { versionKey: false, timestamps: true });

export default model<IOrderModel>("Order", OrderSchema);

import { model, Schema } from "mongoose";
import { IProductModel } from "../interfaces/product.interface";

const ProductSchema:Schema<IProductModel> = new Schema({
    name: { 
        type: String,
        required: true
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    volume: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    threshold: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
}, { versionKey: false, timestamps: true });

export default model<IProductModel>("Product", ProductSchema);
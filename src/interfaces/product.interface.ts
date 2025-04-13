import { Document, Types } from "mongoose";

interface IProduct {
    name: string;
    sku: string;
    category: string;
    brand: string;
    price: number;
    volume: string;
    stock: number;
    threshold: number;
    description: string;
    image: string;
    userId: Types.ObjectId;
}

interface IProductModel extends IProduct, Document { }

export{
    IProduct,
    IProductModel
}
import { Document, Types } from "mongoose";

interface IPet {
    name: string;
    gender: "Male" | "Female";
    type: string;
    breed: string;
    age: number;
    image?: string;
    userId: Types.ObjectId; // Reference to the User model
}

interface IPetModel extends IPet, Document {}

export {
    IPet,
    IPetModel
};

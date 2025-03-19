import { Document } from "mongoose";

interface IPet {
    name: string;
    gender: "Male" | "Female";
    type: string;
    breed: string;
    age: number;
    image?: string;
}

interface IPetModel extends IPet, Document {}

export {
    IPet,
    IPetModel
};

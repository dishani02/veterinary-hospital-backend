import { Document, Types } from "mongoose";

export interface ICustomer {
    name: string;
    phone: string;
}


interface IPet {
    name: string;
    customer: ICustomer;
    gender: "Male" | "Female";
    type: string;
    breed: string;
    age: number;
    image: string;
    userId: Types.ObjectId;
}

interface IPetModel extends IPet, Document { }

export {
    IPet,
    IPetModel
};

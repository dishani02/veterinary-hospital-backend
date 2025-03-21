import { Document, Types } from "mongoose";

interface IPetDetails {
    type: string;
    breed: string;
    age: number;
    image: string;
}

export interface ICustomer {
    name: string;
    phone: string;
}


interface IPet {
    name: string;
    customer: ICustomer;
    gender: "Male" | "Female";
    details: IPetDetails;
    userId: Types.ObjectId;
}

interface IPetModel extends IPet, IPetDetails, Document { }

export {
    IPet,
    IPetModel
};

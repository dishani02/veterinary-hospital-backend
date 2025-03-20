import { Document, Types } from "mongoose";

interface IPetDetails {
    type: string;
    breed: string;
    age: number;
    image: string;
}

interface IPet {
    petId: string;
    name: string;
    gender: "Male" | "Female";
    details: IPetDetails;
    ownerId: Types.ObjectId;
}

interface IPetModel extends IPet, IPetDetails, Document {}

export {
    IPet,
    IPetModel
};

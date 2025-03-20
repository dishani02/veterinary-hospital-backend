import { model, Schema, Types } from "mongoose";
import { IPetModel } from "../interfaces/pet.interface";

const PetSchema: Schema<IPetModel> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female"],
        },
        type: {
            type: String,
            required: true,
        },
        breed: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { versionKey: false, timestamps: true }
);

export default model<IPetModel>("Pet", PetSchema);

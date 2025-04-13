import { model, Schema, Document } from "mongoose";
import { IPetModel } from "../interfaces/pet.interface";

const PetSchema: Schema = new Schema<IPetModel>(
    {
        name: { 
            type: String, 
            required: true 
        },
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
        },
        gender: { 
            type: String, 
            required: true, 
            enum: ["Male", "Female"] 
        },
        type: { 
            type: String, 
            required: true 
        },
        breed: { 
            type: String, 
            required: true 
        },
        age: { 
            type: Number, 
            required: true 
        },
        image: { 
            type: String, 
            default: "" 
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { versionKey: false, timestamps: true }
);

PetSchema.virtual("petInfo").get(function (this: IPetModel) {
    return `${this.name} (${this.breed}, ${this.age} years old)`;
});

export default model<IPetModel>("Pet", PetSchema);

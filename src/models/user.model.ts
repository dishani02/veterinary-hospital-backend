import { model, Schema } from "mongoose";
import { IUserModel } from "../interfaces/user.interface";

const UserSchema: Schema<IUserModel> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        nic: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        password: { 
            type: String, 
            required: true 
        }, 
    },
    { versionKey: false, timestamps: true }
);

export default model<IUserModel>("User", UserSchema);

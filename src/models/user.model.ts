import { model, Schema } from "mongoose";
import { IUserModel } from "../interfaces/user.interface";
import common from "../utils/common.util";

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
        role: {
            type: String,
            enum: [
                common.USER_ROLES.ADMIN,
                common.USER_ROLES.DOCTOR,
                common.USER_ROLES.PET_OWNER
            ],
            required: true
        },
        password: { 
            type: String, 
            required: true 
        }, 
    },
    { versionKey: false, timestamps: true }
);

export default model<IUserModel>("User", UserSchema);

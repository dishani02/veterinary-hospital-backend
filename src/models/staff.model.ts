import { model, Schema } from "mongoose";
import { IStaffModel } from "../interfaces/staff.interface";

const StaffSchema: Schema<IStaffModel> = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        address: { 
            type: String, 
            required: true 
        },
        nic: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
        },
        phone: { 
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            required: true, 
            enum: ["Veterinarian", "Admin"] 
        }
    }, 
    { versionKey: false, timestamps: true }
);

StaffSchema.virtual("fullName").get(function () {
    return this.name;
});

export default model<IStaffModel>("Staff", StaffSchema);

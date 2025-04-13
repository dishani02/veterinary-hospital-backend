import { model, Schema } from "mongoose";
import { IDoctorModel } from "../interfaces/doctor.interface";
import common from "../utils/common.util";

const DoctorSchema: Schema<IDoctorModel> = new Schema(
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
        }, role: {
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

DoctorSchema.virtual("fullName").get(function () {
    return this.name;
});

export default model<IDoctorModel>("Doctor", DoctorSchema);

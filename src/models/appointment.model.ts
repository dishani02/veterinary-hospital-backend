import { model, Schema } from "mongoose";
import { IAppointmentModel } from "../interfaces/appointment.interface";

const AppointmentSchema: Schema<IAppointmentModel> = new Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "canceled", "approved"],
        default: "pending"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    veterinarian: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String
        }
    },
    pet: {
        _id: {
            type: Schema.Types.ObjectId,
            ref: "Pet",
            required: true
        },
        name: {
            type: String
        }
    }

}, { versionKey: false, timestamps: true });

export default model<IAppointmentModel>("Appointment", AppointmentSchema);

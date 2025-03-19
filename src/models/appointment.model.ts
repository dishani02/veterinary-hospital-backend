import { model, Schema } from "mongoose";
import { IAppointmentModel } from "../interfaces/appointment.interface";

const AppointmentSchema: Schema<IAppointmentModel> = new Schema({
    pet_id: { 
        type: String, 
        required: true 
    },

    veterinarian: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
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
        type: String
    }

}, { versionKey: false, timestamps: true });

export default model<IAppointmentModel>("Appointment", AppointmentSchema);

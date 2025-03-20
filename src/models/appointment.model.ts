import { model, Schema } from "mongoose";
import { IAppointmentModel } from "../interfaces/appointment.interface";

const AppointmentSchema: Schema<IAppointmentModel> = new Schema({

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
    },
    
    userId: { 
        type: Schema.Types.ObjectId,
        ref: "user", 
        required:true
    },

    petId: {
        type: Schema.Types.ObjectId,
        ref: "pet", 
        required:true
    },

}, { versionKey: false, timestamps: true });

export default model<IAppointmentModel>("Appointment", AppointmentSchema);

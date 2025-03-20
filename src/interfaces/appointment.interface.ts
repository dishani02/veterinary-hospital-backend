import { Document, Types } from "mongoose";

interface IAppointment {
    veterinarian: string;
    date: Date;
    time: string;
    reason: string;
    note: string;
    status: "pending" | "canceled" | "approved";
    userId: Types.ObjectId;
    petId: Types.ObjectId;
}

interface IAppointmentModel extends IAppointment, Document {}

export {
    IAppointment,
    IAppointmentModel
};



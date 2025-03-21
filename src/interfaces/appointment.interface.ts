import { Document, Types } from "mongoose";


interface IAppointment {
    date: Date;
    time: string;
    reason: string;
    note: string;
    status: "pending" | "canceled" | "approved";
    userId: Types.ObjectId;
    veterinarian: Types.ObjectId
    petId:  Types.ObjectId;
}

interface IAppointmentModel extends IAppointment, Document {}

export {
    IAppointment,
    IAppointmentModel
};



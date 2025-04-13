import { Document, Types } from "mongoose";


interface IAppointment {
    date: String;
    time: string;
    reason: string;
    note: string;
    status: "pending" | "canceled" | "approved";
    userId: Types.ObjectId;
    veterinarian: {
        _id: Types.ObjectId;
        name: string;
    }
    pet:  {
        _id: Types.ObjectId;
        name: string;
    }
}

interface IAppointmentModel extends IAppointment, Document {}

export {
    IAppointment,
    IAppointmentModel
};



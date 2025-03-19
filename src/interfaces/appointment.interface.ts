import { Document } from "mongoose";

interface IAppointment {
    pet_id: string;
    veterinarian: string;
    date: Date;
    time: string;
    reason: string;
    note: string;
}

interface IAppointmentModel extends IAppointment, Document {}

export {
    IAppointment,
    IAppointmentModel
};

import mongoose, { Document, Types } from "mongoose";

interface IDoctor {
    name: string;
    address: string;
    nic: string;
    email: string;
    phone: string;
    role: string;
    password: string;
   
}

interface IDoctorModel extends IDoctor, Document {}

export {
    IDoctor,
    IDoctorModel
};

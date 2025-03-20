import { Document, Types } from "mongoose";

interface IStaff {
    name: string;
    address: string;
    nic: string;
    email: string;
    phone: string;
    role: "Veterinarian" | "Admin"; 
}

interface IStaffModel extends IStaff, Document {}

export {
    IStaff,
    IStaffModel
};

import { Document } from "mongoose";

interface IStaff {
    name: string;
    address: string;
    nic: string;
    email: string;
    phone: string;
    role: "Veterinarian" | "Lab Staff" | "Clinic Staff"; 
}

interface IStaffModel extends IStaff, Document {}

export {
    IStaff,
    IStaffModel
};

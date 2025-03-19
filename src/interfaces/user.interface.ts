import { Document } from "mongoose";

interface IUser {
    name: string;
    phone: string;
    nic: string;
    email: string;
    address: string;
}

interface IUserModel extends IUser, Document {}

export {
    IUser,
    IUserModel
};

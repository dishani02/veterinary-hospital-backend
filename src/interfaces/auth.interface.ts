import mongoose, { ObjectId } from "mongoose";

interface IAuth {
    userId: string;
    role: string;
}

export {
    IAuth
}
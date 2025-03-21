import { object } from "joi";
import UserModel from "../models/user.model";
import common from "./common.util";
import bcrypt from "bcryptjs";

const generateAdmin = async () => {
    const users = [
        {
            email: "admin@admin.com",
            password: "123",
            name: "Admin user",
            phone: "076837453",
            nic: "666570342V",
            address: "Malabe, Sri Lanka",
            role: common.USER_ROLES.ADMIN
        },
        {
            email: "docter@docter.com",
            password: "123",
            name: "doctor user",
            phone: "076834583",
            nic: "6678654543V",
            address: "Colombo, Sri Lanka",
            role: common.USER_ROLES.DOCTOR
        }
    ];

    for (const user of users) {

        if (!user.email || !user.password) continue;

        const dbUser = await UserModel.findOne({email: user.email });

        if (dbUser) continue;

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = new UserModel();
        newUser.name = user.name;
        newUser.phone = user.phone;
        newUser.nic = user.nic;
        newUser.email = user.email;
        newUser.address = user.address;
        newUser.role = user.role;
        newUser.password = hashedPassword;

        await newUser.save();

        console.log("====== user successfully created======");
    }


};

export default { generateAdmin }
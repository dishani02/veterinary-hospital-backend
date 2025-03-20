import UserModel from "../models/user.model";
import common from "./common.util";
import bcrypt from "bcryptjs";

const generateAdmin = async () => {
    
    const email = "admin@admin.com";
    const password = "123";

    if (!email || !password) return;

    const user = await UserModel.findOne({ email });

    if (user) return;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel();
    newUser.name = "Admin user";
    newUser.phone = "0777123456";
    newUser.nic = "666570342V";
    newUser.email = email;
    newUser.address = "Malabe, Sri Lanka";
    newUser.role = common.USER_ROLES.ADMIN;
    newUser.password = hashedPassword;

    await newUser.save();

    console.log("======Admin user successfully created======");
};

export default { generateAdmin }
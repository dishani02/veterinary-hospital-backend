import { Router,Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import common from "../utils/common.util";
import { IAuth } from "../interfaces/auth.interface";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || common.JWT_SECRET; 

const router = Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const auth: IAuth = {
            userId: user._id as string, 
            role: user.role
        };

        const token = jwt.sign(auth, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: (error as Error).message });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, phone, nic, email, address, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            name,
            phone,
            nic,
            email,
            address,
            password: hashedPassword,
            role: common.USER_ROLES.PET_OWNER
        });

        await user.save();

        res.status(201).json({ message: "User successfully registered!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

export default router;
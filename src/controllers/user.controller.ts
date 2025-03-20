import { Router,Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.middleware"; // Ensure correct import


const router = Router();

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "2effbd077fc5422316f52484b98626a977015811df825445e398ba55e5391b9d"; 

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

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
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: "User successfully registered!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});


router.post("/", async (req, res) => {
    try {
        const { name, phone, nic, email, address,password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            name,
            phone,
            nic,
            email,
            address
        });

        await user.save();

        res.status(201).json({
            message: "User successfully created!",
            payload: user
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});


router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});


//router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await UserModel.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching user", error });
//     }
// });


// router.put("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json({
//             message: "User updated successfully!",
//             payload: updatedUser
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating user", error });
//     }
// });


// router.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedUser = await UserModel.findByIdAndDelete(id);
//         if (!deletedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json({ message: "User deleted successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting user", error });
//     }
// });

export default router;

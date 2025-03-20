import { Router,Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import AuthMiddleware from '../middleware/auth.middleware';


const router = Router();

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


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "User updated successfully!",
            payload: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

export default router;

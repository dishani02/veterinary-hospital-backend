import { Router } from "express";
import UserModel from "../models/user.model";

const router = Router();


router.post("/", async (req, res) => {
    try {
        const { name, phone, nic, email, address } = req.body;

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
            return res.status(404).json({ message: "User not found" });
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
            return res.status(404).json({ message: "User not found" });
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
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

export default router;

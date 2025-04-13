import { Router, Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import AuthMiddleware from "../middleware/auth.middleware";
import common from "../utils/common.util";

dotenv.config();
const router = Router();
//create user
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, phone, nic, email, address, password } = req.body;

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

        res.status(201).json({
            message: "User successfully created!",
            payload: user
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error instanceof Error ? error.message : error });
    }
});


router.get("/", AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN]), async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error instanceof Error ? error.message : error });
    }
});


router.get("/:id", AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN, common.USER_ROLES.PET_OWNER]), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error instanceof Error ? error.message : error });
    }
});


router.put("/:id", AuthMiddleware.checkAuth([common.USER_ROLES.PET_OWNER]), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.userId;
        if (userId !== id) {
            res.status(403).json({ message: "You can only update your own profile" });
            return;
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "User updated successfully!", payload: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error instanceof Error ? error.message : error });
    }
});


router.delete("/:id", AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN, common.USER_ROLES.PET_OWNER]), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.userId;
        const role = (req as any).user.role;

        if (role !== common.USER_ROLES.ADMIN && userId !== id) {
            res.status(403).json({ message: "You can only delete your own account" });
            return;
        }

        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error instanceof Error ? error.message : error });
    }
});

export default router;

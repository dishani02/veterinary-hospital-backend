import { Router, Request, Response } from "express";
import PetModel from "../models/pet.model";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import common from '../utils/common.util';
import AuthMiddleware from '../middleware/auth.middleware';


const router = Router();

const SECRET_KEY = process.env.JWT_SECRET || common.JWT_SECRET;


router.post("/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const userIdFromToken = (req as any).user?.userId;

            const user = await UserModel.findById(userIdFromToken);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }
            const pet = new PetModel({
                name: req.body.name,
                customer: {
                    name: user.name,
                    phone: user.phone,
                },
                gender: req.body.gender,
                type: req.body.type,
                breed: req.body.breed,
                age: req.body.age,
                image: req.body.image,
                userId: userIdFromToken,

            });

            await pet.save();

            res.status(201).json({
                message: "Pet successfully added!",
                payload: pet,
            });
        } catch (error) {
            res.status(500).json({ message: "Error occurred", error: (error as Error).message });
        }
    });





router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const pets = await PetModel.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pets", error: (error as Error).message });
    }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const pet = await PetModel.findById(id);
        if (!pet) {
            res.status(404).json({ message: "Pet not found" });
            return;
        }
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving pet", error: (error as Error).message });
    }
});

export default router;

function verifyUser(token: string): any {
    throw new Error("Function not implemented.");
}
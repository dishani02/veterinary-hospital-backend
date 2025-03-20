import { Router, Request, Response } from "express";
import PetModel from "../models/pet.model";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

const SECRET_KEY = "2effbd077fc5422316f52484b98626a977015811df825445e398ba55e5391b9d";

const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const decoded: any = decodeToken(token);
        if (decoded.role !== "admin") {
            res.status(403).json({ message: "Admins only." });
            return;
        }

        const pet = new PetModel({
            name: req.body.name,
            gender: req.body.gender,
            type: req.body.type,
            breed: req.body.breed,
            age: req.body.age,
            image: req.body.image
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
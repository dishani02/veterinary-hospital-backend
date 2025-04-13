import { Router, Request, Response } from "express";
import PetModel from "../models/pet.model";
import UserModel from "../models/user.model";
import common from "../utils/common.util";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();

//create pet
router.post(
    "/",
    AuthMiddleware.checkAuth([common.USER_ROLES.PET_OWNER]),
    async (req: Request, res: Response) => {
        try {
            const { userId } = (req as any).user;
            const { name, customer, gender, details} = req.body;

            
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const pet = new PetModel({
                name,
                customer,
                gender,
                type: details.type,
                breed: details.breed,
                age: details.age,
                image: details.image,
                owner: userId
            });

            await pet.save();
            res.status(201).json({ message: "Pet added successfully", payload: pet });
        } catch (error) {
            res.status(500).json({ message: "Error adding pet", error: (error as Error).message });
        }
    }
);
//read
router.get(
    "/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER,
        common.USER_ROLES.DOCTOR
    ]),
    async (req: Request, res: Response) => {
        try {
            const { userId } = (req as any).user;
            const pets = await PetModel.find({ owner: userId });
            if (!pets.length) {
                res.status(404).json({ message: "No pets found for this user" });
                return;
            }
            res.status(200).json({ message: "Pets retrieved successfully", payload: pets });
        } catch (error) {
            res.status(500).json({ message: "Error fetching pets", error: (error as Error).message });
        }
    }
);

router.get(
    "/:petId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER,
        common.USER_ROLES.DOCTOR
    ]),
    async (req: Request, res: Response) => {
        try {
            const { petId } = req.params;
            const { userId } = (req as any).user;
            const pet = await PetModel.findOne({ _id: petId, owner: userId });

            if (!pet) {
                 res.status(404).json({ message: "Pet not found" });
                 return;
            }
            res.status(200).json({ message: "Pet retrieved successfully", payload: pet });
        } catch (error) {
            res.status(500).json({ message: "Error fetching pet details", error: (error as Error).message });
        }
    }
);


router.put(
    "/:petId",
    AuthMiddleware.checkAuth([common.USER_ROLES.PET_OWNER]),
    async (req: Request, res: Response) => {
        try {
            const { petId } = req.params;
            const { userId } = (req as any).user;
            const updateData = req.body;
            const pet = await PetModel.findOne({ _id: petId, owner: userId });
            if (!pet) {
                res.status(404).json({ message: "Pet not found" });
                return;
            }
            Object.assign(pet, updateData);
            await pet.save();

            res.status(200).json({ message: "Pet updated successfully", payload: pet });
        } catch (error) {
            res.status(500).json({ message: "Error updating pet", error: (error as Error).message });
        }
    }
);

// Delete pet
router.delete(
    "/:petId",
    AuthMiddleware.checkAuth([common.USER_ROLES.PET_OWNER]),
    async (req: Request, res: Response) => {
        try {
            const { petId } = req.params;
            const { userId } = (req as any).user;
            const pet = await PetModel.findOne({ _id: petId, owner: userId });
            if (!pet) {
                 res.status(404).json({ message: "Pet not found" });
                 return;
            }

            await PetModel.findByIdAndDelete(petId);
            res.status(200).json({ message: "Pet deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting pet", error: (error as Error).message });
        }
    }
);

export default router;

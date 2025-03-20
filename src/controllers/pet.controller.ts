import { Router } from "express";
import PetModel from "../models/pet.model";

const router = Router();


router.post("/", async (req, res) => {
    try {
        const { name, gender, type, breed, age, image } = req.body;

        const pet = new PetModel({
            name,
            gender,
            type,
            breed,
            age,
            image
        });

        await pet.save();

        res.status(201).json({
            message: "Pet successfully added!",
            payload: pet
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding pet", error });
    }
});


router.get("/", async (req, res) => {
    try {
        const pets = await PetModel.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pets", error });
    }
});

// router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const pet = await PetModel.findById(id);
//         if (!pet) {
//             return res.status(404).json({ message: "Pet not found" });
//         }
//         res.status(200).json(pet);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching pet", error });
//     }
// });


// router.put("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedPet = await PetModel.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedPet) {
//             return res.status(404).json({ message: "Pet not found" });
//         }
//         res.status(200).json({
//             message: "Pet updated successfully!",
//             payload: updatedPet
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating pet", error });
//     }
// });

// router.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedPet = await PetModel.findByIdAndDelete(id);
//         if (!deletedPet) {
//             return res.status(404).json({ message: "Pet not found" });
//         }
//         res.status(200).json({ message: "Pet deleted successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting pet", error });
//     }
// });

export default router;

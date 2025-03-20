import { Router } from "express";
import StaffModel from "../models/staff.model";

const router = Router();


router.post("/", async (req, res) => {
    try {
        const { name, address, nic, email, phone, role } = req.body;

        const staff = new StaffModel({
            name,
            address,
            nic,
            email,
            phone,
            role
        });

        await staff.save();

        res.status(201).json({
            message: "Staff member successfully created!",
            payload: staff
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating staff member", error });
    }
});


router.get("/", async (req, res) => {
    try {
        const staff = await StaffModel.find();
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff members", error });
    }
});


// router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const staff = await StaffModel.findById(id);
//         if (!staff) {
//             return res.status(404).json({ message: "Staff member not found" });
//         }
//         res.status(200).json(staff);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching staff member", error });
//     }
// });


// router.put("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedStaff = await StaffModel.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedStaff) {
//             return res.status(404).json({ message: "Staff member not found" });
//         }
//         res.status(200).json({
//             message: "Staff member updated successfully!",
//             payload: updatedStaff
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating staff member", error });
//     }
// });

// router.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedStaff = await StaffModel.findByIdAndDelete(id);
//         if (!deletedStaff) {
//             return res.status(404).json({ message: "Staff member not found" });
//         }
//         res.status(200).json({ message: "Staff member deleted successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting staff member", error });
//     }
// });

export default router;

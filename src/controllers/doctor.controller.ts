import { Router } from 'express';
import DoctorModel from '../models/doctor.model';
import bcrypt from "bcryptjs";
import AuthMiddleware from '../middleware/auth.middleware';
import common from '../utils/common.util';

const router = Router();

// Create doctor

router.post(
    "/",
    AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN]),
    async (req, res) => {
        try {
            const { name, phone, nic, email, address, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const doctor = new DoctorModel({
                name,
                phone,
                nic,
                email,
                address,
                password: hashedPassword,
                role: common.USER_ROLES.DOCTOR  
            });

            await doctor.save();

            res.status(201).json({
                message: "Doctor successfully created!",
                payload: doctor
            });
        } catch (error) {
            res.status(500).json({
                message: "Error creating doctor",
                error: error instanceof Error ? error.message : error
            });
        }
    }
);


// Get all doctors
router.get(
    "/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),
    async (req, res) => {
        try {
            const doctors = await DoctorModel.find();
            res.status(200).json(doctors);
        } catch (error) {
            res.status(500).json({ message: "Error fetching doctors", error });
        }
    }
);

// Get a specific doctor
router.get(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN
    ]),
    async (req, res) => {
        try {
            const doctor = await DoctorModel.findById(req.params.id);
            if (!doctor) {
                res.status(404).json({ message: "Doctor not found" });
                return;
            }
            res.status(200).json(doctor);
        } catch (error) {
            res.status(500).json({ message: "Error fetching doctor", error });
        }
    }
);

// Update doctor
router.put(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN
    ]),
    async (req, res) => {
        try {
            const updatedDoctor = await DoctorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedDoctor) {
                res.status(404).json({ message: "Doctor not found" });
                return;
            }
            res.status(200).json({ message: "Doctor successfully updated!", payload: updatedDoctor });
        } catch (error) {
            res.status(500).json({ message: "Error updating doctor", error });
        }
    }
);

// Delete doctor
router.delete(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN
    ]),
    async (req, res) => {
        try {
            const deletedDoctor = await DoctorModel.findByIdAndDelete(req.params.id);
            if (!deletedDoctor) {
                res.status(404).json({ message: "Doctor not found" });
                return;
            }
            res.status(200).json({ message: "Doctor successfully deleted!" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting doctor", error });
        }
    }
);

export default router;
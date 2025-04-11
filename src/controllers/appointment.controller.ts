import { Router, Request, Response } from 'express';
import AppointmentModel from '../models/appointment.model';
import UserModel from "../models/user.model";
import common from '../utils/common.util';
import AuthMiddleware from '../middleware/auth.middleware';
import petModel from '../models/pet.model';

const router = Router();

router.post("/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER
    ]),
    async (req, res): Promise<void> => {

        try {
            const { userId } = (req as any).user;
            const { petId, date, time, reason, note, doctorId } = req.body;

            const user = await UserModel.findById(userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }
            const pet = await petModel.findById(petId);
            if (!pet) {
                res.status(404).json({ message: "Pet not found" });
                return;
            }
            if (pet.userId.toString() !== userId.toString()) {
                res.status(403).json({ message: "Pet not assign to user " });
                return;
            }
            const doctor = await UserModel.findById(doctorId);

            if (!doctor || doctor.role !== common.USER_ROLES.DOCTOR) {
                res.status(404).json({ message: "Doctor not found or invalid role" });
                return;
            }
            const appointment = new AppointmentModel({
                date: date,
                time: time,
                reason: reason,
                userId: userId,
                petId: petId,
                veterinarian: doctor._id,
            });

            if (note) appointment.note = note;
            await appointment.save();
            res.status(201).json({
                message: "Appointment successfully booked!",
                payload: appointment
            });
        } catch (error) {
            res.status(500).json({ message: "Error occurred hi", error: (error as Error).message });
        }

    });


router.get("/appointment-history",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),

    async (req: Request, res: Response): Promise<void> => {
        try {

            const { userId, role } = (req as any).user;

            if (role === common.USER_ROLES.ADMIN) {
                // Fetch user appointments history
                const appointments = await AppointmentModel.find();
                res.status(200).json({ message: "Appointment history retrieved successfully", payload: appointments });
            } else {
                // Fetch user appointments history
                const appointments = await AppointmentModel.find({ userId });
                res.status(200).json({ message: "User appointments history retrieved successfully", payload: appointments });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error fetching user appointments", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    }
);




router.get(
    "/:appointmentId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const { userId, role } = (req as any).user;

            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return;
            }
             if (role === common.USER_ROLES.PET_OWNER && appointment.userId.toString() !== userId) {
                res.status(403).json({ message: "You can only view your own appointments" });
                return;
            }
            res.status(200).json(appointment);
        } catch (error) {
            res.status(500).json({ message: "Error fetching appointment", error: error });
        }
    });


router.delete(
    "/:appointmentId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { appointmentId } = req.params;
            const { userId, role } = (req as any).user;

            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return
            }
            if (appointment.status === "approved") {
                res.status(400).json({
                    message: "Appointment can only be deleted if it is pending or canceled"
                });
                return;
            }
            if (role !== "admin" && appointment.userId.toString() !== userId.toString()) {
                res.status(403).json({ message: "You can only delete your own appointments or if you're an admin" });
                return;
            }
            await AppointmentModel.findByIdAndDelete(appointmentId);
             res.status(200).json({ message: "Appointment deleted successfully" });

        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: "Error deleting appointment",
                    error: error.message
                });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    }
);



// Admin approve appointment 
router.patch(
    "/:appointmentId",
    AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN]),
    async (req, res) => {
        const { appointmentId } = req.params;

        try {
            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return
            }
            if (appointment.status !== 'pending') {
                res.status(400).json({ message: "Only pending appointments can be marked as approved" });
                return
            }
            appointment.status = 'approved';
            await appointment.save();

            res.status(200).json({ message: "Appointment approved successfully", payload: appointment, });
        } catch (error) {
            res.status(500).json({
                message: "Error in updating appointment status",
                error: error instanceof Error ? error.message : error,
            });
        }
    }
);

router.patch(
    "/:appointmentId/cancel",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),
    async (req, res) => {
        const { appointmentId } = req.params;
        const { userId, role } = (req as any).user;

        try {
            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return;
            }
            if (appointment.status !== "pending") {
                res.status(400).json({ message: "Only pending appointments can be canceled" });
                return;
            }
            if (role !== common.USER_ROLES.ADMIN && appointment.userId.toString() !== userId.toString()) {
                res.status(403).json({ message: "You can only cancel your own appointments or if you're an admin" });
                return;
            }
            appointment.status = "canceled";
            await appointment.save();

            res.status(200).json({message: "Appointment successfully updated",payload: appointment });

        } catch (error: unknown) {
            res.status(500).json({
                message: "Error updating appointment",
                error: error instanceof Error ? error.message : error,
            });
        }
    }
);



// router.patch(
//     "/:appointmentId/update",
//     AuthMiddleware.checkAuth([
//         common.USER_ROLES.ADMIN,
//         common.USER_ROLES.PET_OWNER
//     ]),
//     async (req, res) => {
//         const { appointmentId } = req.params;
//         const { userId, role } = (req as any).user;
//         const { date, time, reason, note, doctorId } = req.body;

//         try {
//             const appointment = await AppointmentModel.findById(appointmentId);
//             if (!appointment) {
//                 res.status(404).json({ message: "Appointment not found" });
//                 return;
//             }

//             if (role !== common.USER_ROLES.ADMIN && appointment.userId.toString() !== userId.toString()) {
//                 res.status(403).json({ message: "You can only update your own appointments or if you're an admin" });
//                 return;
//             }

//             if (doctorId) {
//                 const doctor = await UserModel.findById(doctorId);
//                 if (!doctor || doctor.role !== common.USER_ROLES.DOCTOR) {
//                     res.status(404).json({ message: "Doctor not found or invalid role" });
//                     return;
//                 }
//                 const veterinarian = doctor._id;
//             }

//             if (date) appointment.date = date;
//             if (time) appointment.time = time;
//             if (reason) appointment.reason = reason;
//             if (note) appointment.note = note;

//             await appointment.save();

//             res.status(200).json({
//                 message: "Appointment updated successfully",
//                 payload: appointment,
//             });

//         } catch (error) {
//             res.status(500).json({
//                 message: "Error updating appointment",
//                 error: error instanceof Error ? error.message : error,
//             });
//         }
//     }
// );




export default router;

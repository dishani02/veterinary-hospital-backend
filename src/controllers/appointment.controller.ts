import { Router, Request, Response } from 'express';
import AppointmentModel from '../models/appointment.model';
import UserModel from "../models/user.model";
import common from '../utils/common.util';
import AuthMiddleware from '../middleware/auth.middleware';
import { appointmentSchema } from '../validations/appointment.schema.js';
import petModel from '../models/pet.model';

const router = Router();

//create appointment
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

//view user appointment history
router.get("/appointment-history",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER
    ]),

    async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.userId;

            const appointments = await AppointmentModel.find({ userId })
                .populate("userId", "name")
                .populate("veterinarian", "name ");

            if (appointments.length === 0) {
                res.status(404).json({ message: "No appointments found for this user" });
                return;
            }

            res.status(200).json({
                message: "User appointment history retrieved successfully",
                payload: appointments
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error fetching user appointments", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    }
);



// // View single appointment-admin and user
router.get(
    "/appointments/:id", // This route expects an appointment ID as a URL parameter
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        try {
            const appointmentId = (req.params.id);

            const appointment = await AppointmentModel.findById(appointmentId)
                .populate("userId", "name")
                .populate("veterinarian", "name ");

            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return;
            }

            const userId = (req as any).user.userId;
            const role = (req as any).user.role;

            // Check if the user is trying to access their own appointment
            if (role === common.USER_ROLES.PET_OWNER && appointment.userId.toString() !== userId) {
                res.status(403).json({ message: "You can only view your own appointments" });
                return;
            }

            // Return the single appointment
            res.status(200).json({
                message: "Appointment fetched successfully",
                payload: appointment,
            });

        } catch (error) {
            res.status(500).json({ message: "Error fetching appointment", error: error });
        }
    }
);


// // Cancel appointments- update part user and  admin
router.put(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),
    async (req, res): Promise<void> => {

        const { id: appointmentId } = req.params;  // Extract appointment ID from the URL
        const userId = (req as any).user.userId;
        const role = (req as any).user.role;
        const { status, date, details } = req.body;  // Fields to update

        try {

            // Validate appointmentId format before querying
            if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
                res.status(400).json({ message: "Invalid appointment ID format" });
                return;
            }

            // Find the appointment by ID
            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return;
            }


            // Ensure the order is in "pending" status before canceling
            if (appointment.status !== "pending") {
                res.status(400).json({ message: "Order can only be canceled if it's in 'pending' status" });
                return;
            }
            // If the user is a pet owner, they can only update their own appointment
            if (role === common.USER_ROLES.PET_OWNER) {
                if (appointment.userId.toString() !== userId) {
                    res.status(403).json({ message: "You can only update your own appointments" });
                    return;
                }
            }

            // Admin can cancel any "pending" order
            if (role === common.USER_ROLES.ADMIN) {
                appointment.status = "canceled";
            }


            // Save the updated appointment
            await appointment.save();

            // Send back the updated appointment in the response
            res.status(200).json({
                message: "Appointment successfully updated",
                payload: appointment,
            });

        } catch (error: unknown) {
            res.status(500).json({
                message: "Error updating appointment",
                error: error instanceof Error ? error.message : error,
            });
        }
    }
);




// // Delete appoint- delete part
// router.delete("/user/:userId/:id", async (req, res) => {
//     const appointment = await AppointmentModel.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ error: "Appointment not found" });
//     }

//     if (appointment.userId.toString() !== req.params.userId) {
//         return res.status(403).json({ error: "You can only delete your own appointments" });
//     }

//     await appointment.delete();

//     return res.status(200).json({
//         message: "Appointment deleted successfully",
//     });
// });




// //admin side


// // Admin approve appointment 
router.patch(
    "/admin/appointments/:appointmentId/approve",
    AuthMiddleware.checkAuth
        ([
            common.USER_ROLES.ADMIN
        ]),

    async (req: Request, res: Response): Promise<void> => {
        try {
            const { appointmentId } = req.params;

            // Find the appointment by its ID
            const appointment = await AppointmentModel.findById(appointmentId);

            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return
            }

            // Check if the appointment is already approved
            if (appointment.status === 'approved') {
                res.status(400).json({ message: "Appointment is already approved" });
                return
            }

            // Update the appointment status to 'approved'
            appointment.status = 'approved';
            await appointment.save();

            res.status(200).json({
                message: "Appointment approved successfully",
                payload: appointment,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error approving appointment", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    }
);






// // Admin view all appointments
router.get(
    "/admin/appointments",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
    ]),
    async (req: Request, res: Response): Promise<void> => {

        try {

            const appointments = await AppointmentModel.find();

            res.status(200).json({
                message: "Appointments retrieved successfully",
                payload: appointments,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error fetching appointments", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    }
);


// // Admin cancel appointment
// router.delete("/:id/cancel", async (req, res) => {
//     const appointment = await AppointmentModel.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ error: "Appointment not found" });
//     }

//     if (!req.user.isAdmin) {
//         return res.status(403).json({ error: "Unauthorized to cancel this appointment" });
//     }

//     // Set status to canceled
//     appointment.status = "canceled";
//     await appointment.save();

//     return res.status(200).json({
//         message: "Appointment canceled",
//         payload: appointment,
//     });
// });


// // Admin delete appointment

router.delete(
    "/:appointmentId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { appointmentId } = req.params;

            // Find the appointment by ID
            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return
            }

            // Check appointment status 
            if (appointment.status !== "approved" && appointment.status !== "canceled") {
                res.status(400).json({
                    message: "Appointment can only be deleted if it is complete or canceled"
                });
                return;
            }

            const userIdFromToken = (req as any).userIdFromToken;
            const userRole = (req as any).userRole;

            if (userRole !== "admin" && appointment.userId.toString() !== userIdFromToken) {
                res.status(403).json({
                    message: "You can only delete your own appointments or if you're an admin"
                });
                return
            }

            // Delete the appointment
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




export default router;

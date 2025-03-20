
//create appoin - craeatepart
import { Router } from 'express';
import AppointmentModel from '../models/appointment.model.js';
// import UserModel from '../models/user.model.js';
// import VetModel from '../models/vet.model.js';
import { appointmentSchema } from '../validations/appointment.schema.js';

const router = Router();

 router.post("/", async (req, res) => {                                                                                                                                     

    const body = req.body;

    const { error } = appointmentSchema.validate(body, { abortEarly: false });

    if (error) {
        res.status(400).json({ error: error });
    } else {

        // const user = await UserModel.findById(body.userId);
        // if (!user) return res.status(404).json({ error: "User not found" });

        // const vet = await VetModel.findById(body.veterinarian);
        // if (!vet) return res.status(404).json({ error: "Veterinarian not found" });

        const appointment = new AppointmentModel();
        appointment.userId = body.userId;
        appointment.veterinarian = body.veterinarian;
        appointment.date = body.date;
        appointment.time = body.time;
        appointment.reason = body.reason;
        appointment.status = "pending";
        appointment.userId = body.userId;
        appointment.petId = body.petId;

        if (body.note) appointment.note = body.note;

        await appointment.save();

        res.status(201).json({
            message: "Appointment successfully booked!",
            payload: appointment
        });
    }
});


// // View appointment-read part
// router.get("/user/:userId", async (req, res) => {
//     const appointments = await AppointmentModel.find({ userId: req.params.userId });

//     if (!appointments) {
//         return res.status(404).json({ error: "No appointments found for this user" });
//     }

//     return res.status(200).json({
//         message: "Appointments fetched successfully",
//         payload: appointments,
//     });
// });




// // Cancel appointments- update part
// router.delete("/:id", async (req, res) => {
//     const appointment = await AppointmentModel.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ error: "Appointment not found" });
//     }

//     if (req.user.id !== appointment.userId.toString()) {
//         return res.status(403).json({ error: "Unauthorized to cancel this appointment" });
//     }

//     appointment.status = "canceled";
//     await appointment.save();

//     return res.status(200).json({
//         message: "Appointment canceled",
//         payload: appointment,
//     });
// });




// // Delete appoint- deletepart
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
// router.put("/:id/approve", async (req, res) => {
//     const appointment = await AppointmentModel.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ error: "Appointment not found" });
//     }

//     if (!req.user.isAdmin) {
//         return res.status(403).json({ error: "Unauthorized access" });
//     }

//     // Set status to approved
//     appointment.status = "canceled";
//     await appointment.save();

//     return res.status(200).json({
//         message: "Appointment approved",
//         payload: appointment,
//     });
// });


// // Admin approve appointment (e.g., approve, update date/time, etc.)
// router.put("/admin/:id", async (req, res) => {
//     if (!req.user.isAdmin) {
//         return res.status(403).json({ error: "Unauthorized access" });
//     }

//     const appointment = await AppointmentModel.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ error: "Appointment not found" });
//     }

//     // Admin can change fields
//     if (req.body.status) appointment.status = req.body.status;
//     if (req.body.date) appointment.date = req.body.date;
//     if (req.body.time) appointment.time = req.body.time;

//     await appointment.save();

//     return res.status(200).json({
//         message: "Appointment updated successfully",
//         payload: appointment,
//     });
// });





// // Admin view all appointments
// router.get("/admin", async (req, res) => {
//     if (!req.user.isAdmin) {
//         return res.status(403).json({ error: "Unauthorized access" });
//     }

//     const appointments = await AppointmentModel.find();

//     return res.status(200).json({
//         message: "Appointments list fetched",
//         payload: appointments,
//     });
// });


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
// router.delete("/:id", async (req, res) => {
//     const appointment = await AppointmentModel.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ error: "Appointment not found" });
//     }

//     if (!req.user.isAdmin) {
//         return res.status(403).json({ error: "Unauthorized to delete this appointment" });
//     }

//     await appointment.delete();

//     return res.status(200).json({
//         message: "Appointment deleted successfully",
//     });
// });




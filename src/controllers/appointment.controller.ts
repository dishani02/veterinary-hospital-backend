
import { Router } from 'express';
import AppointmentModel from '../models/appointment.model';

const router = Router();

router.post("/", async (req, res) => {

    const body = req.body;

    const appointment = new AppointmentModel();
    appointment.appointment_id = body.appointment_id;
    appointment.pet_id = body.pet_id;
    appointment.veterinarian = body.veterinarian;
    appointment.date = body.date;
    appointment.time = body.time;
    appointment.reason = body.reason;


    if (body.note) appointment.note = body.note;


    await appointment.save();

    res.status(201).json({
        message: "Appointment successfully booked!",
        payload: appointment
    });
});

export default router;
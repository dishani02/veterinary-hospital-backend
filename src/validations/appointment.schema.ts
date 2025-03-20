import Joi from "joi";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const appointmentSchema = Joi.object({

    veterinarian: Joi.string().required().messages({
        "any.required": "veterinarian is required"
    }),
    date: Joi.date().greater("now").required().messages({
        "any.required": "Date is required"
    }),
    time: Joi.string().pattern(timeRegex).required().messages({
        "any.required": "Time is required"
    }),
    reason: Joi.string().required().min(5).max(300).messages({
        "any.required": "Reason is required"
    }),
    note: Joi.string().optional().max(500).messages
});




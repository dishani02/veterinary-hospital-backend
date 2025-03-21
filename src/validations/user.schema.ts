import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required"
    }),
    address: Joi.string().required().messages({
        "any.required": "Address is required"
    }),
    nic: Joi.string().required().messages({
        "any.required": "NIC is required"
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format"
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        "any.required": "Phone number is required",
        "string.pattern.base": "Phone number must be 10 digits"
    }),
    password: Joi.string().min(8).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 8 characters long"
    })
});

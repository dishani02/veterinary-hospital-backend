import Joi from "joi";

export const petSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Pet name is required",
        "string.empty": "Pet name cannot be empty"
    }),
    customer: Joi.object({
        name: Joi.string().required().messages({
            "any.required": "Customer name is required",
            "string.empty": "Customer name cannot be empty"
        }),
        phone: Joi.string()
            .pattern(/^\d{10}$/)
            .required()
            .messages({
                "any.required": "Customer phone number is required",
                "string.pattern.base": "Phone number must be a 10-digit number"
            })
    }).required(),
    type: Joi.string().required().messages({
        "any.required": "Pet type is required",
        "string.empty": "Pet type cannot be empty"
    }),
    breed: Joi.string().required().messages({
        "any.required": "Breed is required",
        "string.empty": "Breed cannot be empty"
    }),
    age: Joi.number().integer().min(0).required().messages({
        "any.required": "Age is required",
        "number.base": "Age must be a number",
        "number.min": "Age cannot be negative"
    }),
    image: Joi.string().optional()
});

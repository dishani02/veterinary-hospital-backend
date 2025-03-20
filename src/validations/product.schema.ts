import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required":"Name is required"
    }),
    sku: Joi.string().required().messages({
        "any.required":"SKU is required"
    }),
    category: Joi.string().required().messages({
        "any.required":"Category is required"
    }),
    brand: Joi.string().required(),
    price: Joi.number().required(),
    volume: Joi.string().required(),
    stock: Joi.number().required(),
    threshold: Joi.number().required(),
    description: Joi.string().optional(),
    image: Joi.string().optional()
}); 



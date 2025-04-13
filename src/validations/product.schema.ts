import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().required().min(5).messages({
        "any.required":"Name is required"
    }),
    sku: Joi.string().required().min(0).messages({
        "any.required":"SKU is required"
    }),
    category: Joi.string().required().messages({
        "any.required":"Category is required"
    }),
    brand: Joi.string().required().messages({
        "any.required":"Category is required"
    }),
    price: Joi.number().required().min(0).messages({
        "any.required":"Brand is required"
    }),
    volume: Joi.string().required().messages({
        "any.required":"Volume is required"
    }),
    stock: Joi.number().required().min(10).messages({
        "any.required":"Stock is required"
    }),
    threshold: Joi.number().required().messages({
        "any.required":"Threshold is required"
    }),
    description: Joi.string().optional(),
    image: Joi.string().optional()
}); 



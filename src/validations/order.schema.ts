import Joi from "joi";

export const orderSchema = Joi.object({

    date: Joi.string().required().min(5).max(100).messages({
        "any.required":"Name is required"
    }),
    customer: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().required()
      }).required(),
    
    price: Joi.number().required().min(0).messages({
        "any.required":"Brand is required"
    }),
    status: Joi.string().valid(
        'pending', 'canceled', 'complete').default('pending'),

    items: Joi.array().items(
        Joi.object({
          _id: Joi.string().required(), 
          quantity: Joi.number().min(1).required(), 
          price: Joi.number().min(0).required(), 
          subtotal: Joi.number().min(0).required() 
        })
      ).required(),
    

}); 

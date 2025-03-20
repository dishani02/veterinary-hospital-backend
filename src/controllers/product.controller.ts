
import { Router } from 'express';
import ProductModel from '../models/product.model';
import { productSchema } from '../validations/product.schema';

const router = Router();

router.post("/", async (req, res) => {

    const body = req.body;

    const { error } = productSchema.validate(body, { abortEarly: false });

    if (error) {
        // res.status(400).json({ error: error.details[0].message });
        res.status(400).json({ error: error });
    } else {

        const product = new ProductModel();
        product.name = body.name;
        product.sku = body.sku;
        product.category = body.category;
        product.brand = body.brand;
        product.price = body.price;
        product.volume = body.volume;
        product.stock = body.stock;
        product.threshold = body.threshold;

        if (body.description) product.description = body.description;
        if (body.image) product.image = body.image;

        await product.save();

        res.status(201).json({
            message: "Product successfully created!",
            payload: product
        });
    }
});

export default router;

import { Router } from 'express';
import ProductModel from '../models/product.model';

const router = Router();

router.post("/", async (req, res) => {

    const body = req.body;

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
});

export default router;
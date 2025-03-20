
import { Router } from 'express';
import ProductModel from '../models/product.model';
import AuthMiddleware from '../middleware/auth.middleware';
import common from '../utils/common.util';

const router = Router();

router.post(
    "/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN
    ]),
    async (req, res) => {

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

// product list
router.get(
    "/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        try {
            const products = await ProductModel.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: "Error fetching products", error });
        }
    });


// // read product 
router.get(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res)=> {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: "Error fetching product", error: error });
        }
    });

// //update product
router.put(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
    ]),
    async (req, res)=> {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

            if (!updatedProduct) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            res.status(200).json({ message: "Product successfully updated!", payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ message: "Error updating product", error: error });
        }
    });

// //delete
router.delete(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
    ]),
    async (req, res) => {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
            if (!deletedProduct) {
                res.status(404).json({ message: "Product not found" });
                return
            }
            res.status(200).json({ message: "Product successfully deleted!" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting product", error: error });
        }
    });


export default router;
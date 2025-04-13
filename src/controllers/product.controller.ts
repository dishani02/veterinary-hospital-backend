
import { Router } from 'express';
import ProductModel from '../models/product.model';
import AuthMiddleware from '../middleware/auth.middleware';
import common from '../utils/common.util';

const router = Router();
//create product
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
    "/product-list",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        try {
            const { userId, role } = (req as any).user;

            // If the user is an admin, show all products
            if (role === common.USER_ROLES.ADMIN) {
                const products = await ProductModel.find();
                res.status(200).json({ message: "All products retrieved successfully", payload: products });

            } else {
                const products = await ProductModel.find({ userId });

                res.status(200).json({ message: "User appointments history retrieved successfully", payload: products });
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error fetching user appointments", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    }
);


// // read product 
router.get(
    "/:productId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        try {
            const { productId } = req.params;
            const { userId, role } = (req as any).user;

            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            if (role === common.USER_ROLES.PET_OWNER && product.userId.toString() !== userId) {
                res.status(403).json({ message: "You can only view your own appointments" });
                return;
            }

            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: "Error fetching product", error: error });
        }
    });

//update product
router.put(
    "/:productId",
    AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN]),
    async (req, res) => {
        const { productId } = req.params;
        const updatedData = req.body;
        try {
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return
            }
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                productId,
                updatedData,
                { new: true }
            );
            res.status(200).json({ message: "Product successfully updated!", payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ message: "Error updating product", error: error });
        }
    }
);
// //delete
router.delete(
    "/:productId",
    AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN]),
    async (req, res) => {
        const { productId } = req.params;
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);

            if (!deletedProduct) {
                res.status(404).json({ message: "Product not found" });
                return
            }
            res.status(200).json({ message: "Product successfully deleted!" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting product", error: error });
        }
    }
);


export default router;
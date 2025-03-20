
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

// // product list
// router.get("/", async (req, res) => {
//     try {
//         const products = await ProductModel.find();
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching products", error: error.message });
//     }
// });


// // read product 
// router.get("/:id", async (req , res) => {
//     try {
//         const product = await ProductModel.findById(req.params.id);
//         if (!product) return res.status(404).json({ message: "Product not found" });
//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching product", error: error.message });
//     }
// });

// //update product
// router.put("/:id", async (req, res) => {
//     try {
//         const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
//         res.status(200).json({ message: "Product successfully updated!", payload: updatedProduct });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating product", error: error.message });
//     }
// });

// //delete
// router.delete("/:id", async (req, res) => {
//     try {
//         const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
//         if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
//         res.status(200).json({ message: "Product successfully deleted!" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting product", error: error.message });
//     }
// });


export default router;
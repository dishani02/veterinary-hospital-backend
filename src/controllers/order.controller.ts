
import { Router, Request, Response } from "express";
import OrderModel from "../models/order.model";
import UserModel from "../models/user.model";
import common from '../utils/common.util';
import AuthMiddleware from '../middleware/auth.middleware';
import productModel from "../models/product.model";
import mongoose from "mongoose";

const router = Router();
//cretae order
router.post(
    "/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER
    ]),
    async (req, res) => {
        try {
            const { userId } = (req as any).user;
            const { items, date, customer, price, status } = req.body;

            const user = await UserModel.findById(userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Create order
            const order = new OrderModel({
                date: date,
                customer: {
                    name: user.name,
                    address: user.address,
                    phone: user.phone,
                    email: user.email
                },
                price: price,
                userId: userId,
                status: status || "pending",
            });


            for (const item of items) {

                const dbItem = await productModel.findById(item._id);

                if (!dbItem) {
                    res.status(404).json({ message: "Product not found! " });
                    return;
                }

                order.items.push({
                    _id: new mongoose.Types.ObjectId(dbItem._id as string),
                    quantity: item.quantity,
                    price: dbItem.price,
                    subtotal: dbItem.price * item.quantity
                });
            }


            await order.save();

            res.status(201).json({
                message: "Order successfully created!",
                payload: order,
            });
            return;
        } catch (error) {
            res.status(500).json({ message: "Error occurred hi", error: (error as Error).message });
            return;
        }
    });
//read
router.get("/order-history",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),

    async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, role } = (req as any).user;

            if (role === common.USER_ROLES.ADMIN) {
                // Fetch user order history
                const orders = await OrderModel.find();

                res.status(200).json({ message: "Order history retrieved successfully", payload: orders });
            } else {
                // Fetch user order history
                const orders = await OrderModel.find({ userId });

                res.status(200).json({ message: "User order history retrieved successfully", payload: orders });
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error fetching user orders", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    });

//single order
router.get(
    "/:orderId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        try {
            const { orderId } = req.params;
            const { userId, role } = (req as any).user;

            // Fetch single order by ID
            const order = await OrderModel.findById(orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }

            if (role === common.USER_ROLES.PET_OWNER && order.userId.toString() !== userId) {
                res.status(403).json({ message: "You can only view your own orders" });
                return;
            }
            // Return the single order, not a list of orders
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: "Error fetching Order", error: error });
        }
    });

router.delete(
    "/:orderId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { orderId } = req.params;
            const { userId, role } = (req as any).user;

            const order = await OrderModel.findById(orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }

            //check if the order is "pending" or "canceled"
            if (order.status === "complete") {
                res.status(400).json({ message: "Order can only be deleted if it is pending or canceled" });
                return;
            }

            // Ensure only admins or the user can delete
            if (role !== "admin" && order.userId.toString() !== userId.toString()) {
                res.status(403).json({ message: "You can only delete your own orders or if you're an admin" });
                return;
            }

            await OrderModel.findByIdAndDelete(orderId);

            res.status(200).json({ message: "Order deleted successfully" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error deleting order", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    });

router.patch(
    "/:orderId",
    AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN]),
    async (req, res) => {
        const { orderId } = req.params;

        try {
            const order = await OrderModel.findById(orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
            if (order.status !== "pending") {
                res.status(400).json({ message: "Only pending orders can be marked as complete" });
                return;
            }

            order.status = "complete";
            await order.save();

            res.status(200).json({ message: "Order successfully marked as complete", payload: order });
        } catch (error) {
            res.status(500).json({
                message: "Error in updating order status",
                error: error instanceof Error ? error.message : error,
            });
        }
    }
);

router.patch(
    "/:orderId/cancel",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        const { orderId } = req.params;
        const { userId, role } = (req as any).user;

        try {
            const order = await OrderModel.findById(orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
            if (order.status !== "pending") {
                res.status(400).json({ message: "Only pending orders can be marked as canceled" });
                return;
            }

            if (role !== common.USER_ROLES.ADMIN && order.userId.toString() !== userId.toString()) {
                res.status(403).json({ message: "You can only cancel your own orders or if you're an admin" });
                return;
            }

            order.status = "canceled";
            await order.save();

            res.status(200).json({ message: "Order successfully marked as canceled", payload: order });
        } catch (error) {
            res.status(500).json({
                message: "Error in updating order status",
                error: error instanceof Error ? error.message : error,
            });
        }
    },

)

export default router;


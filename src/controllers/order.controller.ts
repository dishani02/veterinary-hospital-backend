
import { Router, Request, Response } from "express";
import OrderModel from "../models/order.model";
import UserModel from "../models/user.model";
import common from '../utils/common.util';
import jwt from "jsonwebtoken";
import AuthMiddleware from '../middleware/auth.middleware';



const SECRET_KEY = process.env.JWT_SECRET || common.JWT_SECRET;

const router = Router();

//User side

//create order
router.post(
    "/",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER
    ]),
    async (req, res) => {
        try {
            const userIdFromToken = (req as any).user?.userId;

            if (!userIdFromToken) {
                res.status(404).json({ message: "User not found" });
                return
            }

            const user = await UserModel.findById(userIdFromToken);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }


            // Create order
            const order = new OrderModel({
                date: req.body.date,
                customer: {
                    name: user.name,
                    address: user.address,
                    phone: user.phone,
                    email: user.email
                },
                items: req.body.items,
                price: req.body.price,
                userId: userIdFromToken,
                status: req.body.status || "pending",
            });

            await order.save();

            res.status(201).json({
                message: "Order successfully created!",
                payload: order,
            });
        } catch (error) {
            res.status(500).json({ message: "Error occurred hi", error: (error as Error).message });
        }
    });

//user order history
router.get("/order-history",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.PET_OWNER
    ]),

    async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.userId;

            // Fetch user order history
            const orders = await OrderModel.find({ userId }).populate("userId", "name");

            if (orders.length === 0) {
                res.status(404).json({ message: "No orders found for this user" });
                return;
            }

            res.status(200).json({ message: "User order history retrieved successfully", payload: orders });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error fetching user orders", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    });

//user view order

router.get(
    "/:id",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER,
    ]),
    async (req, res) => {
        try {
            // Fetch single order by ID
            const order = await OrderModel.findById(req.params.id);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
            const userId = (req as any).user.userId;
            const role = (req as any).user.role;

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



//user cancel order - update 
//admin cancel order - update status
router.put(
    "/cancel/:orderId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER

    ]),
    async (req, res): Promise<void> => {

        const { orderId } = req.params;
        const userId = (req as any).user.userId;
        const role = (req as any).user.role;
        const { status } = req.body;

        try {

            // Validate orderId format before querying
            if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
                res.status(400).json({ message: "Invalid order ID format" });
                return;
            }

            // Find order 
            const order = await OrderModel.findById(req.params.id);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }

            if (order.status !== "pending") {
                res.status(400).json({ message: "Order can only be canceled if it's in 'pending' status" });
                return;
            }

            if (role === common.USER_ROLES.PET_OWNER) {
                // Ensure the user can only cancel their own orders
                if (order.userId.toString() !== userId) {
                    res.status(403).json({ message: "You can only cancel your own orders" });
                    return;
                }
            }

            if (role === common.USER_ROLES.ADMIN) {
                // Admin can cancel any "pending" order
                order.status = "canceled";
                await order.save();
                res.status(200).json({ message: "Order successfully canceled", payload: order });
                return;
            }

        } catch (error: unknown) {
            res.status(500).json({
                message: "Error in updating order status",
                error: error instanceof Error ? error.message : error,
            });
        }
    });




// delete order

router.delete(
    "/:orderId",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
        common.USER_ROLES.PET_OWNER
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { orderId } = req.params;

            const order = await OrderModel.findById(orderId);
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }

            //check if the order is "complete" or "canceled"
            if (order.status !== "complete" && order.status !== "canceled") {
                res.status(400).json({ message: "Order can only be deleted if it is complete or canceled" });
                return;
            }

            // Ensure only admins or the order owner can delete
            if ((req as any).userRole !== "admin" && order.userId.toString() !== (req as any).userIdFromToken) {
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


// // admin order List
router.get(
    "/admin/orders",
    AuthMiddleware.checkAuth([
        common.USER_ROLES.ADMIN,
    ]),

    async (req: Request, res: Response): Promise<void> => {
        try {

            const adminUserId = (req as any).user.userId;

            // Fetch orders for the admin's userId
            const orders = await OrderModel.find({ userId: adminUserId });

            res.status(200).json({ message: "Orders retrieved successfully", payload: orders });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Error fetching orders", error: error.message });
            } else {
                res.status(500).json({ message: "An unknown error occurred", error });
            }
        }
    });

// admin complete the order
router.put(
    "/admin/orders/complete/:orderId",
    AuthMiddleware.checkAuth([common.USER_ROLES.ADMIN]),
    async (req, res) => {
        const { orderId } = req.params;

        try {
            if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
                res.status(400).json({ message: "Invalid order ID format" });
                return;
            }
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



export default router;


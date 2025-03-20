
import { Router, Request, Response } from "express";
import OrderModel from "../models/order.model";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.middleware"; 

const router = Router();

const SECRET_KEY = "2effbd077fc5422316f52484b98626a977015811df825445e398ba55e5391b9d"; 

const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const decoded: any = decodeToken(token);
        const userIdFromToken = decoded.userId;

        const user = await UserModel.findById(userIdFromToken);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Create order
        const order = new OrderModel({
            date: req.body.date,
            customer: req.body.customer,
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





// //admin cancel order
// router.put("/admin/orders/cancel/:orderId", async (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const token = req.headers.authorization?.split(' ')[1];

//     try {
//         if (!token) return res.status(401).json({ message: "No token provided" });

//         // Decode token properly
//         const decoded: any = decodeToken(token);
//         if (decoded.role !== "admin") {
//             return res.status(403).json({ message: "Admins only." });
//         }

//         // Validate orderId format before querying
//         if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ message: "Invalid order ID format" });
//         }

//         // Find order in DB
//         const order = await OrderModel.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         // Validate allowed status values
//         const allowedStatuses = ["pending", "canceled", "complete"];
//         if (!allowedStatuses.includes(status)) {
//             return res.status(400).json({ message: "Invalid status value" });
//         }

//         // Update status and save
//         order.status = status;
//         await order.save();

//         res.status(200).json({ message: `Order status updated to ${status}`, payload: order });
//     } catch (error: unknown) {
//         res.status(500).json({
//             message: "Error in updating order status",
//             error: error instanceof Error ? error.message : error,
//         });
//     }
// });




// // delete order
// router.delete("/:orderId", async (req, res) => {
//     const { orderId } = req.params;
//     const token = req.headers.authorization?.split(' ')[1];

//     try {

//         if (!token) return res.status(401).json({ message: "No token provided" });

//         const decoded: any = verifyUser(token);
//         const userIdFromToken = decoded.userId;

//         const order = await OrderModel.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         if (order.status !== "complete" && order.status !== "canceled") {
//             return res.status(400).json({ message: "Order can only be deleted if it is complete or canceled" });
//         }

//         if (decoded.role !== "admin" && order.userId.toString() !== userIdFromToken) {
//             return res.status(403).json({ message: "You can only delete your own orders or if you're an admin" });
//         }

//         await OrderModel.findByIdAndDelete(orderId);

//         //   res.status(200).json({ message: "Order deleted successfully" });
//         // } catch (error) {
//         //   res.status(500).json({ message: "Error deleting order", error: error.message });
//         // }

//         res.status(200).json({ message: "Order status updated to canceled", payload: order });
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             res.status(500).json({ message: "Error canceling order", error: error.message });
//         } else {
//             res.status(500).json({ message: "An unknown error occurred", error });
//         }
//     }

// });

// // admin order List
// router.get("/admin/orders", async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     try {
//         if (!token) return res.status(401).json({ message: "No token provided" });

//         const decoded: any = verifyUser(token);
//         if (decoded.role !== "admin") {
//             return res.status(403).json({ message: "Access denied. Admins only." });
//         }

//         const orders = await OrderModel.find();
//         //     res.status(200).json({ payload: orders });
//         // } catch (error) {
//         //     res.status(500).json({ message: "Error fetching orders", error: error.message });
//         // }

//         res.status(200).json({ message: "Order status updated to canceled", payload: orders });
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             res.status(500).json({ message: "Error canceling order", error: error.message });
//         } else {
//             res.status(500).json({ message: "An unknown error occurred", error });
//         }
//     }
// });

// //user order history
// router.get("/order-history", async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     try {

//         if (!token) return res.status(401).json({ message: "No token provided" });

//         const decoded: any = verifyUser(token);
//         const userIdFromToken = decoded.userId;

//         const orders = await OrderModel.find({ userId: userIdFromToken }).populate("userId", "name");

//         if (orders.length === 0) {
//             return res.status(404).json({ message: "No orders found for this user" });
//         }

//         //   res.status(200).json({ payload: orders });
//         // } catch (error) {
//         //   res.status(500).json({ message: "Error fetching user orders", error: error.message });
//         // }
//         res.status(200).json({ message: "Order status updated to canceled", payload: orders });
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             res.status(500).json({ message: "Error canceling order", error: error.message });
//         } else {
//             res.status(500).json({ message: "An unknown error occurred", error });
//         }
//     }

// });



export default router;
function verifyUser(token: string): any {
    throw new Error("Function not implemented.");
}


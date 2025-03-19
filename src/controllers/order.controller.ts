import { Router } from "express";
import OrderModel from "../models/order.model";

const router = Router();

router.post("/", async (req, res) => {
    const body = req.body;

    const order = new OrderModel();
    order.orderId = body.orderId;
    order.date = body.date;
    order.customer = body.customer;
    order.items = body.items;
    order.price = body.price;
    
    if (body.status) order.status = body.status;

    await order.save();

    res.status(201).json({
        message: "Order successfully created!",
        payload: order,
    });
});

export default router;

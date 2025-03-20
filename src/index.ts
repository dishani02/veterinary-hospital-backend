import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import PetRoutes from "./controllers/pet.controller"; 
import UserRoutes from "./controllers/user.controller";
import AuthRoutes from "./controllers/auth.controller";
import OrderRoutes from "./controllers/order.controller";
import ProductRoutes from "./controllers/product.controller";
import AppointmentRoutes from "./controllers/appointment.controller";


import helperUtils from "./utils/helper.utils";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ping", (req, res, next) => {
    res.status(200).json({ message: "pong" });
});

app.use("/api/products", ProductRoutes);
app.use("/api/appointment", AppointmentRoutes);
app.use("/api/order", OrderRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/pets", PetRoutes);
app.use("/api/auth", AuthRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: "API Endpoint Not Found!" });
});

const start = () => {
    try {
        const port = process.env.PORT || 5000;
        const mongoDbUrl = process.env.MONGODB_URL || "";

        app.listen(port, async () => {
            await mongoose.connect(mongoDbUrl, { retryWrites: true, w: 'majority' })
                .then(async () => {
                    console.log('MongoDB connected!');

                   await helperUtils.generateAdmin();
                })
                .catch((err) => console.error(err));
            console.log(`Server started. port: ${port}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();